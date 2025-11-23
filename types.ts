export interface Team {
  id: string;
  name: string;
  capital: number;
  points: number;
  icon: string;
  secretActions: SecretActionEntry[];
  investorFlag?: boolean;
  // Optional properties to support AppTeamView if needed
  currentDecisions?: RoundDecisions;
  isReady?: boolean;
  state?: {
      capital: number;
      innovation: number;
      awareness: number;
      employees: number;
      history: RoundResult[];
  };
  playerCount?: number;
}

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
  option: 'A' | 'B' | 'C';
  amt: number;
  pts: number;
  note: string;
}

export interface GameState {
  year: number;
  teams: Team[];
  assignments: Assignment[];
  round?: number; // Added for compatibility with AppTeamView usage
  isGameOver?: boolean;
  currentEvent?: GameEvent;
}

// Configuration Types from Constants
export interface YearOption {
  amt: number;
  pts: number;
  note: string;
}

export interface YearConfig {
  year: number;
  title: string;
  A: YearOption;
  B: YearOption;
  C: YearOption;
}

export interface StoryConfig {
  title: string;
  story: string;
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

// --- New Types Added to Fix Errors ---

export enum PriceStrategy {
  LOW = 'Niedrig',
  MEDIUM = 'Mittel',
  HIGH = 'Hoch'
}

export interface RoundDecisions {
  productInvest: number;
  marketingInvest: number;
  coopInvest: boolean;
  hiringDelta: number;
  priceStrategy: PriceStrategy;
  plannedSales: number;
  submitted: boolean;
}

export interface GameEvent {
  title: string;
  description: string;
  marketMultiplier: number;
  costMultiplier: number;
}

export interface RoundResult {
  round: number;
  event: GameEvent;
  decisions: RoundDecisions;
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  productCost: number;
  marketingCost: number;
  coopCost: number;
  profit: number;
  cumulativeCapital: number;
  sales: number;
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
