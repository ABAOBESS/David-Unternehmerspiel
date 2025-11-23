import { Team, GameState } from '../types';
import { ICONS } from '../constants';

export const uid = () => Math.random().toString(36).slice(2, 9);

export const formatCurrency = (val: number) => 
  (val || 0).toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';

export const getInitialState = (): GameState => ({
  year: 1,
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
      secretActions: [],
      icon: iconKeys[(i - 1) % iconKeys.length]
    });
  }
  return teams;
};
