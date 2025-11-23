import { PublicCard, SecretCard, SecretExplain, YearConfig, SecretEffectConfig, StoryConfig, PriceStrategy } from "./types";

export const ICONS: Record<string, string> = {
  gear:'<path d="M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="#22d3ee" stroke-width="2"/><path d="M4 12h3M17 12h3M12 4v3M12 17v3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>',
  bolt:'<path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" fill="#facc15"/>',
  leaf:'<path d="M3 12C3 6 9 3 21 3c0 12-3 18-9 18-6 0-9-6-9-9z" fill="#22c55e"/><path d="M9 14c2-2 6-5 12-7" stroke="#14532d" stroke-width="2"/>',
  rocket:'<path d="M12 2c4 2 6 6 6 10v2l-6 6-6-6v-2C6 8 8 4 12 2z" fill="#60a5fa"/><path d="M12 9a2 2 0 110 4 2 2 0 010-4z" fill="#1e3a8a"/>',
  building:'<rect x="4" y="3" width="16" height="18" rx="2" fill="#94a3b8"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="#0f172a" stroke-width="2"/>',
  bridge:'<path d="M3 18h18M3 18c3-6 6-6 9 0 3-6 6-6 9 0" stroke="#f97316" stroke-width="2" fill="none"/><path d="M3 18v3M12 18v3M21 18v3" stroke="#f97316" stroke-width="2"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z" fill="#64748b"/><path d="M8 12l2 2 4-4" stroke="#22c55e" stroke-width="2" fill="none"/>',
  globe:'<circle cx="12" cy="12" r="9" stroke="#22d3ee" stroke-width="2" fill="none"/><path d="M3 12h18M12 3c3 3 3 15 0 18-3-3-3-15 0-18z" stroke="#22d3ee" stroke-width="2"/>',
  bulb:'<path d="M9 17h6v2a3 3 0 01-6 0v-2z" fill="#fde047"/><path d="M12 3a6 6 0 00-3 11v3h6v-3a6 6 0 00-3-11z" fill="#f59e0b"/>',
  chip:'<rect x="6" y="6" width="12" height="12" rx="2" fill="#38bdf8"/><path d="M12 6V3M12 21v-3M6 12H3M21 12h-3" stroke="#0c4a6e" stroke-width="2"/>',
  drop:'<path d="M12 2c6 6 8 9 8 12a8 8 0 11-16 0c0-3 2-6 8-12z" fill="#60a5fa"/>',
  hammer:'<path d="M3 10l6-6 3 3-1 1 2 2 2-2 3 3-6 6" stroke="#eab308" stroke-width="2" fill="none"/><path d="M7 14l-4 4 3 3 4-4" fill="#eab308"/>',
};

export const PUBLIC_CARDS: PublicCard[] = [
  {id:'IHK', title:'IHK-Anmeldung vergessen', text:'Binnen 1 Runde anmelden, sonst Strafe 2.000 € & -3 Planungs-Punkte.', amt:-2000, pts:-3},
  {id:'Liefer', title:'Lieferant ausgefallen', text:'Produktion -15% (mit Kooperation -5%). Trage manuell die Auswirkung ein.', amt:0, pts:0},
  {id:'Sick', title:'Mitarbeiter krank/Urlaub', text:'-5% Produktivität. Option: 2.000 € für Leihkräfte → neutralisiert.', amt:0, pts:0},
  {id:'Lohn', title:'Lohnpfändung', text:'5.000 € Darlehen? Ja: +2 Punkte (Loyalität), Kapital -5.000. Nein: -3 Punkte.', amt:-5000, pts:+2},
  {id:'Tax', title:'Steuerprüfung', text:'Keine Unterlagen → Strafe 3.000 € (sonst 0).', amt:-3000, pts:0},
  {id:'SM', title:'Social-Media-Skandal', text:'-10% Absatz & -2 Gesellschaft. 5.000 € Krisen-PR → neutralisiert.', amt:0, pts:-2},
  {id:'Patent', title:'Patentstreit', text:'Anwaltskosten 7.500 € oder Produkt stoppen (-10% Absatz).', amt:-7500, pts:0},
  {id:'Investor', title:'Investor-DD', text:'2.000 € DD → bei Exit +10.000 €. (Merker setzen)', amt:-2000, pts:0},
  {id:'Fire', title:'Feuer im Lager', text:'Bestand -8.000 € (Versicherung je nach Schutz).', amt:-8000, pts:0},
  {id:'Prize', title:'Gründerpreis', text:'Bekanntheit +10, Umsatz +5%.', amt:0, pts:+10},
  {id:'Cyber', title:'Cyber-Angriff', text:'Compliance 5.000 € oder -5 Punkte & -10% Vertrauen.', amt:-5000, pts:0},
  {id:'Client', title:'Großkunde kündigt', text:'Umsatz -20% (mit >4 Vertrieblern -10%).', amt:0, pts:0},
];

