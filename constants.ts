import { PublicCard, SecretCard, SecretExplain, YearConfig, SecretEffectConfig, YearOption, IndustryType, PriceStrategy } from "./types";

export const ICONS: Record<string, string> = {
  rocket:'<path d="M12 2c4 2 6 6 6 10v2l-6 6-6-6v-2C6 8 8 4 12 2z" fill="#60a5fa"/><path d="M12 9a2 2 0 110 4 2 2 0 010-4z" fill="#1e3a8a"/>',
  bolt:'<path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" fill="#facc15"/>',
  leaf:'<path d="M3 12C3 6 9 3 21 3c0 12-3 18-9 18-6 0-9-6-9-9z" fill="#22c55e"/><path d="M9 14c2-2 6-5 12-7" stroke="#14532d" stroke-width="2"/>',
  diamond:'<path d="M6 2l-4 6 10 14 10-14-4-6H6z" fill="#38bdf8" stroke="#0ea5e9" stroke-width="2"/>',
  target:'<circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" fill="#ef4444"/><circle cx="12" cy="12" r="2" fill="#fff"/>',
  star:'<path d="M12 2l3 7h7l-5 5 2 7-7-5-7 5 2-7-5-5h7z" fill="#f59e0b"/>',
  trophy:'<path d="M6 9h12v2a6 6 0 01-12 0V9z" fill="#fbbf24"/><path d="M6 9H2V6h4v3zm12 0h4V6h-4v3z" fill="#f59e0b"/><path d="M12 17v4m-4 0h8" stroke="#b45309" stroke-width="2"/>',
  crown:'<path d="M2 18h20v2H2v-2zm0-2l5-10 5 6 5-6 5 10H2z" fill="#facc15"/>',
  fist:'<path d="M6 14c0-4 4-8 8-8s8 4 8 8-2 6-6 6-6-6-10-6z" fill="#eab308"/><rect x="4" y="14" width="8" height="8" rx="2" fill="#ca8a04"/>',
  unicorn:'<path d="M6 6c0-3 2-5 5-5 1 4-1 6-3 6m0 0l-2 4m5-6c3 0 6 3 6 7 0 5-4 9-9 9s-9-4-9-9" stroke="#d946ef" stroke-width="2" fill="none"/>',
};

export const GAME_RULES = [
  { icon: '🎯', title: 'Ziel', text: 'Nach 8 Runden die beste Kombination aus Punkten und Geld erreichen.\nFormel: Punkte + (Geld ÷ 1.000) = Gesamtscore' },
  { icon: '💰', title: 'Geld vs. Punkte', text: 'Beide zählen! Punkte zeigen euren Erfolg und Reputation, Geld ist eure finanzielle Stabilität. Eine gute Balance ist entscheidend.' },
  { icon: '⚠️', title: 'Insolvenz-Regel', text: 'Bei Kapital unter 0 € erhaltet ihr 2-3 Joker-Karten zur Rettung. Diese bringen Geld, haben aber drastische Nachteile (z.B. Anteilsverlust, Punkteabzug). Max. 3 Joker pro Team!' },
  { icon: '🎲', title: 'Pfadabhängigkeit', text: 'Jede Entscheidung beeinflusst die Optionen im nächsten Jahr. Wählt strategisch!' },
];

export const JOKERS = {
  BANK: {
    title: 'Not-Kredit der Bank',
    desc: 'Ihr erhaltet 100.000 € sofort. Die Bank übernimmt strenge Aufsicht.',
    effect: '+100k € Liquidität',
    cost: '10% Zinsen (10k) pro Runde',
    amt: 100000
  },
  SHARK: {
    title: 'Aggressiver Investor',
    desc: 'Ein "Heuschrecken"-Investor schießt 100.000 € nach, übernimmt aber 60% der Anteile.',
    effect: '+100k € Liquidität',
    cost: 'Score wird am Ende um 60% gekürzt',
    amt: 100000
  }
};

