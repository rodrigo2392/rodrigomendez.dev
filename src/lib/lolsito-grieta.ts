/**
 * La Grieta del hero de /lolsito.
 *
 * Dibuja el mapa del juego tumbado en perspectiva con los diez jugadores
 * caminando por sus calles. Cuando la jungla enemiga se pierde de vista, su
 * ficha se queda clavada en gris donde estaba y sale el ping, que es justo lo
 * que la app avisa por voz.
 *
 * El arte sale de Data Dragon, el CDN público de Riot. Nada de esto es
 * indispensable para la página: si no hay WebGL, si el visitante pidió menos
 * movimiento o si el CDN no contesta, el hero se queda con su resplandor de
 * siempre y no se nota la falta.
 */
import * as THREE from 'three';

const CICLO = 15; // segundos que dura la escena antes de repetirse

const RUTAS: Record<string, [number, number][]> = {
  // Coordenadas del minimapa: (0,0) abajo a la izquierda es la base azul,
  // (1,1) arriba a la derecha la roja.
  top: [[0.06, 0.34], [0.07, 0.62], [0.13, 0.84], [0.34, 0.93]],
  mid: [[0.24, 0.24], [0.38, 0.4], [0.5, 0.5], [0.62, 0.6], [0.76, 0.76]],
  bot: [[0.34, 0.06], [0.62, 0.08], [0.85, 0.15], [0.93, 0.36]],
  jgAzul: [[0.2, 0.42], [0.32, 0.3], [0.44, 0.24], [0.36, 0.14], [0.2, 0.2]],
  jgRojo: [[0.78, 0.6], [0.66, 0.7], [0.56, 0.78], [0.66, 0.86], [0.8, 0.8]],
};

