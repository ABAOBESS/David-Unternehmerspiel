import { Team, GameState, YearConfig, IndustryType } from '../types';
import { ICONS, YEAR_CONFIGS, JOKERS } from '../constants';

export const uid = () => Math.random().toString(36).slice(2, 9);

export const formatCurrency = (val: number) => 
  (val || 0).toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';

export const getInitialState = (): GameState => ({
  year: 1, // Start at Year 1 conceptually, but Year 0 logic handled in UI
  teams: [],
  assignments: []
});

export const createInitialTeams = (count: number = 5): Team[] => {
  const teams: Team[] = [];
  const iconKeys = Object.keys(ICONS);
  for (let i = 1; i <= count; i++) {
    teams.push({
      id: uid(),
      name: 'Team ' + i,
      capital: 100000,
      points: 0,
      history: [],
      secretActions: [],
      icon: iconKeys[(i - 1) % iconKeys.length]
    });
  }
  return teams;
};

export const getOptionsForTeam = (year: number, team: Team) => {
  const config = YEAR_CONFIGS.find(y => y.year === year);
  if (!config) return null;
  return config.options(team.history || []);
};

export const calculateScore = (team: Team) => {
  // Score formula: Points + (Capital / 1000)
  // If Shark Joker active: -60% total
  let score = team.points + Math.floor(team.capital / 1000);
  
  if (team.jokerActive === 'SHARK') {
    score = Math.floor(score * 0.4); // Lose 60%
  }
  
  return score;
};
