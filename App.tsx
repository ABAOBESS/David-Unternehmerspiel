import React, { useState, useEffect } from 'react';
import { GameState, Team, Assignment, SecretEffectOption } from './types';
import { getInitialState, uid, createInitialTeams } from './services/gameLogic';
import { YEARS, PUBLIC_CARDS, SECRET_CARDS, SECRET_EFFECTS } from './constants';

import PublicDashboard from './components/PublicDashboard';
import AdminDashboard from './components/AdminDashboard';
import ClosingDashboard from './components/ClosingDashboard';
import TeamClientView from './components/TeamClientView';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [activeTab, setActiveTab] = useState<'anzeige'|'leitung'|'abschluss'>('anzeige');
  
  // Navigation State for pre-filling Closing tab
  const [closingYear, setClosingYear] = useState<number | undefined>(undefined);
  const [closingOption, setClosingOption] = useState<string | undefined>(undefined);

  // Client View State
  const [clientTeamId, setClientTeamId] = useState<string | null>(null);

  // --- Persistence ---
  useEffect(() => {
    // Check URL params for team ID (Player View)
    const params = new URLSearchParams(window.location.search);
    const teamId = params.get('team');
    if (teamId) {
      setClientTeamId(teamId);
    }

    const saved = localStorage.getItem('es8_state_v5');
    if (saved) {
      setGameState(JSON.parse(saved));
    } else {
      const initial = getInitialState();
      initial.teams = createInitialTeams(5);
      setGameState(initial);
      localStorage.setItem('es8_state_v5', JSON.stringify(initial));
    }
  }, []);

  const save = (newState: GameState) => {
    setGameState(newState);
    localStorage.setItem('es8_state_v5', JSON.stringify(newState));
  };

  // --- Actions ---

  const handleUpdateTeam = (updatedTeam: Team) => {
    const teams = gameState.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    save({ ...gameState, teams });
  };

  const handleAddTeam = (name: string, icon: string, capital: number) => {
    const newTeam: Team = {
        id: uid(),
        name,
        icon,
        capital,
        points: 0,
        secretActions: []
    };
    save({ ...gameState, teams: [...gameState.teams, newTeam] });
  };

  const handleDeleteTeam = (id: string) => {
    save({ ...gameState, teams: gameState.teams.filter(t => t.id !== id) });
  };

  const handleSetAllCapital = (amt: number) => {
    save({ ...gameState, teams: gameState.teams.map(t => ({...t, capital: amt})) });
  };

  const handleReset = () => {
    const fresh = getInitialState();
    fresh.teams = createInitialTeams(5); // Default reset to 5 teams
    save(fresh);
    setActiveTab('anzeige');
  };

  const handleNewYear = () => {
    const nextYear = Math.min(gameState.year + 1, 8);
    save({ ...gameState, year: nextYear });
  };

  const handleApplyEvent = (cardId: string, amt: number, pts: number, targetId: string) => {
    const teams = gameState.teams.map(t => {
      if (targetId === 'all' || t.id === targetId) {
        return { ...t, capital: t.capital + amt, points: t.points + pts };
      }
      return t;
    });
    save({ ...gameState, teams });
  };

  const handleAssignSecret = (teamId: string, player: string, cardId: string) => {
    const card = SECRET_CARDS.find(c => c.id === cardId);
    if (!card) return;
    
    const teams = gameState.teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          secretActions: [...t.secretActions, {
             id: uid(),
             teamId,
             player,
             cardId,
             title: card.title,
             text: card.text,
             status: 'open' as const,
             ts: Date.now()
          }]
        };
      }
      return t;
    });
    save({ ...gameState, teams });
  };

  const handleResolveSecret = (teamId: string, secretId: string, cardId: string, option: SecretEffectOption, targetTeamId?: string) => {
     let teams = [...gameState.teams];
     const teamIdx = teams.findIndex(t => t.id === teamId);
     if (teamIdx === -1) return;

     // Update Action Status
     const actionIdx = teams[teamIdx].secretActions.findIndex(a => a.id === secretId);
     if (actionIdx !== -1) {
         teams[teamIdx].secretActions[actionIdx].status = 'closed';
     }

     // Apply Effect
     if (option.type === 'random') {
         const isWin = Math.random() < 0.5;
         const res = isWin ? option.success : option.fail;
         if (res) {
            teams[teamIdx].capital += res.amt;
            teams[teamIdx].points += res.pts;
         }
     } else if (option.type === 'success_target' && targetTeamId) {
         const targetIdx = teams.findIndex(t => t.id === targetTeamId);
         if (targetIdx !== -1) {
             teams[targetIdx].capital += (option.amtTarget || 0);
             teams[targetIdx].points += (option.ptsTarget || 0);
         }
     } else {
         teams[teamIdx].capital += (option.amt || 0);
         teams[teamIdx].points += (option.pts || 0);
         if (option.flag === 'investor') teams[teamIdx].investorFlag = true;
     }

     save({ ...gameState, teams });
  };

  const handleBookYear = (year: number, teamId: string, option: 'A'|'B'|'C') => {
    const yearCfg = YEARS.find(y => y.year === year);
    if (!yearCfg) return;
    const optCfg = yearCfg[option];
    const team = gameState.teams.find(t => t.id === teamId);
    if (!team) return;

    // Apply stats
    const updatedTeams = gameState.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, capital: t.capital + optCfg.amt, points: t.points + optCfg.pts };
      }
      return t;
    });

    // Log assignment
    const newAssignment: Assignment = {
      id: uid(),
      ts: Date.now(),
      year,
      teamId,
      teamName: team.name,
      option,
      amt: optCfg.amt,
      pts: optCfg.pts,
      note: optCfg.note
    };

    let nextYear = gameState.year;
    // Auto-advance year if booking for current year
    if (year === gameState.year) {
         nextYear = Math.min(gameState.year + 1, 8);
    }

    save({ ...gameState, teams: updatedTeams, assignments: [...gameState.assignments, newAssignment], year: nextYear });
  };

  const handleUndo = (assignmentId: string) => {
    const assignment = gameState.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const updatedTeams = gameState.teams.map(t => {
      if (t.id === assignment.teamId) {
         return { ...t, capital: t.capital - assignment.amt, points: t.points - assignment.pts };
      }
      return t;
    });

    save({ 
        ...gameState, 
        teams: updatedTeams, 
        assignments: gameState.assignments.filter(a => a.id !== assignmentId) 
    });
  };

  // --- Render ---

  // Player View (Mobile)
  if (clientTeamId) {
      const team = gameState.teams.find(t => t.id === clientTeamId);
      if (!team) return <div className="p-8 text-center text-xl">Team nicht gefunden oder gelöscht.</div>;
      return <TeamClientView team={team} gameState={gameState} />;
  }

  // Admin/Projector View
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-[#0b1224] border-b border-white/10 sticky top-0 z-50 shadow-xl">
        <div className="row">
          <strong className="text-xl tracking-wide text-white">Entrepreneurship Sprint 8</strong>
          <span className="pill pill-ok uppercase tracking-wider text-xs">Live Control</span>
        </div>
        <nav className="flex gap-4 text-base font-bold">
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'anzeige' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('anzeige')}
          >
            📺 Dashboard
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'leitung' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('leitung')}
          >
            🛠 Leitung
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'abschluss' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActiveTab('abschluss')}
          >
            🗂 Abschluss
          </button>
        </nav>
      </header>

      <div className="p-6 w-full">
        {activeTab === 'anzeige' && (
          <PublicDashboard 
            gameState={gameState} 
            onNewYear={handleNewYear}
            onNavigateToClosing={(y, o) => {
                setClosingYear(y);
                setClosingOption(o);
                setActiveTab('abschluss');
            }}
          />
        )}
        
        {activeTab === 'leitung' && (
          <AdminDashboard 
            gameState={gameState}
            onAddTeam={handleAddTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
            onSetAllCapital={handleSetAllCapital}
            onReset={handleReset}
            onApplyEvent={handleApplyEvent}
            onAssignSecret={handleAssignSecret}
            onResolveSecret={handleResolveSecret}
          />
        )}

        {activeTab === 'abschluss' && (
          <ClosingDashboard 
            gameState={gameState}
            initialYear={closingYear}
            initialOption={closingOption}
            onBook={handleBookYear}
            onUndo={handleUndo}
          />
        )}
      </div>
    </>
  );
};

export default App;