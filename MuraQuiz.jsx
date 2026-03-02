import { useState, useEffect, useCallback, useRef } from "react";

/* ── BRAND ── */
const PRI = "#B5685A";
const PRI_LT = "#F5EBE7";
const ACCENT = "#D4A574";
const BG = "#FAFAF7";
const CARD = "#FFFFFF";
const OPT_BG = "#F4F1ED";
const OPT_BD = "#E8E2DA";
const OPT_HOV = "#EDE7DF";
const OPT_SEL = "#F5EBE7";
const TX = "#2C2420";
const TX2 = "#6B5D54";
const TXM = "#A39688";
const GRN = "#5B9A6B";
const GRN_LT = "#EDF5EF";
const YEL = "#D4A03C";
const RED = "#C75050";
const F1 = "'Nunito Sans', sans-serif";
const F2 = "'Cormorant Garamond', serif";

/* ── IMAGES (Shopify CDN) ── */
const HERO_IMG = "https://cdn.shopify.com/s/files/1/0794/3766/0390/files/WhatsApp_Image_2026-02-24_at_03.28.17.jpg?v=1772008696&width=480";
const C1_IMG = "https://cdn.shopify.com/s/files/1/0794/3766/0390/files/Whisk_b1a5bc09f18b6e4b60b4abbf45814092dr.png?v=1772008561&width=440";
const C2_IMG = "https://cdn.shopify.com/s/files/1/0794/3766/0390/files/Whisk_ac9983593137161a87b4119e4ea1231ddr.jpg?v=1772007977&width=440";
const C3_IMG = "https://cdn.shopify.com/s/files/1/0794/3766/0390/files/Diseno_Sin_Titulo_-_1_-_Editado.png?v=1772007978&width=440";
const C4_IMG = "https://cdn.shopify.com/s/files/1/0794/3766/0390/files/Whisk_79758414d8149528082492ac7376c851dr.jpg?v=1772008321&width=440";

/* ── TRACKING CONFIG ── */
const META_PIXEL_ID = "1664661887894561";
const GA4_ID = "G-LX0Z3VLVPD";
const META_STANDARD_EVENTS = ["PageView","ViewContent","Lead","InitiateCheckout","Purchase","AddToCart","CompleteRegistration"];

/* ══════════════════════════════════════════════════
   TRACKING QUEUE SYSTEM
   - Encola eventos hasta que Meta Pixel y GA4 estén listos
   - Despacha la cola cuando ambos scripts cargan
   ══════════════════════════════════════════════════ */
const trackingQueue = [];
let trackingReady = false;

function flushQueue() {
  while (trackingQueue.length > 0) {
    const { eventName, params } = trackingQueue.shift();
    fireEvent(eventName, params);
  }
}

function fireEvent(eventName, params) {
  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    if (META_STANDARD_EVENTS.includes(eventName)) {
      window.fbq("track", eventName, params || {});
    } else {
      window.fbq("trackCustom", eventName, params || {});
    }
  }
  // GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params || {});
  }
}

function track(eventName, params) {
  if (trackingReady && typeof window !== "undefined" && window.fbq && window.gtag) {
    fireEvent(eventName, params);
  } else {
    trackingQueue.push({ eventName, params });
  }
}

function markTrackingReady() {
  trackingReady = true;
  flushQueue();
}

