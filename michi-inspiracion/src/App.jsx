import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

const POOL = ["Caos","Ritual","Ruido","Deseo","Mapa","Error","Brillo","Secreto","Fuga","Juego","Pulso","Eco","Corte","Sombra","Vuelo","Truco","Llama","Nube","Grieta","Salto"];
const PROMPTS = ["¿Qué haría Adefesio si tuviera presupuesto infinito?","Rompe la idea obvia. ¿Qué queda?","¿Cómo se vería esto si fuera más raro?","¿Qué detalle haría que alguien sonría?","¿Dónde está la parte más viva de esta idea?","¿Qué cosa absurda podría volverla útil?","¿Qué eliminarías para que respire?","¿Cómo lo explicarías en una imagen?","¿Y si el usuario tuviera solo 30 segundos?","¿Qué parte merece ser más absurda?"];
const VIBES = ["Vuelo","Salto","Mirada","Eco","Pulso"];
const MSG = {
  idle:       ["Adefesio no trabaja gratis.","Adefesio evalúa si mereces jugar.","..."],
  curious:    ["Toca una chispa. Adefesio decide si la caza.","Hay chispas rondando.","Adefesio vio algo. O creyó verlo."],
  hunting:    ["Adefesio vio algo. Corre.","¡Va!","Adefesio en modo caza.","Ojo al gato."],
  distracted: ["Adefesio se distrajo con algo invisible.","Un momento. Adefesio vio un fantasma.","Adefesio decidió ignorarte."],
  happy:      ["Cazada limpia.","Adefesio aprueba.","Captura confirmada.","Exacto. Eso era."],
  combo:      ["Combo creativo.","Adefesio está caliente.","Racha activa. No la arruines.","¿Cuántas más?"],
  offended:   ["Eso era polvo. No inspiración.","Adefesio está decepcionado.","Error de cálculo. El tuyo.","Silencio incómodo."],
  eureka:     ["Chispa Eureka. Escribe antes de que Adefesio se aburra.","Esto es diferente. Escríbelo.","Adefesio exige una idea ahora."],
  end:        ["Adefesio terminó. Exige otra ronda.","30 segundos de caos creativo.","Ronda cerrada."],
};
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function AdefesioSVG({ mood }) {
  return (
    <svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" className={`adef mood-${mood}`} style={{ overflow: "visible", width: "100%", height: "100%" }}>
      <path className="a-tail" d="M178 190 C240 184 236 235 186 224" />
      <ellipse className="a-body" cx="132" cy="161" rx="58" ry="75" />
      <path className="a-chest" d="M105 124 C115 170 112 205 132 224 C151 201 152 164 160 124" />
      <path className="a-ear" d="M78 83 L38 13 C98 24 104 73 99 98 Z" />
      <path className="a-ear" d="M162 83 L218 18 C221 82 188 105 164 101 Z" />
      <path className="a-iear" d="M75 72 L50 30 C88 42 92 72 91 85 Z" />
      <path className="a-iear" d="M171 75 L207 34 C206 75 185 88 171 88 Z" />
      <ellipse className="a-head" cx="128" cy="94" rx="61" ry="55" />
      <path className="a-muzzle" d="M100 116 C112 101 144 101 156 116 C147 136 111 136 100 116 Z" />
      <ellipse className="a-eye" cx="102" cy="91" rx="16" ry="22" />
      <ellipse className="a-eye" cx="154" cy="91" rx="16" ry="22" />
      <circle className="a-pupil" cx="104" cy="92" r="7" />
      <circle className="a-pupil" cx="156" cy="92" r="7" />
      <circle className="a-shine" cx="98" cy="82" r="4" />
      <circle className="a-shine" cx="150" cy="82" r="4" />
      <path className="a-nose" d="M123 113 Q128 119 134 113 Q129 127 123 113 Z" />
      <path className="a-mouth" d="M128 122 C121 132 111 128 106 122 M128 122 C135 132 146 128 151 122" />
      <path className="a-stripe" d="M112 45 L119 75" />
      <path className="a-stripe" d="M130 39 L130 74" />
      <path className="a-stripe" d="M149 45 L139 76" />
      <path className="a-stripe" d="M78 96 C55 88 47 77 41 63" />
      <path className="a-stripe" d="M180 96 C205 87 213 75 218 61" />
      <path className="a-stripe" d="M88 144 C65 155 66 179 88 186" />
      <path className="a-stripe" d="M176 140 C199 154 198 181 176 188" />
      <path className="a-whisker" d="M86 118 C43 105 25 103 7 108" />
      <path className="a-whisker" d="M88 128 C44 130 25 140 8 154" />
      <path className="a-whisker" d="M170 118 C213 105 232 104 252 109" />
      <path className="a-whisker" d="M168 128 C211 130 232 140 252 154" />
      <ellipse className="a-paw" cx="105" cy="229" rx="23" ry="15" />
      <ellipse className="a-paw" cx="154" cy="229" rx="23" ry="15" />
    </svg>
  );
}

