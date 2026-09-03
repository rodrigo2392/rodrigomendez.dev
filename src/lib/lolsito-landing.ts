/**
 * Toda la landing de Lolsito: la portada 3D con la Grieta, el recorrido de
 * pantallas, el riel de la API key, el parallax y el mosaico del pie.
 *
 * Sale del mockup mock/lolsito-v2/index.html, que es donde se diseñó. El único
 * cambio es que three.js se importa del proyecto en lugar de un CDN.
 */

import * as THREE from 'three';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a,b,t)=>a+(b-a)*t;
const clamp = (v,a=0,b=1)=>Math.min(b,Math.max(a,v));

const CHAMPS = ['Ahri','Yasuo','Jinx','LeeSin','Lux','Zed','Ashe','Darius','Katarina',
  'Thresh','Ekko','Vi','Jhin','Kaisa','Sett','Yone','Viego','Akali','Irelia','Riven',
  'MissFortune','Pyke','Senna','Samira'];
const art = n => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${n}_0.jpg`;

/* ═══════════════════════════════════════════════════════════════
   PORTADA: la Grieta, con la partida corriendo
   El mapa del juego tumbado en perspectiva, los diez jugadores
   caminando por sus calles y Lolsito cantando lo que ve. Cuando la
   jungla enemiga se pierde de vista, su ficha se queda clavada en
   gris y sale el ping donde se le vio por última vez.
   ═══════════════════════════════════════════════════════════════ */

/* La versión del parche hace falta para el mapa y los iconos. Si el CDN no
   contesta se usa una conocida y la portada sigue funcionando. */
let VER = '15.24.1';
try {
  const r = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const v = await r.json();
  if (Array.isArray(v) && v[0]) VER = v[0];
} catch { /* sin red: se queda la de respaldo */ }

const icono = n => `https://ddragon.leagueoflegends.com/cdn/${VER}/img/champion/${n}.png`;
const mapaGrieta = () => `https://ddragon.leagueoflegends.com/cdn/${VER}/img/map/map11.png`;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, innerWidth/innerHeight, .1, 120);

/* Carga texturas sin reventar: si una imagen falla, entra un pixel oscuro y
   la escena sigue en pie. */
const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');
const texVacia = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 2;
  const x = c.getContext('2d');
  x.fillStyle = '#12121b'; x.fillRect(0, 0, 2, 2);
  return new THREE.CanvasTexture(c);
})();
const carga = (url, onLoad) => loader.load(url, t => {
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  onLoad(t);
}, undefined, () => onLoad(texVacia));

const grupo = new THREE.Group();
scene.add(grupo);

/* ── El mapa ─────────────────────────────────────────────────── */
const LADO = 16;
const mapa = new THREE.Mesh(
  new THREE.PlaneGeometry(LADO, LADO, 1, 1),
  new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {uTex: {value: null}},
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
carga(mapaGrieta(), t => mapa.material.uniforms.uTex.value = t);
mapa.rotation.x = -Math.PI / 2;
// El orden manda: lo que va encima del mapa se dibuja después, si no el mapa
// (opaco por dentro) los borra al pintarse.
mapa.renderOrder = 0;
grupo.add(mapa);

/* ── Rutas ───────────────────────────────────────────────────────
   Coordenadas del minimapa: (0,0) abajo a la izquierda es la base azul,
   (1,1) arriba a la derecha la roja. */
const uvXY = (u, v) => new THREE.Vector3((u - .5) * LADO, 0, -(v - .5) * LADO);

const RUTAS = {
  top:    [[.06,.34],[.07,.62],[.13,.84],[.34,.93]],
  mid:    [[.24,.24],[.38,.40],[.50,.50],[.62,.60],[.76,.76]],
  bot:    [[.34,.06],[.62,.08],[.85,.15],[.93,.36]],
  jgAzul: [[.20,.42],[.32,.30],[.44,.24],[.36,.14],[.20,.20]],
  jgRojo: [[.78,.60],[.66,.70],[.56,.78],[.66,.86],[.80,.80]],
};

const JUGADORES = [
  {champ:'Darius',   ruta:'top',    equipo:'rojo', v:.055, off:.15},
  {champ:'LeeSin',   ruta:'jgRojo', equipo:'rojo', v:.075, off:0, esJungla:true},
  {champ:'Katarina', ruta:'mid',    equipo:'rojo', v:.05,  off:.62},
  {champ:'Jhin',     ruta:'bot',    equipo:'rojo', v:.045, off:.78},
  {champ:'Thresh',   ruta:'bot',    equipo:'rojo', v:.045, off:.72},
  {champ:'Riven',    ruta:'top',    equipo:'azul', v:.05,  off:.55},
  {champ:'Vi',       ruta:'jgAzul', equipo:'azul', v:.07,  off:.30},
  {champ:'Ahri',     ruta:'mid',    equipo:'azul', v:.05,  off:.30},
  {champ:'Jinx',     ruta:'bot',    equipo:'azul', v:.045, off:.16},
  {champ:'Lux',      ruta:'bot',    equipo:'azul', v:.045, off:.10},
];

const curvas = {};
for (const [k, pts] of Object.entries(RUTAS)){
  const curva = new THREE.CatmullRomCurve3(pts.map(([u,v]) => uvXY(u,v)));
  curvas[k] = curva;
  const linea = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(curva.getPoints(60)),
    new THREE.LineBasicMaterial({color:0x5B5FD6, transparent:true, opacity:.2, depthWrite:false})
  );
  linea.position.y = .03;
  linea.renderOrder = 1;
  grupo.add(linea);
}