export const SECRET_CARDS: SecretCard[] = [
  {id:'S-A', title:'Bewerbung zum Wettbewerb', text:'50% Gewinnchance: +10.000 € / sonst -2.000 €.'},
  {id:'S-B', title:'Lohnpfändung (persönlich)', text:'Leihe 5.000 € vom Team (+2 Punkte), Entdeckung: -10.000 €.'},
  {id:'S-C', title:'Krankmeldung fälschen', text:'Wenn entdeckt: -2.000 € & -3 Punkte.'},
  {id:'S-D', title:'Bewerbung bei Konkurrent', text:'Wenn angenommen: -2.000 € Kosten & -2 Punkte.'},
  {id:'S-E', title:'Bestechung', text:'Annahme: kein Teameffekt. Entdeckt: -8.000 € Bußgeld.'},
  {id:'S-F', title:'Insider-Tipp', text:'Team teilen: +10.000 €. Horten: -5 Punkte.'},
  {id:'S-G', title:'Familien-Notfall', text:'Nicht ersetzt: -5.000 € Effekt. Ersetzen: -5.000 € Einstellung.'},
  {id:'S-H', title:'Whistleblower', text:'Melden: Team -10.000 €, +5 Gesellschaft.'},
  {id:'S-I', title:'Investor (geheim)', text:'+10.000 € jetzt, Exit später -20% (Merker).'},
  {id:'S-J', title:'Urlaub wollen', text:'Bonus 3.000 € zahlen oder -2 Punkte.'},
  {id:'S-K', title:'Loyaler Angestellter', text:'+3 Nachhaltigkeitspunkte.'},
  {id:'S-L', title:'Sabotage (simuliert)', text:'Erfolg: Zielteam -10.000 €. Entdeckt: -15.000 € & -5 Punkte.'},
];

export const SECRET_EXPLAIN: Record<string, SecretExplain> = {
  'S-A': {desc:'Spieler reicht heimlich eine Wettbewerbseinreichung ein.', effect:'Bei Erfolg +10.000 € fürs Team, bei Misserfolg -2.000 €.', tip:'Zieh die Karte in Wachstumsphasen. Lass 50/50 oder entscheide situationsbezogen.'},
  'S-B': {desc:'Privates Finanzproblem; bittet um Darlehen.', effect:'Darlehen: -5.000 €, +2 Loyalität. Veruntreuung entdeckt: -10.000 €.', tip:'Test für Kultur. Frage: Wie helft ihr fair & verantwortlich?'},
  'S-C': {desc:'Simulierte Krankmeldung.', effect:'Entdeckt: -2.000 € & -3 Gesellschaftspunkte.', tip:'Setzen, wenn Führung zu hart ist. Diskutiere Prozesse statt Personen.'},
  'S-D': {desc:'Wechsel zum Konkurrent möglich.', effect:'Angenommen: -2.000 € & -2 Punkte.', tip:'Bindung/Retention diskutieren.'},
  'S-E': {desc:'Lieferant bietet Bestechung.', effect:'Nicht entdeckt: kein Effekt. Entdeckt: -8.000 €.', tip:'Compliance & Whistleblowing thematisieren.'},
  'S-F': {desc:'Insider-Info Förderung.', effect:'Teilen: +10.000 €. Horten: -5 Punkte.', tip:'Wissensteilung incentivieren.'},
  'S-G': {desc:'Familiennotfall: 2 Runden Ausfall.', effect:'Nicht ersetzt: -5.000 €. Ersatz: -5.000 €.', tip:'Personalplanung & Backups.'},
  'S-H': {desc:'Melden eines Verstoßes.', effect:'Melden: -10.000 €, +5 Gesellschaft.', tip:'Fehlerkultur ansprechen.'},
  'S-I': {desc:'Investor mit Bedingungen.', effect:'+10.000 € jetzt; Exit -20 % (Merker).', tip:'Governance besprechen, vor Jahr 8 setzen.'},
  'S-J': {desc:'Urlaub/Boni-Konflikt.', effect:'Bonus zahlen: -3.000 €. Verweigern: -2 Punkte.', tip:'Mitarbeiterbindung vs. Kosten.'},
  'S-K': {desc:'Mitarbeiter investiert privat.', effect:'+3 Nachhaltigkeit.', tip:'Belohnung bei echter Strategie.'},
  'S-L': {desc:'Fiktive Sabotage.', effect:'Erfolg: Ziel -10.000 €. Entdeckt: -15.000 € & -5 Punkte.', tip:'Nur bei klaren Regeln einsetzen.'},
};

