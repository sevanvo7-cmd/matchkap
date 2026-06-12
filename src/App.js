import { useState, useEffect } from "react";

const SUPABASE_URL = "https://ulcusvxdyasgngymrbgb.supabase.co";
const SUPABASE_KEY = "sb_publishable_j9bItmvXx9N_k9hONT1J4w_gh0f7r0W";

async function saveProfile(name, domain, city, score) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ name, domain, city, score })
    });
    return res.ok;
  } catch { return false; }
}

async function getProfiles() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=score.desc&limit=10`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });
    if (res.ok) return await res.json();
    return [];
  } catch { return []; }
}

const COLORS = {
  bg: "#07080f",
  card: "#0e1018",
  border: "#1a1d2e",
  accent: "#6c63ff",
  accentLight: "#8b85ff",
  accentGlow: "rgba(108,99,255,0.15)",
  green: "#00d68f",
  text: "#f0f0f8",
  muted: "#6b7090",
  orange: "#ff7043",
};

const NAV_ITEMS = ["Accueil", "Candidats", "Entreprises", "Classement"];

const CHALLENGES = {
  IT: [
    { q: "Difference entre RAM et ROM ?", options: ["RAM = temporaire, ROM = permanente", "RAM = permanente, ROM = temporaire", "Les deux sont identiques", "RAM = disque dur"], correct: 0 },
    { q: "Un client envoie une requete a un serveur. Qui repond ?", options: ["Le client", "Le serveur", "Le reseau", "Le router"], correct: 1 },
    { q: "Une adresse IP c'est quoi ?", options: ["Un identifiant unique sur un reseau", "Un mot de passe reseau", "Un type de cable", "Un navigateur internet"], correct: 0 },
    { q: "CSS sert a quoi ?", options: ["Structurer le contenu", "Styliser l'apparence", "Gerer la logique", "Stocker des donnees"], correct: 1 },
    { q: "Que signifie HTML ?", options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Machine Logic", "Home Tool Markup Language"], correct: 0 },
  ],
  PERSO: [
    { q: "Bug critique 30min avant une demo client. Tu fais quoi ?", options: ["Tu paniques", "Tu previens ton responsable et cherches une solution", "Tu ignores", "Tu annules la demo"], correct: 1 },
    { q: "Desaccord avec ton tuteur sur une solution. Tu fais quoi ?", options: ["Tu fais ce qu'il dit sans rien dire", "Tu expliques ton point de vue puis tu suis sa decision", "Tu fais a ta facon", "Tu te plaints aux RH"], correct: 1 },
    { q: "On te confie une tache que t'as jamais faite. Ta reaction ?", options: ["Tu refuses", "Tu demandes de l'aide et cherches sur internet", "Tu fais semblant de savoir", "Tu attends que quelqu'un d'autre le fasse"], correct: 1 },
  ],
  LOGIQUE: [
    { q: "3 pommes, tu en donnes 2. Combien il t'en reste ?", options: ["0", "1", "2", "3"], correct: 1 },
    { q: "Prochaine valeur : 2, 4, 8, 16, ... ?", options: ["20", "24", "32", "64"], correct: 2 },
    { q: "Train part a 8h, arrive a 11h30. Duree du trajet ?", options: ["2h", "2h30", "3h", "3h30"], correct: 3 },
  ],
};

const DEMO_PROFILES = [
  { name: "Karim B.", score: 94, domain: "IT / BTS CIEL", city: "Cergy" },
  { name: "Lea M.", score: 88, domain: "Commerce / BTS NRC", city: "Paris" },
  { name: "Noah T.", score: 85, domain: "IT / BTS SIO", city: "Pontoise" },
];

function ScoreBar({ score, color }) {
  return (
    <div style={{ background: "#1a1d2e", borderRadius: 999, height: 8, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${score}%`, borderRadius: 999, background: color || COLORS.accent, transition: "width 1s ease" }} />
    </div>
  );
}