/* ── Los diez, como en el minimapa ───────────────────────────── */
const fichaGeo = new THREE.PlaneGeometry(1.05, 1.05);
const fichas = JUGADORES.map(j => {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTex: {value: null},
      uColor: {value: j.equipo === 'rojo'
        ? new THREE.Color(.92, .36, .42)
        : new THREE.Color(.44, .72, 1.0)},
      uVivo: {value: 1},   // baja a 0 cuando se pierde de vista
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
  carga(icono(j.champ), t => mat.uniforms.uTex.value = t);
  const m = new THREE.Mesh(fichaGeo, mat);
  m.position.y = .5;
  m.renderOrder = 3;
  grupo.add(m);
  return {...j, mesh: m, mat};
});

/* ── Ping donde se le vio por última vez ─────────────────────── */
const ping = new THREE.Mesh(
  new THREE.PlaneGeometry(6.2, 6.2),
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {uT: {value: 0}},
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
ping.position.y = .06;
ping.visible = false;
ping.renderOrder = 2;
grupo.add(ping);

/* ── Guion: ciclo de 15 s ────────────────────────────────────── */
const CICLO = 15;
const avisos   = [...document.querySelectorAll('.voz__i')];
const relojEl  = document.getElementById('reloj');
const relojN   = document.getElementById('relojN');

const mouse = {tx:0, ty:0};
addEventListener('pointermove', e => {
  mouse.tx = (e.clientX / innerWidth - .5) * 2;
  mouse.ty = (e.clientY / innerHeight - .5) * 2;
}, {passive:true});

const heroEl   = document.getElementById('hero');
const heroWrap = document.getElementById('heroWrap');
const heroBeat = document.getElementById('heroBeat');
const hint     = document.querySelector('.scrollhint');

let scrollP = 0, scrollPs = 0;
let camBase = 30;   // distancia de la cámara al mapa
let miraY = 0;      // sube el punto de mira y el mapa baja en pantalla

function colocar(dive, mx = 0, my = 0){
  camera.position.set(
    mx,
    grupo.position.y + camBase * (.78 - dive * .5) - my,
    camBase * (.56 + dive * .16)
  );
  camera.lookAt(0, grupo.position.y + miraY, 0);
}

/* El mapa se encuadra solo: se prueba una distancia, se mide dónde caen sus
   cuatro esquinas en pantalla y se corrige, hasta que cabe entero en la franja
   de abajo. Así queda bien en cualquier monitor sin números a mano. */
const ESQUINAS = [
  new THREE.Vector3(-8, 0, -8), new THREE.Vector3(8, 0, -8),
  new THREE.Vector3(8, 0, 8),   new THREE.Vector3(-8, 0, 8),
];
const vTmp = new THREE.Vector3();

function medir(){
  let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
  for (const e of ESQUINAS){
    vTmp.copy(e).applyMatrix4(grupo.matrixWorld).project(camera);
    x0 = Math.min(x0, vTmp.x); x1 = Math.max(x1, vTmp.x);
    y0 = Math.min(y0, vTmp.y); y1 = Math.max(y1, vTmp.y);
  }
  return {w: x1 - x0, h: y1 - y0, cy: (y0 + y1) / 2};
}

function encuadrar(){
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  const vertical = innerWidth / innerHeight < 1;
  const ANCHO_MAX = vertical ? 1.9 : 1.68;   // en coordenadas de pantalla (-1 a 1)
  const ALTO_MAX  = vertical ? 1.06 : 1.12;
  const CENTRO    = vertical ? -.3 : -.34;   // el mapa vive por debajo del medio

  grupo.updateMatrixWorld(true);
  for (let k = 0; k < 8; k++){
    colocar(0);
    let m = medir();
    camBase *= Math.max(m.w / ANCHO_MAX, m.h / ALTO_MAX);
    colocar(0);
    m = medir();
    const altoVisible = 2 * Math.tan(camera.fov * Math.PI / 360) * camBase;
    miraY += (m.cy - CENTRO) * altoVisible / 2;
  }
}
encuadrar();

const posTmp = new THREE.Vector3();

function frame(ms){
  const t = ms / 1000;
  const hb = heroEl.getBoundingClientRect();
  scrollP = clamp(-hb.top / (heroEl.offsetHeight - innerHeight));
  scrollPs = lerp(scrollPs, scrollP, .075);
  const p = scrollPs;

  const ct = reduce ? 4 : t % CICLO;

  fichas.forEach((f, i) => {
    // La jungla enemiga se mete al arbusto en el segundo 4 y sale en el 11.
    // Mientras no se le ve, su ficha se queda clavada y en gris justo donde
    // estaba: eso es lo que la app te avisa, dónde se perdió de vista.
    const oculto = f.esJungla && ct > 4 && ct < 11;

    if (!oculto){
      const u = (f.off + (reduce ? 0 : t * f.v)) % 2;
      const d = u > 1 ? 2 - u : u;
      curvas[f.ruta].getPointAt(clamp(d, .001, .999), posTmp);
      const lado = (i % 2 ? 1 : -1) * .34;   // los de una misma calle no se encimen
      f.mesh.position.set(posTmp.x + lado, .55, posTmp.z + lado * .5);
    }
    // Siempre de frente: si se acuestan con el mapa se ven como óvalos.
    f.mesh.quaternion.copy(camera.quaternion);

    if (f.esJungla){
      f.mat.uniforms.uVivo.value = lerp(f.mat.uniforms.uVivo.value, oculto ? 0 : 1, .08);
      if (!oculto) ping.position.set(f.mesh.position.x, .06, f.mesh.position.z);
      ping.visible = oculto;
    }
  });

  ping.material.uniforms.uT.value = (ct > 4 && ct < 11) ? (ct - 4) / 2.6 : 0;

  const seg = Math.floor(760 + t);
  relojN.textContent = `${String(Math.floor(seg / 60)).padStart(2,'0')}:${String(seg % 60).padStart(2,'0')}`;
  relojEl.classList.toggle('on', p < .2);

  const cual = ct < 4.6 ? -1 : ct < 8.5 ? 0 : ct < 11.5 ? 1 : 2;
  avisos.forEach((a, i) => a.classList.toggle('on', i === cual && p < .22));

  // Al bajar, la cámara se hunde en el mapa y el mapa se va con ella.
  const dive = Math.pow(clamp((p - .15) / .6), 1.5);
  grupo.rotation.y = -.18 + Math.sin(t * .06) * .03 + p * .2;
  grupo.position.y = -1.2 - dive * 1.2;
  colocar(dive, mouse.tx * 1.4, mouse.ty * .6);

  canvas.style.opacity = String(1 - clamp((p - .7) / .2) * .96);

  const ti = clamp((p - .1) / .3);
  heroWrap.style.transform = `translateY(${-24 - ti * 7}vh) scale(${1 + ti * .55})`;
  heroWrap.style.opacity   = String(1 - clamp(ti * 1.3));
  heroWrap.style.filter    = `blur(${ti*ti*30}px)`;
  hint.style.opacity       = String(1 - clamp(ti * 1.6));

  const b = clamp((p - .62) / .18) * (1 - clamp((p - .94) / .06));
  heroBeat.style.opacity   = String(b);
  heroBeat.style.transform = `translateY(${(1-b)*38}px) scale(${.955 + b*.045})`;
  heroBeat.style.filter    = `blur(${(1-b)*18}px)`;

  if (hb.bottom > 0) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  encuadrar();
}, {passive:true});

