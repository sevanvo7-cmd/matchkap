import { useState } from "react";

const COLORS = {
  bg: "#07080f",
  card: "#0e1018",
  border: "#1a1d2e",
  accent: "#6c63ff",
  accentLight: "#8b85ff",
  accentGlow: "rgba(108,99,255,0.15)",
  green: "#00d68f",
  greenGlow: "rgba(0,214,143,0.12)",
  text: "#f0f0f8",
  muted: "#6b7090",
  orange: "#ff7043",
};

const NAV_ITEMS = ["Accueil", "Candidats", "Entreprises", "Classement"];

const CHALLENGES = {
  IT: [
    { q: "C'est quoi la différence entre RAM et ROM ?", a: "RAM = mémoire temporaire (vive), ROM = mémoire permanente (lecture seule)", type: "text" },
    { q: "Un client envoie une requête à un serveur. Qui répond ?", options: ["Le client", "Le serveur", "Le réseau", "Le router"], correct: 1 },
    { q: "Qu'est-ce qu'une adresse IP ?", a: "Identifiant unique d'un appareil sur un réseau", type: "text" },
    { q: "CSS sert à quoi ?", options: ["Structurer le contenu", "Styliser l'apparence", "Gérer la logique", "Stocker des données"], correct: 1 },
    { q: "Que signifie HTML ?", options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Machine Logic", "Home Tool Markup Language"], correct: 0 },
  ],
  PERSO: [
    { q: "T'as un bug critique 30min avant une démo client. Tu fais quoi ?", options: ["Tu paniques", "Tu préviens ton responsable et cherches une solution", "Tu ignores et espères que ça passe", "Tu annules la démo"], correct: 1 },
    { q: "T'es en désaccord avec ton tuteur sur une solution technique. Tu fais quoi ?", options: ["Tu fais ce qu'il dit sans rien dire", "Tu expliques ton point de vue calmement puis tu suis sa décision", "Tu fais à ta façon", "Tu te plaints aux RH"], correct: 1 },
    { q: "On te confie une tâche que t'as jamais faite. Ta réaction ?", options: ["Tu refuses", "Tu demandes de l'aide et tu cherches sur internet", "Tu fais semblant de savoir", "Tu attends que quelqu'un d'autre le fasse"], correct: 1 },
  ],
  LOGIQUE: [
    { q: "Si tu as 3 pommes et tu en donnes 2, combien il t'en reste ?", options: ["0", "1", "2", "3"], correct: 1 },
    { q: "Quelle est la prochaine valeur : 2, 4, 8, 16, ... ?", options: ["20", "24", "32", "64"], correct: 2 },
    { q: "Un train part à 8h et arrive à 11h30. Combien de temps de trajet ?", options: ["2h", "2h30", "3h", "3h30"], correct: 3 },
  ],
};

const PROFILES = [
  { name: "Karim B.", score: 94, domain: "IT / BTS CIEL", city: "Cergy", badge: "🔥 Top profil", challenges: ["IT", "Logique", "Perso"], time: "14 min" },
  { name: "Léa M.", score: 88, domain: "Commerce / BTS NRC", city: "Paris", badge: "⭐ Vérifié", challenges: ["Commerce", "Logique", "Perso"], time: "11 min" },
  { name: "Noah T.", score: 85, domain: "IT / BTS SIO", city: "Pontoise", badge: "⭐ Vérifié", challenges: ["IT", "Logique", "Perso"], time: "16 min" },
  { name: "Sara D.", score: 79, domain: "Marketing / BUT MMI", city: "Versailles", badge: null, challenges: ["Marketing", "Logique", "Perso"], time: "13 min" },
  { name: "Tom R.", score: 76, domain: "IT / BTS CIEL", city: "Argenteuil", badge: null, challenges: ["IT", "Logique", "Perso"], time: "18 min" },
];

const COMPANIES = [
  { name: "Sopra Steria", logo: "SS", color: "#6c63ff", domain: "IT", spots: 3, location: "Paris / Île-de-France" },
  { name: "BNP Paribas", logo: "BNP", color: "#00d68f", domain: "Finance / IT", spots: 5, location: "Paris" },
  { name: "Orange", logo: "OR", color: "#ff7043", domain: "Télécom / IT", spots: 2, location: "Paris La Défense" },
  { name: "Capgemini", logo: "CG", color: "#6c63ff", domain: "IT / Conseil", spots: 4, location: "Île-de-France" },
];

function ScoreBar({ score, color }) {
  return (
    <div style={{ background: "#1a1d2e", borderRadius: 999, height: 8, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${score}%`, borderRadius: 999,
        background: `linear-gradient(90deg, ${color || COLORS.accent}, ${color ? color + "aa" : COLORS.accentLight})`,
        transition: "width 1s ease"
      }} />
    </div>
  );
}

function ChallengeFlow({ onDone }) {
  const all = [
    ...CHALLENGES.IT.map(q => ({ ...q, cat: "💻 Technique" })),
    ...CHALLENGES.LOGIQUE.map(q => ({ ...q, cat: "🧠 Logique" })),
    ...CHALLENGES.PERSO.map(q => ({ ...q, cat: "🎯 Caractère" })),
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

  const progress = ((step) / all.length) * 100;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>{cur.cat}</span>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>{step + 1} / {all.length}</span>
        </div>
        <div style={{ background: COLORS.border, borderRadius: 999, height: 4 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: COLORS.accent, borderRadius: 999, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 24 }}>{cur.q}</p>
        {cur.options && cur.options.map((opt, i) => {
          let bg = COLORS.border;
          let color = COLORS.text;
          if (selected !== null) {
            if (i === cur.correct) { bg = COLORS.green; color = "#000"; }
            else if (i === selected && selected !== cur.correct) { bg = COLORS.orange; color = "#fff"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              width: "100%", background: selected === null ? COLORS.card : bg,
              border: `1px solid ${selected !== null && i === cur.correct ? COLORS.green : COLORS.border}`,
              borderRadius: 10, padding: "12px 16px", color, fontSize: 14,
              textAlign: "left", cursor: selected === null ? "pointer" : "default",
              marginBottom: 8, fontFamily: "inherit", transition: "all 0.3s",
              display: "flex", alignItems: "center", gap: 10
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: selected !== null && i === cur.correct ? "rgba(0,0,0,0.2)" : COLORS.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                color: selected !== null && i === cur.correct ? "#000" : COLORS.muted
              }}>
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

  const renderHome = () => (
    <div>
      <div style={{ textAlign: "center", padding: "80px 20px 60px", position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none"
        }} />
        <div style={{
          display: "inline-block", background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`,
          borderRadius: 999, padding: "6px 16px", fontSize: 12, color: COLORS.accentLight,
          fontWeight: 600, letterSpacing: 1, marginBottom: 20, textTransform: "uppercase"
        }}>
          🚀 La première plateforme FR skill-first
        </div>
        <h1 style={{
          fontSize: "clamp(32px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.1,
          marginBottom: 20, letterSpacing: "-1px"
        }}>
          Prouve ce que tu vaux.<br />
          <span style={{ color: COLORS.accent }}>Pas ce que t'as fait.</span>
        </h1>
        <p style={{ fontSize: 18, color: COLORS.muted, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Fini les CVs ignorés. Sur Matchkap tu passes un challenge de 15 minutes, les entreprises voient tes vrais skills — et toi tu décroches enfin un entretien.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("candidat")} style={{
            background: COLORS.accent, border: "none", borderRadius: 12,
            padding: "16px 32px", color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit"
          }}>
            Je suis candidat →
          </button>
          <button onClick={() => setPage("entreprise")} style={{
            background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "16px 32px", color: COLORS.text,
            fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
          }}>
            Je recrute
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap", marginBottom: 80, padding: "0 20px" }}>
        {[
          { n: "2 min", label: "Délai de réponse moyen" },
          { n: "94%", label: "Candidats vus par les RH" },
          { n: "0€", label: "Pour les candidats" },
          { n: "15min", label: "Le challenge complet" },
        ].map((s, i) => (
          <div key={i} style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 16, padding: "24px 32px", textAlign: "center", minWidth: 140, flex: "1 1 140px", maxWidth: 200
          }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.accent }}>{s.n}</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto 80px", padding: "0 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Comment ça marche ?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { step: "01", icon: "⚡", title: "Tu passes le challenge", desc: "15 minutes. Questions techniques, logique, personnalité. On mesure ce que tu vaux vraiment — pas ce que t'as mis sur ton CV." },
            { step: "02", icon: "📊", title: "T'obtiens ton score", desc: "Un score sur 100, un profil complet, et tu apparais dans les résultats de recherche des recruteurs." },
            { step: "03", icon: "🎯", title: "Les entreprises te contactent", desc: "Fini d'envoyer 100 CVs dans le vide. Les recruteurs voient ton profil et viennent vers toi si tu matches leur besoin." },
          ].map((s, i) => (
            <div key={i} style={{
              background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: 16, padding: 24, display: "flex", gap: 20, alignItems: "flex-start"
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>ÉTAPE {s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto 80px", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Profils récents</h2>
          <button onClick={() => setPage("classement")} style={{
            background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 8, padding: "8px 16px", color: COLORS.muted,
            fontSize: 13, cursor: "pointer", fontFamily: "inherit"
          }}>Voir tout →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PROFILES.slice(0, 3).map((p, i) => (
            <div key={i} style={{
              background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: 14, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 16, flexShrink: 0
              }}>{p.name[0]}</div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name} {p.badge && <span style={{ fontSize: 12, color: COLORS.accent }}>{p.badge}</span>}</div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>{p.domain} · {p.city}</div>
              </div>
              <div style={{ minWidth: 100 }}>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Score</div>
                <ScoreBar score={p.score} />
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
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>⚡</div>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Passe ton challenge</h2>
        <p style={{ color: COLORS.muted, fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
          11 questions. 15 minutes max. Technique, logique, personnalité.
          Ton score apparaît sur ton profil et les entreprises peuvent te trouver.
        </p>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 32, textAlign: "left" }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Ce qu'on mesure :</div>
          {[
            { icon: "💻", label: "5 questions techniques IT (bases)" },
            { icon: "🧠", label: "3 questions de logique" },
            { icon: "🎯", label: "3 questions de personnalité" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ color: COLORS.muted, fontSize: 14 }}>{item.label}</span>
            </div>
          ))}
        </div>
        {!formDone ? (
          <div style={{ textAlign: "left", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Ton profil :</div>
            {[
              { key: "name", placeholder: "Prénom et nom" },
              { key: "domain", placeholder: "Formation visée (ex: BTS CIEL)" },
              { key: "city", placeholder: "Ville" },
            ].map(f => (
              <input key={f.key} value={candidatForm[f.key]}
                onChange={e => setCandidatForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{
                  width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  borderRadius: 10, color: COLORS.text, fontSize: 14, padding: "12px 16px",
                  marginBottom: 10, fontFamily: "inherit", outline: "none", boxSizing: "border-box"
                }} />
            ))}
          </div>
        ) : null}
        <button onClick={() => { setFormDone(true); setChallengeStep("challenge"); }} style={{
          width: "100%", background: COLORS.accent, border: "none", borderRadius: 12,
          padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}>
          Commencer le challenge →
        </button>
      </div>
    );

    if (challengeStep === "challenge") return (
      <div style={{ paddingTop: 40 }}>
        <ChallengeFlow onDone={(score) => { setFinalScore(score); setChallengeStep("result"); }} />
      </div>
    );

    if (challengeStep === "result") return (
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%", margin: "0 auto 24px",
          background: `conic-gradient(${finalScore >= 70 ? COLORS.green : finalScore >= 50 ? COLORS.accent : COLORS.orange} ${finalScore * 3.6}deg, ${COLORS.border} 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", background: COLORS.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900,
            color: finalScore >= 70 ? COLORS.green : finalScore >= 50 ? COLORS.accent : COLORS.orange
          }}>{finalScore}</div>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          {finalScore >= 80 ? "🔥 Excellent !" : finalScore >= 60 ? "⭐ Bon profil !" : "💪 Pas mal !"}
        </h2>
        <p style={{ color: COLORS.muted, marginBottom: 32, lineHeight: 1.6 }}>
          {finalScore >= 70
            ? "Ton profil est visible par toutes les entreprises partenaires. T'attends plus que les contacts."
            : "Ton profil est en ligne. Tu peux repasser le challenge dans 7 jours pour améliorer ton score."}
        </p>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Ton profil Matchkap</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 8 }}>📍 {candidatForm.city || "Île-de-France"} · {candidatForm.domain || "IT"}</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Score global</div>
            <ScoreBar score={finalScore} color={finalScore >= 70 ? COLORS.green : COLORS.accent} />
          </div>
          <div style={{ background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: COLORS.accentLight }}>
            ✅ Profil visible par {COMPANIES.length} entreprises partenaires
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setChallengeStep("intro"); setFinalScore(null); }} style={{
            flex: 1, background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "14px", color: COLORS.muted,
            fontSize: 14, cursor: "pointer", fontFamily: "inherit"
          }}>Recommencer</button>
          <button onClick={() => setPage("classement")} style={{
            flex: 2, background: COLORS.accent, border: "none", borderRadius: 12,
            padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit"
          }}>Voir le classement →</button>
        </div>
      </div>
    );
  };

  const renderEntreprise = () => {
    if (formDone && page === "entreprise") return (
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Demande envoyée !</h2>
        <p style={{ color: COLORS.muted, marginBottom: 32, lineHeight: 1.6 }}>
          L'équipe Matchkap vous contacte sous 24h pour activer votre accès aux profils qualifiés.
        </p>
        <button onClick={() => { setFormDone(false); setPage("classement"); }} style={{
          background: COLORS.accent, border: "none", borderRadius: 12, padding: "14px 28px",
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
        }}>Voir les profils disponibles →</button>
      </div>
    );

    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Recrutez autrement.</h2>
        <p style={{ color: COLORS.muted, marginBottom: 40, fontSize: 16 }}>Accédez à des profils pré-qualifiés. Zéro CV. Que des skills prouvés.</p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
          {[
            { icon: "⚡", title: "Réponse en 2 min", desc: "Vous voyez le score du candidat avant même son nom" },
            { icon: "🎯", title: "0 CV à trier", desc: "Chaque profil a déjà prouvé ses compétences" },
            { icon: "💰", title: "99€/mois", desc: "Profils illimités. Résiliable à tout moment." },
          ].map((f, i) => (
            <div key={i} style={{
              background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: 14, padding: 20, flex: "1 1 200px"
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Demande d'accès gratuit</div>
          {[
            { key: "name", placeholder: "Nom de l'entreprise" },
            { key: "sector", placeholder: "Secteur (ex: IT, Finance...)" },
            { key: "spots", placeholder: "Nombre de postes à pourvoir" },
          ].map(f => (
            <input key={f.key} value={companyForm[f.key]}
              onChange={e => setCompanyForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              style={{
                width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: 10, color: COLORS.text, fontSize: 14, padding: "12px 16px",
                marginBottom: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box"
              }} />
          ))}
          <button onClick={() => setFormDone(true)} style={{
            width: "100%", background: COLORS.green, border: "none", borderRadius: 12,
            padding: "14px", color: "#000", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", marginTop: 8
          }}>
            Accéder aux profils gratuitement →
          </button>
          <p style={{ color: COLORS.muted, fontSize: 12, textAlign: "center", marginTop: 12 }}>
            Essai gratuit 30 jours · Sans engagement · Sans CB
          </p>
        </div>
      </div>
    );
  };

  const renderClassement = () => (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>🏆 Classement</h2>
      <p style={{ color: COLORS.muted, marginBottom: 32 }}>Les profils les mieux scorés cette semaine</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PROFILES.map((p, i) => (
          <div key={i} style={{
            background: COLORS.card, border: `1px solid ${i === 0 ? COLORS.accent + "66" : COLORS.border}`,
            borderRadius: 14, padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: i === 0 ? "linear-gradient(135deg,#ffd700,#ffaa00)" : i === 1 ? "linear-gradient(135deg,#c0c0c0,#909090)" : i === 2 ? "linear-gradient(135deg,#cd7f32,#a05a2c)" : COLORS.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 15, color: i < 3 ? "#000" : COLORS.muted
            }}>{i + 1}</div>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 16
            }}>{p.name[0]}</div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name} {p.badge && <span style={{ fontSize: 11, color: COLORS.accent }}>{p.badge}</span>}</div>
              <div style={{ color: COLORS.muted, fontSize: 12 }}>{p.domain} · {p.city} · {p.time}</div>
            </div>
            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? COLORS.green : COLORS.text }}>{p.score}<span style={{ fontSize: 13, color: COLORS.muted }}>/100</span></div>
              <ScoreBar score={p.score} color={i === 0 ? COLORS.green : COLORS.accent} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <button onClick={() => { setPage("candidat"); setChallengeStep("intro"); }} style={{
          background: COLORS.accent, border: "none", borderRadius: 12,
          padding: "14px 28px", color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}>
          Passe ton challenge et rejoins le classement →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: COLORS.bg + "ee", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 60
      }}>
        <div style={{ fontWeight: 900, fontSize: 20, cursor: "pointer", color: COLORS.text }} onClick={() => setPage("home")}>
          match<span style={{ color: COLORS.accent }}>kap</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map((item, i) => {
            const pages = ["home", "candidat", "entreprise", "classement"];
            return (
              <button key={i} onClick={() => { setPage(pages[i]); if (pages[i] === "candidat") setChallengeStep("intro"); }} style={{
                background: page === pages[i] ? COLORS.accentGlow : "transparent",
                border: page === pages[i] ? `1px solid ${COLORS.accent}44` : "1px solid transparent",
                borderRadius: 8, padding: "6px 12px",
                color: page === pages[i] ? COLORS.accentLight : COLORS.muted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
              }}>{item}</button>
            );
          })}
        </div>
        <button onClick={() => { setPage("candidat"); setChallengeStep("intro"); }} style={{
          background: COLORS.accent, border: "none", borderRadius: 8,
          padding: "8px 16px", color: "#fff", fontSize: 13,
          fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
        }}>
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