/* ── SCREENS ── */
const Q = [
  { id:"P1", t:"hero", k:"age", heroImg:true, hl:"Descubrí tu plan para la menopausia", hl2:"Perdé peso y volvé a sentirte bien", tag:"Test de 2 minutos", q:"Seleccioná tu edad",
    opts:[{l:"38–45",v:"38-45"},{l:"46–50",v:"46-50"},{l:"51–58",v:"51-58"},{l:"59+",v:"59+"}] },
  { id:"P2", t:"q", k:"frustration", f:"icons", q:"¿Cuál es tu mayor frustración con tu cuerpo en esta etapa?",
    opts:[{l:"Subí de peso y nada lo baja",v:"peso",i:"⚖️"},{l:"Cansada todo el tiempo, sin energía",v:"energía",i:"😴"},{l:"No duermo bien — me despierto en la madrugada",v:"sueño",i:"🌙"},{l:"Mi humor cambió: irritable, triste o ansiosa",v:"humor",i:"😔"}] },
  { id:"P3", t:"q", k:"symptoms", f:"multi", q:"¿Cuáles de estos síntomas tenés?", sub:"Elegí todos los que apliquen",
    opts:[{l:"Sofocos o calores",v:"sofocos",i:"🔥"},{l:"Sudores nocturnos",v:"sudores",i:"💦"},{l:"Niebla mental",v:"niebla",i:"🧠"},{l:"Peso abdominal",v:"peso_abd",i:"⚖️"},{l:"Insomnio",v:"insomnio",i:"😴"},{l:"Cambios de humor",v:"humor",i:"😤"},{l:"Fatiga constante",v:"fatiga",i:"🪫"},{l:"Pérdida de deseo",v:"deseo",i:"💔"},{l:"Dolor articular",v:"dolor",i:"🦴"}] },
  { id:"C1", t:"card", title:"¿Sabías que todos estos síntomas tienen la misma causa?", img:"🧬", imgSrc:C1_IMG,
    body:"Los sofocos, el insomnio, el aumento de peso y los cambios de humor no son problemas separados. Son síntomas de UN MISMO proceso: los cambios hormonales de la menopausia.\n\nTu cuerpo no está fallando — está atravesando una transformación que afecta todo al mismo tiempo.",
    stat:"Más del 80% de las mujeres en menopausia tienen 3 o más síntomas al mismo tiempo.", cta:"Continuar" },
  { id:"P5", t:"q", k:"sleep", f:"icons", q:"¿Cómo es tu sueño la mayoría de las noches?",
    opts:[{l:"Me cuesta dormirme (más de 30 min)",v:"cuesta",i:"⏰"},{l:"Me despierto en la madrugada",v:"madrugada",i:"🌙"},{l:"Me despierto toda transpirada",v:"sudor",i:"💦"},{l:"Duermo pero me levanto cansada",v:"agotada",i:"😩"},{l:"Duermo relativamente bien",v:"bien",i:"😴"}] },
  { id:"P6", t:"q", k:"tried", f:"icons", q:"¿Qué probaste para sentirte mejor?",
    opts:[{l:"Dietas o cambios de alimentación",v:"dietas",i:"🥗"},{l:"Suplementos o remedios naturales",v:"suplementos",i:"💊"},{l:"Fui al médico",v:"medico",i:"🩺"},{l:"Probé varias cosas sin resultado",v:"varias",i:"😞"},{l:"Todavía no probé nada",v:"nada",i:"🤷‍♀️"}],
    fb:{varias:"No te preocupes — vas a entender por qué."} },
  { id:"P7", t:"q", k:"worked", f:"yn", q:"¿Sentís que lo que probaste te dio resultados duraderos?",
    opts:[{l:"Sí, me funcionó",v:"si",i:"✅"},{l:"No, nada me dio resultados de verdad",v:"no",i:"❌"}] },
  { id:"C2", t:"card", img:"🔬", imgSrc:C2_IMG, title:"No es que nada funcione.\nEs que nada estaba diseñado para vos.",
    body:"Las dietas, los suplementos y las rutinas que probaste fueron creados para un cuerpo que ya no es el tuyo. La menopausia cambia tu metabolismo, tus hormonas y cómo tu cuerpo procesa todo.\n\nPara que algo funcione, tiene que estar diseñado para lo que necesitás AHORA.",
    stat:"El 99% de las dietas populares no tienen en cuenta los cambios hormonales de la menopausia.", cta:"Ahora lo entiendo" },
  { id:"P9", t:"q", k:"stage", f:"list", q:"¿En qué etapa creés que estás?",
    opts:[{l:"Perimenopausia (ciclos irregulares)",v:"peri"},{l:"Menopausia (sin menstruación 12+ meses)",v:"meno"},{l:"Postmenopausia (años sin menstruación)",v:"post"},{l:"No estoy segura",v:"nosegura"}] },
  { id:"P10", t:"q", k:"activity", f:"icons", q:"¿Cuánta actividad física hacés?",
    opts:[{l:"Casi nada — bastante sedentaria",v:"sedentaria",i:"🛋️"},{l:"Algo liviano — caminar, cosas de casa",v:"ligero",i:"🚶‍♀️"},{l:"Moderada (2-3 veces por semana)",v:"moderada",i:"🏃‍♀️"},{l:"Bastante (4+ veces por semana)",v:"regular",i:"💪"}] },
  { id:"P11a", t:"q", k:"diet", f:"icons", q:"¿Cómo es tu alimentación?",
    opts:[{l:"Como de todo",v:"todo",i:"🍳"},{l:"Baja en carbohidratos",v:"lowcarb",i:"🥑"},{l:"Vegetariana",v:"veg",i:"🥬"},{l:"Vegana",v:"vegana",i:"🍆"},{l:"Solo pescado, no carne",v:"pesc",i:"🐟"},{l:"Como bien pero no me funciona",v:"bien_nada",i:"🤷‍♀️"}] },
  { id:"P11b", t:"q", k:"allergies", f:"multi", q:"¿Tenés alguna alergia o intolerancia alimentaria?", sub:"Elegí todos los que apliquen",
    opts:[{l:"Ninguna",v:"ninguna",i:"❌"},{l:"Lácteos",v:"lacteos",i:"🧀"},{l:"Gluten",v:"gluten",i:"🥐"},{l:"Huevo",v:"huevo",i:"🥚"},{l:"Frutos secos",v:"frutos",i:"🥜"},{l:"Pescado",v:"pescado",i:"🐟"},{l:"Mariscos",v:"mariscos",i:"🦐"},{l:"Soja",v:"soja",i:"🌱"},{l:"Otra",v:"otra",i:"🤔"}] },
  { id:"P12", t:"num", k:"height", q:"¿Cuánto medís?", ph:"162", suf:"cm", min:130, max:200, hint:"Ingresá tu altura en centímetros" },
  { id:"P13", t:"num", k:"weight", q:"¿Cuánto pesás actualmente?", ph:"72", suf:"kg", min:35, max:180, hint:"Aproximado — no necesitás ser exacta", priv:true },
  { id:"P14", t:"q", k:"wGoal", f:"icons", q:"¿Cuánto peso te gustaría perder?",
    opts:[{l:"0–5 kg",v:"05",m:2.5,i:"🎯"},{l:"5–10 kg",v:"510",m:7.5,i:"⚖️"},{l:"10–20 kg",v:"1020",m:15,i:"💪"},{l:"20+ kg",v:"20p",m:20,i:"🔥"},{l:"No me importa el número — quiero sentirme mejor",v:"noimporta",m:4,i:"💛"}] },
  { id:"C3", t:"social", img:"👩‍👩‍👧", imgSrc:C3_IMG, title:"Ya ayudamos a más de 2.400 mujeres argentinas",
    body:"Mujeres de todo el país, con los mismos síntomas, ya descubrieron cómo recuperar el control de su cuerpo.",
    tests:[{x:"A las 3 semanas ya dormía de corrido.",n:"María",a:51,c:"Buenos Aires"},{x:"Bajé 4 kg en 6 semanas sin pasar hambre.",n:"Lucía",a:49,c:"Córdoba"},{x:"Por fin entendí qué me pasaba.",n:"Carmen",a:54,c:"Mendoza"}], cta:"Continuar" },
  { id:"P16", t:"slider", k:"control", q:"¿Del 1 al 10, cuánto sentís que perdiste el control sobre tu cuerpo?", min:1, max:10, lo:"Tengo bastante control", hi2:"Perdí todo el control" },
  { id:"C4", t:"card", img:"💪", imgSrc:C4_IMG, title:'Lo que sentís NO es "normal a tu edad" — es tratable.',
    body:'Los síntomas de la menopausia no son algo que "hay que aguantar." Las mujeres que siguen un plan específico para su etapa hormonal notan mejoras importantes en las primeras 4 a 6 semanas.',
    stat:"El 87% de las mujeres que siguen un plan personalizado nota mejoras en las primeras 6 semanas.", cta:"Quiero mi plan" },
  { id:"P18", t:"q", k:"objective", f:"icons", q:"¿Si pudieras mejorar UNA cosa en 8 semanas, cuál sería?",
    opts:[{l:"Bajar de peso y sentirme bien",v:"bajar_peso",i:"⚖️"},{l:"Dormir de corrido toda la noche",v:"dormir",i:"😴"},{l:"Volver a tener energía y buen humor",v:"energia_humor",i:"⚡"},{l:"Un plan claro que me diga qué hacer",v:"plan_claro",i:"📋"}] },
  { id:"P19", t:"q", k:"time", f:"list", q:"¿Hace cuánto que te sentís así?",
    opts:[{l:"Menos de 6 meses",v:"lt6m"},{l:"6 meses a 1 año",v:"6m1a"},{l:"1 a 3 años",v:"1a3a"},{l:"Más de 3 años",v:"gt3a"}],
    fb:{"1a3a":"Llevás demasiado tiempo sintiéndote así. Eso puede cambiar.","gt3a":"Llevás demasiado tiempo sintiéndote así. Eso puede cambiar."} },
  { id:"P20", t:"q", k:"commit", f:"yn", q:"¿Estás dispuesta a seguir un plan de 8 semanas diseñado para tu etapa hormonal?",
    opts:[{l:"Sí, estoy lista para hacer algo por mí",v:"si",i:"✅"},{l:"Todavía no estoy segura",v:"no",i:"❌"}] },
  { id:"V1", t:"bmi" },
  { id:"V3", t:"wp" },
  { id:"P21", t:"email" },
  { id:"V7", t:"calc" },
  { id:"R1", t:"profile" },
  { id:"V5", t:"fw" },
  { id:"R2", t:"plan" },
];

const PROF = {
  bloqueo: { name:"Bloqueo Hormonal", col:"#C07050", desc:"Tu metabolismo está bloqueado por los cambios hormonales. Lo que antes te funcionaba ya no funciona — tu cuerpo necesita un enfoque nuevo.", tn:"Graciela M.", ta:54, tt:"Nada funcionaba y me sentía cada vez peor. Con Mūra entendí que mi cuerpo necesitaba algo diferente. En 6 semanas bajé 4 kilos y por fin duermo de corrido." },
  desconexion: { name:"Desconexión Hormonal", col:"#7C6BAF", desc:"Las fluctuaciones hormonales están afectando tu estado emocional y tu energía. No estás exagerando — es un proceso que se puede gestionar.", tn:"Silvia R.", ta:51, tt:"Me explicaron POR QUÉ me pasaba lo que me pasaba. Los sofocos bajaron muchísimo y me siento yo de nuevo." },
  fatiga: { name:"Fatiga Hormonal", col:"#3D8B8B", desc:"Tu cuerpo acumuló meses de desgaste hormonal que afectan tu sueño y tu energía. Con el plan correcto, podés recuperar tu vitalidad.", tn:"Marta L.", ta:48, tt:"El protocolo de sueño fue un antes y un después. Ahora me despierto descansada por primera vez en meses." },
};

