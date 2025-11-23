import React from 'react';
import { GameState, Team } from '../types';
import { formatCurrency } from '../services/gameLogic';
import { YEAR_SCENARIO, ICONS } from '../constants';

interface Props {
  team: Team;
  gameState: GameState;
}

const TeamClientView: React.FC<Props> = ({ team, gameState }) => {
  const scenario = YEAR_SCENARIO[gameState.year];

  return (
    <div className="min-h-screen bg-[#0b1328] p-4 text-[#e6eef6]">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header */}
        <div className="panel bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-l-4 border-l-cyan-400">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10" dangerouslySetInnerHTML={{ __html: ICONS[team.icon] || ICONS['gear'] }} />
              <h1 className="text-2xl font-bold">{team.name}</h1>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                  <div className="text-xs muted uppercase">Kapital</div>
                  <div className={`text-2xl font-mono font-bold ${team.capital < 0 ? 'text-red-500' : 'text-green-400'}`}>
                      {formatCurrency(team.capital)}
                  </div>
              </div>
              <div>
                  <div className="text-xs muted uppercase">Punkte</div>
                  <div className="text-2xl font-mono font-bold text-yellow-500">
                      {team.points}
                  </div>
              </div>
           </div>
        </div>

        {/* Current Round Info */}
        <div className="panel">
           <div className="flex justify-between items-center mb-2">
               <h2 className="m-0 text-lg">Jahr {gameState.year}</h2>
               <span className="pill pill-ok">Live</span>
           </div>
           <h3 className="text-md text-cyan-300 mb-2">{scenario.title}</h3>
           <p className="text-sm opacity-80 leading-relaxed">{scenario.text}</p>
        </div>

        {/* Messages / Secret Box */}
        <div className="panel">
            <h2 className="text-sm muted uppercase mb-3">Nachrichten-Eingang</h2>
            {team.secretActions.length === 0 ? (
                <div className="text-center py-8 opacity-50 text-sm">Keine Nachrichten vorhanden.</div>
            ) : (
                <div className="space-y-3">
                    {team.secretActions.map(action => (
                        <div key={action.id} className={`p-3 rounded border ${action.status === 'open' ? 'bg-orange-900/20 border-orange-500/50' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm">{action.player}</span>
                                <span className="text-[10px] bg-black/40 px-1 rounded">{new Date(action.ts).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-xs font-bold text-orange-200 mb-1">{action.title}</div>
                            <div className="text-xs opacity-70">{action.text}</div>
                            {action.status === 'closed' && (
                                <div className="mt-2 text-[10px] text-green-400 font-bold uppercase tracking-wide">Abgeschlossen</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default TeamClientView;