/* ═══════════════════════════════════════════════════════════════
   RECORRIDO: siete pantallas de la app, una por cada 100vh
   ═══════════════════════════════════════════════════════════════ */
const BEATS = [
  {tono:'neg', tilt:[ 1.4, -3.2], aspecto:1.370},  // Meta juego
  {tono:'neg', tilt:[ 1.0,  3.0], aspecto:1.557},  // Draft de IA
  {tono:'ind', tilt:[ 2.0, -1.4], aspecto:1.557},  // Coach en vivo
  {tono:'neg', tilt:[-1.6, -2.6], aspecto:1.370},  // Análisis
  {tono:'ind', tilt:[ 1.6,  2.6], aspecto:1.697},  // Coach Q&A
  {tono:'neg', tilt:[-1.2, -2.8], aspecto:1.697},  // Destilteo
  {tono:'ind', tilt:[ 0.8,  2.2], aspecto:1.370},  // Configuración
];

const tour      = document.getElementById('tour');
const tourStick = document.getElementById('tourStick');
const win       = document.getElementById('win');
const words     = [...document.querySelectorAll('.tour__word')];
const hilo      = document.querySelector('.tour__hilo');
const fotos     = [...document.querySelectorAll('.win__foto')];
const copies    = [...document.querySelectorAll('.tour__copy p')];
const chipBtns  = [...document.querySelectorAll('.chips__in button[data-b]')];

