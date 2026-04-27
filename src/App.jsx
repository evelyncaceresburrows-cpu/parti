import { useEffect, useMemo, useRef, useState } from "react";

const prompts = [
  "¿Cómo lo haría un gato astronauta?",
  "¿Qué pasaría si esto fuera un juego?",
  "¿Cómo lo resolvería alguien sin presupuesto?",
  "¿Qué parte de esta idea merece ser más absurda?",
  "¿Y si el usuario solo tuviera 30 segundos?",
  "¿Cómo se vería esto si fuera más tierno?",
  "¿Qué haría que alguien quisiera volver mañana?",
  "¿Qué elemento puede transformarse en sorpresa?",
  "¿Qué eliminarías para que la idea respire?",
  "¿Dónde está escondida la emoción?"
];

const sparkWords = [
  "Caos", "Vuelo", "Ritual", "Juego", "Espera",
  "Sorpresa", "Mapa", "Michi", "Luz", "Ruido",
  "Deseo", "Objeto", "Pantalla", "Cuidado", "Truco"
];

const vibes = [
  { key: "Vuelo", desc: "Fluidez" },
  { key: "Salto", desc: "Originalidad" },
  { key: "Mirada", desc: "Contexto" },
  { key: "Eco", desc: "Narrativa" },
  { key: "Pulso", desc: "Realidad" }
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [michi, setMichi] = useState({ x: 50, y: 55 });
  const [sparks, setSparks] = useState([]);
  const [captured, setCaptured] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [idea, setIdea] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("Vuelo");
  const [ideas, setIdeas] = useState([]);
  const [mood, setMood] = useState("dormido");
  const fieldRef = useRef(null);

  useEffect(() => {
    if (!started) return;

    const initial = Array.from({ length: 5 }).map((_, i) => ({
      id: crypto.randomUUID(),
      word: sparkWords[Math.floor(Math.random() * sparkWords.length)],
      x: 15 + Math.random() * 70,
      y: 18 + Math.random() * 55,
      delay: i * 0.2
    }));

    setSparks(initial);
    setMood("curioso");
  }, [started]);

  const moveMichi = (e) => {
    if (!started || currentPrompt) return;

    const rect = fieldRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setMichi({ x, y });
    setMood("cazando");

    setTimeout(() => detectCollision(x, y), 240);
  };

  const detectCollision = (x, y) => {
    const hit = sparks.find((s) => {
      const dx = s.x - x;
      const dy = s.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 11;
    });

    if (!hit) {
      setMood("ofendido");
      setTimeout(() => setMood("curioso"), 500);
      return;
    }

    setCaptured((prev) => [...prev, hit.word]);
    setSparks((prev) => prev.filter((s) => s.id !== hit.id));
    setMood("eureka");

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt({ word: hit.word, prompt });
  };

  const saveIdea = () => {
    if (!idea.trim()) return;

    setIdeas((prev) => [
      {
        id: crypto.randomUUID(),
        text: idea.trim(),
        vibe: selectedVibe,
        prompt: currentPrompt.prompt,
        spark: currentPrompt.word,
        createdAt: new Date().toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit"
        })
      },
      ...prev
    ]);

    setIdea("");
    setCurrentPrompt(null);
    setMood("orgulloso");

    if (sparks.length === 0) {
      setSparks(
        Array.from({ length: 5 }).map(() => ({
          id: crypto.randomUUID(),
          word: sparkWords[Math.floor(Math.random() * sparkWords.length)],
          x: 15 + Math.random() * 70,
          y: 18 + Math.random() * 55
        }))
      );
    }

    setTimeout(() => setMood("curioso"), 800);
  };

  const radar = useMemo(() => {
    const base = {
      Vuelo: 8,
      Salto: 8,
      Mirada: 8,
      Eco: 8,
      Pulso: 8
    };

    ideas.forEach((i) => {
      base[i.vibe] += 18;
    });

    Object.keys(base).forEach((k) => {
      base[k] = Math.min(base[k], 100);
    });

    return base;
  }, [ideas]);

  const michiText = {
    dormido: "Zzz...",
    curioso: "Toca la pantalla. Hay chispas rondando.",
    cazando: "¡Michi va!",
    ofendido: "Eso no era una chispa. Era aire.",
    eureka: "Michi encontró algo.",
    orgulloso: "Idea cazada. Michi aprueba."
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-[#f7f2ea] flex items-center justify-center p-6">
        <section className="max-w-md w-full text-center">
          <div className="text-8xl mb-6 animate-bounce">🐈</div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            Michi-Inspiración
          </h1>
          <p className="text-slate-600 mb-8">
            Juega con el Michi. Caza chispas. Desbloquea ideas.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="w-full rounded-3xl bg-slate-900 text-white py-4 font-bold text-lg shadow-xl active:scale-95 transition"
          >
            Despertar al Michi
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
        <section>
          <header className="mb-4">
            <h1 className="text-3xl md:text-5xl font-black">
              Michi-Inspiración
            </h1>
            <p className="text-slate-600">
              Atrapa chispas para provocar ideas rápidas.
            </p>
          </header>

          <div
            ref={fieldRef}
            onClick={moveMichi}
            onTouchStart={moveMichi}
            className="relative h-[62vh] min-h-[430px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-white via-[#efe7dc] to-[#d8e6f2] border border-white shadow-2xl cursor-pointer"
          >
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_28%),radial-gradient(circle_at_80%_60%,white,transparent_22%)]" />

            <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start gap-4">
              <div className="backdrop-blur-xl bg-white/55 border border-white rounded-3xl px-5 py-3 shadow">
                <p className="font-bold">Estado Michi</p>
                <p className="text-sm text-slate-600">{michiText[mood]}</p>
              </div>
              <div className="backdrop-blur-xl bg-white/55 border border-white rounded-3xl px-5 py-3 shadow text-right">
                <p className="font-bold">{ideas.length}</p>
                <p className="text-sm text-slate-600">ideas cazadas</p>
              </div>
            </div>

            {sparks.map((s) => (
              <button
                key={s.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white shadow-lg animate-pulse"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                ✨ {s.word}
              </button>
            ))}

            <div
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
              style={{ left: `${michi.x}%`, top: `${michi.y}%` }}
            >
              <div className="text-8xl drop-shadow-2xl select-none">
                {mood === "ofendido" ? "🙀" : mood === "eureka" ? "😼" : "🐈"}
              </div>
            </div>

            {currentPrompt && (
              <div className="absolute inset-0 z-40 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center p-5">
                <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
                  <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">
                    Chispa cazada: {currentPrompt.word}
                  </p>
                  <h2 className="text-2xl font-black mb-4">
                    {currentPrompt.prompt}
                  </h2>

                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Escribe una idea rápida, aunque sea rara..."
                    className="w-full h-32 rounded-2xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  />

                  <div className="grid grid-cols-5 gap-2 my-4">
                    {vibes.map((v) => (
                      <button
                        key={v.key}
                        onClick={() => setSelectedVibe(v.key)}
                        className={`rounded-2xl p-2 text-xs border ${
                          selectedVibe === v.key
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50"
                        }`}
                      >
                        <strong>{v.key}</strong>
                        <br />
                        {v.desc}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={saveIdea}
                    className="w-full rounded-2xl bg-slate-900 text-white py-3 font-bold active:scale-95 transition"
                  >
                    Guardar idea
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[2rem] bg-white p-5 shadow-xl">
            <h2 className="text-xl font-black mb-4">Radar creativo</h2>
            <div className="space-y-3">
              {Object.entries(radar).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{key}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-xl max-h-[55vh] overflow-auto">
            <h2 className="text-xl font-black mb-4">Bitácora del Michi</h2>

            {ideas.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Todavía no hay ideas. Caza una chispa.
              </p>
            ) : (
              <div className="space-y-3">
                {ideas.map((i) => (
                  <article
                    key={i.id}
                    className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                  >
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                      <span>{i.createdAt}</span>
                      <span>{i.vibe}</span>
                    </div>
                    <p className="font-semibold">{i.text}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Chispa: {i.spark}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