export const INDUSTRIES: Record<IndustryType, {label: string, icon: string, desc: string}> = {
  TECH: { label: 'Tech Start-up', icon: '💻', desc: 'Hohes Risiko, hohe Skalierbarkeit. Fokus auf Innovation.' },
  CRAFT: { label: 'Handwerk & Manufaktur', icon: '🔨', desc: 'Solides Wachstum, hohe Qualität. Fokus auf Kundenbindung.' },
  SERVICE: { label: 'Dienstleistung', icon: '🤝', desc: 'Geringe Fixkosten, Personalintensiv. Fokus auf Vertrieb.' }
};

export const PRICES: Record<PriceStrategy, number> = {
  [PriceStrategy.SKIMMING]: 60,
  [PriceStrategy.BALANCED]: 40,
  [PriceStrategy.PENETRATION]: 20
};

// --- DYNAMIC BRANCHING CONFIGURATION ---

const commonOptions = (history: string[]) => {
  const lastChoice = history[history.length - 1] || 'A';
  // Example of path dependency:
  const suffix = ` (Pfad: ${lastChoice})`;
  
  return {
    A: { title: 'Option A', amt: -10000, pts: 10, note: 'Standard Invest' + suffix },
    B: { title: 'Option B', amt: 5000, pts: 0, note: 'Standard Sparen' + suffix },
    C: { title: 'Option C', amt: -25000, pts: 25, note: 'High Risk' + suffix },
  };
};

