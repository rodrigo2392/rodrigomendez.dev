/* ═══════════════════════════════════════════════════════════════
   Datos y utilidades de League compartidos por las tres portadas.
   El arte sale de Data Dragon, el CDN público de Riot.
   ═══════════════════════════════════════════════════════════════ */

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Versión del parche. Si el CDN no contesta, se usa una conocida. */
let VER = '15.24.1';
export async function version() {
  try {
    const r = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const v = await r.json();
    if (Array.isArray(v) && v[0]) VER = v[0];
  } catch {
    /* sin red: se queda la de respaldo */
  }
  return VER;
}

/** Arte vertical (308x560), el de la pantalla de carga. */
export const artCarga = (n) =>
  `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${n}_0.jpg`;
/** Arte horizontal grande (1215x717), el del splash. */
export const artSplash = (n) =>
  `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${n}_0.jpg`;
/** Icono cuadrado del campeón (120x120). Necesita versión. */
export const icono = (n) =>
  `https://ddragon.leagueoflegends.com/cdn/${VER}/img/champion/${n}.png`;
/** Mapa de la Grieta del Invocador (512x512). Necesita versión. */
export const mapaGrieta = () =>
  `https://ddragon.leagueoflegends.com/cdn/${VER}/img/map/map11.png`;

/** Campeones con arte que se ve bien en oscuro. */
export const CHAMPS = [
  'Ahri', 'Yasuo', 'Jinx', 'LeeSin', 'Lux', 'Zed', 'Ashe', 'Darius', 'Katarina',
  'Thresh', 'Ekko', 'Vi', 'Jhin', 'Kaisa', 'Sett', 'Yone', 'Viego', 'Akali',
  'Irelia', 'Riven', 'MissFortune', 'Pyke', 'Senna', 'Samira',
];

/** Nombre en español para enseñar en pantalla. */
export const NOMBRE = {
  LeeSin: 'Lee Sin',
  MissFortune: 'Miss Fortune',
  Kaisa: "Kai'Sa",
};
export const bonito = (n) => NOMBRE[n] || n;

/**
 * Carga una textura y avisa cuando ya está. Nunca revienta: si una imagen
 * falla, devuelve una textura de un pixel para que la escena siga.
 */
export function cargador(THREE) {
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  const vacio = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 2;
    const x = c.getContext('2d');
    x.fillStyle = '#12121b';
    x.fillRect(0, 0, 2, 2);
    return new THREE.CanvasTexture(c);
  })();

  return (url, onLoad) =>
    loader.load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        onLoad?.(t);
      },
      undefined,
      () => onLoad?.(vacio)
    );
}

/** Ruido de valor 3D en GLSL, para disolver y deformar. */
export const GLSL_NOISE = /* glsl */ `
  float lolHash(vec3 p){
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float lolNoise(vec3 x){
    vec3 i = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(lolHash(i), lolHash(i + vec3(1,0,0)), f.x),
          mix(lolHash(i + vec3(0,1,0)), lolHash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(lolHash(i + vec3(0,0,1)), lolHash(i + vec3(1,0,1)), f.x),
          mix(lolHash(i + vec3(0,1,1)), lolHash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float lolFbm(vec3 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++){ v += a * lolNoise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
`;

/**
 * Bucle de dibujo que se apaga solo cuando la portada sale de pantalla o la
 * pestaña se esconde, para no gastar batería de a gratis.
 */
export function bucle(el, frame) {
  let visible = true;
  let raf = 0;
  let t0 = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (!t0) t0 = now;
    frame((now - t0) / 1000);
  };
  const play = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const sync = () => (visible && !document.hidden ? play() : pause());
  new IntersectionObserver(
    (es) => {
      visible = es.some((e) => e.isIntersecting);
      sync();
    },
    { threshold: 0 }
  ).observe(el);
  document.addEventListener('visibilitychange', sync);
  play();
}