export const YEARS: YearConfig[] = [
  {year:1, title:'Gründung & Strategie', A:{amt:-10000, pts:+5, note:'Premiumqualität & Marke'}, B:{amt:+5000, pts:+5, note:'Kostenführerschaft'}, C:{amt:-5000, pts:0, note:'Unklare Strategie'}},
  {year:2, title:'Produktentwicklung', A:{amt:-20000, pts:+10, note:'F&E investieren'}, B:{amt:0, pts:0, note:'Produkt beibehalten'}, C:{amt:-10000, pts:-5, note:'Billigvariante'}},
  {year:3, title:'Markt & Vertrieb', A:{amt:-15000, pts:+5, note:'Starkes Marketing'}, B:{amt:-10000, pts:+5, note:'Vertrieb ausbauen'}, C:{amt:0, pts:-2, note:'Sparmodus (-Absatz)'}},
  {year:4, title:'Krise am Markt', A:{amt:+10000, pts:-5, note:'Kosten senken (Qualitätsverlust)'}, B:{amt:-15000, pts:+10, note:'Effizienz investieren (langfristig +)'}, C:{amt:-10000, pts:0, note:'Nichts ändern (Verlust)'}},
  {year:5, title:'Expansion & Digitalisierung', A:{amt:-20000, pts:+10, note:'Digitalstrategie (+10k Zukunft)'}, B:{amt:-10000, pts:+5, note:'Kooperation (+5k Zukunft)'}, C:{amt:0, pts:0, note:'Beim Alten bleiben (-5k)'}},
  {year:6, title:'Fachkräftemangel & Wachstum', A:{amt:-15000, pts:+5, note:'Löhne erhöhen (+Prod.)'}, B:{amt:+10000, pts:-5, note:'Outsourcing'}, C:{amt:-5000, pts:0, note:'Nichts ändern (-Prod.)'}},
  {year:7, title:'Nachhaltigkeit & Image', A:{amt:-20000, pts:+10, note:'Nachhaltig investieren'}, B:{amt:-5000, pts:+3, note:'Greenwashing (+3 / -3 ethic)'}, C:{amt:0, pts:-3, note:'Kein Fokus'}},
  {year:8, title:'Exit oder Weiterführung', A:{amt:+20000, pts:+5, note:'Exit (Cash +)'}, B:{amt:-10000, pts:+10, note:'Skalieren & expandieren'}, C:{amt:+5000, pts:+3, note:'Konsolidieren'}},
];