export const YEAR_CONFIGS: YearConfig[] = [
  {
    year: 1,
    title: 'Gründung & Positionierung',
    scenario: 'Willkommen am Markt! Die ersten Schritte sind entscheidend. Wählt eure Strategie für den Markteintritt.',
    options: () => ({
      A: { title: 'Nischenstrategie', amt: -15000, pts: 15, note: 'Spezialisierung auf High-End' },
      B: { title: 'Massenmarkt', amt: -25000, pts: 30, note: 'Aggressives Wachstum (Burn-Rate hoch)' },
      C: { title: 'Bootstrapping', amt: 0, pts: 5, note: 'Organisch wachsen, kein Risiko' },
    })
  },
  {
    year: 2,
    title: 'Erste Kunden & Iteration',
    scenario: 'Euer MVP ist am Markt. Das Feedback ist gemischt. Jetzt zeigt sich, ob ihr den Product-Market-Fit findet oder pivoten müsst.',
    options: (history) => {
      // Path Dependency Logic
      if (history[0] === 'A') { // If Niche chosen in Y1
        return {
          A: { title: 'Fokus: Nischenstrategie', amt: 25000, pts: 10, note: 'Hohe Preise durchsetzen (Gewinnmitnahme)' },
          B: { title: 'Expansion: Mehrere Marktsegmente', amt: -10000, pts: 40, note: 'Nische verlassen und skalieren' },
          C: { title: 'Risiko: Internationalisierung früh', amt: -35000, pts: 60, note: 'Alles auf eine Karte' },
        };
      }
      if (history[0] === 'B') { // If Mass Market chosen in Y1
        return {
          A: { title: 'Pivot: Geschäftsmodell ändern', amt: -30000, pts: 30, note: 'B2C zu B2B Wechsel' },
          B: { title: 'Iterate: Produkt verbessern', amt: 20000, pts: 15, note: 'Bugs fixen, Kunden halten' },
          C: { title: 'Scale: Aggressive Skalierung', amt: -40000, pts: 70, note: 'Werbebudget verdoppeln' },
        };
      }
      // Default / C (Bootstrapping)
      return {
        A: { title: 'Investor suchen', amt: 50000, pts: -10, note: 'Kapital aufnehmen (Anteile weg)' },
        B: { title: 'Partnerschaft', amt: -5000, pts: 20, note: 'Vertriebskoop mit Großunternehmen' },
        C: { title: 'Weiter Bootstrapping', amt: 5000, pts: 10, note: 'Langsam und stetig' },
      };
    }
  },
  {
    year: 3,
    title: 'Wachstumsschmerzen',
    scenario: 'Die Organisation knirscht. Prozesse fehlen, Mitarbeiter sind überlastet. Wie professionalisiert ihr euch?',
    options: (history) => ({
      A: { title: 'Management-Ebene einziehen', amt: -20000, pts: 20, note: 'Struktur schaffen' },
      B: { title: 'Kultur-Fokus', amt: -5000, pts: 10, note: 'Team-Events & Benefits' },
      C: { title: 'Tools & Automatisierung', amt: -15000, pts: 25, note: 'Effizienz steigern' },
    })
  },
  {
    year: 4,
    title: 'Konjunkturkrise',
    scenario: 'Der Markt bricht ein (-20% Nachfrage). Die Konkurrenz beginnt einen Preiskampf. Eure Liquidität wird getestet.',
    options: () => ({
      A: { title: 'Preiskampf annehmen', amt: -30000, pts: 10, note: 'Margen opfern für Marktanteil' },
      B: { title: 'Qualitätsoffensive', amt: -15000, pts: 30, note: 'Premium bleiben, Kunden halten' },
      C: { title: 'Kosten radikal senken', amt: 10000, pts: -15, note: 'Entlassungen & Sparmaßnahmen' },
    })
  },
  {
    year: 5,
    title: 'Neue Horizonte',
    scenario: 'Die Krise ist vorbei. Neue Technologien (KI, Blockchain) bieten Chancen. Seid ihr First Mover oder Fast Follower?',
    options: () => ({
      A: { title: 'Forschungslabor', amt: -50000, pts: 80, note: 'Eigene Tech entwickeln' },
      B: { title: 'Zukauf (M&A)', amt: -80000, pts: 100, note: 'Wettbewerber kaufen' },
      C: { title: 'Kooperation', amt: -10000, pts: 30, note: 'Technologie lizenzieren' },
    })
  },
  {
    year: 6,
    title: 'Das Finale: Exit oder Legacy',
    scenario: 'Das letzte Jahr. Investoren wollen Ergebnisse sehen. Bereitet ihr den Exit vor oder baut ihr ein Generationen-Unternehmen?',
    options: (history) => ({
      A: { title: 'Exit an Tech-Giganten', amt: 150000, pts: 20, note: 'Der große Cash-Out' },
      B: { title: 'Börsengang (IPO)', amt: 50000, pts: 150, note: 'Maximale Reputation' },
      C: { title: 'Hidden Champion', amt: 20000, pts: 80, note: 'Profitabel und Unabhängig' },
    })
  },
  // Fallbacks for Year 7/8 if needed, though game usually ends at 6
  {
    year: 7, title: 'Bonus Jahr', scenario: 'Zusatzrunde',
    options: () => ({ A:{title:'A',amt:0,pts:0,note:''}, B:{title:'B',amt:0,pts:0,note:''}, C:{title:'C',amt:0,pts:0,note:''} })
  },
  {
    year: 8, title: 'Bonus Jahr', scenario: 'Zusatzrunde',
    options: () => ({ A:{title:'A',amt:0,pts:0,note:''}, B:{title:'B',amt:0,pts:0,note:''}, C:{title:'C',amt:0,pts:0,note:''} })
  }
];