function getBMI(h, w) { return (!h || !w) ? 27 : w / ((h/100)*(h/100)); }
function getProf(fr, ob) {
  if (ob==="bajar_peso") return "bloqueo";
  if (ob==="energia_humor") return "desconexion";
  if (ob==="dormir"||ob==="plan_claro") return "fatiga";
  if (fr==="peso") return "bloqueo";
  if (fr==="humor") return "desconexion";
  return "fatiga";
}
function getWP(w, gk) {
  if (!w) return { cur:75, tgt:70, wk:[75,74.5,74,73.2,72.5,71.8,71.2,70.5,70], loss:5 };
  var go = Q.find(function(s){return s.id==="P14"});
  var gopt = go ? go.opts.find(function(o){return o.v===gk}) : null;
  var loss = Math.min(gopt ? gopt.m : 4, 8);
  var tgt = Math.round((w - loss) * 10) / 10;
  var wk = [];
  for (var i = 0; i <= 8; i++) {
    var p = i === 0 ? 0 : loss * (1 - Math.pow(1 - i/8, 1.3));
    wk.push(Math.round((w - p) * 10) / 10);
  }
  return { cur:w, tgt:tgt, wk:wk, loss:loss };
}
function getFWL(bmi) { return bmi >= 30 ? "2-3" : bmi >= 25 ? "1-2" : "0.5-1"; }
function stageLbl(s) { return {peri:"Perimenopausia",meno:"Menopausia",post:"Postmenopausia",nosegura:"En evaluación"}[s] || "—"; }