/* Cada letra en su propio span para poder repartirlas a lo ancho */
for (const w of words) w.innerHTML = [...w.textContent.trim()].map(c => `<span>${c}</span>`).join('');
let beat = -1;

let flote = 0;
function pintarVentana(){
  const B = BEATS[Math.max(beat, 0)];
  win.style.transform =
    `perspective(2200px) translate3d(0, ${flote.toFixed(1)}px, 0)` +
    ` rotateX(${B.tilt[0]}deg) rotateY(${B.tilt[1]}deg)`;
}

function pintarBeat(i){
  if (i === beat) return;
  beat = i;
  const B = BEATS[i];
  tourStick.dataset.tono = B.tono;
  win.style.setProperty('--aspecto', String(B.aspecto));
  pintarVentana();
  words.forEach((w,n)  => w.classList.toggle('on', n === i));
  fotos.forEach((f,n)  => f.classList.toggle('on', n === i));
  copies.forEach((c,n) => c.classList.toggle('on', n === i));
  chipBtns.forEach((c,n)  => c.classList.toggle('on', n === i));
  // El chip activo se centra moviendo SOLO su barra. scrollIntoView arrastraba
  // el contenedor clavado completo y descuadraba la pantalla en celular.
  const btn = chipBtns[i], cont = document.getElementById('chips');
  if (btn && cont && cont.scrollWidth > cont.clientWidth){
    cont.scrollTo({left: btn.offsetLeft - (cont.clientWidth - btn.offsetWidth) / 2, behavior:'smooth'});
  }
}

/* Ir a un beat al presionar su chip */
chipBtns.forEach((btn, i) => btn.addEventListener('click', () => {
  const arr = tour.offsetTop;
  const paso = (tour.offsetHeight - innerHeight) / BEATS.length;
  scrollTo({top: arr + paso * (i + .5), behavior:'smooth'});
}));
document.getElementById('skip').addEventListener('click', () =>
  document.getElementById('key').scrollIntoView({behavior:'smooth'}));

/* ═══ Apariciones ═══ */
const io = new IntersectionObserver((es, o) => {
  for (const e of es) if (e.isIntersecting){ e.target.classList.add('on'); o.unobserve(e.target); }
}, {rootMargin:'0px 0px -12% 0px'});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ═══ Scroll: parallax, progreso, recorrido y riel ═══ */
const pxEls  = [...document.querySelectorAll('[data-px]')];
const prog   = document.getElementById('prog');
const barcta = document.getElementById('barcta');
const key    = document.getElementById('key');
const rail   = document.getElementById('rail');

/* Un solo motor para todas las capas.
   data-px    px que recorre la capa (negativo = va al revés que el scroll)
   data-px-x  lo mismo en horizontal
   data-px-s  zoom extra en los extremos del recorrido
   data-px-y  desplazamiento fijo que hay que conservar (ej. centrados) */
