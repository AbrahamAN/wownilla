/** Owns the original Canvas 2D scene and exposes lifecycle controls for React. */
export function createDungeon(canvas: HTMLCanvasElement, reduce: boolean) {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return { start() {}, stop() {}, dispose() {} };
  const ctx = context;
  const W = 2.2,
    HP = 2.3,
    VH = 0.9,
    D = 3.4,
    N = 12,
    NEAR = 0.22,
    TORCH_Y = 1.85;

  // Cross-section of the corridor (closed loop): walls, pointed vault, flagstone floor.
  function arch(w: number) {
    const pts = [];
    for (let i = 0; i <= 3; i++) pts.push([-w, (HP * i) / 3]);
    for (let i = 1; i < 10; i++) {
      const a = Math.PI - (Math.PI * i) / 10;
      pts.push([Math.cos(a) * w, HP + Math.sin(a) * w * VH]);
    }
    for (let i = 3; i >= 0; i--) pts.push([w, (HP * i) / 3]);
    return pts;
  }
  const outer = arch(W);
  const inner = arch(W - 0.26);
  const prof = outer.concat([
    [W / 3, 0],
    [-W / 3, 0],
  ]);
  const n = prof.length;
  const kinds = prof.map((p, k) => {
    const q = prof[(k + 1) % n];
    if (p[1] === 0 && q[1] === 0) return 2; // floor
    return p[0] === q[0] ? 0 : 1; // wall : vault
  });
  const BASE = [
    [96, 74, 50],
    [72, 56, 40],
    [86, 68, 48],
  ]; // weathered sandstone: wall, vault, floor

  const hash = (a: number, b: number) => {
    let h = (a * 374761393 + b * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };

  let cw = 0,
    ch = 0,
    f = 1,
    cx = 0,
    cy = 0;
  let t = 0,
    travel = 0,
    camX = 0,
    camY = 1.5;
  let mx = 0,
    my = 0,
    smx = 0,
    smy = 0;
  let running = false,
    raf = 0,
    last = 0;

  const embers = Array.from({ length: 70 }, () => spawnEmber(true));
  function spawnEmber(anywhere: boolean) {
    return {
      x: (Math.random() * 2 - 1) * W * 0.85,
      y: Math.random() * (anywhere ? 3.6 : 1.2),
      z: anywhere ? 0.6 + Math.random() * 32 : 10 + Math.random() * 26,
      vy: 0.12 + Math.random() * 0.25,
      s: Math.random() * 10,
    };
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    cw = Math.max(1, r.width);
    ch = Math.max(1, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, cw < 768 ? 1.25 : 1.5);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    f = Math.max(cw * 0.55, ch * 0.62);
    cx = cw / 2;
    cy = ch * 0.47;
  }

  const P = (x: number, y: number, z: number) => [
    cx + ((x - camX) * f) / z,
    cy - ((y - camY) * f) / z,
  ];

  function frame(dt: number) {
    t += dt;
    // Rush in on load, then settle into a slow, steady walk.
    const speed = 0.85 + 6 * Math.exp(-t / 0.8);
    travel += speed * dt;
    smx += (mx - smx) * 0.04;
    smy += (my - smy) * 0.04;
    camX = Math.sin(t * 0.21) * 0.16 + smx * 0.35;
    camY = 1.5 + Math.sin(t * 1.9) * 0.018 - smy * 0.12;
    const roll = Math.sin(t * 0.27) * 0.01;

    const base = Math.floor(travel / D),
      off = travel - base * D;
    const planes = [{ z: NEAR, abs: 0, arch: false, idx: 0 }];
    for (let i = 1; i <= N; i++) {
      const za = i * D - off,
        zm = za - D / 2;
      if (zm > NEAR)
        planes.push({
          z: zm,
          abs: (base + i) * 2 - 1,
          arch: false,
          idx: base + i,
        });
      if (za > NEAR)
        planes.push({ z: za, abs: (base + i) * 2, arch: true, idx: base + i });
    }
    const zFar = planes[planes.length - 1].z;

    // Torches on every other arch, flickering independently.
    const torches: {
      x: number;
      y: number;
      z: number;
      f: number;
      side: number;
    }[] = [];
    for (const p of planes) {
      if (!p.arch || p.idx % 2) continue;
      for (const side of [-1, 1]) {
        const s = p.idx * 1.7 + side;
        const fl =
          0.82 +
          0.1 * Math.sin(t * 13 + s) +
          0.08 * Math.sin(t * 7.3 + s * 2.1);
        torches.push({ x: side * (W - 0.12), y: TORCH_Y, z: p.z, f: fl, side });
      }
    }
    const light = (x: number, y: number, z: number) => {
      let L = 0;
      for (const tr of torches) {
        const dz = z - tr.z;
        if (dz > 9 || dz < -9) continue;
        const dx = x - tr.x,
          dy = y - tr.y;
        L += (tr.f * 1.9) / (1 + (dx * dx + dy * dy + dz * dz) * 0.9);
      }
      return L;
    };
    const shade = (rgb: number[], v: number, L: number, z: number) => {
      const fog = Math.exp(-z / 11);
      const glow = Math.exp(-(zFar - z) / 5) * 0.55;
      const k = (0.13 + L * 0.9) * v * fog;
      const warm = L * L * 0.32 * fog;
      return `rgb(${Math.min(255, rgb[0] * k + 255 * warm + 150 * glow) | 0},${Math.min(255, rgb[1] * k + 150 * warm + 92 * glow) | 0},${Math.min(255, rgb[2] * k + 60 * warm + 60 * glow) | 0})`;
    };

    ctx.save();
    ctx.fillStyle = "#070604";
    ctx.fillRect(0, 0, cw, ch);
    ctx.translate(cx, cy);
    ctx.rotate(roll);
    ctx.translate(-cx, -cy);

    // The golden gate at the end of the corridor.
    const g0 = P(0, 1.3, zFar);
    const gr = ((W * f) / zFar) * 2.2;
    const pulse = 0.85 + 0.15 * Math.sin(t * 1.3);
    const gate = ctx.createRadialGradient(g0[0], g0[1], 0, g0[0], g0[1], gr);
    gate.addColorStop(0, `rgba(255,236,190,${0.95 * pulse})`);
    gate.addColorStop(0.3, `rgba(212,160,60,${0.75 * pulse})`);
    gate.addColorStop(1, "rgba(26,18,11,1)");
    ctx.beginPath();
    prof.forEach((p, k) => {
      const s = P(p[0], p[1], zFar);
      if (k) ctx.lineTo(s[0], s[1]);
      else ctx.moveTo(s[0], s[1]);
    });
    ctx.closePath();
    ctx.fillStyle = gate;
    ctx.fill();

    ctx.lineJoin = "round";
    // Paint far → near so nearer stone covers what's behind it.
    for (let j = planes.length - 1; j >= 1; j--) {
      const a = planes[j - 1],
        b = planes[j];
      const za = a.z,
        zb = b.z,
        zc = (za + zb) / 2;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(8,6,4,${0.25 + 0.4 * Math.exp(-zc / 11)})`;
      for (let k = 0; k < n; k++) {
        const p = prof[k],
          q = prof[(k + 1) % n];
        const kind = kinds[k];
        const v =
          0.8 +
          hash(b.abs, k) * 0.32 +
          (kind === 2 && (b.abs + k) % 2 ? 0.08 : 0);
        ctx.fillStyle = shade(
          BASE[kind],
          v,
          light((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, zc),
          zc,
        );
        const s1 = P(p[0], p[1], za),
          s2 = P(q[0], q[1], za),
          s3 = P(q[0], q[1], zb),
          s4 = P(p[0], p[1], zb);
        ctx.beginPath();
        ctx.moveTo(s1[0], s1[1]);
        ctx.lineTo(s2[0], s2[1]);
        ctx.lineTo(s3[0], s3[1]);
        ctx.lineTo(s4[0], s4[1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      if (!a.arch) continue;
      // Stone rib of the arch: a back face (shadow) and a front face.
      const Lr = (light(-W * 0.9, 1.6, za) + light(W * 0.9, 1.6, za)) / 2;
      for (const [dz, dim] of [
        [0.3, 0.55],
        [0, 1],
      ]) {
        const z = za + dz;
        ctx.beginPath();
        outer.forEach((p, k) => {
          const s = P(p[0], p[1], z);
          if (k) ctx.lineTo(s[0], s[1]);
          else ctx.moveTo(s[0], s[1]);
        });
        for (let k = inner.length - 1; k >= 0; k--) {
          const s = P(inner[k][0], inner[k][1], z);
          ctx.lineTo(s[0], s[1]);
        }
        ctx.closePath();
        ctx.fillStyle = shade([104, 82, 56], dim, Lr, z);
        ctx.fill();
      }
      ctx.strokeStyle = `rgba(255,190,110,${Math.min(0.45, Lr * 0.22) * Math.exp(-za / 11)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      inner.forEach((p, k) => {
        const s = P(p[0], p[1], za);
        if (k) ctx.lineTo(s[0], s[1]);
        else ctx.moveTo(s[0], s[1]);
      });
      ctx.stroke();

      // Gold rune on every fourth keystone.
      if (a.idx % 4 === 0) {
        const ks = P(0, HP + (W - 0.13) * VH, za),
          r = (0.09 * f) / za;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = `rgba(212,175,55,${0.6 * Math.exp(-za / 14)})`;
        ctx.beginPath();
        ctx.moveTo(ks[0], ks[1] - r);
        ctx.lineTo(ks[0] + r * 0.7, ks[1]);
        ctx.lineTo(ks[0], ks[1] + r);
        ctx.lineTo(ks[0] - r * 0.7, ks[1]);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // Torches mounted on this arch.
      for (const tr of torches) {
        if (tr.z !== za) continue;
        const s = f / za,
          pt = P(tr.x, tr.y, za),
          fog = Math.exp(-za / 12);
        ctx.fillStyle = `rgba(22,16,10,${0.9 * fog + 0.1})`;
        ctx.fillRect(pt[0] - 0.03 * s, pt[1], 0.06 * s, 0.24 * s);
        const fh = 0.28 * s * tr.f,
          fw = 0.1 * s;
        const fg = ctx.createRadialGradient(
          pt[0],
          pt[1] - fh * 0.3,
          0,
          pt[0],
          pt[1] - fh * 0.3,
          fh,
        );
        fg.addColorStop(0, `rgba(255,248,220,${fog})`);
        fg.addColorStop(0.4, `rgba(255,180,70,${0.9 * fog})`);
        fg.addColorStop(1, "rgba(249,115,22,0)");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.ellipse(pt[0], pt[1] - fh * 0.35, fw, fh * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bloom around the torches.
    ctx.globalCompositeOperation = "lighter";
    for (const tr of torches) {
      if (tr.z < NEAR + 0.1) continue;
      const s = f / tr.z,
        pt = P(tr.x, tr.y, tr.z),
        r = 0.95 * s * tr.f;
      const bg = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], r);
      bg.addColorStop(0, `rgba(255,160,70,${0.45 * Math.exp(-tr.z / 12)})`);
      bg.addColorStop(1, "rgba(255,120,40,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(pt[0] - r, pt[1] - r, r * 2, r * 2);
    }

    // Embers drifting up through the corridor.
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.y += e.vy * dt;
      e.x += Math.sin(t * 0.8 + e.s) * 0.12 * dt;
      e.z -= speed * dt;
      if (e.z < 1.2 || e.y > 4.2) {
        embers[i] = spawnEmber(false);
        continue;
      }
      const p = P(e.x, e.y, e.z),
        r = Math.min(2.4, Math.max(0.6, (0.02 * f) / e.z));
      const a =
        Math.min(1, Math.exp(-e.z / 12) * 1.6) *
        (0.55 + 0.45 * Math.sin(t * 3 + e.s));
      ctx.fillStyle = `rgba(255,190,100,${a * 0.35})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,226,170,${a})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    frame(dt);
    if (running) raf = requestAnimationFrame(loop);
  }

  resize();
  if (reduce) {
    t = 4;
    travel = 8;
  }
  frame(0);
  const onResize = () => {
    resize();
    if (!running) frame(0);
  };
  const onMouseMove = (event: MouseEvent) => {
    mx = (event.clientX / window.innerWidth - 0.5) * 2;
    my = (event.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  return {
    start() {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    },
  };
}