export const PUBLIC_CARDS: PublicCard[] = [
  {id:'IHK', title:'IHK-Anmeldung vergessen', text:'Binnen 1 Runde anmelden, sonst Strafe 2.000 € & -3 Planungs-Punkte.', amt:-2000, pts:-3},
  {id:'Liefer', title:'Lieferant ausgefallen', text:'Produktion -15%. Alternativ: Expresszuschlag zahlen.', amt:-5000, pts:0},
  {id:'Sick', title:'Grippewelle im Team', text:'-5% Produktivität. Option: 2.000 € für Leihkräfte → neutralisiert.', amt:-2000, pts:0},
  {id:'Lohn', title:'Steuernachzahlung', text:'Das Finanzamt prüft. Sofort fällig.', amt:-8000, pts:0},
  {id:'SM', title:'Viraler Hit', text:'Eure Kampagne geht durch die Decke! +20% Umsatz.', amt:15000, pts:10},
  {id:'Patent', title:'Patentstreit', text:'Anwaltskosten 7.500 € oder Produkt stoppen.', amt:-7500, pts:0},
  {id:'Prize', title:'Gründerpreis gewonnen', text:'Bekanntheit +10, Preisgeld 10.000 €.', amt:10000, pts:20},
  {id:'Cyber', title:'Ransomware Angriff', text:'Daten verschlüsselt. Lösegeld oder Backup (kostet Zeit).', amt:-10000, pts:-5},
];

export const SECRET_CARDS: SecretCard[] = [
  {id:'S-A', title:'Bewerbung zum Wettbewerb', text:'50% Gewinnchance: +10.000 € / sonst -2.000 €.'},
  {id:'S-B', title:'Private Geldprobleme', text:'Spieler braucht Darlehen (5k). Gibst du es? (Loyalität vs Geld)'},
  {id:'S-F', title:'Insider-Tipp', text:'Du weißt von einer Förderung. Teilst du das Wissen (+10k Team) oder behältst du es (-5 Pkt)?'},
  {id:'S-L', title:'Sabotage', text:'Spiele dies auf ein anderes Team. Kostet sie 10.000 €. Wenn entdeckt: Strafe!'},
  {id:'S-I', title:'Business Angel', text:'Bietet 20.000 € für 10% Anteile. (Sofort Cash, weniger Score am Ende)'},
];

export const SECRET_EXPLAIN: Record<string, SecretExplain> = {
  'S-A': {desc:'Risiko-Entscheidung', effect:'Win/Loss', tip:'Lass sie würfeln.'},
  'S-B': {desc:'Führungstest', effect:'Geld gegen Moral', tip:'Beobachte die Diskussion.'},
  'S-F': {desc:'Teamplayer Test', effect:'Teilen belohnen', tip:'Kommunikation fördern.'},
  'S-L': {desc:'Angriff', effect:'Gegner schaden', tip:'Nur in kompetitiven Gruppen.'},
  'S-I': {desc:'Finanzspritze', effect:'Liquidität jetzt, Kosten später', tip:'Gut bei Geldnot.'},
};

export const SECRET_EFFECTS: Record<string, SecretEffectConfig> = {
  'S-A': { options:[
    {label:'Wagen (50/50)', type:'random', success:{amt:10000,pts:5,log:'Wettbewerb gewonnen!'}, fail:{amt:-2000,pts:0,log:'Wettbewerb verloren.'}},
  ]},
  'S-B': { options:[
    {label:'Darlehen geben', type:'grant', amt:-5000, pts:5, log:'Darlehen gewährt (Loyalität +)'},
    {label:'Ablehnen', type:'none', amt:0, pts:-2, log:'Abgelehnt (Moral -)'},
  ]},
  'S-F': { options:[
    {label:'Teilen', type:'shared', amt:10000, pts:5, log:'Förderung genutzt'},
    {label:'Behalten', type:'hoarded', amt:0, pts:-5, log:'Team geschädigt'},
  ]},
  'S-L': { options:[
    {label:'Sabotage ausführen', type:'success_target', target:true, amtTarget:-10000, ptsTarget:0, log:'wurde sabotiert!'},
  ]},
  'S-I': { options:[
    {label:'Annehmen', type:'accept', amt:20000, pts:-10, log:'Angel Investoren an Bord'},
    {label:'Ablehnen', type:'decline', amt:0, pts:0, log:'Kein Deal'},
  ]},
};