function mkSpark(eureka = false) {
  const a = Math.random() * Math.PI * 2;
  const spd = 0.006 + Math.random() * 0.01;
  return { id: crypto.randomUUID(), word: pick(POOL), x: 12 + Math.random() * 76, y: 20 + Math.random() * 60, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, ttl: 3500 + Math.random() * 2000, born: Date.now(), eureka };
}

export default function App() {
  const [game, setGame]       = useState("intro");
  const [time, setTime]       = useState(30);
  const [score, setScore]     = useState(0);
  const [combo, setCombo]     = useState(0);
  const [animo, setAnimo]     = useState(70);
  const [mood, setMood]       = useState("idle");
  const [msg, setMsg]         = useState(pick(MSG.idle));
  const [catPos, setCatPos]   = useState({ x: 50, y: 55 });
  const [sparks, setSparks]   = useState([]);
  const [pops, setPops]       = useState([]);
  const [prompt, setPrompt]   = useState(null);
  const [idea, setIdea]       = useState("");
  const [ideas, setIdeas]     = useState([]);
  const [vibe, setVibe]       = useState("Salto");

  const catR       = useRef({ x: 50, y: 55 });
  const targetR    = useRef(null);
  const sparksR    = useRef([]);
  const roundR     = useRef(false);
  const comboR     = useRef(0);
  const captR      = useRef(0);
  const animoR     = useRef(70);
  const moodR      = useRef("idle");
  const distR      = useRef(false);
  const loopR      = useRef(null);
  const sdriftR    = useRef(null);
  const timerR     = useRef(null);
  const spawnerR   = useRef(null);

  useEffect(() => { sparksR.current = sparks; }, [sparks]);

  function setM(m) { moodR.current = m; setMood(m); }
  function setA(v) { const c = Math.max(0, Math.min(100, v)); animoR.current = c; setAnimo(c); }

  function burst(x, y, gold) {
    const ps = Array.from({ length: gold ? 16 : 8 }, () => ({
      id: crypto.randomUUID(), x, y, angle: Math.random() * 360, r: 22 + Math.random() * 42, gold,
    }));
    setPops(p => [...p, ...ps]);
    setTimeout(() => setPops(p => p.filter(q => !ps.find(z => z.id === q.id))), 700);
  }

  function clearAll() {
    clearInterval(loopR.current);
    clearInterval(sdriftR.current);
    clearInterval(timerR.current);
    clearInterval(spawnerR.current);
  }
  useEffect(() => () => clearAll(), []);

  function capture(spark) {
    captR.current += 1;
    const c = comboR.current + 1;
    comboR.current = c;
    setCombo(c);
    setScore(p => p + 10 + c * 2);
    setA(animoR.current + 8);
    burst(spark.x, spark.y, spark.eureka);
    setSparks(p => p.filter(s => s.id !== spark.id));
    const isEureka = captR.current % 5 === 0 || spark.eureka;
    if (isEureka) {
      roundR.current = false;
      clearInterval(timerR.current);
      clearInterval(spawnerR.current);
      setM("eureka");
      setMsg(pick(MSG.eureka));
      setPrompt({ spark: spark.word, text: pick(PROMPTS) });
    } else {
      setM("happy");
      setMsg(c >= 3 ? pick(MSG.combo) : pick(MSG.happy));
      setTimeout(() => { if (moodR.current === "happy" && roundR.current) setM("curious"); }, 600);
    }
  }

  function startLoop() {
    clearInterval(loopR.current);
    loopR.current = setInterval(() => {
      if (!roundR.current) return;
      const cat = catR.current;
      const tgt = targetR.current;
      if (tgt) {
        const dx = tgt.x - cat.x, dy = tgt.y - cat.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 5.5) {
          const sid = tgt.id;
          targetR.current = null;
          distR.current = false;
          if (sid) {
            const s = sparksR.current.find(x => x.id === sid);
            if (s) capture(s);
          }
        } else {
          const spd = 1.7;
          const nx = cat.x + (dx / d) * spd, ny = cat.y + (dy / d) * spd;
          catR.current = { x: nx, y: ny };
          setCatPos({ x: nx, y: ny });
        }
      } else {
        if (Math.random() < 0.015 && sparksR.current.length > 0 && !distR.current) {
          let best = null, bd = 999;
          for (const s of sparksR.current) { const d = Math.hypot(s.x - cat.x, s.y - cat.y); if (d < bd) { bd = d; best = s; } }
          if (best) { targetR.current = { x: best.x, y: best.y, id: best.id }; setM("hunting"); setMsg(pick(MSG.hunting)); }
        }
        if (Math.random() < 0.007 && !distR.current) {
          distR.current = true;
          targetR.current = { x: 20 + Math.random() * 60, y: 20 + Math.random() * 55, id: null };
          setM("distracted"); setMsg(pick(MSG.distracted));
          setTimeout(() => {
            distR.current = false;
            if (roundR.current && moodR.current === "distracted") { setM("curious"); setMsg(pick(MSG.curious)); }
          }, 1800 + Math.random() * 1400);
        }
      }
    }, 50);
  }

  function startDrift() {
    clearInterval(sdriftR.current);
    sdriftR.current = setInterval(() => {
      if (!roundR.current) return;
      const now = Date.now();
      setSparks(prev => {
        const next = prev
          .filter(s => now - s.born < s.ttl)
          .map(s => ({ ...s, x: Math.max(8, Math.min(92, s.x + s.vx * 60)), y: Math.max(15, Math.min(82, s.y + s.vy * 60)) }));
        if (targetR.current?.id) {
          const still = next.find(s => s.id === targetR.current.id);
          if (!still) {
            targetR.current = null; comboR.current = 0; setCombo(0);
            setA(animoR.current - 12); setM("offended"); setMsg(pick(MSG.offended));
            setTimeout(() => { if (moodR.current === "offended" && roundR.current) setM("curious"); }, 700);
          } else {
            targetR.current = { ...targetR.current, x: still.x, y: still.y };
          }
        }
        return next;
      });
    }, 60);
  }

  function startTimer() {
    clearInterval(timerR.current);
    timerR.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) { endRound(); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  function startSpawner() {
    clearInterval(spawnerR.current);
    spawnerR.current = setInterval(() => {
      if (!roundR.current) return;
      setSparks(p => p.length >= 9 ? p : [...p, mkSpark()]);
    }, 1400);
  }

  function startRound() {
    roundR.current = true; targetR.current = null; catR.current = { x: 50, y: 55 };
    comboR.current = 0; captR.current = 0; distR.current = false; animoR.current = 70;
    setCatPos({ x: 50, y: 55 }); setGame("play"); setTime(30); setScore(0); setCombo(0); setAnimo(70);
    setM("curious"); setMsg(pick(MSG.curious));
    setSparks(Array.from({ length: 6 }, () => mkSpark()));
    startLoop(); startDrift(); startTimer(); startSpawner();
  }

  function endRound() {
    roundR.current = false; clearAll(); setGame("end"); targetR.current = null;
    setM("idle"); setMsg(pick(MSG.end));
  }

  function tapSpark(s) {
    if (!roundR.current || prompt) return;
    distR.current = false;
    targetR.current = { x: s.x, y: s.y, id: s.id };
    setM("hunting"); setMsg(pick(MSG.hunting));
  }

  function saveIdea() {
    if (!idea.trim()) return;
    setIdeas(p => [{ id: crypto.randomUUID(), text: idea.trim(), vibe, spark: prompt.spark, time: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) }, ...p]);
    setIdea(""); setPrompt(null); setM("happy"); setMsg("Idea guardada. Adefesio concede otra ronda.");
    roundR.current = true; startTimer(); startSpawner();
    setTimeout(() => { if (moodR.current === "happy") setM("curious"); }, 800);
  }

  const radar = useMemo(() => {
    const b = { Vuelo: 10, Salto: 10, Mirada: 10, Eco: 10, Pulso: 10 };
    ideas.forEach(i => { b[i.vibe] = Math.min(100, b[i.vibe] + 20); });
    return b;
  }, [ideas]);

  const tColor = time > 10 ? "#e2e8f0" : time > 5 ? "#f59e0b" : "#ef4444";

  return (
    <main className="game-root">
      {game === "intro" && (
        <div className="intro-screen">
          <div className="intro-cat"><AdefesioSVG mood="idle" /></div>
          <h1>Adefesio</h1>
          <p className="intro-sub">Juego creativo · 30 s · Caza chispas</p>
          <p className="intro-desc">Toca las chispas para atraer a Adefesio.<br />Él decide si las caza.<br />Cada 5 capturas abre una idea.</p>
          <button className="btn-primary" onClick={startRound}>Despertar a Adefesio</button>
        </div>
      )}

      {game !== "intro" && (
        <div className="game-layout">
          <div className="arena-col">
            <div className="hud">
              <span className="hud-time" style={{ color: tColor }}>{time}s</span>
              <div className="hud-bar-wrap"><div className="hud-bar" style={{ width: `${(time / 30) * 100}%`, background: tColor }} /></div>
              <span className="hud-score">{score} pts</span>
              {combo > 1 && <span className="hud-combo">x{combo}</span>}
            </div>
            <div className="animo-row">
              <span>ánimo</span>
              <div className="animo-bar-wrap"><div className="animo-bar" style={{ width: `${animo}%`, background: animo > 55 ? "#4ade80" : animo > 25 ? "#fbbf24" : "#f87171" }} /></div>
            </div>
            <div className="arena">
              <div className="arena-glow g1" />
              <div className="arena-glow g2" />

              <div className="cat-wrap" style={{ left: `${catPos.x}%`, top: `${catPos.y}%` }}>
                <AdefesioSVG mood={mood} />
              </div>

              {sparks.map(s => {
                const age = (Date.now() - s.born) / s.ttl;
                return (
                  <button
                    key={s.id}
                    className={`spark${s.eureka ? " spark-eureka" : ""}`}
                    style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: age > 0.72 ? Math.max(0, 1 - (age - 0.72) / 0.28) : 1 }}
                    onClick={() => tapSpark(s)}
                    onTouchStart={e => { e.preventDefault(); tapSpark(s); }}
                  >
                    {s.eureka ? "⚡" : "✦"} {s.word}
                  </button>
                );
              })}

              {pops.map(p => (
                <div key={p.id} className={`pop${p.gold ? " pop-gold" : ""}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%,-50%) translate(${Math.cos(p.angle * Math.PI / 180) * p.r}px,${Math.sin(p.angle * Math.PI / 180) * p.r}px)` }} />
              ))}

              <div className="speech">{msg}</div>

              {game === "end" && !prompt && (
                <div className="end-overlay">
                  <div className="end-cat"><AdefesioSVG mood="idle" /></div>
                  <p className="end-score">{score} pts</p>
                  <p className="end-msg">{msg}</p>
                  <button className="btn-primary" onClick={startRound}>Otra ronda</button>
                </div>
              )}
            </div>
          </div>

          <aside className="panel">
            <div className="card">
              <p className="card-label">Radar</p>
              {Object.entries(radar).map(([k, v]) => (
                <div key={k} className="radar-row">
                  <div className="radar-labels"><span>{k}</span><span>{v}%</span></div>
                  <div className="radar-bar-wrap"><div className="radar-bar" style={{ width: `${v}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="card card-log">
              <p className="card-label">Bitácora</p>
              {ideas.length === 0
                ? <p className="muted">Adefesio está esperando.</p>
                : ideas.map(i => (
                  <div key={i.id} className="log-entry">
                    <p className="log-meta">{i.time} · {i.vibe} · {i.spark}</p>
                    <p className="log-text">{i.text}</p>
                  </div>
                ))}
            </div>
          </aside>
        </div>
      )}

      {prompt && (
        <div className="modal-bg">
          <div className="modal-box">
            <p className="modal-label">⚡ Chispa Eureka · {prompt.spark}</p>
            <h2 className="modal-q">{prompt.text}</h2>
            <textarea autoFocus value={idea} onChange={e => setIdea(e.target.value)}
              placeholder="Escribe una idea rápida. Rara sirve. Obvia no."
              className="modal-ta" />
            <div className="vibe-row">
              {VIBES.map(v => (
                <button key={v} onClick={() => setVibe(v)} className={`vibe-btn${vibe === v ? " active" : ""}`}>{v}</button>
              ))}
            </div>
            <button className="btn-primary" onClick={saveIdea}>Guardar idea</button>
          </div>
        </div>
      )}
    </main>
  );
}
