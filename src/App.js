import { useState, useEffect } from "react";

const SUPABASE_URL = "https://ulcusvxdyasgngymrbgb.supabase.co";
const SUPABASE_KEY = "sb_publishable_j9bItmvXx9N_k9hONT1J4w_gh0f7r0W";
const EMAILJS_SERVICE = "service_8nsnt6w";
const EMAILJS_TEMPLATE = "template_yp7zwdf";
const EMAILJS_PUBLIC = "OxM7F2nrygHbJgT9o";

async function saveProfile(name, domain, city, score) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify({ name, domain, city, score })
    });
    return res.ok;
  } catch { return false; }
}

async function getProfiles() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=score.desc&limit=20`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    if (res.ok) return await res.json();
    return [];
  } catch { return []; }
}

async function sendCompanyEmail(company_name, sector, spots, email) {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: EMAILJS_SERVICE, template_id: EMAILJS_TEMPLATE, user_id: EMAILJS_PUBLIC, template_params: { company_name, sector, spots, email } })
    });
    return res.ok;
  } catch { return false; }
}

const QUESTION_BANKS = {
  IT: [
    { q: "Difference entre RAM et ROM ?", options: ["RAM = temporaire, ROM = permanente", "RAM = permanente, ROM = temporaire", "Les deux pareilles", "RAM = disque dur"], correct: 0 },
    { q: "CSS sert a quoi ?", options: ["Structurer le contenu", "Styliser l'apparence", "Gerer la logique", "Stocker des donnees"], correct: 1 },
    { q: "Que signifie HTML ?", options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Machine Logic", "Home Tool Markup Language"], correct: 0 },
    { q: "Un client envoie une requete a un serveur. Qui repond ?", options: ["Le client", "Le serveur", "Le reseau", "Le routeur"], correct: 1 },
    { q: "Que signifie IP dans adresse IP ?", options: ["Internet Protocol", "Internal Process", "Input Port", "Internet Page"], correct: 0 },
    { q: "Quel port utilise HTTPS par defaut ?", options: ["80", "21", "443", "8080"], correct: 2 },
    { q: "Que signifie DNS ?", options: ["Domain Name System", "Digital Network Service", "Data Node Server", "Dynamic Name Setup"], correct: 0 },
    { q: "La commande ping sert a tester quoi ?", options: ["La connexion reseau", "La vitesse CPU", "L'espace disque", "La memoire RAM"], correct: 0 },
    { q: "Difference entre TCP et UDP ?", options: ["TCP est fiable, UDP est rapide sans garantie", "UDP est fiable, TCP est rapide", "Les deux sont identiques", "TCP est sans fil"], correct: 0 },
    { q: "Que fait la commande ipconfig ?", options: ["Affiche la config reseau", "Installe un driver", "Formate le disque", "Lance un scan virus"], correct: 0 },
    { q: "Qu'est-ce qu'une adresse MAC ?", options: ["Identifiant physique unique d'une carte reseau", "Un type de mot de passe", "Une adresse email Apple", "Un protocole de securite"], correct: 0 },
    { q: "Role d'un pare-feu ?", options: ["Filtrer le trafic reseau", "Accelerer le processeur", "Gerer la memoire", "Sauvegarder les fichiers"], correct: 0 },
    { q: "Que signifie VLAN ?", options: ["Virtual Local Area Network", "Very Large Access Node", "Virtual Link Adapter Network", "Verified LAN"], correct: 0 },
    { q: "Quelle couche OSI gere le routage ?", options: ["Couche 1", "Couche 2", "Couche 3", "Couche 4"], correct: 2 },
    { q: "Un sous-reseau /24 contient combien d'adresses ?", options: ["128", "256", "512", "1024"], correct: 1 },
  ],
  COMMERCE: [
    { q: "Qu'est-ce que le CA d'une entreprise ?", options: ["Chiffre d'Affaires total des ventes", "Capital Annuel investi", "Cout d'Achat des produits", "Charge Administrative"], correct: 0 },
    { q: "La marge commerciale c'est ?", options: ["Prix de vente - Cout d'achat", "CA - Charges totales", "Benefice net apres impots", "CA divise par 2"], correct: 0 },
    { q: "BtoB signifie ?", options: ["Business to Business", "Budget to Balance", "Brand to Buyer", "Base to Base"], correct: 0 },
    { q: "La TVA au taux normal en France ?", options: ["10%", "15%", "20%", "25%"], correct: 2 },
    { q: "L'argumentaire CAP c'est ?", options: ["Caracteristique, Avantage, Preuve", "Client, Achat, Prix", "Contact, Action, Prospect", "Cout, Analyse, Produit"], correct: 0 },
    { q: "Le taux de conversion mesure quoi ?", options: ["% de prospects devenus clients", "% de remise accordee", "% de marge sur les ventes", "% de clients perdus"], correct: 0 },
    { q: "Un bon de commande c'est quoi ?", options: ["Document formalisant une commande client", "Facture de paiement", "Contrat de travail", "Fiche produit"], correct: 0 },
    { q: "La fidelisation coute moins cher que la prospection ?", options: ["Vrai", "Faux", "Depend du secteur", "Impossible a savoir"], correct: 0 },
    { q: "Le merchandising c'est ?", options: ["Optimisation de la presentation en point de vente", "Technique de negociation", "Strategie de prix", "Gestion des stocks"], correct: 0 },
    { q: "Un prospect froid c'est ?", options: ["Contact qui ne connait pas encore l'entreprise", "Client qui achete rarement", "Fournisseur inactif", "Employe demotive"], correct: 0 },
    { q: "Le NPS mesure quoi ?", options: ["Satisfaction et fidelite client", "Score de performance commerciale", "Note produit sur le marche", "Taux de negociation reussi"], correct: 0 },
  ],
  MARKETING: [
    { q: "Les 4P du marketing mix ?", options: ["Produit, Prix, Place, Promotion", "Prospect, Profit, Part, Pub", "Plan, Prix, Pub, Produit", "Produit, Performance, Place, Profit"], correct: 0 },
    { q: "Le SEO c'est ?", options: ["Optimisation pour les moteurs de recherche", "Strategie d'emailing", "Publicite reseaux sociaux", "Analyse des donnees clients"], correct: 0 },
    { q: "Un KPI c'est ?", options: ["Indicateur cle de performance", "Type de contenu publicitaire", "Outil de gestion stocks", "Technique de vente"], correct: 0 },
    { q: "Taux d'engagement reseaux sociaux = ?", options: ["Interactions / portee totale", "Nombre d'abonnes", "Nombre de publications", "Budget depense"], correct: 0 },
    { q: "Un persona marketing c'est ?", options: ["Profil fictif representant le client ideal", "Pseudonyme utilise en pub", "Personnage de pub TV", "Type de contenu video"], correct: 0 },
    { q: "Le tunnel de conversion represente ?", options: ["Le parcours du prospect jusqu'a l'achat", "La progression d'un employe", "Le cycle de vie produit", "La chaine logistique"], correct: 0 },
    { q: "Le A/B testing c'est ?", options: ["Comparer deux versions pour voir laquelle performe mieux", "Tester deux produits", "Former deux equipes", "Analyser deux concurrents"], correct: 0 },
    { q: "CPC en pub digitale signifie ?", options: ["Cout Par Clic", "Contenu Par Campagne", "Client Potentiel Contacte", "Cout Par Conversion"], correct: 0 },
  ],
  COMPTA: [
    { q: "Le bilan comptable c'est ?", options: ["Photo de la situation financiere a un instant T", "Compte rendu des ventes", "Liste des employes", "Planning des paiements"], correct: 0 },
    { q: "La TVA collectee c'est ?", options: ["La TVA facturee aux clients", "La TVA payee aux fournisseurs", "La TVA remboursee par l'Etat", "La TVA sur les salaires"], correct: 0 },
    { q: "Le resultat net c'est ?", options: ["Produits - Charges", "CA - Achats", "Actif - Passif", "Recettes - TVA"], correct: 0 },
    { q: "L'amortissement c'est ?", options: ["Etalement du cout d'un bien sur sa duree de vie", "Remboursement d'un emprunt", "Reduction du prix de vente", "Augmentation du capital"], correct: 0 },
    { q: "Une charge fixe c'est ?", options: ["Charge independante du niveau d'activite", "Charge qui varie avec les ventes", "Charge payee annuellement", "Charge liee aux matieres premieres"], correct: 0 },
    { q: "La CAF c'est ?", options: ["Ressources generees par l'activite de l'entreprise", "Montant des impots dus", "Valeur des dettes fournisseurs", "Salaire des dirigeants"], correct: 0 },
    { q: "Le seuil de rentabilite c'est ?", options: ["Le CA a partir duquel l'entreprise est beneficiaire", "Le prix minimum d'un produit", "Le nombre minimum de clients", "La date limite de paiement"], correct: 0 },
  ],
  COMMUNICATION: [
    { q: "Qu'est-ce qu'un plan de communication ?", options: ["Document qui definit les objectifs et actions de communication", "Liste des contacts presse", "Budget annuel publicite", "Contrat avec une agence"], correct: 0 },
    { q: "La communication interne c'est ?", options: ["Communication entre employes de l'entreprise", "Pub sur les reseaux sociaux", "Relations avec la presse", "Communication vers les clients"], correct: 0 },
    { q: "Qu'est-ce qu'une identite visuelle ?", options: ["Logo, couleurs, typo qui representent une marque", "Photo de profil d'un employe", "Signature d'email", "Fond d'ecran du site web"], correct: 0 },
    { q: "Un communique de presse c'est ?", options: ["Document envoye aux journalistes pour annoncer une info", "Pub dans un magazine", "Post sur Instagram", "Newsletter client"], correct: 0 },
    { q: "La cible d'une campagne com c'est ?", options: ["Le public a qui s'adresse le message", "Le budget de la campagne", "Le canal de diffusion", "La date de lancement"], correct: 0 },
    { q: "Le storytelling c'est ?", options: ["Technique narrative pour engager l'audience", "Type de format video", "Logiciel de creation", "Strategie de prix"], correct: 0 },
    { q: "Qu'est-ce que l'image de marque ?", options: ["Perception qu'a le public d'une marque", "Logo d'une entreprise", "Slogan publicitaire", "Photo du produit"], correct: 0 },
    { q: "Un media owned c'est ?", options: ["Canal detenu par la marque (site, reseaux)", "Publicite achetee", "Article de presse gratuit", "Bouche a oreille"], correct: 0 },
    { q: "La charte editoriale definit ?", options: ["Le ton, le style et les regles d'ecriture d'une marque", "Les couleurs de la marque", "Le budget communication", "Les partenaires medias"], correct: 0 },
    { q: "Un influenceur macro c'est ?", options: ["Createur avec plus de 100 000 abonnes", "Createur avec moins de 10 000 abonnes", "Un journaliste", "Un directeur marketing"], correct: 0 },
  ],
  LOGIQUE: [
    { q: "3 pommes, tu en donnes 2. Combien il t'en reste ?", options: ["0", "1", "2", "3"], correct: 1 },
    { q: "Prochaine valeur : 2, 4, 8, 16 ?", options: ["20", "24", "32", "64"], correct: 2 },
    { q: "Train part a 8h, arrive a 11h30. Duree ?", options: ["2h", "2h30", "3h", "3h30"], correct: 3 },
    { q: "Si A > B et B > C, alors ?", options: ["A > C", "C > A", "A = C", "Impossible a dire"], correct: 0 },
    { q: "Magasin fait -30% sur 100 EUR. Prix final ?", options: ["60 EUR", "70 EUR", "75 EUR", "80 EUR"], correct: 1 },
    { q: "1 imprimante imprime 10 pages en 2min. Combien en 10min ?", options: ["20", "30", "50", "100"], correct: 2 },
    { q: "Prochaine valeur : 1, 1, 2, 3, 5, 8 ?", options: ["10", "11", "13", "16"], correct: 2 },
    { q: "Article a 80 EUR apres -20%. Prix initial ?", options: ["96 EUR", "100 EUR", "104 EUR", "112 EUR"], correct: 1 },
    { q: "Combien de mois entre mars et novembre ?", options: ["6", "7", "8", "9"], correct: 2 },
    { q: "Un rectangle de 6x4. Perimetre ?", options: ["20", "24", "10", "48"], correct: 0 },
  ],
  PERSO: [
    { q: "Bug critique 30min avant une demo. Tu fais quoi ?", options: ["Tu paniques", "Tu previens ton responsable et cherches une solution", "Tu ignores", "Tu annules la demo"], correct: 1 },
    { q: "Desaccord avec ton tuteur. Tu fais quoi ?", options: ["Tu fais ce qu'il dit sans rien dire", "Tu expliques ton point de vue puis tu suis sa decision", "Tu fais a ta facon", "Tu te plaints aux RH"], correct: 1 },
    { q: "On te confie une tache inconnue. Ta reaction ?", options: ["Tu refuses", "Tu demandes de l'aide et cherches sur internet", "Tu fais semblant de savoir", "Tu attends quelqu'un d'autre"], correct: 1 },
    { q: "Tu rates une echeance. Tu fais quoi ?", options: ["Tu caches l'erreur", "Tu informes immediatement et proposes une solution", "Tu blames un collegue", "Tu attends que ca se passe"], correct: 1 },
    { q: "Un collegue fait une erreur qui t'affecte. Tu ?", options: ["Tu cries dessus", "Tu lui parles calmement en prive", "Tu l'ignores", "Tu le signales au manager directement"], correct: 1 },
  ],
};

function getQuestionsForDomain(domain) {
  const d = (domain || "").toLowerCase().replace(/[éèê]/g, "e").replace(/[àâ]/g, "a").replace(/[î]/g, "i").replace(/[ô]/g, "o").replace(/[û]/g, "u");
  let domainQuestions = [];
  if (d.includes("ciel") || d.includes("sio") || d.includes("info") || d.includes("it") || d.includes("cyber") || d.includes("reseau") || d.includes("dev") || d.includes("reseaux")) {
    domainQuestions = QUESTION_BANKS.IT;
  } else if (d.includes("commerce") || d.includes("nrc") || d.includes("mco") || d.includes("vente") || d.includes("commercial")) {
    domainQuestions = QUESTION_BANKS.COMMERCE;
  } else if (d.includes("commun") || d.includes("info-com") || d.includes("journa") || d.includes("media") || d.includes("redac")) {
    domainQuestions = QUESTION_BANKS.COMMUNICATION;
  } else if (d.includes("market") || d.includes("mmi") || d.includes("pub") || d.includes("digital")) {
    domainQuestions = QUESTION_BANKS.MARKETING;
  } else if (d.includes("compta") || d.includes("finance") || d.includes("gea") || d.includes("gestion")) {
    domainQuestions = QUESTION_BANKS.COMPTA;
  } else {
    domainQuestions = [...QUESTION_BANKS.IT.slice(0, 4), ...QUESTION_BANKS.COMMERCE.slice(0, 3), ...QUESTION_BANKS.MARKETING.slice(0, 3)];
  }
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  return [
    ...shuffle(domainQuestions).slice(0, 5).map(q => ({ ...q, cat: "Technique" })),
    ...shuffle(QUESTION_BANKS.LOGIQUE).slice(0, 3).map(q => ({ ...q, cat: "Logique" })),
    ...shuffle(QUESTION_BANKS.PERSO).slice(0, 3).map(q => ({ ...q, cat: "Caractere" })),
  ];
}

const C = {
  bg: "#09090B",
  s1: "#111113",
  s2: "#18181B",
  border: "#27272A",
  border2: "#3F3F46",
  accent: "#FFFFFF",
  blue: "#3B82F6",
  green: "#22C55E",
  red: "#EF4444",
  yellow: "#EAB308",
  text: "#FAFAFA",
  t2: "#A1A1AA",
  t3: "#52525B",
};

const DEMO_PROFILES = [
  { name: "Karim B.", score: 94, domain: "BTS CIEL", city: "Cergy" },
  { name: "Lea M.", score: 88, domain: "BTS NRC", city: "Paris" },
  { name: "Noah T.", score: 85, domain: "BTS SIO", city: "Pontoise" },
  { name: "Sara D.", score: 79, domain: "BUT MMI", city: "Versailles" },
  { name: "Tom R.", score: 76, domain: "BTS CIEL", city: "Argenteuil" },
];

const scoreColor = (s) => s >= 80 ? C.green : s >= 60 ? C.yellow : C.red;

const btn = (extra = {}) => ({
  border: "none", cursor: "pointer", fontFamily: "Inter, -apple-system, sans-serif",
  fontWeight: 600, borderRadius: 8, transition: "opacity .15s", ...extra
});

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%", boxSizing: "border-box",
        background: C.s1, border: `1px solid ${C.border}`,
        borderRadius: 8, color: C.text, fontSize: 14,
        padding: "11px 14px", fontFamily: "Inter, -apple-system, sans-serif",
        outline: "none", marginBottom: 10,
      }}
    />
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: color + "18", color, border: `1px solid ${color}30`,
      borderRadius: 4, fontSize: 11, fontWeight: 600,
      padding: "2px 7px", letterSpacing: .3,
    }}>{children}</span>
  );
}

function Avatar({ name, size = 36 }) {
  const colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4"];
  const color = colors[(name || "?").charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: color + "22", border: `1px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, color,
    }}>{(name || "?")[0].toUpperCase()}</div>
  );
}