function ChallengeFlow({ onDone }) {
  const all = [
    ...CHALLENGES.IT.map(q => ({ ...q, cat: "Technique" })),
    ...CHALLENGES.LOGIQUE.map(q => ({ ...q, cat: "Logique" })),
    ...CHALLENGES.PERSO.map(q => ({ ...q, cat: "Caractere" })),
  ];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const cur = all[step];
  const isLast = step === all.length - 1;

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => {
      const newAnswers = [...answers, { correct: i === cur.correct }];
      if (isLast) {
        const score = Math.round((newAnswers.filter(a => a.correct).length / all.length) * 100);
        onDone(score);
      } else {
        setAnswers(newAnswers);
        setSelected(null);
        setStep(s => s + 1);
      }
    }, 900);
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>{cur.cat}</span>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>{step + 1} / {all.length}</span>
        </div>
        <div style={{ background: COLORS.border, borderRadius: 999, height: 4 }}>
          <div style={{ height: "100%", width: `${(step / all.length) * 100}%`, background: COLORS.accent, borderRadius: 999, transition: "width 0.3s" }} />
        </div>
      </div>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5, marginBottom: 24 }}>{cur.q}</p>
        {cur.options.map((opt, i) => {
          let bg = COLORS.card;
          let borderColor = COLORS.border;
          let color = COLORS.text;
          if (selected !== null) {
            if (i === cur.correct) { bg = COLORS.green; borderColor = COLORS.green; color = "#000"; }
            else if (i === selected) { bg = COLORS.orange; borderColor = COLORS.orange; color = "#fff"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              width: "100%", background: bg, border: `1px solid ${borderColor}`,
              borderRadius: 10, padding: "12px 16px", color, fontSize: 14,
              textAlign: "left", cursor: selected === null ? "pointer" : "default",
              marginBottom: 8, fontFamily: "inherit", transition: "all 0.3s",
              display: "flex", alignItems: "center", gap: 10
            }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, color: COLORS.muted }}>
                {["A", "B", "C", "D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Matchkap() {
  const [page, setPage] = useState("home");
  const [challengeStep, setChallengeStep] = useState("intro");
  const [finalScore, setFinalScore] = useState(null);
  const [candidatForm, setCandidatForm] = useState({ name: "", domain: "", city: "" });
  const [companyForm, setCompanyForm] = useState({ name: "", sector: "", spots: "" });
  const [formDone, setFormDone] = useState(false);
  const [profiles, setProfiles] = useState(DEMO_PROFILES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfiles().then(data => {
      if (data && data.length > 0) setProfiles(data);
    });
  }, []);

  const goCandidat = () => { setPage("candidat"); setChallengeStep("intro"); };

  const handleChallengeComplete = async (score) => {
    setFinalScore(score);
    setSaving(true);
    await saveProfile(
      candidatForm.name || "Anonyme",
      candidatForm.domain || "Non specifie",
      candidatForm.city || "France",
      score
    );
    const fresh = await getProfiles();
    if (fresh && fresh.length > 0) setProfiles(fresh);
    setSaving(false);
    setChallengeStep("result");
  };

  const renderHome = () => (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ textAlign: "center", padding: "80px 20px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "inline-block", background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`, borderRadius: 999, padding: "6px 16px", fontSize: 12, color: COLORS.accentLight, fontWeight: 600, letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>
          La premiere plateforme FR skill-first
        </div>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-1px" }}>
          Prouve ce que tu vaux.<br />
          <span style={{ color: COLORS.accent }}>Pas ce que t'as fait.</span>
        </h1>
        <p style={{ fontSize: 18, color: COLORS.muted, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Fini les CVs ignores. Sur Matchkap tu passes un challenge de 15 minutes, les entreprises voient tes vrais skills.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={goCandidat} style={{ background: COLORS.accent, border: "none", borderRadius: 12, padding: "16px 32px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Je suis candidat
          </button>
          <button onClick={() => setPage("entreprise")} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 32px", color: COLORS.text, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Je recrute
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 80, padding: "0 20px" }}>
        {[{ n: "2 min", label: "Delai de reponse moyen" }, { n: "94%", label: "Candidats vus par les RH" }, { n: "0 EUR", label: "Pour les candidats" }, { n: "15min", label: "Le challenge complet" }].map((s, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "24px 32px", textAlign: "center", minWidth: 140, flex: "1 1 140px", maxWidth: 200 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.accent }}>{s.n}</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto 80px", padding: "0 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Comment ca marche ?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { step: "01", icon: "⚡", title: "Tu passes le challenge", desc: "15 minutes. Questions techniques, logique, personnalite. On mesure ce que tu vaux vraiment." },
            { step: "02", icon: "📊", title: "T'obtiens ton score", desc: "Un score sur 100, un profil complet, et tu apparais dans les resultats des recruteurs." },
            { step: "03", icon: "🎯", title: "Les entreprises te contactent", desc: "Fini d'envoyer 100 CVs dans le vide. Les recruteurs viennent vers toi." },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>ETAPE {s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto 80px", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Profils recents</h2>
          <button onClick={() => setPage("classement")} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 16px", color: COLORS.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Voir tout</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {profiles.slice(0, 3).map((p, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{(p.name || "?")[0]}</div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>{p.domain} · {p.city}</div>
              </div>
              <div style={{ minWidth: 100 }}>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Score</div>
                <ScoreBar score={p.score} color={COLORS.green} />
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, marginTop: 4 }}>{p.score}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCandidat = () => {
    if (challengeStep === "intro") return (
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>⚡</div>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Passe ton challenge</h2>
        <p style={{ color: COLORS.muted, fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>11 questions. 15 minutes max. Technique, logique, personnalite.</p>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 32, textAlign: "left" }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Ce qu'on mesure :</div>
          {[{ icon: "💻", label: "5 questions techniques IT" }, { icon: "🧠", label: "3 questions de logique" }, { icon: "🎯", label: "3 questions de personnalite" }].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ color: COLORS.muted, fontSize: 14 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "left", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Ton profil :</div>
          {[{ key: "name", placeholder: "Prenom et nom" }, { key: "domain", placeholder: "Formation visee (ex: BTS CIEL)" }, { key: "city", placeholder: "Ville" }].map(f => (
            <input key={f.key} value={candidatForm[f.key]} onChange={e => setCandidatForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 14, padding: "12px 16px", marginBottom: 10, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          ))}
        </div>
        <button onClick={() => { setFormDone(true); setChallengeStep("challenge"); }} style={{ width: "100%", background: COLORS.accent, border: "none", borderRadius: 12, padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Commencer le challenge
        </button>
      </div>
    );

    if (challengeStep === "challenge") return (
      <div style={{ paddingTop: 40, paddingBottom: 80 }}>
        <ChallengeFlow onDone={handleChallengeComplete} />
      </div>
    );

    if (challengeStep === "result") return (
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px 80px", textAlign: "center" }}>
        {saving ? (
          <div style={{ color: COLORS.muted, fontSize: 16, marginBottom: 20 }}>Sauvegarde de ton profil...</div>
        ) : null}
        <div style={{ width: 120, height: 120, borderRadius: "50%", margin: "0 auto 24px", background: `conic-gradient(${finalScore >= 70 ? COLORS.green : COLORS.accent} ${finalScore * 3.6}deg, ${COLORS.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: finalScore >= 70 ? COLORS.green : COLORS.accent }}>{finalScore}</div>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{finalScore >= 80 ? "Excellent !" : finalScore >= 60 ? "Bon profil !" : "Pas mal !"}</h2>
        <p style={{ color: COLORS.muted, marginBottom: 32, lineHeight: 1.6 }}>{finalScore >= 70 ? "Ton profil est visible par toutes les entreprises partenaires." : "Ton profil est en ligne. Tu peux repasser le challenge dans 7 jours."}</p>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Ton profil Matchkap</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 8 }}>{candidatForm.city || "France"} · {candidatForm.domain || "IT"}</div>
          <ScoreBar score={finalScore} color={finalScore >= 70 ? COLORS.green : COLORS.accent} />
          <div style={{ background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: COLORS.accentLight, marginTop: 12 }}>
            Profil sauvegarde et visible par les entreprises
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setChallengeStep("intro"); setFinalScore(null); }} style={{ flex: 1, background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px", color: COLORS.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Recommencer</button>
          <button onClick={() => setPage("classement")} style={{ flex: 2, background: COLORS.accent, border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Voir le classement</button>
        </div>
      </div>
    );
  };

  const renderEntreprise = () => {
    if (formDone && page === "entreprise") return (
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Demande envoyee !</h2>
        <p style={{ color: COLORS.muted, marginBottom: 32, lineHeight: 1.6 }}>L'equipe Matchkap vous contacte sous 24h a l'adresse email fournie.</p>
        <button onClick={() => { setFormDone(false); setPage("classement"); }} style={{ background: COLORS.accent, border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Voir les profils</button>
      </div>
    );
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Recrutez autrement.</h2>
        <p style={{ color: COLORS.muted, marginBottom: 40, fontSize: 16 }}>Profils pre-qualifies. Zero CV. Que des skills prouves.</p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
          {[{ icon: "⚡", title: "Reponse en 2 min", desc: "Vous voyez le score avant meme son nom" }, { icon: "🎯", title: "0 CV a trier", desc: "Chaque profil a prouve ses competences" }, { icon: "💰", title: "99 EUR/mois", desc: "Profils illimites. Resiliable a tout moment." }].map((f, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 20, flex: "1 1 200px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Demande d'acces gratuit</div>
          {[{ key: "name", placeholder: "Nom de l'entreprise" }, { key: "sector", placeholder: "Secteur (ex: IT, Finance...)" }, { key: "spots", placeholder: "Nombre de postes a pourvoir" }].map(f => (
            <input key={f.key} value={companyForm[f.key]} onChange={e => setCompanyForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 14, padding: "12px 16px", marginBottom: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          ))}
          <button onClick={() => setFormDone(true)} style={{ width: "100%", background: COLORS.green, border: "none", borderRadius: 12, padding: "14px", color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
            Acces gratuit 30 jours
          </button>
          <p style={{ color: COLORS.muted, fontSize: 12, textAlign: "center", marginTop: 12 }}>Sans engagement · Sans CB</p>
        </div>
      </div>
    );
  };

  const renderClassement = () => (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px 80px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Classement</h2>
      <p style={{ color: COLORS.muted, marginBottom: 32 }}>Les profils les mieux scores</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {profiles.map((p, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${i === 0 ? COLORS.accent + "66" : COLORS.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg,#ffd700,#ffaa00)" : i === 1 ? "linear-gradient(135deg,#c0c0c0,#909090)" : i === 2 ? "linear-gradient(135deg,#cd7f32,#a05a2c)" : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: i < 3 ? "#000" : COLORS.muted }}>{i + 1}</div>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{(p.name || "?")[0]}</div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <div style={{ color: COLORS.muted, fontSize: 12 }}>{p.domain} · {p.city}</div>
            </div>
            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? COLORS.green : COLORS.text }}>{p.score}<span style={{ fontSize: 13, color: COLORS.muted }}>/100</span></div>
              <ScoreBar score={p.score} color={i === 0 ? COLORS.green : COLORS.accent} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <button onClick={goCandidat} style={{ background: COLORS.accent, border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Passe ton challenge
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: COLORS.bg + "ee", backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ fontWeight: 900, fontSize: 20, cursor: "pointer", color: COLORS.text }} onClick={() => setPage("home")}>
          match<span style={{ color: COLORS.accent }}>kap</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map((item, i) => {
            const pages = ["home", "candidat", "entreprise", "classement"];
            return (
              <button key={i} onClick={() => { setPage(pages[i]); if (pages[i] === "candidat") setChallengeStep("intro"); }} style={{ background: page === pages[i] ? COLORS.accentGlow : "transparent", border: page === pages[i] ? `1px solid ${COLORS.accent}44` : "1px solid transparent", borderRadius: 8, padding: "6px 12px", color: page === pages[i] ? COLORS.accentLight : COLORS.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{item}</button>
            );
          })}
        </div>
        <button onClick={goCandidat} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Passer le challenge
        </button>
      </nav>
      {page === "home" && renderHome()}
      {page === "candidat" && renderCandidat()}
      {page === "entreprise" && renderEntreprise()}
      {page === "classement" && renderClassement()}
    </div>
  );
}
