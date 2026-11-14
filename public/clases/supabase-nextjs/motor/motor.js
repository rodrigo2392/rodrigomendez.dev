/* Motor de las presentaciones: navegación, pasos, animaciones, tema y la
   ventana del presentador. No depende de ninguna librería. */
(() => {
  "use strict";

  const raiz = document.documentElement;
  const escenario = document.querySelector(".escenario");
  const lienzo = escenario.querySelector(".lienzo");
  const laminas = [...lienzo.querySelectorAll(".lamina")];
  const total = laminas.length;
  const nombre = escenario.dataset.nombre || "presentacion";
  const otraUrl = escenario.dataset.otra || "";
  const otraCorto = escenario.dataset.otraCorto || "";
  const otraTitulo = escenario.dataset.otraTitulo || "";
  const regresoUrl = escenario.dataset.regreso || "";
  const regresoTitulo = escenario.dataset.regresoTitulo || "";
  const cierra = escenario.dataset.cierra === "1";
  const reducir = matchMedia("(prefers-reduced-motion: reduce)");
  const esPresentador = new URLSearchParams(location.search).has("presentador");
  let limpio = !esPresentador && new URLSearchParams(location.search).has("limpio");
  if (limpio) raiz.classList.add("modo-limpio");
  /* ?imprimir pone todas las láminas una tras otra, cada una en su estado final:
     de ahí sale el PDF de cada clase. */
  const imprimir = !esPresentador && new URLSearchParams(location.search).has("imprimir");

  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------- tema claro u oscuro ---------- */

  const temaGuardado = leer("rastro-tema");
  if (temaGuardado === "light" || temaGuardado === "dark") raiz.dataset.theme = temaGuardado;

  const temaActual = () =>
    raiz.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function alternarTema() {
    raiz.dataset.theme = temaActual() === "dark" ? "light" : "dark";
    guardar("rastro-tema", raiz.dataset.theme);
    avisarPresentador();
  }

  /* ---------- pasos de cada lámina ---------- */

  const pasosDe = laminas.map((l) => {
    const ns = [...l.querySelectorAll("[data-paso]")].map((e) => Number(e.dataset.paso) || 0);
    return ns.length ? Math.max(...ns) : 0;
  });

  laminas.forEach((l, k) => {
    l.setAttribute("aria-roledescription", "diapositiva");
    l.setAttribute("aria-label", `${k + 1} de ${total}: ${l.dataset.titulo || ""}`);
    l.setAttribute("aria-hidden", "true");
  });

  /* Las líneas que se dibujan solas: se mide cada trazo y se esconde con un
     guion del mismo largo. Al activarse, el guion se recorre y aparece. */
  function prepararTrazas() {
    lienzo.querySelectorAll('[data-anima="traza"]').forEach((el) => {
      if (typeof el.getTotalLength !== "function") return;
      const largo = Math.ceil(el.getTotalLength()) + 2;
      el.style.strokeDasharray = `${largo} ${largo}`;
      el.style.strokeDashoffset = String(largo);
    });
  }

  /* ---------- números que cuentan ---------- */

  const formato = new Intl.NumberFormat("es-MX");

  function ponerCuenta(el, v) {
    el.textContent = (el.dataset.antes || "") + formato.format(Math.round(v)) + (el.dataset.despues || "");
  }

  function contar(el) {
    const fin = Number(el.dataset.valor) || 0;
    const dur = Number(el.dataset.dur) || 1400;
    const retraso = parseInt(getComputedStyle(el).getPropertyValue("--d"), 10) || 0;
    el._turno = (el._turno || 0) + 1;
    const turno = el._turno;
    if (reducir.matches) { ponerCuenta(el, fin); return; }
    ponerCuenta(el, 0);
    const t0 = performance.now() + retraso;
    const cuadro = (t) => {
      if (turno !== el._turno || !el.classList.contains("on")) return;
      const k = Math.min(Math.max((t - t0) / dur, 0), 1);
      ponerCuenta(el, fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(cuadro);
    };
    requestAnimationFrame(cuadro);
  }

  /* ---------- activar y reiniciar animaciones ---------- */

  function activarAnimas(lamina) {
    lamina.querySelectorAll("[data-anima]").forEach((el) => {
      const paso = el.closest("[data-paso]");
      if (paso && !paso.classList.contains("visto")) return;
      if (el.classList.contains("on")) return;
      el.classList.add("on");
      if (el.dataset.anima === "cuenta") contar(el);
    });
  }

  /* Los pasos de cada lámina se revelan solos al llegar a ella, uno tras otro:
     nadie tiene que picar "siguiente" para ver lo que falta. Cada paso sale
     PAUSA_PASO ms después del anterior, o cuando diga su data-en (milisegundos
     desde que llega la lámina), para esperar a que termine otra animación. */
  const PAUSA_PASO = 900;

  function revelarPasos(l) {
    (l._pasos || []).forEach(clearTimeout);
    l._pasos = [];
    const cuantos = pasosDe[laminas.indexOf(l)];
    for (let n = 1; n <= cuantos; n++) {
      const propio = [...l.querySelectorAll(`[data-paso="${n}"][data-en]`)]
        .map((e) => Number(e.dataset.en))
        .find((v) => v > 0);
      const cuando = reducir.matches ? 0 : propio || n * PAUSA_PASO;
      l._pasos.push(setTimeout(() => {
        if (!l.classList.contains("visible")) return;
        l.querySelectorAll("[data-paso]").forEach((e) => {
          if (Number(e.dataset.paso) <= n) e.classList.add("visto");
        });
        activarAnimas(l);
      }, cuando));
    }
  }

  function entrar(l) {
    clearTimeout(l._salida);
    l.classList.remove("reinicio");
    l.classList.add("visible");
    l.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!l.classList.contains("visible")) return;
      l.classList.add("animada");
      activarAnimas(l);
      revelarPasos(l);
    }));
  }

  function salir(l) {
    l.classList.remove("visible");
    l.setAttribute("aria-hidden", "true");
    (l._pasos || []).forEach(clearTimeout);
    l._pasos = [];
    clearTimeout(l._salida);
    l._salida = setTimeout(() => {
      if (l.classList.contains("visible")) return;
      l.classList.add("reinicio");
      l.classList.remove("animada");
      l.querySelectorAll(".on").forEach((e) => e.classList.remove("on"));
      l.querySelectorAll(".visto").forEach((e) => e.classList.remove("visto"));
      l.querySelectorAll('[data-anima="cuenta"]').forEach((e) => {
        e._turno = (e._turno || 0) + 1;
        ponerCuenta(e, Number(e.dataset.valor) || 0);
      });
      void l.offsetWidth;
      l.classList.remove("reinicio");
    }, 800);
  }

  /* ---------- navegación ---------- */

  let i = 0;
  const p = 0; // ya no hay pasos a mano: la ventana de notas siempre recibe 0
  let arrancada = false;

  const contador = document.querySelector(".controles .contador");
  const numCajetin = lienzo.querySelector(".cajetin b");
  const voz = document.querySelector(".escenario .solo-lector");
  const dos = (n) => String(n).padStart(2, "0");

  function mostrar(ni) {
    ni = Math.max(0, Math.min(total - 1, ni));
    const cambia = !arrancada || ni !== i;
    arrancada = true;
    i = ni;
    const actual = laminas[i];

    if (cambia) {
      laminas.forEach((l, k) => { if (k !== i && l.classList.contains("visible")) salir(l); });
      entrar(actual);
      if (voz) voz.textContent = actual.getAttribute("aria-label");
    }

    if (contador) contador.textContent = `${i + 1} / ${total}`;
    if (numCajetin) numCajetin.textContent = `${dos(i + 1)} de ${dos(total)}`;
    lienzo.style.setProperty("--progreso", total > 1 ? i / (total - 1) : 1);
    // La dirección guarda la lámina (#5): si se recarga, vuelve al mismo lugar.
    try { history.replaceState(null, "", `#${i + 1}`); } catch (e) { /* sin historial */ }
    avisarPresentador();
  }

  // Siguiente y anterior siempre cambian de lámina: los pasos salen solos.
  function siguiente() {
    if (i < total - 1) mostrar(i + 1);
  }

  function anterior() {
    if (i > 0) mostrar(i - 1);
  }

  /* ---------- escala del lienzo ---------- */

  function escalar() {
    const s = Math.min(innerWidth / 1600, innerHeight / 900);
    lienzo.style.setProperty("--escala", String(s));
  }

  /* ---------- pantalla completa, ayuda, aviso ---------- */

  function pantallaCompleta() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (raiz.requestFullscreen) raiz.requestFullscreen().catch(() => {});
    } catch (e) { /* el navegador no lo permite */ }
  }

  const ayuda = document.querySelector(".ayuda");
  const abrirAyuda = () => { if (ayuda) ayuda.hidden = false; };
  const cerrarAyuda = () => { if (ayuda) ayuda.hidden = true; };
  if (ayuda) ayuda.addEventListener("click", (e) => { if (e.target === ayuda || e.target.closest("[data-cerrar]")) cerrarAyuda(); });

  const aviso = document.querySelector(".aviso-teclas");
  let tAviso;
  function avisar(texto, ms) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.remove("fuera");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => aviso.classList.add("fuera"), ms || 4200);
  }

  /* ---------- ventana del presentador ---------- */

  let ventana = null;

  function abrirPresentador() {
    let abierta = null;
    try {
      const url = location.href.split("#")[0].split("?")[0] + "?presentador";
      abierta = window.open(url, `rastro-notas-${nombre}`, "width=1120,height=740");
    } catch (e) { abierta = null; }
    if (abierta) {
      ventana = abierta;
      setTimeout(avisarPresentador, 700);
    } else {
      avisar("El navegador bloqueó la ventana de notas. Permite las ventanas emergentes de este sitio y vuelve a presionar P.", 6000);
    }
  }

  function avisarPresentador() {
    if (ventana && !ventana.closed) {
      try { ventana.postMessage({ rastro: true, i, p, limpio, tema: temaActual() }, "*"); } catch (e) { /* ventana cerrada */ }
    }
  }

  /* ---------- modo limpio ---------- */

  /* La ventana que se comparte en Zoom se queda sin botones, avisos ni cursor,
     y no responde al teclado ni al dedo: solo la ventana de notas la mueve.
     P (abrir las notas) y F (pantalla completa) siguen funcionando para no
     quedarse atorado si la ventana de notas se cierra. Se guarda en la
     dirección (?limpio) para que sobreviva a recargar la página. */
  function ponerLimpio(v) {
    limpio = Boolean(v);
    raiz.classList.toggle("modo-limpio", limpio);
    if (limpio) {
      cerrarAyuda();
      if (aviso) aviso.classList.add("fuera");
    }
    try {
      history.replaceState(null, "", location.pathname + (limpio ? "?limpio" : "") + location.hash);
    } catch (e) { /* sin historial */ }
    avisarPresentador();
  }

  /* ---------- pasar a la otra presentación ---------- */

  /* Lleva la ventana que se comparte a la otra presentación de la misma hora,
     respetando el modo limpio. La ventana de notas se va detrás por su cuenta y
     se vuelve a enlazar con su saludo de cada dos segundos. */
  function irA(url) {
    if (!url) return;
    location.href = url + (limpio ? "?limpio" : "");
  }
  const irALaOtra = () => irA(otraUrl);

  /* ---------- modo presentador: esta misma página, con las notas ---------- */

  function montarPresentador() {
    raiz.classList.add("modo-presentador");
    escenario.hidden = true;
    document.querySelectorAll(".controles, .ayuda, .aviso-teclas").forEach((e) => { e.hidden = true; });
    document.title = "Notas · " + document.title;

    const panel = document.createElement("div");
    panel.className = "presentador";
    panel.innerHTML = `
      <main class="p-principal">
        <div class="p-cabeza"><span class="p-num"></span><span class="p-paso"></span><span class="p-min"></span></div>
        <h1 class="p-titulo"></h1>
        <div class="p-notas"></div>
      </main>
      <aside class="p-lado">
        <div>
          <button class="p-reloj" type="button" title="Clic para volver a cero">00:00</button>
          <div class="p-hora"></div>
        </div>
        <div class="p-sigue"><span class="etiqueta">Sigue</span><b></b></div>
        <div class="p-modo">
          <button class="p-limpio" type="button" aria-pressed="false" disabled title="Tecla L">
            <span>Modo limpio<small>La presentación sin botones: solo se mueve desde aquí</small></span>
            <span class="p-interruptor" aria-hidden="true"></span>
          </button>
          ${otraUrl ? `<button class="p-otra" type="button" title="Tecla O">Pasar a ${otraTitulo}<span aria-hidden="true">→</span></button>` : ""}
          ${regresoUrl ? `<button class="p-mini p-regreso" type="button">Regresar a ${regresoTitulo}</button>` : ""}
          <button class="p-mini" type="button" data-ir="tema">Cambiar entre claro y oscuro</button>
          <p class="p-estado">Buscando la ventana de la presentación…</p>
        </div>
        <p class="p-aviso">Esta ventana es solo para ti: déjala fuera de lo que compartes en pantalla.</p>
        <div class="p-botones">
          <button type="button" data-ir="anterior">Anterior</button>
          <button type="button" data-ir="siguiente">Siguiente</button>
        </div>
      </aside>`;
    document.body.appendChild(panel);

    const $ = (s) => panel.querySelector(s);
    let inicio = Date.now();
    $(".p-reloj").addEventListener("click", () => { inicio = Date.now(); });
    const reloj = () => {
      const s = Math.floor((Date.now() - inicio) / 1000);
      $(".p-reloj").textContent = `${dos(Math.floor(s / 60))}:${dos(s % 60)}`;
      $(".p-hora").textContent = new Date().toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
    };
    reloj();
    setInterval(reloj, 1000);

    const pedir = (accion, valor) => {
      try { if (window.opener) window.opener.postMessage({ rastro: true, accion, valor }, "*"); } catch (e) { /* sin ventana principal */ }
    };

    /* Cada botón suelta el foco al usarse, para que la barra espaciadora y el
       control remoto sigan avanzando láminas en lugar de volver a picarlo. */
    const botonLimpio = $(".p-limpio");
    let estadoLimpio = false;
    botonLimpio.addEventListener("click", () => { pedir("limpio", !estadoLimpio); botonLimpio.blur(); });
    panel.querySelectorAll("[data-ir]").forEach((b) => b.addEventListener("click", () => { pedir(b.dataset.ir); b.blur(); }));

    /* Pasar a la otra presentación: primero se lo pide a la ventana que se
       comparte y luego esta misma ventana abre las notas de la otra. */
    const pasarA = (accion, url) => {
      if (!url) return;
      pedir(accion);
      setTimeout(() => { location.href = url + "?presentador"; }, 150);
    };
    const pasarALaOtra = () => pasarA("otra", otraUrl);
    const botonOtraNotas = $(".p-otra");
    if (botonOtraNotas) botonOtraNotas.addEventListener("click", pasarALaOtra);
    const botonRegreso = $(".p-regreso");
    if (botonRegreso) botonRegreso.addEventListener("click", () => pasarA("regreso", regresoUrl));

    addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key;
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) pedir("siguiente");
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) pedir("anterior");
      else if (k === "Home") pedir("inicio");
      else if (k === "End") pedir("fin");
      else if (k === "l" || k === "L") pedir("limpio", !estadoLimpio);
      else if (k === "t" || k === "T") pedir("tema");
      else if (k === "o" || k === "O") pasarALaOtra();
      else return;
      e.preventDefault();
    });

    /* La ventana de notas saluda cada dos segundos. Así se vuelve a enlazar sola
       si la presentación se recarga, y avisa si se perdió la conexión. */
    let ultimaSenal = 0;
    const estado = $(".p-estado");
    const revisarConexion = () => {
      const viva = Date.now() - ultimaSenal < 5000;
      estado.classList.toggle("sin-conexion", !viva);
      estado.textContent = viva
        ? (estadoLimpio ? "Conectada. La presentación solo se mueve desde aquí." : "Conectada a la presentación.")
        : "Sin conexión: presiona P en la ventana de la presentación.";
      botonLimpio.disabled = !viva;
    };

    let pintada = "";
    const pintar = (ni, np) => {
      if (pintada === `${ni}.${np}`) return;
      pintada = `${ni}.${np}`;
      const l = laminas[ni];
      if (!l) return;
      $(".p-num").textContent = `Lámina ${ni + 1} de ${total}`;
      $(".p-paso").textContent = "";
      $(".p-min").textContent = l.dataset.min ? `Minuto ${l.dataset.min}` : "";
      $(".p-titulo").textContent = l.dataset.titulo || "";
      const notas = l.querySelector(".notas");
      $(".p-notas").innerHTML = notas ? notas.innerHTML : "<p>Sin notas para esta lámina.</p>";
      const s = laminas[ni + 1];
      $(".p-sigue b").textContent = s
        ? s.dataset.titulo || ""
        : (otraUrl && !cierra ? `Fin. Después: ${otraTitulo}` : "Fin de la presentación");
    };
    pintar(0, 0);

    addEventListener("message", (e) => {
      const d = e.data;
      if (!d || !d.rastro || typeof d.i !== "number") return;
      ultimaSenal = Date.now();
      estadoLimpio = Boolean(d.limpio);
      botonLimpio.setAttribute("aria-pressed", String(estadoLimpio));
      if (d.tema === "light" || d.tema === "dark") raiz.dataset.theme = d.tema;
      pintar(d.i, d.p || 0);
      revisarConexion();
    });
    pedir("hola");
    setInterval(() => { pedir("hola"); revisarConexion(); }, 2000);
  }

  /* ---------- arranque ---------- */

  if (esPresentador) { montarPresentador(); return; }

  if (imprimir) {
    raiz.classList.add("modo-imprimir");
    laminas.forEach((l) => {
      l.classList.add("visible", "animada");
      l.setAttribute("aria-hidden", "false");
      l.querySelectorAll("[data-paso]").forEach((e) => e.classList.add("visto"));
      l.querySelectorAll("[data-anima]").forEach((e) => {
        e.classList.add("on");
        if (e.dataset.anima === "cuenta") ponerCuenta(e, Number(e.dataset.valor) || 0);
      });
    });
    return;
  }

  addEventListener("message", (e) => {
    const d = e.data;
    if (!d || !d.rastro || !d.accion) return;
    if (d.accion === "hola") { ventana = e.source; avisarPresentador(); }
    else if (d.accion === "siguiente") siguiente();
    else if (d.accion === "anterior") anterior();
    else if (d.accion === "inicio") mostrar(0);
    else if (d.accion === "fin") mostrar(total - 1);
    else if (d.accion === "limpio") ponerLimpio(d.valor);
    else if (d.accion === "tema") alternarTema();
    else if (d.accion === "otra") irALaOtra();
    else if (d.accion === "regreso") irA(regresoUrl);
  });

  addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (limpio) {
      if (k === "p" || k === "P") { abrirPresentador(); e.preventDefault(); }
      else if (k === "f" || k === "F") { pantallaCompleta(); e.preventDefault(); }
      return;
    }
    if (ayuda && !ayuda.hidden) {
      if (k === "Escape" || k === "?" || k === "h" || k === "H") { cerrarAyuda(); e.preventDefault(); }
      return;
    }
    if ((k === " " || k === "Enter") && e.target.closest && e.target.closest("button")) return;
    switch (k) {
      case "ArrowRight": case "ArrowDown": case "PageDown": case " ": case "Enter": siguiente(); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp": case "Backspace": anterior(); break;
      case "Home": mostrar(0); break;
      case "End": mostrar(total - 1); break;
      case "f": case "F": pantallaCompleta(); break;
      case "t": case "T": alternarTema(); break;
      case "o": case "O": irALaOtra(); break;
      case "p": case "P": abrirPresentador(); break;
      case "?": case "h": case "H": abrirAyuda(); break;
      default: return;
    }
    e.preventDefault();
  });

  document.querySelectorAll(".controles [data-accion]").forEach((b) => {
    b.addEventListener("click", () => {
      const a = b.dataset.accion;
      if (a === "anterior") anterior();
      else if (a === "siguiente") siguiente();
      else if (a === "pantalla") pantallaCompleta();
      else if (a === "tema") alternarTema();
      else if (a === "presentador") abrirPresentador();
      else if (a === "ayuda") abrirAyuda();
      else if (a === "otra") irALaOtra();
    });
  });

  const botonOtra = document.querySelector('.controles [data-accion="otra"]');
  if (botonOtra && otraUrl) {
    botonOtra.hidden = false;
    const texto = botonOtra.querySelector(".otra-texto");
    if (texto) texto.textContent = otraCorto;
    botonOtra.setAttribute("aria-label", `Pasar a ${otraTitulo}`);
  }

  /* Controles y cursor se esconden solos cuando el ratón no se mueve. */
  const controles = document.querySelector(".controles");
  let tQuieto;
  function despertar() {
    document.body.classList.remove("quieto");
    clearTimeout(tQuieto);
    tQuieto = setTimeout(() => {
      const enControles = controles && (controles.matches(":hover") || controles.contains(document.activeElement));
      if (!enControles) document.body.classList.add("quieto");
    }, 2600);
  }
  addEventListener("mousemove", despertar, { passive: true });
  addEventListener("pointerdown", despertar, { passive: true });

  /* Deslizar con el dedo en pantallas táctiles. */
  let x0 = null;
  let y0 = null;
  escenario.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    x0 = t.clientX;
    y0 = t.clientY;
  }, { passive: true });
  escenario.addEventListener("touchend", (e) => {
    if (x0 === null || limpio) { x0 = null; return; }
    const t = e.changedTouches[0];
    const dx = t.clientX - x0;
    const dy = t.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? siguiente : anterior)();
  }, { passive: true });

  addEventListener("resize", escalar);
  escalar();
  prepararTrazas();

  if (reducir.matches) lienzo.querySelectorAll("svg").forEach((s) => { if (s.pauseAnimations) s.pauseAnimations(); });

  const m = location.hash.match(/^#(\d+)/);
  mostrar(m ? Number(m[1]) - 1 : 0);
  despertar();
  if (!limpio) avisar("Flechas o barra espaciadora para avanzar · F pantalla completa · P notas y modo limpio · ? ayuda");
})();