function ScoreRing({ score, size = 80 }) {
  const color = scoreColor(score);
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.28, fontWeight: 800, color,
      }}>{score}</div>
    </div>
  );
}

function ProgressDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: i < current ? C.blue : i === current ? C.text : C.border,
          transition: "background .3s",
        }} />
      ))}
    </div>
  );
}

function ChallengeFlow({ onDone, domain }) {
  const all = getQuestionsForDomain(domain);
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
        onDone(Math.round((newAnswers.filter(a => a.correct).length / all.length) * 100));
      } else {
        setAnswers(newAnswers);
        setSelected(null);
        setStep(s => s + 1);
      }
    }, 800);
  };

  const catColor = cur.cat === "Technique" ? C.blue : cur.cat === "Logique" ? C.yellow : "#A78BFA";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Badge color={catColor}>{cur.cat}</Badge>
        <span style={{ fontSize: 13, color: C.t2, fontVariantNumeric: "tabular-nums" }}>{step + 1} / {all.length}</span>
      </div>
      <ProgressDots total={all.length} current={step} />
      <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
      <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.55, color: C.text, marginBottom: 20 }}>{cur.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cur.options.map((opt, i) => {
          let borderColor = C.border;
          let bg = C.s1;
          let color = C.t2;
          let icon = null;
          if (selected !== null) {
            if (i === cur.correct) { borderColor = C.green; bg = C.green + "12"; color = C.green; icon = "✓"; }
            else if (i === selected && i !== cur.correct) { borderColor = C.red; bg = C.red + "12"; color = C.red; icon = "✗"; }
          } else if (selected === null) {
            color = C.text;
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              background: bg, border: `1px solid ${borderColor}`,
              borderRadius: 8, padding: "12px 14px", color,
              fontSize: 14, textAlign: "left", cursor: selected === null ? "pointer" : "default",
              fontFamily: "Inter, -apple-system, sans-serif", transition: "all .25s",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: 6, background: C.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0, color: C.t3,
              }}>{icon || ["A", "B", "C", "D"][i]}</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const isMobile = typeof screen !== "undefined" && screen.width < 640;

export default function Matchkap() {

  const [page, setPage] = useState("home");
  const [challengeStep, setChallengeStep] = useState("intro");
  const [finalScore, setFinalScore] = useState(null);
  const [candidatForm, setCandidatForm] = useState({ name: "", domain: "", diplome: "", specialisation: "", city: "" });
  const [companyForm, setCompanyForm] = useState({ name: "", email: "", sector: "", spots: "" });
  const [formDone, setFormDone] = useState(false);
  const [profiles, setProfiles] = useState(DEMO_PROFILES);
  const [saving, setSaving] = useState(false);
  const [candidatError, setCandidatError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [companyAccess, setCompanyAccess] = useState(false);
  const [companyCode, setCompanyCode] = useState("");

  useEffect(() => {
    getProfiles().then(data => { if (data && data.length > 0) setProfiles(data); });
  }, []);

  const goCandidat = () => { setPage("candidat"); setChallengeStep("intro"); };

  const handleChallengeComplete = async (score) => {
    setFinalScore(score);
    setSaving(true);
    await saveProfile(candidatForm.name || "Anonyme", candidatForm.domain || "Non specifie", candidatForm.city || "France", score);
    const fresh = await getProfiles();
    if (fresh && fresh.length > 0) setProfiles(fresh);
    setSaving(false);
    setChallengeStep("result");
  };

  const handleCompanySubmit = async () => {
    setFormDone(true);
    await sendCompanyEmail(companyForm.name, companyForm.sector, companyForm.spots, companyForm.email);
  };

  const Nav = () => (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: C.bg + "f0", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${C.border}`,
      height: 56, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 16px",
    }}>
      <span onClick={() => setPage("home")} style={{ fontWeight: 800, fontSize: 17, cursor: "pointer", letterSpacing: -.4, color: C.text }}>
        match<span style={{ color: C.blue }}>kap</span>
      </span>
      {!isMobile && (
        <nav style={{ display: "flex", gap: 2 }}>
          {[["home","Accueil"],["candidat","Candidats"],["entreprise","Entreprises"],["classement","Classement"]].map(([p, label]) => (
            <button key={p} onClick={() => { setPage(p); if (p === "candidat") setChallengeStep("intro"); }}
              style={btn({
                padding: "5px 11px", fontSize: 13,
                background: page === p ? C.s2 : "transparent",
                border: `1px solid ${page === p ? C.border : "transparent"}`,
                color: page === p ? C.text : C.t2,
              })}>{label}</button>
          ))}
        </nav>
      )}
      {isMobile && (
        <div style={{ display: "flex", gap: 6 }}>
          {[["candidat","Challenge"],["classement","Top"],["entreprise","RH"]].map(([p, label]) => (
            <button key={p} onClick={() => { setPage(p); if (p === "candidat") setChallengeStep("intro"); }}
              style={btn({
                padding: "5px 10px", fontSize: 12,
                background: page === p ? C.s2 : "transparent",
                border: `1px solid ${page === p ? C.border : "transparent"}`,
                color: page === p ? C.text : C.t2,
              })}>{label}</button>
          ))}
        </div>
      )}
      <button onClick={goCandidat} style={btn({ background: C.blue, color: "#fff", padding: isMobile ? "7px 10px" : "7px 14px", fontSize: isMobile ? 12 : 13, whiteSpace: "nowrap" })}>
        {isMobile ? "Go →" : "Passer le challenge"}
      </button>
    </header>
  );

  const Home = () => (
    <div style={{ paddingBottom: 80 }}>
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "80px 20px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.s2, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: C.t2, fontWeight: 500, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
          {profiles.filter(p => p.score).length} profils qualifies ce mois
        </div>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 58px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 20, color: C.text }}>
          Prouve ce que tu vaux.<br />
          <span style={{ color: C.t3 }}>Pas ce que t'as fait.</span>
        </h1>
        <p style={{ fontSize: 17, color: C.t2, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.65, fontWeight: 400 }}>
          15 minutes. Un score sur 100. Les recruteurs voient tes competences avant ton CV.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={goCandidat} style={btn({ background: C.text, color: C.bg, padding: "12px 28px", fontSize: 15, fontWeight: 700 })}>
            Commencer le challenge
          </button>
          <button onClick={() => setPage("classement")} style={btn({ background: "transparent", border: `1px solid ${C.border}`, color: C.t2, padding: "12px 28px", fontSize: 15 })}>
            Voir le classement
          </button>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.s1 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)" }}>
          {[["15 min", "Pour passer le challenge"], ["94%", "Taux de visibilite RH"], ["0 EUR", "Pour les candidats"], [profiles.length+"", "Profils dans la base"]].map(([n, l], i) => (
            <div key={i} style={{
              padding: "20px 16px",
              borderRight: isMobile ? (i % 2 === 0 ? `1px solid ${C.border}` : "none") : (i < 3 ? `1px solid ${C.border}` : "none"),
              borderBottom: isMobile && i < 2 ? `1px solid ${C.border}` : "none",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>{n}</div>
              <div style={{ fontSize: 12, color: C.t3, lineHeight: 1.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "48px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Profils recents</div>
            <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>Candidats les mieux notes</div>
          </div>
          <button onClick={() => setPage("classement")} style={btn({ background: "transparent", border: `1px solid ${C.border}`, color: C.t2, padding: "7px 14px", fontSize: 13 })}>
            Voir tout
          </button>
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {profiles.slice(0, 5).map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
              background: i % 2 === 0 ? C.s1 : C.bg,
            }}>
              <span style={{ width: 20, fontSize: 12, color: C.t3, fontVariantNumeric: "tabular-nums", textAlign: "center" }}>{i + 1}</span>
              <Avatar name={p.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.t3 }}>{p.domain} · {p.city}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 80, height: 4, background: C.border, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p.score}%`, background: scoreColor(p.score), borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(p.score), fontVariantNumeric: "tabular-nums", minWidth: 42, textAlign: "right" }}>{p.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto 0", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          {[
            { num: "01", title: "Tu remplis ton profil", desc: "Prenom, formation visee, ville. 30 secondes." },
            { num: "02", title: "Tu passes le challenge", desc: "11 questions adaptees a ton domaine. Score sur 100." },
            { num: "03", title: "Les recruteurs te trouvent", desc: "Ton profil apparait dans les resultats des entreprises." },
          ].map((s, i) => (
            <div key={i} style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>{s.num}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: C.t3, lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const Candidat = () => {
    if (challengeStep === "intro") return (
      <div style={{ maxWidth: 480, margin: "48px auto", padding: "0 20px 80px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -.5, marginBottom: 6 }}>Ton profil</h2>
          <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.6 }}>Remplis tes infos, puis passe le challenge. Questions adaptees a ton domaine.</p>
        </div>
        <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t3, letterSpacing: .5, marginBottom: 12 }}>TES INFORMATIONS</div>
          <Input value={candidatForm.name} onChange={e => setCandidatForm(p => ({ ...p, name: e.target.value }))} placeholder="Prenom et nom" />
          <select value={candidatForm.diplome} onChange={e => setCandidatForm(p => ({ ...p, diplome: e.target.value, specialisation: "", domain: e.target.value }))}
            style={{ width: "100%", boxSizing: "border-box", background: C.s1, border: `1px solid ${C.border}`, borderRadius: 8, color: candidatForm.diplome ? C.text : C.t3, fontSize: 14, padding: "11px 14px", fontFamily: "Inter, -apple-system, sans-serif", outline: "none", marginBottom: 10, appearance: "none" }}>
            <option value="" disabled>Type de diplome vise</option>
            <option value="BTS">BTS</option>
            <option value="BUT">BUT</option>
            <option value="Bachelor">Bachelor (Bac+3)</option>
            <option value="Licence Pro">Licence Professionnelle</option>
            <option value="Bac Pro">Bac Pro</option>
          </select>
          {candidatForm.diplome && (
            <select value={candidatForm.specialisation} onChange={e => setCandidatForm(p => ({ ...p, specialisation: e.target.value, domain: p.diplome + " " + e.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", background: C.s1, border: `1px solid ${C.border}`, borderRadius: 8, color: candidatForm.specialisation ? C.text : C.t3, fontSize: 14, padding: "11px 14px", fontFamily: "Inter, -apple-system, sans-serif", outline: "none", marginBottom: 10, appearance: "none" }}>
              <option value="" disabled>Specialisation</option>
              {candidatForm.diplome === "BTS" && [["CIEL","CIEL - Info, Electronique, Reseaux"],["SIO","SIO - Services Informatiques"],["SN","SN - Systemes Numeriques"],["NDRC","NDRC - Negociation Relation Client"],["MCO","MCO - Management Commercial"],["Communication","Communication"],["CG","CG - Comptabilite et Gestion"],["Banque","Banque"],["Assurance","Assurance"],["Autre","Autre BTS"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              {candidatForm.diplome === "BUT" && [["Informatique","Informatique"],["Reseaux","Reseaux et Telecom"],["MMI","MMI - Multimedia et Internet"],["Info-Com","Information-Communication"],["GEA","Gestion des Entreprises"],["TC","Techniques de Commercialisation"],["Autre","Autre BUT"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              {candidatForm.diplome === "Bachelor" && [["Bachelor Informatique","Informatique / Cybersecurite"],["Bachelor Marketing","Marketing / Digital"],["Bachelor Commerce","Commerce / Business"],["Bachelor Communication","Communication"],["Bachelor Finance","Finance / Gestion"],["Autre Bachelor","Autre"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              {candidatForm.diplome === "Licence Pro" && [["LP Informatique","Informatique / Reseaux"],["LP Commerce","Commerce / Vente"],["LP Communication","Communication"],["LP Gestion","Gestion / Comptabilite"],["Autre LP","Autre"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              {candidatForm.diplome === "Bac Pro" && [["Bac Pro SEN","SEN - Systemes Electroniques"],["Bac Pro Commerce","Commerce"],["Bac Pro Gestion","Gestion-Administration"],["Autre Bac Pro","Autre"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
          <Input value={candidatForm.city} onChange={e => setCandidatForm(p => ({ ...p, city: e.target.value }))} placeholder="Ville" />
        </div>
        <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t3, letterSpacing: .5, marginBottom: 12 }}>LE CHALLENGE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[["💻","5 questions techniques","Adaptees a ton domaine"],["🧠","3 questions de logique","Raisonnement et calcul"],["🎯","3 questions de caractere","Comment tu te comportes au travail"]].map(([icon, title, sub], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
                  <div style={{ fontSize: 12, color: C.t3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {candidatError && <div style={{ color: C.red, fontSize: 13, marginBottom: 12, padding: "10px 14px", background: C.red + "12", borderRadius: 8, border: `1px solid ${C.red}30` }}>{candidatError}</div>}
        <button onClick={() => {
          if (!candidatForm.name.trim()) { setCandidatError("Entre ton prenom et nom."); return; }
          if (!candidatForm.diplome) { setCandidatError("Selectionne ton type de diplome."); return; }
          if (!candidatForm.specialisation) { setCandidatError("Selectionne ta specialisation."); return; }
          if (!candidatForm.city.trim()) { setCandidatError("Entre ta ville."); return; }
          setCandidatError("");
          setChallengeStep("challenge");
        }} style={btn({ background: C.blue, color: "#fff", padding: "13px", fontSize: 15, width: "100%", borderRadius: 8 })}>
          Commencer le challenge →
        </button>
      </div>
    );

    if (challengeStep === "challenge") return (
      <ChallengeFlow onDone={handleChallengeComplete} domain={candidatForm.domain} />
    );

    if (challengeStep === "result") return (
      <div style={{ maxWidth: 480, margin: "48px auto", padding: "0 20px 80px" }}>
        {saving && <div style={{ color: C.t2, fontSize: 13, marginBottom: 16, textAlign: "center" }}>Sauvegarde en cours...</div>}
        <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 28, marginBottom: 16, textAlign: "center" }}>
          <ScoreRing score={finalScore} size={96} />
          <div style={{ marginTop: 16, fontSize: 22, fontWeight: 800, color: C.text }}>
            {finalScore >= 80 ? "Excellent !" : finalScore >= 60 ? "Bon profil !" : "Continue !"}
          </div>
          <div style={{ fontSize: 14, color: C.t2, marginTop: 6 }}>
            {finalScore >= 70 ? "Ton profil est visible par les recruteurs." : "Repasse le challenge dans 7 jours pour ameliorer ton score."}
          </div>
        </div>
        <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={candidatForm.name} size={40} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{candidatForm.name || "Anonyme"}</div>
              <div style={{ fontSize: 12, color: C.t3 }}>{candidatForm.domain} · {candidatForm.city}</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Badge color={scoreColor(finalScore)}>{finalScore}/100</Badge>
            </div>
          </div>
          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          <div style={{ fontSize: 12, color: C.green, display: "flex", alignItems: "center", gap: 6 }}>
            <span>✓</span> Profil sauvegarde et visible par les entreprises
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setChallengeStep("intro"); setFinalScore(null); }} style={btn({ flex: 1, background: C.s1, border: `1px solid ${C.border}`, color: C.t2, padding: "12px", fontSize: 14 })}>
            Recommencer
          </button>
          <button onClick={() => setPage("classement")} style={btn({ flex: 2, background: C.blue, color: "#fff", padding: "12px", fontSize: 14 })}>
            Voir le classement
          </button>
        </div>
      </div>
    );
  };

  const Entreprise = () => {
    if (!companyAccess) return (
      <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 20px" }}>
        <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.t3, letterSpacing: .5, marginBottom: 8 }}>ESPACE RECRUTEURS</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Acces entreprise</h2>
          <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.6, marginBottom: 20 }}>Cet espace est reserve aux recruteurs. Entrez votre code d'acces ou contactez-nous.</p>
          <Input value={companyCode} onChange={e => setCompanyCode(e.target.value)} placeholder="Code d'acces" />
          {companyError && <div style={{ color: C.red, fontSize: 13, marginBottom: 10 }}>{companyError}</div>}
          <button onClick={() => {
            if (companyCode === "MATCHKAP2026") { setCompanyAccess(true); setCompanyError(""); }
            else setCompanyError("Code incorrect.");
          }} style={btn({ background: C.text, color: C.bg, padding: "11px", fontSize: 14, width: "100%", marginBottom: 14 })}>
            Acceder
          </button>
          <div style={{ height: 1, background: C.border, marginBottom: 14 }} />
          <p style={{ fontSize: 13, color: C.t3, marginBottom: 6 }}>Pas encore de code ?</p>
          <a href="mailto:sevanvo7@gmail.com?subject=Demande acces Matchkap" style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>
            Contacter Matchkap →
          </a>
        </div>
      </div>
    );

    if (formDone) return (
      <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Demande envoyee</div>
          <div style={{ fontSize: 14, color: C.t2, marginBottom: 20 }}>On vous contacte sous 24h a l'adresse email fournie.</div>
          <button onClick={() => { setFormDone(false); setPage("classement"); }} style={btn({ background: C.blue, color: "#fff", padding: "11px 20px", fontSize: 14 })}>
            Voir les profils disponibles
          </button>
        </div>
      </div>
    );

    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t3, letterSpacing: .5, marginBottom: 8 }}>POUR LES RECRUTEURS</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: -.5, marginBottom: 12 }}>Recrutez sur les competences.</h2>
            <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, marginBottom: 24 }}>Chaque candidat a prouve ses competences avant de postuler. Vous voyez le score avant le nom.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["0 CV a trier","Chaque profil a passe un challenge de competences"],["Score avant tout","Vous evaluez les skills avant de voir l'identite"],["99 EUR / mois","Acces illimite. Resiliable a tout moment."]].map(([t, d], i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t}</div>
                    <div style={{ fontSize: 13, color: C.t3, lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.s1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t3, letterSpacing: .5, marginBottom: 16 }}>DEMANDE D'ACCES GRATUIT</div>
            <Input value={companyForm.name} onChange={e => setCompanyForm(p => ({ ...p, name: e.target.value }))} placeholder="Nom de l'entreprise" />
            <Input value={companyForm.email} onChange={e => setCompanyForm(p => ({ ...p, email: e.target.value }))} placeholder="Email de contact" type="email" />
            <Input value={companyForm.sector} onChange={e => setCompanyForm(p => ({ ...p, sector: e.target.value }))} placeholder="Secteur (ex: IT, Finance...)" />
            <Input value={companyForm.spots} onChange={e => setCompanyForm(p => ({ ...p, spots: e.target.value }))} placeholder="Nombre de postes a pourvoir" />
            {companyError && <div style={{ color: C.red, fontSize: 13, marginBottom: 10, padding: "8px 12px", background: C.red + "12", borderRadius: 6 }}>{companyError}</div>}
            <button onClick={() => {
              if (!companyForm.name.trim()) { setCompanyError("Entre le nom de l'entreprise."); return; }
              if (!companyForm.email.trim() || !companyForm.email.includes("@")) { setCompanyError("Entre un email valide."); return; }
              if (!companyForm.sector.trim()) { setCompanyError("Entre le secteur d'activite."); return; }
              if (!companyForm.spots.trim() || isNaN(companyForm.spots)) { setCompanyError("Entre un nombre de postes valide."); return; }
              setCompanyError("");
              handleCompanySubmit();
            }} style={btn({ background: C.text, color: C.bg, padding: "12px", fontSize: 14, width: "100%", fontWeight: 700 })}>
              Acces gratuit 30 jours
            </button>
            <p style={{ fontSize: 12, color: C.t3, textAlign: "center", marginTop: 10 }}>Sans engagement · Sans CB</p>
          </div>
        </div>
      </div>
    );
  };

  const Classement = () => (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -.5 }}>Classement</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{profiles.length} profils qualifies — mis a jour en temps reel</p>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        {profiles.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
            borderBottom: i < profiles.length - 1 ? `1px solid ${C.border}` : "none",
            background: i === 0 ? C.blue + "08" : i % 2 === 0 ? C.s1 : C.bg,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: i === 0 ? "#EAB308" : i === 1 ? C.t2 : i === 2 ? "#CD7F32" : C.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800,
              color: i < 3 ? C.bg : C.t3,
            }}>{i + 1}</div>
            <Avatar name={p.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.name}</div>
              <div style={{ fontSize: 12, color: C.t3 }}>{p.domain} · {p.city}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 72, height: 4, background: C.border, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p.score}%`, background: scoreColor(p.score), borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(p.score), fontVariantNumeric: "tabular-nums", minWidth: 42, textAlign: "right" }}>{p.score}/100</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button onClick={goCandidat} style={btn({ background: C.blue, color: "#fff", padding: "12px 28px", fontSize: 14 })}>
          Rejoindre le classement
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden", maxWidth: "100vw" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { background: #09090B; }`}</style>
      {Nav()}
      {page === "home" && Home()}
      {page === "candidat" && Candidat()}
      {page === "entreprise" && Entreprise()}
      {page === "classement" && Classement()}
    </div>
  );
}