/* ── COMPONENT ── */
export default function MuraQuiz() {
  var _s = useState(0), idx = _s[0], setIdx = _s[1];
  var _a = useState({}), ans = _a[0], setAns = _a[1];
  var _b = useState(false), busy = _b[0], setBusy = _b[1];
  var _sl = useState(5), slVal = _sl[0], setSlVal = _sl[1];
  var _en = useState(""), eName = _en[0], setEName = _en[1];
  var _ea = useState(""), eAddr = _ea[0], setEAddr = _ea[1];
  var _m = useState([]), multi = _m[0], setMulti = _m[1];
  var _fb = useState(""), fbTxt = _fb[0], setFbTxt = _fb[1];
  var _cp = useState(0), calcPh = _cp[0], setCalcPh = _cp[1];
  var _nv = useState(""), numVal = _nv[0], setNumVal = _nv[1];
  var trackingInitialized = useRef(false);

  var scr = Q[idx];
  var isQType = scr && (scr.t==="q"||scr.t==="hero"||scr.t==="slider"||scr.t==="num");
  var totalQ = Q.filter(function(s){return s.t==="q"||s.t==="hero"||s.t==="slider"||s.t==="num"}).length;
  var doneQ = Q.slice(0, idx+1).filter(function(s){return s.t==="q"||s.t==="hero"||s.t==="slider"||s.t==="num"}).length;
  var pct = Math.min((doneQ / totalQ) * 100, 100);

  var bmi = getBMI(ans.height, ans.weight);
  var profKey = getProf(ans.frustration, ans.objective);
  var prof = PROF[profKey];
  var wp = getWP(ans.weight, ans.wGoal);
  var fwl = getFWL(bmi);

  /* ══════════════════════════════════════════════════
     FIX 1: Cargar scripts de tracking y marcar ready
     Solo después se despacha la cola de eventos
     ══════════════════════════════════════════════════ */
  useEffect(function() {
    if (trackingInitialized.current) return;
    trackingInitialized.current = true;

    // Preconnect CDN
    var pc = document.createElement("link");
    pc.rel = "preconnect"; pc.href = "https://cdn.shopify.com"; pc.crossOrigin = "anonymous";
    document.head.appendChild(pc);
    var pl = document.createElement("link");
    pl.rel = "preload"; pl.as = "image"; pl.href = HERO_IMG;
    document.head.appendChild(pl);

    var metaReady = false;
    var gaReady = false;

    function checkBothReady() {
      if (metaReady && gaReady) {
        markTrackingReady();
      }
    }

    // ── Meta Pixel ──
    if (window.fbq) {
      metaReady = true;
      checkBothReady();
    } else {
      (function(f,b,e,v,n,t,s){
        if(f.fbq)return;
        n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];
        t=b.createElement(e);t.async=!0;t.src=v;
        t.onload = function() {
          metaReady = true;
          checkBothReady();
        };
        t.onerror = function() {
          console.warn("Meta Pixel failed to load");
          metaReady = true;
          checkBothReady();
        };
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
      })(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", META_PIXEL_ID);
      window.fbq("track", "PageView");
    }

    // ── GA4 ──
    if (window.gtag) {
      gaReady = true;
      checkBothReady();
    } else {
      var gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
      gaScript.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", GA4_ID);
        gaReady = true;
        checkBothReady();
      };
      gaScript.onerror = function() {
        console.warn("GA4 failed to load");
        gaReady = true;
        checkBothReady();
      };
      document.head.appendChild(gaScript);
    }

    var fallbackTimer = setTimeout(function() {
      if (!trackingReady) {
        console.warn("Tracking scripts timeout — flushing queue with available tools");
        markTrackingReady();
      }
    }, 5000);

    return function() {
      clearTimeout(fallbackTimer);
      try { document.head.removeChild(pc); } catch(e) {}
      try { document.head.removeChild(pl); } catch(e) {}
    };
  }, []);

  /* ══════════════════════════════════════════════════
     FIX 2: Tracking por pantalla — usa track() con cola
     ══════════════════════════════════════════════════
     FIX 4: Eventos custom separados para GA4
     - Quiz_ProfileView (solo quiz, no landing)
     ══════════════════════════════════════════════════ */
  useEffect(function() {
    if (!scr) return;
    track("QuizStep_" + scr.id, {
      step_id: scr.id,
      step_index: idx,
      step_type: scr.t,
    });
    if (scr.t === "profile") {
      // Evento estándar Meta (para optimización del pixel)
      track("ViewContent", {
        content_name: profKey,
        content_category: "perfil_hormonal",
        content_type: "quiz_result",
      });
      // ── FIX 4: Evento custom GA4 (diferenciable de la landing) ──
      track("Quiz_ProfileView", {
        content_name: profKey,
        content_category: "perfil_hormonal",
      });
    }
  }, [idx, scr, profKey]);

  var next = useCallback(function() {
    if (busy) return; setBusy(true); setFbTxt("");
    setTimeout(function() { setIdx(function(i){return Math.min(i+1, Q.length-1)}); setMulti([]); setNumVal(""); setBusy(false); }, 200);
  }, [busy]);

  var back = useCallback(function() {
    if (busy) return; setBusy(true); setFbTxt("");
    setTimeout(function() { setIdx(function(i){return Math.max(0, i-1)}); setMulti([]); setNumVal(""); setBusy(false); }, 200);
  }, [busy]);

  var pick = useCallback(function(key, val) {
    if (busy) return;
    setAns(function(p) { var n = Object.assign({}, p); n[key] = val; return n; });
    var s = Q[idx];
    if (s.fb && s.fb[val]) { setFbTxt(s.fb[val]); setTimeout(next, 1100); }
    else setTimeout(next, 280);
  }, [idx, next, busy]);

  var submitMulti = useCallback(function() {
    if (!multi.length) return;
    var s = Q[idx];
    var final = multi.indexOf("ninguna") >= 0 ? ["ninguna"] : multi;
    setAns(function(p) { var n = Object.assign({}, p); n[s.k] = final; return n; });
    next();
  }, [multi, idx, next]);

  var submitSlider = useCallback(function() {
    setAns(function(p) { var n = Object.assign({}, p); n.control = slVal; return n; });
    next();
  }, [slVal, next]);

  var submitEmail = useCallback(function() {
    if (!eName.trim() || eAddr.indexOf("@") < 0) return;
    setAns(function(p) { var n = Object.assign({}, p); n.name = eName; n.email = eAddr; return n; });
    track("Lead", {
      content_name: profKey,
      content_category: "quiz_completado",
    });

    // ── FIX 5: Enviar lead a Brevo via API route ──
    // Fire-and-forget: no bloqueamos el quiz si falla
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: eAddr,
          nombre: eName,
          perfil: profKey,
          edad: ans.age,
          frustracion: ans.frustration,
          sintomas: ans.symptoms,
          etapa: ans.stage,
          objetivo: ans.objective,
          peso: ans.weight,
          altura: ans.height,
          imc: bmi,
        }),
      }).catch(function(e) { console.warn("Lead API error:", e); });
    } catch(e) { console.warn("Lead API error:", e); }

    next();
  }, [eName, eAddr, next, profKey, ans, bmi]);

  var submitNum = useCallback(function() {
    var s = Q[idx]; var v = parseFloat(numVal);
    if (isNaN(v) || v < s.min || v > s.max) return;
    setAns(function(p) { var n = Object.assign({}, p); n[s.k] = v; return n; });
    next();
  }, [numVal, idx, next]);

  var toggleMulti = function(val) {
    if (val === "ninguna") { setMulti(function(p) { return p.indexOf("ninguna")>=0 ? [] : ["ninguna"]; }); }
    else { setMulti(function(p) { var c = p.filter(function(v){return v!=="ninguna"}); return c.indexOf(val)>=0 ? c.filter(function(v){return v!==val}) : c.concat([val]); }); }
  };

  useEffect(function() {
    if (!scr || scr.t !== "calc") return;
    setCalcPh(0);
    var t1 = setTimeout(function(){setCalcPh(1)}, 3000);
    var t2 = setTimeout(function(){setCalcPh(2)}, 6000);
    var t3 = setTimeout(function(){setCalcPh(3); setTimeout(next, 1000);}, 9000);
    return function() { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [idx, scr, next]);

  /* ── STYLES ── */
  var optSt = function(sel) {
    return {
      display:"flex", alignItems:"center", gap:14, padding:"15px 18px", borderRadius:16,
      background: sel ? OPT_SEL : OPT_BG, border: sel ? "2px solid "+PRI : "2px solid transparent",
      cursor:"pointer", transition:"all 0.15s", textAlign:"left", fontSize:15, color:TX, fontFamily:F1, fontWeight:500, width:"100%",
    };
  };
  var ctaSt = function(dis) {
    return {
      width:"100%", padding:"16px", borderRadius:16, border:"none", fontSize:16, fontWeight:700,
      cursor: dis ? "default" : "pointer", fontFamily:F1,
      background: dis ? OPT_BD : PRI, color:"white", transition:"all 0.2s",
      boxShadow: dis ? "none" : "0 4px 16px rgba(181,104,90,0.25)",
    };
  };

  var showBack = idx > 0 && scr && scr.t !== "calc" && scr.t !== "profile" && scr.t !== "plan";

  /* ── RENDER HELPERS ── */
  var renderOpt = function(o, sel, onClick) {
    return (
      <button key={o.v} onClick={onClick} style={optSt(sel)}>
        {o.i && <span style={{fontSize:22, flexShrink:0, width:32, textAlign:"center"}}>{o.i}</span>}
        <span style={{flex:1}}>{o.l}</span>
        {sel && <span style={{color:PRI, fontWeight:700}}>{"✓"}</span>}
      </button>
    );
  };

  /* ── SCREEN RENDERS ── */
  var renderScreen = function() {
    if (!scr) return null;

    // HERO
    if (scr.t === "hero") {
      return (
        <div>
          <div style={{background:"linear-gradient(180deg, "+PRI_LT+", "+BG+")", padding:"20px 24px 16px", textAlign:"center"}}>
            <h1 style={{fontSize:24, fontWeight:600, lineHeight:1.3, color:TX, fontFamily:F2, margin:"0 0 4px"}}>{scr.hl}</h1>
            <p style={{fontSize:18, fontWeight:600, color:PRI, fontFamily:F2, margin:"0 0 6px"}}>{scr.hl2}</p>
            <p style={{fontSize:13, color:TXM, fontFamily:F1, margin:"0 0 16px"}}>{scr.tag}</p>
            <div style={{width:"100%", maxWidth:300, borderRadius:16, overflow:"hidden", margin:"0 auto"}}>
              <img src={HERO_IMG} alt="" fetchPriority="high" decoding="async" style={{width:"100%", display:"block", borderRadius:16, background:PRI_LT}} />
            </div>
          </div>
          <div style={{padding:"16px 20px 32px"}}>
            <p style={{fontSize:17, fontWeight:700, color:TX, fontFamily:F1, marginBottom:14}}>{scr.q}</p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
              {scr.opts.map(function(o) {
                return (
                  <button key={o.v} onClick={function(){pick(scr.k, o.v)}} style={{
                    padding:"20px 12px", borderRadius:16, border:"2px solid transparent",
                    background:OPT_BG, cursor:"pointer", fontSize:18, fontWeight:700, color:TX, fontFamily:F1, transition:"all 0.15s",
                  }}>{o.l}</button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // QUESTION
    if (scr.t === "q") {
      return (
        <div style={{padding:"24px 20px 32px"}}>
          <h2 style={{fontSize:20, fontWeight:700, lineHeight:1.4, color:TX, fontFamily:F1, marginBottom: scr.sub ? 6 : 18}}>{scr.q}</h2>
          {scr.sub && <p style={{fontSize:13, color:TXM, marginBottom:16, fontFamily:F1}}>{scr.sub}</p>}
          {scr.priv && <p style={{fontSize:12, color:TXM, marginBottom:12, fontFamily:F1}}>{"🔒 Tus datos son 100% privados."}</p>}

          {scr.f === "multi" ? (
            <div>
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {scr.opts.map(function(o) { return renderOpt(o, multi.indexOf(o.v)>=0, function(){toggleMulti(o.v)}); })}
              </div>
              {multi.length > 0 && (
                <div style={{marginTop:18}}>
                  <button onClick={submitMulti} style={ctaSt(false)}>Continuar</button>
                </div>
              )}
            </div>
          ) : scr.f === "yn" ? (
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              {scr.opts.map(function(o) {
                return (
                  <button key={o.v} onClick={function(){pick(scr.k, o.v)}} style={{
                    display:"flex", alignItems:"center", gap:14, justifyContent:"center", padding:"15px 18px", borderRadius:16,
                    background:OPT_BG, border:"2px solid transparent", cursor:"pointer", fontSize:16, fontWeight:600, color:TX, fontFamily:F1, width:"100%",
                  }}>
                    {o.i && <span style={{fontSize:20}}>{o.i}</span>}
                    <span>{o.l}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {scr.opts.map(function(o) { return renderOpt(o, false, function(){pick(scr.k, o.v)}); })}
            </div>
          )}

          {fbTxt && <p style={{marginTop:14, padding:"12px 16px", background:PRI_LT, borderRadius:12, fontSize:14, color:PRI, fontFamily:F1, fontStyle:"italic"}}>{fbTxt}</p>}
        </div>
      );
    }

    // NUMBER INPUT
    if (scr.t === "num") {
      var valid = numVal && !isNaN(parseFloat(numVal)) && parseFloat(numVal) >= scr.min && parseFloat(numVal) <= scr.max;
      return (
        <div style={{padding:"24px 20px 32px"}}>
          <h2 style={{fontSize:20, fontWeight:700, color:TX, fontFamily:F1, marginBottom:8}}>{scr.q}</h2>
          {scr.priv && <p style={{fontSize:12, color:TXM, marginBottom:8, fontFamily:F1}}>{"🔒 Tus datos son 100% privados."}</p>}
          <p style={{fontSize:13, color:TXM, marginBottom:20, fontFamily:F1}}>{scr.hint}</p>
          <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:24}}>
            <input type="number" inputMode="decimal" placeholder={scr.ph} value={numVal}
              onChange={function(e){setNumVal(e.target.value)}}
              onKeyDown={function(e){if(e.key==="Enter"&&valid)submitNum()}}
              style={{
                flex:1, padding:"18px 20px", borderRadius:16,
                border:"2px solid "+(numVal ? PRI : OPT_BD),
                fontSize:24, fontWeight:700, color:TX, fontFamily:F1,
                outline:"none", background:CARD, textAlign:"center",
              }}
            />
            <span style={{fontSize:20, fontWeight:700, color:TX2, fontFamily:F1}}>{scr.suf}</span>
          </div>
          <button onClick={submitNum} disabled={!valid} style={ctaSt(!valid)}>Continuar</button>
        </div>
      );
    }

    // CARD
    if (scr.t === "card") {
      return (
        <div style={{padding:"28px 22px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", justifyContent:"center", minHeight:"65vh"}}>
          {scr.imgSrc ? (
            <div style={{width:"100%", maxWidth:320, borderRadius:20, overflow:"hidden", marginBottom:20}}>
              <img src={scr.imgSrc} alt="" loading="lazy" decoding="async" style={{width:"100%", display:"block", borderRadius:20, background:PRI_LT}} />
            </div>
          ) : scr.img ? (
            <div style={{width:"100%", maxWidth:320, height:160, borderRadius:20, background:"linear-gradient(135deg, "+PRI_LT+", #F9F2EE)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", marginBottom:20, border:"1px dashed "+OPT_BD}}>
              <span style={{fontSize:48, marginBottom:4}}>{scr.img}</span>
              <span style={{fontSize:10, color:TXM, fontFamily:F1}}>Imagen placeholder</span>
            </div>
          ) : null}
          <h2 style={{fontSize:24, fontWeight:600, lineHeight:1.35, color:TX, fontFamily:F2, marginBottom:20, maxWidth:340, whiteSpace:"pre-line"}}>{scr.title}</h2>
          <p style={{fontSize:15, lineHeight:1.75, color:TX2, fontFamily:F1, marginBottom:24, maxWidth:360, whiteSpace:"pre-line"}}>{scr.body}</p>
          {scr.stat && (
            <div style={{padding:"14px 20px", background:PRI_LT, borderRadius:14, marginBottom:32, maxWidth:340}}>
              <p style={{fontSize:13, color:PRI, fontFamily:F1, fontWeight:600, margin:0, lineHeight:1.5}}>{"📊 "+scr.stat}</p>
            </div>
          )}
          <button onClick={next} style={Object.assign({}, ctaSt(false), {maxWidth:300})}>{scr.cta}</button>
        </div>
      );
    }

    // SOCIAL PROOF
    if (scr.t === "social") {
      return (
        <div style={{padding:"28px 20px", textAlign:"center"}}>
          {scr.imgSrc ? (
            <div style={{width:"100%", borderRadius:20, overflow:"hidden", marginBottom:18}}>
              <img src={scr.imgSrc} alt="" loading="lazy" decoding="async" style={{width:"100%", display:"block", borderRadius:20, background:PRI_LT}} />
            </div>
          ) : scr.img ? (
            <div style={{width:"100%", height:140, borderRadius:20, background:"linear-gradient(135deg, "+PRI_LT+", #F9F2EE)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", marginBottom:18, border:"1px dashed "+OPT_BD}}>
              <span style={{fontSize:48, marginBottom:4}}>{scr.img}</span>
              <span style={{fontSize:10, color:TXM, fontFamily:F1}}>Imagen placeholder</span>
            </div>
          ) : null}
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:8}}>{scr.title}</h2>
          <p style={{fontSize:14, color:TX2, fontFamily:F1, marginBottom:18, lineHeight:1.6}}>{scr.body}</p>
          <div style={{display:"flex", justifyContent:"center", gap:2, marginBottom:4}}>
            {[1,2,3,4,5].map(function(i){return <span key={i} style={{fontSize:20, color:"#F5A623"}}>{"★"}</span>})}
          </div>
          <p style={{fontSize:13, color:TXM, marginBottom:22, fontFamily:F1}}>Calificación: 4.8/5</p>
          <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:26}}>
            {scr.tests.map(function(t, i) {
              return (
                <div key={i} style={{padding:"14px 16px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, textAlign:"left"}}>
                  <p style={{fontSize:14, color:TX, fontFamily:F1, margin:"0 0 6px", fontStyle:"italic", lineHeight:1.5}}>{'"'+t.x+'"'}</p>
                  <p style={{fontSize:12, color:TXM, fontFamily:F1, margin:0, fontWeight:700}}>{"— "+t.n+", "+t.a+", "+t.c}</p>
                </div>
              );
            })}
          </div>
          <button onClick={next} style={ctaSt(false)}>{scr.cta}</button>
        </div>
      );
    }

    // SLIDER
    if (scr.t === "slider") {
      var col = slVal <= 3 ? GRN : slVal <= 6 ? YEL : RED;
      return (
        <div style={{padding:"32px 20px"}}>
          <h2 style={{fontSize:20, fontWeight:700, color:TX, fontFamily:F1, textAlign:"center", marginBottom:36}}>{scr.q}</h2>
          <div style={{textAlign:"center", marginBottom:20}}>
            <span style={{fontSize:64, fontWeight:800, fontFamily:F1, lineHeight:1, color:col, transition:"color 0.2s"}}>{slVal}</span>
          </div>
          <div style={{padding:"0 8px", marginBottom:10}}>
            <input type="range" min={scr.min} max={scr.max} value={slVal}
              onChange={function(e){setSlVal(parseInt(e.target.value))}}
              style={{width:"100%", height:6, appearance:"none", borderRadius:99, outline:"none", cursor:"pointer",
                background:"linear-gradient(90deg, "+GRN+" 0%, "+YEL+" 50%, "+RED+" 100%)"}} />
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:36, padding:"0 4px"}}>
            <span style={{fontSize:12, color:TXM, fontFamily:F1, maxWidth:"40%"}}>{scr.lo}</span>
            <span style={{fontSize:12, color:TXM, fontFamily:F1, maxWidth:"40%", textAlign:"right"}}>{scr.hi2}</span>
          </div>
          <button onClick={submitSlider} style={ctaSt(false)}>Continuar</button>
        </div>
      );
    }

    // BMI
    if (scr.t === "bmi") {
      var pos = Math.max(5, Math.min(95, ((bmi-18)/(38-18))*100));
      var dotCol = bmi < 25 ? GRN : bmi < 30 ? YEL : RED;
      var msg = bmi < 25 ? "Tu peso está en rango saludable. Un plan preventivo te ayuda a mantenerlo." :
        bmi < 30 ? "Tu IMC está ligeramente por encima de lo ideal. Es el momento perfecto para actuar." :
        "Tu IMC indica que tus hormonas ya afectan tu metabolismo. Cuanto antes actúes, mejor.";
      return (
        <div style={{padding:"36px 20px", textAlign:"center"}}>
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:6}}>Tu índice de masa corporal</h2>
          <p style={{fontSize:13, color:TXM, fontFamily:F1, marginBottom:36}}>Basado en tus respuestas</p>
          <div style={{position:"relative", height:70, margin:"0 16px 8px"}}>
            <div style={{height:14, borderRadius:99, background:"linear-gradient(90deg, "+GRN+" 0%, "+GRN+" 35%, "+YEL+" 35%, "+YEL+" 60%, "+RED+" 60%)", position:"relative", top:28}}>
              <div style={{position:"absolute", left:pos+"%", top:-24, transform:"translateX(-50%)"}}>
                <div style={{width:48, height:48, borderRadius:"50%", background:CARD, border:"3px solid "+dotCol, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:dotCol, fontFamily:F1}}>
                  {bmi.toFixed(1)}
                </div>
              </div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:32, fontSize:11, color:TXM, fontFamily:F1}}>
              <span>Saludable</span><span>Normal</span><span>En riesgo</span>
            </div>
          </div>
          <div style={{padding:"14px 18px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, marginTop:20, marginBottom:28}}>
            <p style={{fontSize:14, color:TX2, fontFamily:F1, margin:0, lineHeight:1.6}}>{msg}</p>
          </div>
          <button onClick={next} style={ctaSt(false)}>Continuar</button>
        </div>
      );
    }

    // WEIGHT PROJECTION
    if (scr.t === "wp") {
      var cur = wp.cur, tgt = wp.tgt, wk = wp.wk;
      var mx = cur+2, mn = tgt-2, rng = mx-mn;
      var pts = wk.map(function(w,i){return {x:(i/8)*280+30, y:20+((mx-w)/rng)*160}});
      var pathD = pts.map(function(p,i){
        if(i===0) return "M "+p.x+" "+p.y;
        var pv = pts[i-1]; var cx = (pv.x+p.x)/2;
        return "C "+cx+" "+pv.y+" "+cx+" "+p.y+" "+p.x+" "+p.y;
      }).join(" ");
      return (
        <div style={{padding:"36px 20px", textAlign:"center"}}>
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:6}}>Tu mejora potencial en 8 semanas</h2>
          <p style={{fontSize:14, color:TXM, fontFamily:F1, marginBottom:24}}>
            {"Podrías alcanzar "}<strong style={{color:GRN}}>{tgt+" kg"}</strong>
          </p>
          <svg viewBox="0 0 340 220" style={{width:"100%", maxWidth:380}}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={RED}/><stop offset="50%" stopColor={YEL}/><stop offset="100%" stopColor={GRN}/></linearGradient>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={GRN} stopOpacity="0.12"/><stop offset="100%" stopColor={GRN} stopOpacity="0"/></linearGradient>
            </defs>
            {[0,1,2,3,4].map(function(i){
              var y = 20+(i/4)*160; var label = Math.round(mx-(i/4)*rng);
              return <g key={i}><line x1="30" y1={y} x2="310" y2={y} stroke={OPT_BD} strokeWidth="0.5"/><text x="22" y={y+4} textAnchor="end" fill={TXM} fontSize="9">{label}</text></g>;
            })}
            {[0,2,4,6,8].map(function(i){return <text key={i} x={(i/8)*280+30} y="200" textAnchor="middle" fill={TXM} fontSize="9">{"S"+i}</text>})}
            <path d={pathD+" L "+pts[8].x+" 190 L "+pts[0].x+" 190 Z"} fill="url(#ag)"/>
            <path d={pathD} fill="none" stroke="url(#cg)" strokeWidth="3" strokeLinecap="round"/>
            <circle cx={pts[0].x} cy={pts[0].y} r="5" fill={RED}/>
            <text x={pts[0].x} y={pts[0].y-12} textAnchor="middle" fill={RED} fontSize="11" fontWeight="700">{cur+" kg"}</text>
            <circle cx={pts[8].x} cy={pts[8].y} r="5" fill={GRN}/>
            <text x={pts[8].x} y={pts[8].y-12} textAnchor="middle" fill={GRN} fontSize="11" fontWeight="700">{tgt+" kg"}</text>
          </svg>
          <p style={{fontSize:12, color:TXM, fontFamily:F1, marginTop:4, marginBottom:28}}>Proyección basada en tu perfil. Resultados pueden variar.</p>
          <button onClick={next} style={ctaSt(false)}>Continuar</button>
        </div>
      );
    }

    // EMAIL CAPTURE
    if (scr.t === "email") {
      var emailValid = eName.trim() && eAddr.indexOf("@") >= 0;
      return (
        <div style={{padding:"40px 20px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh"}}>
          <div style={{fontSize:44, marginBottom:12}}>{"🎉"}</div>
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:10}}>Tu plan está casi listo</h2>
          <p style={{fontSize:15, color:TX2, fontFamily:F1, marginBottom:28, lineHeight:1.6, maxWidth:340}}>
            {"Ingresá tu nombre y mail para descubrir "}<strong>tu perfil hormonal completo</strong>{" y "}<strong>el primer paso para tu caso</strong>.
          </p>
          <div style={{width:"100%", maxWidth:340, display:"flex", flexDirection:"column", gap:10, marginBottom:20}}>
            <input type="text" placeholder="Tu nombre" value={eName} onChange={function(e){setEName(e.target.value)}}
              style={{padding:"16px 18px", border:"2px solid "+OPT_BD, borderRadius:14, fontSize:16, fontFamily:F1, outline:"none", background:CARD}} />
            <input type="email" placeholder="Tu mail" value={eAddr} onChange={function(e){setEAddr(e.target.value)}}
              onKeyDown={function(e){if(e.key==="Enter"&&emailValid)submitEmail()}}
              style={{padding:"16px 18px", border:"2px solid "+OPT_BD, borderRadius:14, fontSize:16, fontFamily:F1, outline:"none", background:CARD}} />
          </div>
          <button onClick={submitEmail} disabled={!emailValid} style={Object.assign({}, ctaSt(!emailValid), {maxWidth:340})}>Ver mis resultados</button>
          <p style={{fontSize:11, color:TXM, marginTop:14, fontFamily:F1}}>{"🔒 100% privado. No compartimos tus datos."}</p>
          <p style={{fontSize:11, color:PRI, marginTop:6, fontFamily:F1, fontWeight:700}}>{"✓ +2.400 argentinas ya recibieron su plan"}</p>
        </div>
      );
    }

    // CALCULATING
    if (scr.t === "calc") {
      var phases = [
        {x:"Analizando tus síntomas y etapa hormonal...", p:35},
        {x:"Calculando tu perfil hormonal y tu IMC...", p:70},
        {x:"Generando tu plan personalizado...", p:92},
        {x:"¡Tu plan está listo!!", p:100},
      ];
      var ph = phases[calcPh] || phases[0];
      var done = calcPh >= 3;
      return (
        <div style={{padding:"60px 20px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh"}}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            border:"3px solid "+(done ? GRN : OPT_BD),
            borderTopColor: done ? GRN : PRI,
            animation: done ? "none" : "spin 0.9s linear infinite",
            display:"flex", alignItems:"center", justifyContent:"center",
            marginBottom:28, background: done ? GRN_LT : "transparent", transition:"all 0.4s",
          }}>
            {done && <span style={{fontSize:32, color:GRN}}>{"✓"}</span>}
          </div>
          <p style={{fontSize:16, color:TX, fontFamily:F1, fontWeight:600, marginBottom:8}}>{ph.x}</p>
          {calcPh >= 1 && calcPh < 3 && <p style={{fontSize:14, color:prof.col, fontFamily:F1, fontWeight:700, marginBottom:20}}>{"Tu perfil: "+prof.name}</p>}
          <div style={{width:"100%", maxWidth:280, height:6, background:OPT_BD, borderRadius:99, overflow:"hidden", marginTop:12}}>
            <div style={{height:"100%", width:ph.p+"%", background: done ? GRN : PRI, borderRadius:99, transition:"width 2.5s ease"}}/>
          </div>
        </div>
      );
    }

    // PROFILE RESULTS
    if (scr.t === "profile") {
      return (
        <div style={{padding:"36px 20px", textAlign:"center"}}>
          <p style={{fontSize:12, color:TXM, fontFamily:F1, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10}}>Tu resultado</p>
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:8}}>Tu perfil hormonal:</h2>
          <div style={{display:"inline-block", padding:"8px 24px", background:PRI_LT, borderRadius:99, border:"2px solid "+OPT_BD, marginBottom:20}}>
            <span style={{fontSize:20, fontWeight:800, color:prof.col, fontFamily:F1}}>{prof.name}</span>
          </div>
          <p style={{fontSize:15, color:TX2, fontFamily:F1, lineHeight:1.7, marginBottom:24, maxWidth:360, marginLeft:"auto", marginRight:"auto"}}>{prof.desc}</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14}}>
            <div style={{padding:"14px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
              <div style={{width:40, height:40, borderRadius:10, background:PRI_LT, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <p style={{fontSize:12, color:TXM, fontFamily:F1, margin:"4px 0 2px"}}>Edad</p>
              <p style={{fontSize:16, fontWeight:700, color:TX, fontFamily:F1, margin:0}}>{ans.age || "—"}</p>
            </div>
            <div style={{padding:"14px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
              <div style={{width:40, height:40, borderRadius:10, background:PRI_LT, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.5-3.5 10-7.5 10-12A10 10 0 0 0 2 10c0 4.5 4.5 8.5 10 12z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <p style={{fontSize:12, color:TXM, fontFamily:F1, margin:"4px 0 2px"}}>Etapa</p>
              <p style={{fontSize:16, fontWeight:700, color:TX, fontFamily:F1, margin:0}}>{stageLbl(ans.stage)}</p>
            </div>
            <div style={{padding:"14px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
              <div style={{width:40, height:40, borderRadius:10, background: bmi<25?GRN_LT:bmi<30?"#FDF5E6":"#FDE8E8", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={bmi<25?GRN:bmi<30?YEL:RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6"/><path d="M8 6h10v10"/></svg>
              </div>
              <p style={{fontSize:12, color:TXM, fontFamily:F1, margin:"4px 0 2px"}}>IMC</p>
              <p style={{fontSize:16, fontWeight:700, color: bmi<25?GRN:bmi<30?YEL:RED, fontFamily:F1, margin:0}}>{bmi.toFixed(1)}</p>
            </div>
            <div style={{padding:"14px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
              <div style={{width:40, height:40, borderRadius:10, background:PRI_LT, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6"/><path d="M12 9v6"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <p style={{fontSize:12, color:TXM, fontFamily:F1, margin:"4px 0 2px"}}>Síntomas</p>
              <p style={{fontSize:16, fontWeight:700, color:TX, fontFamily:F1, margin:0}}>{(ans.symptoms ? ans.symptoms.length : 0)}</p>
            </div>
          </div>
          <div style={{padding:"10px 14px", background:PRI_LT, borderRadius:12, marginBottom:28}}>
            <p style={{fontSize:13, color:PRI, fontFamily:F1, fontWeight:600, margin:0}}>
              El 87% de las mujeres con un perfil similar nota mejoras en las primeras 6 semanas.
            </p>
          </div>
          <button onClick={next} style={ctaSt(false)}>Ver mi plan</button>
        </div>
      );
    }

    // FIRST WEEK
    if (scr.t === "fw") {
      return (
        <div style={{padding:"36px 20px", textAlign:"center"}}>
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:8}}>Resultados estimados en 7 días</h2>
          <p style={{fontSize:14, color:TXM, fontFamily:F1, marginBottom:28}}>Si seguís el plan, podrías perder:</p>
          <div style={{position:"relative", display:"inline-block", marginBottom:24}}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="65" fill="none" stroke={OPT_BD} strokeWidth="8"/>
              <circle cx="75" cy="75" r="65" fill="none" stroke={GRN} strokeWidth="8"
                strokeDasharray="408" strokeDashoffset={bmi>=30?"80":bmi>=25?"160":"280"}
                strokeLinecap="round" transform="rotate(-90 75 75)" style={{transition:"stroke-dashoffset 1s ease"}}/>
            </svg>
            <div style={{position:"absolute", top:0, left:0, right:0, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <span style={{fontSize:36, fontWeight:800, color:GRN, fontFamily:F1, lineHeight:1}}>{"-"+fwl}</span>
              <span style={{fontSize:14, fontWeight:600, color:GRN, fontFamily:F1}}>kg</span>
            </div>
          </div>
          <div style={{display:"flex", gap:10, marginBottom:24, textAlign:"left"}}>
            <div style={{flex:1, padding:"12px 14px", background:GRN_LT, borderRadius:12, textAlign:"center"}}>
              <span style={{fontSize:20}}>{"😴"}</span>
              <p style={{fontSize:12, color:"#2D5A3E", fontFamily:F1, fontWeight:600, margin:"4px 0 0"}}>Mejor sueño</p>
            </div>
            <div style={{flex:1, padding:"12px 14px", background:GRN_LT, borderRadius:12, textAlign:"center"}}>
              <span style={{fontSize:20}}>{"🫧"}</span>
              <p style={{fontSize:12, color:"#2D5A3E", fontFamily:F1, fontWeight:600, margin:"4px 0 0"}}>Menos hinchazón</p>
            </div>
            <div style={{flex:1, padding:"12px 14px", background:GRN_LT, borderRadius:12, textAlign:"center"}}>
              <span style={{fontSize:20}}>{"⚡"}</span>
              <p style={{fontSize:12, color:"#2D5A3E", fontFamily:F1, fontWeight:600, margin:"4px 0 0"}}>Más energía</p>
            </div>
          </div>
          <p style={{fontSize:13, color:TX2, fontFamily:F1, lineHeight:1.6, marginBottom:28, maxWidth:340, marginLeft:"auto", marginRight:"auto"}}>
            Bajada de peso visible entre la semana 2 y 3.
          </p>
          <button onClick={next} style={ctaSt(false)}>Continuar</button>
        </div>
      );
    }

    // FINAL PLAN
    if (scr.t === "plan") {
      var items = [
        {i:"⚖️", x:"Perder entre "+Math.max(1,wp.loss-2)+" y "+wp.loss+" kg"},
        {i:"😴", x:"Mejorar tu sueño desde la semana 2"},
        {i:"⚡", x:"Más energía y estabilidad desde la semana 3"},
      ];
      var featureIcons = [
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4m8-4v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>},
        function(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>},
      ];
      var features = [
        {x:"Plan de alimentación adaptado a tu IMC y etapa hormonal"},
        {x:"Rutina de movimiento de 15-20 min para tu nivel — sin gimnasio"},
        {x:"Guía de manejo de tus "+(ans.symptoms?ans.symptoms.length:0)+" síntomas"},
        {x:"Recetario hormonal: +30 recetas organizadas por síntoma"},
        {x:"Guía de suplementos según tu perfil: qué sirve, qué no, dosis"},
        {x:"Protocolo de sueño para menopausia"},
        {x:"Tracker de síntomas semanal imprimible"},
        {x:"Emails de acompañamiento durante tu plan"},
      ];
      return (
        <div style={{padding:"32px 20px 40px", textAlign:"center"}}>
          <h2 style={{fontSize:24, fontWeight:600, color:TX, fontFamily:F2, marginBottom:8}}>Tu plan personalizado está listo</h2>
          <p style={{fontSize:15, color:TX2, fontFamily:F1, marginBottom:24, lineHeight:1.6}}>Según tu perfil, con Mūra podrías:</p>
          <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:24, textAlign:"left"}}>
            {items.map(function(item, i) {
              return (
                <div key={i} style={{display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:GRN_LT, borderRadius:12}}>
                  <span style={{fontSize:20}}>{item.i}</span>
                  <span style={{fontSize:14, color:"#2D5A3E", fontFamily:F1, fontWeight:600}}>{item.x}</span>
                </div>
              );
            })}
          </div>
          <p style={{fontSize:15, fontWeight:700, color:TX, fontFamily:F1, margin:"0 0 12px", textAlign:"left"}}>Tu plan incluye:</p>
          <div style={{display:"flex", flexDirection:"column", gap:8, marginBottom:16, textAlign:"left"}}>
            {features.map(function(f, i) {
              return (
                <div key={i} style={{display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14}}>
                  <div style={{width:36, height:36, borderRadius:10, background:PRI_LT, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                    {featureIcons[i]()}
                  </div>
                  <span style={{fontSize:13, color:TX, fontFamily:F1, fontWeight:600}}>{f.x}</span>
                </div>
              );
            })}
          </div>
          <div style={{padding:"12px 16px", background:CARD, border:"1px solid "+OPT_BD, borderRadius:14, marginBottom:24}}>
            <p style={{fontSize:14, fontStyle:"italic", color:TX2, fontFamily:F1, margin:"0 0 6px", lineHeight:1.5}}>{'"'+prof.tt+'"'}</p>
            <p style={{fontSize:12, color:TXM, fontFamily:F1, margin:0, fontWeight:700}}>{"— "+prof.tn+", "+prof.ta}</p>
          </div>
          <button onClick={function(){
            /* ══════════════════════════════════════════════════
               FIX 4: Eventos separados quiz vs landing
               - InitiateCheckout → estándar Meta (pixel optimization)
               - Quiz_GoToLanding → custom GA4 (solo quiz)
               ══════════════════════════════════════════════════ */
            // Evento estándar Meta
            track("InitiateCheckout", {
              content_name: profKey,
              content_category: "quiz_to_checkout",
              num_items: 1,
            });
            // ── FIX 4: Evento custom GA4 (diferenciable de la landing) ──
            track("Quiz_GoToLanding", {
              content_name: profKey,
              content_category: "quiz_to_landing",
            });

            var params = [];
            if (ans.name) params.push("nombre="+encodeURIComponent(ans.name));
            var profileSlug = profKey === "bloqueo" ? "bloqueo-hormonal" : profKey === "desconexion" ? "desconexion-hormonal" : "fatiga-hormonal";
            params.push("perfil="+profileSlug);
            if (ans.email) params.push("email="+encodeURIComponent(ans.email));
            if (ans.weight) params.push("peso_actual="+ans.weight);
            if (ans.wGoal) { var goals={"5-10":"7","10-15":"12","15-20":"17","20+":"22","no-se":"8"}; params.push("peso_objetivo="+(ans.weight - (goals[ans.wGoal]||8))); }
            window.location.href = "/plan?" + params.join("&");
          }} style={Object.assign({}, ctaSt(false), {fontSize:17, padding:"18px"})}>
            Quiero mi plan personalizado
          </button>
          <p style={{fontSize:11, color:TXM, marginTop:10, fontFamily:F1}}>{"🔒 Pago seguro · Garantía de 7 días"}</p>
        </div>
      );
    }

    return null;
  };

  /* ── MAIN RENDER ── */
  return (
    <div style={{maxWidth:440, margin:"0 auto", minHeight:"100vh", background:BG, fontFamily:F1, display:"flex", flexDirection:"column"}}>
      <style>{[
        "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700;800&display=swap');",
        "@keyframes spin { to { transform: rotate(360deg); } }",
        "input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%; background: white; border: 3px solid #B5685A; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }",
        "input[type='range']::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: white; border: 3px solid #B5685A; cursor: pointer; }",
        "input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }",
        "input[type='number'] { -moz-appearance: textfield; }",
        "* { box-sizing: border-box; margin: 0; }",
        "body { margin: 0; background: #EDE8E3; }",
      ].join("\n")}</style>

      {/* ══ FIX 3: Logo SVG en lugar de base64 roto ══ */}
      <div style={{display:"flex", alignItems:"center", padding:"14px 16px 0", gap:12}}>
        {showBack ? (
          <button onClick={back} style={{width:40, height:40, borderRadius:12, border:"1.5px solid "+OPT_BD, background:CARD, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:TX2, flexShrink:0}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        ) : <div style={{width:40}}/>}
        <div style={{display:"flex", alignItems:"center", flex:1, justifyContent:"center", marginRight:40}}>
          <img src="https://cdn.shopify.com/s/files/1/0794/3766/0390/files/mura-high-resolution-logo-transparent.png?v=1771997092" alt="Mūra" style={{height:26, objectFit:"contain"}} />
        </div>
      </div>

      {/* PROGRESS */}
      {isQType && (
        <div style={{padding:"10px 20px 0"}}>
          <div style={{height:3, background:OPT_BD, borderRadius:99, overflow:"hidden"}}>
            <div style={{height:"100%", width:pct+"%", background:PRI, borderRadius:99, transition:"width 0.5s ease"}}/>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{flex:1, overflowY:"auto"}} key={idx}>
        {renderScreen()}
      </div>
    </div>
  );
}
