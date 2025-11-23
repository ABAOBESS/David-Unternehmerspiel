export interface Team {
  id: string;
  name: string;
  capital: number;
  points: number;
  icon: string;
  secretActions: SecretActionEntry[];
  
  // New Mechanics
  industry?: IndustryType;
  history: string[]; // Array of 'A'|'B'|'C' choices per year
  jokerActive?: 'BANK' | 'SHARK';
  
  // Client State
  currentDecisions?: RoundDecisions; 
  isReady?: boolean;
  selectedOption?: 'A' | 'B' | 'C'; // The option they clicked on their device

  // Extended State for AppTeamView
  state?: {
    history: RoundResult[];
    innovation: number;
    awareness: number;
    employees: number;
    capital: number;
  };
  playerCount?: number;
}

export type IndustryType = 'TECH' | 'CRAFT' | 'SERVICE';

export interface SecretActionEntry {
  id: string;
  teamId: string;
  player: string;
  cardId: string;
  title: string;
  text: string;
  status: 'open' | 'closed';
  ts: number;
}

export interface Assignment {
  id: string;
  ts: number;
  year: number;
  teamId: string;
  teamName: string;
  option: string;
  amt: number;
  pts: number;
  note: string;
}

export interface GameState {
  year: number;
  teams: Team[];
  assignments: Assignment[];
  // Extended state
  round?: number;
  currentEvent?: GameEvent;
  isGameOver?: boolean;
}

// Configuration Types
export interface YearOption {
  title: string; // Added title for card display
  amt: number;
  pts: number;
  note: string;
  id?: string; // For branching reference
}

export interface YearConfig {
  year: number;
  title: string;
  scenario: string;
  // Dynamic options based on previous path
  options: (history: string[]) => { A: YearOption, B: YearOption, C: YearOption };
}

export interface PublicCard {
  id: string;
  title: string;
  text: string;
  amt: number;
  pts: number;
}

export interface SecretCard {
  id: string;
  title: string;
  text: string;
}

export interface SecretExplain {
  desc: string;
  effect: string;
  tip: string;
}

export interface SecretEffectOption {
  label: string;
  type: 'random' | 'success' | 'fail' | 'grant' | 'discovered' | 'ignore' | 'accepted' | 'none' | 'shared' | 'hoarded' | 'not_replaced' | 'replaced' | 'reported' | 'silent' | 'accept' | 'decline' | 'bonus' | 'deny' | 'loyal' | 'success_target';
  amt?: number;
  pts?: number;
  log?: string;
  success?: { amt: number; pts: number; log: string };
  fail?: { amt: number; pts: number; log: string };
  target?: boolean;
  amtTarget?: number;
  ptsTarget?: number;
  flag?: string;
}

export interface SecretEffectConfig {
  options: SecretEffectOption[];
}

// --- Extended Types for AI and Detailed Views ---

export enum PriceStrategy {
  SKIMMING = 'SKIMMING',
  PENETRATION = 'PENETRATION',
  BALANCED = 'BALANCED'
}

export interface RoundDecisions {
  submitted: boolean;
  productInvest: number;
  marketingInvest: number;
  coopInvest: boolean;
  hiringDelta: number;
  priceStrategy: PriceStrategy;
  plannedSales: number;
}

export interface GameEvent {
  id?: string;
  title: string;
  description: string;
  marketMultiplier: number;
  costMultiplier: number;
}

export interface RoundResult {
  round: number;
  event: GameEvent;
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  productCost: number;
  marketingCost: number;
  coopCost: number;
  profit: number;
  cumulativeCapital: number;
  sales: number;
  decisions: RoundDecisions;
  innovationLevel: number;
  awarenessLevel: number;
  totalScore: number;
  scoreFinancial: number;
  scoreInnovation: number;
  scoreEmployees: number;
  scorePlanning: number;
}

export interface AIAdvice {
  analysis: string;
  tips: string[];
}