export const ABC_STORY: Record<number, {A:StoryConfig, B:StoryConfig, C:StoryConfig}> = {
  1: {
    A: {title:'Premium & Marke', story:'Ihr entscheidet euch für eine hochwertige Positionierung. Ihr investiert bewusst in Material, Prozesse und konsequentes Branding – in der Hoffnung, Preissetzungsmacht und Loyalität aufzubauen. Kurzfristig drückt das auf die Liquidität; mittel-/langfristig soll die Marge tragen.'},
    B: {title:'Kostenführerschaft', story:'Ihr commitet euch auf Effizienz, Standardisierung und große Lose. Alles wird auf Durchsatz und Stückkosten optimiert, „Variantenliebe“ wird abgewöhnt. Klare Governance ist nötig, sonst franst es aus.'},
    C: {title:'Strategie vertagt', story:'Ihr bleibt opportunistisch und verschiebt die klare Positionierung. Das erhält Handlungsfreiheit, kostet aber Fokus, Story und Priorisierung. Gefahr: ihr seid weder günstig noch besonders.'},
  },
  2: {
    A: {title:'F&E-Schub', story:'Ihr finanziert einen Entwicklungs‑Sprint: Prototypen, Tests, Patente. Heute weniger Ertrag für die Wette auf ein überlegenes Produkt in 12–24 Monaten. Wer trägt Product-Owner, und wie killt ihr Ideen schnell, die nicht tragen?'},
    B: {title:'Produkt stabil halten', story:'Ihr fokussiert Betriebssicherheit: Lieferkette stabil, Qualitätskosten runter, keine Ablenkung. Das Team arbeitet sauber an der Basis und schafft Lernroutinen. Gefahr: Markt läuft euch davon.'},
    C: {title:'Billigvariante', story:'Ihr bringt eine kostengünstige Light‑Version. Damit erschließt ihr preisgetriebene Segmente, riskiert aber Support‑Overhead und Markenverdünnung. Wie schützt ihr euer Kernprodukt vor Kannibalisierung?'},
  },
  3: {
    A: {title:'Marketing-Offensive', story:'Ihr kauft Reichweite: Kampagnen, PR, Events. Ziel ist Aufmerksamkeit, Vertrauen und Preissetzungsmacht. Ohne „Full‑funnel“ und Sales‑Followup verbrennt Budget. Welche Hypothesen testet ihr mit klaren KPIs?'},
    B: {title:'Vertriebsausbau', story:'Ihr skaliert Sales-Coverage: mehr Hunter, klare Prozesse, Coaching. Fokus auf Abschlussquote, Deal‑Velocity und Forecast‑Hygiene. Achtung: falsche Incentives erzeugen Rabattschlachten.'},
    C: {title:'Sparmodus', story:'Ihr fahrt sichtbar auf Verschleiß: Marketing runter, Neueinstellungen gestoppt, Pipeline schrumpft. Das rettet Cash, kostet aber Momentum. Definiert Exit‑Kriterien, um nicht zu lange zu sparen.'},
  },
  4: {
    A: {title:'Kostenbremse', story:'Ihr schneidet alles Nicht‑Essenzielle. Das stabilisiert die Kennzahlen schnell, kann aber Qualität und Moral beschädigen. Wie schützt ihr Kundenerlebnis und Kernkompetenzen?'},
    B: {title:'Effizienz-Invest', story:'Ihr nutzt die Krise zum Umbau: Automatisierung, Durchlaufzeit, Lieferantenmix. Kurzfristig zäh, später fliegt die Fabrik. Welche Bottlenecks adressiert ihr zuerst?'},
    C: {title:'Aussitzen', story:'Ihr bleibt auf Kurs und nehmt Verluste in Kauf. Das schont Fokus und verhindert Fehlprojekte, riskiert aber Marktanteile. Plant Gateways, um bei Verschärfung zu wechseln.'},
  },
  5: {
    A: {title:'Digital sprengen', story:'Ihr baut die Digital‑Backbone: Self‑Service, Analytics, Automatisierung, ggf. Abo. Heute Capex & Change‑Schmerz; morgen Skalierhebel und Datenvorteil. Achtet auf Adoption – Technik ohne Nutzung bringt nichts.'},
    B: {title:'Kooperieren', story:'Ihr hebelt Partner: Reseller, Bundles, Co‑Marketing. Das verkürzt Time‑to‑Market, schafft aber Abhängigkeiten und teilt Marge. Governance & klare SLAs sind Pflicht.'},
    C: {title:'Weiter wie bisher', story:'Ihr priorisiert Stabilität und Ertrag jetzt. In dynamischen Märkten droht Pfadabhängigkeit. Welche Frühindikatoren zwingen euch trotzdem zum Kurswechsel?'},
  },
  6: {
    A: {title:'Löhne rauf, Team binden', story:'Ihr steigert Attraktivität: Vergütung, Weiterbildungen, Karrierestufen. Das erhöht Kosten, aber auch Bindung und Output je Kopf. Achtet auf saubere Wirkungsmessung, sonst versandet es.'},
    B: {title:'Outsourcing', story:'Ihr verlagert Tätigkeiten an Spezialisten. Kurzfristig spart ihr Fixkosten, langfristig droht Wissensverlust und Vendor‑Lock‑in. Wie haltet ihr Architektur & Schnittstellen im Griff?'},
    C: {title:'Keine Änderung', story:'Ihr akzeptiert Knappheit und priorisiert hart. Das schützt Cash, erzeugt aber Staus. Welche Aufträge/Features lasst ihr bewusst liegen – und wie kommuniziert ihr das?'},
  },
  7: {
    A: {title:'Nachhaltig investieren', story:'Ihr geht Substanz an: Energieeffizienz, Kreislauf, Lieferanten‑Audits. Das stärkt Marke, Ausschreibungsfähigkeit und Finanzierung. Achtet auf realistische Roadmap und Messbarkeit (CO₂, Abfall, ESG‑Score).'},
    B: {title:'Greenwashing light', story:'Ihr investiert hauptsächlich in Kommunikation. Das kann kurz wirken, kippt aber bei Nachfragen. Wie verhindert ihr Reputationsschäden?'},
    C: {title:'Kein Fokus', story:'Ihr setzt ESG bewusst hinten an, um Kernziele zu liefern. Achtung: Banken/Kunden könnten euch später ausschließen. Definiert Mindeststandards.'},
  },
  8: {
    A: {title:'Exit', story:'Ihr richtet die Firma auf Verkaufsfähigkeit aus: wiederkehrende Umsätze, schlanke KPIs, Due‑Diligence‑Readiness. Das kann Fokus verschieben und Innovation bremsen, bringt aber Liquidität und Risikoabbau.'},
    B: {title:'Skalieren & expandieren', story:'Ihr verdoppelt die Ambition: neue Märkte/Segmente, Kapazität rauf, ggf. M&A. Kapitalbindung & Komplexität steigen. Wie schützt ihr Qualität & Kultur?'},
    C: {title:'Konsolidieren', story:'Ihr optimiert Cash & Prozesse, macht Proof‑of‑Profitability. Das erhöht Stabilität und Verhandlungsmacht für spätere Schritte, kann aber Chancen kosten. Legt klare Schwellen für erneutes Wachstum fest.'},
  }
};