function parallax(){
  for (const el of pxEls){
    const ref = el.dataset.pxRef === 'section' ? el.closest('section') : el.parentElement;
    const r = ref.getBoundingClientRect();
    if (r.bottom < -300 || r.top > innerHeight + 300) continue;
    // c va de +1 (la sección viene entrando) a -1 (ya se fue)
    const c = clamp((r.top + r.height/2 - innerHeight/2) / innerHeight, -1.4, 1.4);
    const dy = c * (+el.dataset.px || 0);
    const dx = c * (+el.dataset.pxX || 0);
    const sc = 1 + Math.abs(c) * (+el.dataset.pxS || 0);
    const fijo = el.dataset.pxY || '0';
    el.style.transform = `translate3d(${dx}px, calc(${fijo} + ${dy.toFixed(1)}px), 0) scale(${sc.toFixed(3)})`;
  }
}

function onScroll(){
  parallax();

  prog.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
  barcta.classList.toggle('on', scrollY > innerHeight * .8);

  // Recorrido
  const tr = tour.getBoundingClientRect();
  if (tr.top <= 0 && tr.bottom >= innerHeight){
    const p = clamp(-tr.top / (tour.offsetHeight - innerHeight), 0, .9999);
    const i = Math.floor(p * BEATS.length);
    pintarBeat(i);
    // La palabra del fondo se arrastra: el texto "se mueve" mientras lees
    const local = p * BEATS.length - i;
    const w = words[i];
    if (w) w.style.transform = `translate3d(${(local - .5) * -84}px, ${(local - .5) * 26}px, 0)`;
    const c = copies[i];
    if (c) c.style.setProperty('--dx', `${(local - .5) * 46}px`);
    // La ventana flota en sentido contrario a la palabra del fondo
    flote = (local - .5) * -26;
    pintarVentana();
    hilo.style.transform = `scaleY(${1 + (local - .5) * .5})`;
  } else if (beat === -1 && tr.top < innerHeight){
    pintarBeat(0);
  }

  // Riel de la API key
  const recorrido = key.offsetHeight - innerHeight;
  const kr = key.getBoundingClientRect();
  if (recorrido > 0 && kr.top <= 0 && kr.bottom >= innerHeight){
    const p = clamp(-kr.top / recorrido);
    rail.style.transform = `translate3d(${-p * railDist}px,0,0)`;
  } else if (recorrido <= 0 && kr.bottom > 0 && kr.top < innerHeight){
    // En rejilla fija no hay nada que correr: los pasos bajan despacio mientras
    // el encabezado sube, para que la sección no se sienta plana.
    const c = clamp((kr.top + key.offsetHeight/2 - innerHeight/2) / innerHeight, -1.2, 1.2);
    rail.style.transform = `translate3d(0, ${(c * 52).toFixed(1)}px, 0)`;
  }
}

/* Cuánto le falta al riel por correr y, con eso, cuánto scroll merece la
   sección. Si los cinco pasos caben de una en pantallas anchas, el recorrido
   es cero y la sección deja de retener el scroll a la fuerza. */
let railDist = 0;
function medirKey(){
  rail.classList.remove('key__rail--fijo');
  const cs    = getComputedStyle(rail);
  const gap   = parseFloat(cs.columnGap) || 0;
  const padX  = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  const pasos = rail.children.length;
  const MIN   = 250;   // ancho mínimo para que un paso siga siendo legible

  if (pasos * MIN + (pasos - 1) * gap + padX <= rail.clientWidth){
    // Caben todos: rejilla fija, cero scroll forzado
    rail.classList.add('key__rail--fijo');
    rail.style.transform = 'translate3d(0,0,0)';
    railDist = 0;
  } else {
    railDist = Math.max(0, rail.scrollWidth - rail.clientWidth + (parseFloat(cs.paddingRight) || 0));
  }
  // 1.35 para que los pasos no pasen disparados
  key.style.height = Math.round(innerHeight + railDist * 1.35) + 'px';
}
medirKey();
addEventListener('resize', medirKey, {passive:true});
// Las tarjetas se miden mal hasta que cargan las fuentes
document.fonts?.ready.then(() => { medirKey(); onScroll(); });
addEventListener('scroll', onScroll, {passive:true});
addEventListener('resize', onScroll, {passive:true});
onScroll();


/* ═══ Mosaico del pie ═══ */
const mosaic = document.getElementById('mosaic');
const cols = innerWidth <= 900 ? 4 : 8;
const filas = Math.ceil(innerHeight / (innerWidth/cols * (560/308))) + 1;
for (let i = 0; i < cols * Math.max(filas, 3); i++){
  const el = document.createElement('i');
  el.style.backgroundImage = `url(${art(CHAMPS[(i*5) % CHAMPS.length])})`;
  mosaic.appendChild(el);
}
