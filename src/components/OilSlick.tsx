"use client";

import { useEffect, useRef } from "react";

/**
 * Slow-spreading oil slicks, drawn with WebGL.
 *
 * No library. three.js is ~150KB gzipped and ogl ~16KB; this is one quad and
 * one fragment shader, so a dependency would cost far more than the effect.
 *
 * It layers over the CSS oil band rather than replacing it, so the section
 * still looks finished when this never runs — no WebGL, reduced motion, or
 * JavaScript blocked. Nothing here is load-bearing.
 */

const BLOBS = 7;

const VERT = `
attribute vec2 a_quad;
varying vec2 v_uv;
void main() {
  v_uv = a_quad * 0.5 + 0.5;
  gl_Position = vec4(a_quad, 0.0, 1.0);
}
`;

/**
 * Each slick is an inverse-square field around a drifting centre. Summing the
 * fields and then cutting the total at a threshold is what makes neighbouring
 * slicks bleed into one shape and pull apart again — a plain stack of circles
 * would only ever overlap, never merge.
 */
const FRAG = `
precision mediump float;

uniform float u_time;
uniform float u_scroll;
uniform float u_aspect;

varying vec2 v_uv;

void main() {
  float field = 0.0;

  for (int i = 0; i < ${BLOBS}; i++) {
    float fi = float(i);

    // Two incommensurate frequencies per axis, so the slicks never fall back
    // into a visible loop.
    vec2 c = vec2(
      0.5 + 0.40 * sin(u_time * (0.048 + fi * 0.011) + fi * 2.13),
      0.5 + 0.30 * cos(u_time * (0.039 + fi * 0.014) + fi * 1.31)
    );
    // Nearer slicks react more to scroll — the difference is what reads as
    // depth rather than one flat sheet sliding past.
    c.y += u_scroll * (0.05 + fi * 0.022);

    vec2 d = v_uv - c;
    d.x *= u_aspect;

    float r = 0.145 + 0.055 * sin(fi * 1.77);
    field += (r * r) / (dot(d, d) + 0.0008);
  }

  // One wide, soft ramp and no rim band. A narrow ramp — or a bright edge —
  // draws a hard ring around every centre, and the whole thing stops looking
  // like spreading oil and starts looking like bubbles.
  //
  // Size is set here, not by the radius above. A slick's visible edge is where
  // the field crosses the lower cut-off, at r / sqrt(cut-off) — so shrinking r
  // and dropping the cut-off by the matching factor leaves the shape identical.
  // Raising the cut-off is what actually makes them smaller.
  float body = smoothstep(1.75, 4.30, field);

  vec3 deep = vec3(0.84, 0.56, 0.07);
  vec3 lit = vec3(1.00, 0.89, 0.58);
  vec3 colour = mix(deep, lit, smoothstep(2.10, 6.20, field));

  // A little stronger than before: the same alpha over a smaller area reads
  // as fainter.
  float alpha = body * 0.40;

  // Premultiplied: writing straight colour and blending against a
  // transparent-black canvas drags the amber towards grey.
  gl_FragColor = vec4(colour * alpha, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function OilSlick({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) return; // no WebGL — the CSS band alone still looks right

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vert || !frag || !program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const quad = gl.getAttribLocation(program, "a_quad");
    gl.enableVertexAttribArray(quad);
    gl.vertexAttribPointer(quad, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uAspect = gl.getUniformLocation(program, "u_aspect");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    /**
     * Rendered at well under CSS resolution and stretched back up. This shader
     * runs per pixel, so resolution is the whole cost — and the output has no
     * edge sharper than the upscale, so there is nothing to lose.
     */
    const SCALE = 0.4;

    function resize() {
      const w = Math.max(1, Math.round(canvas!.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas!.clientHeight * SCALE));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
      gl!.uniform1f(uAspect, w / h);
    }
    resize();

    let frame = 0;
    let visible = false;
    const start = performance.now();

    function draw() {
      frame = 0;
      if (!visible) return;
      resize();
      const rect = canvas!.getBoundingClientRect();
      gl!.uniform1f(uTime, (performance.now() - start) / 1000);
      // Progress of the band through the viewport, so the parallax follows the
      // reader rather than the absolute page position.
      gl!.uniform1f(uScroll, -rect.top / Math.max(rect.height, 1));
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    }

    // Only burn frames while the band is actually on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible && !frame) frame = requestAnimationFrame(draw);
      },
      { rootMargin: "10% 0px" },
    );
    observer.observe(canvas);

    const onLost = (event: Event) => {
      event.preventDefault();
      visible = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      if (frame) cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