export const YEAR_SCENARIO: Record<number, {title:string, text:string}> = {
  1: {title:'Gründung & strategische Positionierung', text:'Ihr seid frisch am Start. Markt ist fragmentiert, Konkurrenz schläft nicht. Ressourcen sind knapp – jede Entscheidung hat Opportunitätskosten. Es geht um eure Grundhaltung: Differenzierung, Kostenfokus oder erstmal Suchbewegung?'},
  2: {title:'Produktreife & technische Kante', text:'Der Proof-of-Concept ist da, aber Kundenerwartungen steigen. Feature‑Requests prasseln rein, Patente/Standards werden relevant. Eure Wahl bestimmt Tempo vs. Substanz.'},
  3: {title:'Marktbearbeitung & Nachfrageaufbau', text:'Jetzt entscheidet sich, ob ihr die Pipeline füllt. Sichtbarkeit vs. Abschlussstärke – und wer wie eng mit Produkt/Delivery zusammenarbeitet, um Learnings schnell zu drehen.'},
  4: {title:'Externe Delle / Marktkrise', text:'Ein negativer Schlag trifft den Markt (Nachfrage sinkt, Preise wanken). Ihr müsst entscheiden: kurzfristig Kosten sägen, gezielt investieren oder Kurs halten – jede Variante hat Nebenwirkungen.'},
  5: {title:'Skalierung durch Digitalisierung/Partnerschaften', text:'Ihr könnt Effizienz und Reichweite massiv hebeln – digital, prozessual, mit Partnern. Gleichzeitig drohen Abhängigkeiten und Change‑Schmerzen im Team.'},
  6: {title:'Talente & Kapazität', text:'Aufträge wachsen, aber Skills & Köpfe sind knapp. Ihr müsst die Belegschaft stärken, zukaufen oder radikal priorisieren – jeweils mit kulturellen und finanziellen Konsequenzen.'},
  7: {title:'Nachhaltigkeit & Legitimität', text:'Kunden, Bewerber und Finanzierer achten auf echte Nachhaltigkeit. Green Claims ohne Substanz fliegen euch um die Ohren. Wie baut ihr Glaubwürdigkeit auf?'},
  8: {title:'Weichenstellung: Exit vs. Weiterwachsen', text:'Ihr habt Substanz, aber begrenzte Zeit & Energie. Jetzt gilt es, Wert zu realisieren oder bewusst weiter zu akkumulieren – Governance, KPIs und Team‑Story müssen passen.'}
};