const JUGADORES = [
  { champ: 'Darius', ruta: 'top', equipo: 'rojo', v: 0.055, off: 0.15 },
  { champ: 'LeeSin', ruta: 'jgRojo', equipo: 'rojo', v: 0.075, off: 0, esJungla: true },
  { champ: 'Katarina', ruta: 'mid', equipo: 'rojo', v: 0.05, off: 0.62 },
  { champ: 'Jhin', ruta: 'bot', equipo: 'rojo', v: 0.045, off: 0.78 },
  { champ: 'Thresh', ruta: 'bot', equipo: 'rojo', v: 0.045, off: 0.72 },
  { champ: 'Riven', ruta: 'top', equipo: 'azul', v: 0.05, off: 0.55 },
  { champ: 'Vi', ruta: 'jgAzul', equipo: 'azul', v: 0.07, off: 0.3 },
  { champ: 'Ahri', ruta: 'mid', equipo: 'azul', v: 0.05, off: 0.3 },
  { champ: 'Jinx', ruta: 'bot', equipo: 'azul', v: 0.045, off: 0.16 },
  { champ: 'Lux', ruta: 'bot', equipo: 'azul', v: 0.045, off: 0.1 },
] as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function sinMovimiento() {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function hayWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

interface Piezas {
  canvas: HTMLCanvasElement;
  voz?: HTMLElement | null;
  reloj?: HTMLElement | null;
  minuto?: HTMLElement | null;
}

/** Monta la escena. Devuelve la función para desmontarla, o null si no aplica. */
export async function montarGrieta({ canvas, voz, reloj, minuto }: Piezas) {
  if (sinMovimiento() || !hayWebGL()) return null;

  // La versión del parche hace falta para el mapa y los iconos. Si el CDN no
  // contesta se usa una conocida y la escena sigue en pie.
  let VER = '15.24.1';
  try {
    const r = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const v = await r.json();
    if (Array.isArray(v) && v[0]) VER = v[0];
  } catch {
    /* sin red: se queda la de respaldo */
  }
  const urlIcono = (n: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${VER}/img/champion/${n}.png`;
  const urlMapa = () =>
    `https://ddragon.leagueoflegends.com/cdn/${VER}/img/map/map11.png`;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);

  // Carga texturas sin reventar: si una imagen falla entra un pixel oscuro.
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  const vacia = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 2;
    const x = c.getContext('2d')!;
    x.fillStyle = '#12121b';
    x.fillRect(0, 0, 2, 2);
    return new THREE.CanvasTexture(c);
  })();
  const carga = (url: string, ok: (t: THREE.Texture) => void) =>
    loader.load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        ok(t);
      },
      undefined,
      () => ok(vacia)
    );

  const grupo = new THREE.Group();
  scene.add(grupo);

  // ---- el mapa ------------------------------------------------------
  const LADO = 16;
  const mapa = new THREE.Mesh(
    new THREE.PlaneGeometry(LADO, LADO, 1, 1),
    new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTex: { value: null } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        varying vec2 vUv;
        void main(){
          vec3 tex = texture2D(uTex, vUv).rgb;
          float luma = dot(tex, vec3(0.299, 0.587, 0.114));
          // Se conserva el dibujo del mapa y solo se tiñe de azul de noche: si
          // se aplana a dos colores, las calles y la jungla dejan de verse.
          vec3 tinte = tex * vec3(0.46, 0.56, 1.32) * 1.45;
          vec3 col = mix(vec3(0.075, 0.08, 0.14), tinte, 0.9);
          col += vec3(0.14, 0.15, 0.38) * smoothstep(0.35, 0.85, luma);

          // Rejilla fina encima, como un tablero táctico.
          vec2 g = abs(fract(vUv * 16.0) - 0.5);
          float rej = 1.0 - smoothstep(0.0, 0.05, min(g.x, g.y));
          col += vec3(0.30, 0.32, 0.62) * rej * 0.10;

          // Los bordes se apagan: nada de cuadro recortado.
          vec2 b = min(vUv, 1.0 - vUv);
          gl_FragColor = vec4(col, smoothstep(0.0, 0.16, min(b.x, b.y)));
        }
      `,
    })
  );
  carga(urlMapa(), (t) => ((mapa.material as THREE.ShaderMaterial).uniforms.uTex.value = t));
  mapa.rotation.x = -Math.PI / 2;
  // El orden manda: lo que va encima del mapa se dibuja después, si no el mapa
  // (opaco por dentro) los borra al pintarse.
  mapa.renderOrder = 0;
  grupo.add(mapa);

  // ---- rutas --------------------------------------------------------
  const uvXY = (u: number, v: number) =>
    new THREE.Vector3((u - 0.5) * LADO, 0, -(v - 0.5) * LADO);

  const curvas: Record<string, THREE.CatmullRomCurve3> = {};
  for (const [k, pts] of Object.entries(RUTAS)) {
    const curva = new THREE.CatmullRomCurve3(pts.map(([u, v]) => uvXY(u, v)));
    curvas[k] = curva;
    const linea = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curva.getPoints(60)),
      new THREE.LineBasicMaterial({
        color: 0x5b5fd6,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      })
    );
    linea.position.y = 0.03;
    linea.renderOrder = 1;
    grupo.add(linea);
  }

  // ---- los diez -----------------------------------------------------
  const fichaGeo = new THREE.PlaneGeometry(1.05, 1.05);
  const fichas = JUGADORES.map((j) => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTex: { value: null },
        uColor: {
          value:
            j.equipo === 'rojo'
              ? new THREE.Color(0.92, 0.36, 0.42)
              : new THREE.Color(0.44, 0.72, 1),
        },
        uVivo: { value: 1 }, // baja a 0 cuando se pierde de vista
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform vec3 uColor;
        uniform float uVivo;
        varying vec2 vUv;
        void main(){
          float r = length(vUv - 0.5);
          if (r > 0.5) discard;
          vec3 tex = texture2D(uTex, vUv).rgb;
          float luma = dot(tex, vec3(0.299, 0.587, 0.114));
          vec3 col = mix(vec3(luma) * 0.5, tex, uVivo);
          float aro = smoothstep(0.5, 0.44, r) - smoothstep(0.44, 0.37, r);
          col = mix(col, uColor, aro * (0.55 + uVivo * 0.45));
          gl_FragColor = vec4(col, smoothstep(0.5, 0.47, r) * (0.35 + uVivo * 0.65));
        }
      `,
    });
    carga(urlIcono(j.champ), (t) => (mat.uniforms.uTex.value = t));
    const m = new THREE.Mesh(fichaGeo, mat);
    m.position.y = 0.5;
    m.renderOrder = 3;
    grupo.add(m);
    return { ...j, mesh: m, mat };
  });

  // ---- ping donde se le vio por última vez --------------------------
  const ping = new THREE.Mesh(
    new THREE.PlaneGeometry(6.2, 6.2),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uT;
        varying vec2 vUv;
        void main(){
          float r = length(vUv - 0.5) * 2.0;
          if (r > 1.0) discard;
          // Aro fijo, dos ondas que salen y un punto al centro: el ping del juego.
          float aro = 1.0 - smoothstep(0.0, 0.045, abs(r - 0.42));
          float ondas = 0.0;
          for (int i = 0; i < 2; i++){
            float f = fract(uT * 0.55 - float(i) * 0.5);
            ondas += (1.0 - smoothstep(0.0, 0.13, abs(r - f))) * (1.0 - f) * 0.9;
          }
          float punto = 1.0 - smoothstep(0.05, 0.09, r);
          float a = (aro * 0.85 + ondas + punto) * step(0.001, uT);
          gl_FragColor = vec4(vec3(1.0, 0.42, 0.5), clamp(a, 0.0, 1.0) * 0.95);
        }
      `,
    })
  );
  ping.rotation.x = -Math.PI / 2;
  ping.position.y = 0.06;
  ping.visible = false;
  ping.renderOrder = 2;
  grupo.add(ping);

  // ---- encuadre -----------------------------------------------------
  let camBase = 30; // distancia de la cámara al mapa
  let miraY = 0; // sube el punto de mira y el mapa baja en pantalla

  function colocar(mx = 0, my = 0) {
    camera.position.set(mx, grupo.position.y + camBase * 0.78 - my, camBase * 0.56);
    camera.lookAt(0, grupo.position.y + miraY, 0);
  }

  /* El mapa se encuadra solo: se prueba una distancia, se mide dónde caen sus
     cuatro esquinas en pantalla y se corrige, hasta que cabe entero en la
     franja de abajo. Así queda bien en cualquier monitor sin números a mano. */
  const ESQUINAS = [
    new THREE.Vector3(-8, 0, -8),
    new THREE.Vector3(8, 0, -8),
    new THREE.Vector3(8, 0, 8),
    new THREE.Vector3(-8, 0, 8),
  ];
  const vTmp = new THREE.Vector3();

  function medir() {
    let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (const e of ESQUINAS) {
      vTmp.copy(e).applyMatrix4(grupo.matrixWorld).project(camera);
      x0 = Math.min(x0, vTmp.x); x1 = Math.max(x1, vTmp.x);
      y0 = Math.min(y0, vTmp.y); y1 = Math.max(y1, vTmp.y);
    }
    return { w: x1 - x0, h: y1 - y0, cy: (y0 + y1) / 2 };
  }

  function encuadrar() {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // En celular el lienzo es una franja aparte debajo del texto y el mapa la
    // llena; en pantallas anchas comparte espacio con el copy, así que se hace
    // más chico y se recuesta en la parte de abajo.
    const chico = window.innerWidth <= 736;
    const ANCHO_MAX = chico ? 1.94 : 1.68; // en coordenadas de pantalla (-1 a 1)
    const ALTO_MAX = chico ? 1.9 : 0.94;
    const CENTRO = chico ? 0 : -0.22;

    grupo.updateMatrixWorld(true);
    for (let k = 0; k < 8; k++) {
      colocar();
      let m = medir();
      camBase *= Math.max(m.w / ANCHO_MAX, m.h / ALTO_MAX);
      colocar();
      m = medir();
      const altoVisible = 2 * Math.tan((camera.fov * Math.PI) / 360) * camBase;
      miraY += ((m.cy - CENTRO) * altoVisible) / 2;
    }
  }
  grupo.position.y = -1.2;
  encuadrar();

  // ---- guion --------------------------------------------------------
  const avisos = voz ? Array.from(voz.querySelectorAll<HTMLElement>('.lol-voz__i')) : [];
  const mouse = { tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const posTmp = new THREE.Vector3();

  function pintar(t: number) {
    const ct = t % CICLO;

    fichas.forEach((f, i) => {
      // La jungla enemiga se mete al arbusto en el segundo 4 y sale en el 11.
      // Mientras no se le ve, su ficha se queda clavada y en gris justo donde
      // estaba: eso es lo que la app avisa, dónde se perdió de vista.
      const oculto = 'esJungla' in f && f.esJungla && ct > 4 && ct < 11;

      if (!oculto) {
        const u = (f.off + t * f.v) % 2;
        const d = u > 1 ? 2 - u : u;
        curvas[f.ruta].getPointAt(clamp(d, 0.001, 0.999), posTmp);
        const lado = (i % 2 ? 1 : -1) * 0.34; // los de una misma calle no se encimen
        f.mesh.position.set(posTmp.x + lado, 0.55, posTmp.z + lado * 0.5);
      }
      // Siempre de frente: si se acuestan con el mapa se ven como óvalos.
      f.mesh.quaternion.copy(camera.quaternion);

      if ('esJungla' in f && f.esJungla) {
        const u = f.mat.uniforms.uVivo;
        u.value = lerp(u.value, oculto ? 0 : 1, 0.08);
        if (!oculto) ping.position.set(f.mesh.position.x, 0.06, f.mesh.position.z);
        ping.visible = !!oculto;
      }
    });

    (ping.material as THREE.ShaderMaterial).uniforms.uT.value =
      ct > 4 && ct < 11 ? (ct - 4) / 2.6 : 0;

    // Reloj de la partida, corriendo.
    if (minuto) {
      const seg = Math.floor(760 + t);
      minuto.textContent = `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
    }
    reloj?.classList.add('is-on');

    // Los avisos entran en su momento del ciclo.
    const cual = ct < 4.6 ? -1 : ct < 8.5 ? 0 : ct < 11.5 ? 1 : 2;
    avisos.forEach((a, i) => a.classList.toggle('is-on', i === cual));

    grupo.rotation.y = -0.18 + Math.sin(t * 0.06) * 0.03;
    colocar(mouse.tx * 1.4, mouse.ty * 0.6);
    renderer.render(scene, camera);
  }

  // ---- bucle: solo pinta con el hero en pantalla ---------------------
  let visible = false;
  let raf = 0;
  let t0 = 0;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (!t0) t0 = now;
    pintar((now - t0) / 1000);
  };
  const play = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const sync = () => (visible && !document.hidden ? play() : pause());

  const io = new IntersectionObserver(
    (es) => {
      visible = es.some((e) => e.isIntersecting);
      sync();
    },
    { threshold: 0 }
  );
  io.observe(canvas);
  document.addEventListener('visibilitychange', sync);

  const ro = new ResizeObserver(() => encuadrar());
  ro.observe(canvas);

  // Con setTimeout y no con requestAnimationFrame: si la pestaña carga en
  // segundo plano, rAF se congela y el lienzo se quedaría invisible.
  setTimeout(() => canvas.classList.add('is-on'), 60);

  return () => {
    pause();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pointermove', onMove);
    scene.traverse((obj) => {
      const m = obj as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    renderer.dispose();
  };
}