export const SECRET_EFFECTS: Record<string, SecretEffectConfig> = {
  'S-A': { options:[
    {label:'Zufall 50/50', type:'random', success:{amt:+10000,pts:0,log:'Wettbewerb gewonnen'}, fail:{amt:-2000,pts:0,log:'Wettbewerb verloren'}},
    {label:'Erfolg', type:'success', amt:+10000, pts:0, log:'Wettbewerb gewonnen'},
    {label:'Fehlschlag', type:'fail', amt:-2000, pts:0, log:'Wettbewerb verloren'},
  ]},
  'S-B': { options:[
    {label:'Darlehen gewähren', type:'grant', amt:-5000, pts:+2, log:'Darlehen gewährt (+Loyalität)'},
    {label:'Entdeckt (Veruntreuung)', type:'discovered', amt:-10000, pts:0, log:'Veruntreuung entdeckt'},
  ]},
  'S-C': { options:[
    {label:'Entdeckt', type:'discovered', amt:-2000, pts:-3, log:'Gefälschte Krankmeldung entdeckt'},
    {label:'Ignorieren (kein Effekt)', type:'ignore', amt:0, pts:0, log:'Keine Auswirkung'},
  ]},
  'S-D': { options:[
    {label:'Angenommen', type:'accepted', amt:-2000, pts:-2, log:'Mitarbeiter verließ Team (Recruit-Kosten)'},
    {label:'Kein Angebot/bleibt', type:'none', amt:0, pts:0, log:'Bewerbung folgenlos'},
  ]},
  'S-E': { options:[
    {label:'Angenommen (nicht entdeckt)', type:'accepted', amt:0, pts:0, log:'Bestechung intern — kein Teameffekt'},
    {label:'Entdeckt', type:'discovered', amt:-8000, pts:0, log:'Bestechung entdeckt — Bußgeld'},
  ]},
  'S-F': { options:[
    {label:'Insider geteilt', type:'shared', amt:+10000, pts:0, log:'Förderung genutzt (Insider geteilt)'},
    {label:'Gehortet', type:'hoarded', amt:0, pts:-5, log:'Insiderwissen gehortet — Team verärgert'},
  ]},
  'S-G': { options:[
    {label:'Nicht ersetzt', type:'not_replaced', amt:-5000, pts:0, log:'Ausfall wirkt sich aus'},
    {label:'Ersatz eingestellt', type:'replaced', amt:-5000, pts:0, log:'Ersatzkosten getragen'},
  ]},
  'S-H': { options:[
    {label:'Melden', type:'reported', amt:-10000, pts:+5, log:'Whistleblower meldete Verstoß'},
    {label:'Still halten', type:'silent', amt:0, pts:0, log:'Keine Auswirkung'},
  ]},
  'S-I': { options:[
    {label:'Investor akzeptiert', type:'accept', amt:+10000, pts:0, log:'Investor an Bord (Merker: Exit -20%)', flag:'investor'},
    {label:'Investor abgelehnt', type:'decline', amt:0, pts:0, log:'Investor abgelehnt'},
  ]},
  'S-J': { options:[
    {label:'Bonus zahlen', type:'bonus', amt:-3000, pts:0, log:'Urlaubsbonus gezahlt'},
    {label:'Bonus verweigern', type:'deny', amt:0, pts:-2, log:'Urlaub verweigert — Unzufriedenheit'},
  ]},
  'S-K': { options:[
    {label:'Loyalitätspaket', type:'loyal', amt:0, pts:+3, log:'Mitarbeiter investiert privat — Nachhaltigkeit +3'},
  ]},
  'S-L': { options:[
    {label:'Erfolg (Zielteam -10.000 €)', type:'success_target', target:true, amtTarget:-10000, ptsTarget:0, log:'Sabotage geglückt'},
    {label:'Entdeckt', type:'discovered', amt:-15000, pts:-5, log:'Sabotage entdeckt — Strafe'},
  ]},
};

export const PRICES: Record<PriceStrategy, number> = {
  [PriceStrategy.LOW]: 30,
  [PriceStrategy.MEDIUM]: 50,
  [PriceStrategy.HIGH]: 80,
};
