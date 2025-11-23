import React, { useState } from 'react';
import { GameState, Team, IndustryType } from '../types';
import { PUBLIC_CARDS, SECRET_CARDS, JOKERS, INDUSTRIES } from '../constants';
import { formatCurrency } from '../services/gameLogic';

interface Props {
  gameState: GameState;
  onUpdateTeam: (team: Team) => void;
  onAddTeam: (name: string, icon: string, capital: number) => void;
  onDeleteTeam: (id: string) => void;
  onSetAllCapital: (amount: number) => void;
  onReset: () => void;
  onApplyEvent: (cardId: string, amt: number, pts: number, targetId: string) => void;
  onAssignSecret: (teamId: string, player: string, cardId: string) => void;
  onResolveSecret: (teamId: string, secretId: string, cardId: string, option: any, targetTeamId?: string) => void;
  onApplyJoker: (teamId: string, type: 'BANK' | 'SHARK') => void;
}

const AdminDashboard: React.FC<Props> = ({ 
  gameState, onUpdateTeam, onAddTeam, onDeleteTeam, onSetAllCapital, onReset,
  onApplyEvent, onAssignSecret, onResolveSecret, onApplyJoker
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [startKap, setStartKap] = useState(100000);
  const [applyAmount, setApplyAmount] = useState(0);

  const getQRUrl = (teamId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?team=${teamId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-6">
      
      {/* LEFT: Team Management */}
      <div className="panel flex flex-col h-[calc(100vh-100px)]">
        <h2>Teams</h2>
        
        {/* Creator */}
        <div className="bg-black/20 p-3 rounded-xl mb-4 border border-white/5">
            <div className="row mb-2">
              <input placeholder="Neues Team" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="flex-1" />
              <button className="btn" onClick={() => { onAddTeam(newTeamName || `Team ${gameState.teams.length+1}`, 'rocket', startKap); setNewTeamName(''); }}>+</button>
            </div>
            <div className="row text-xs">
               <label>Startkap:</label>
               <input type="number" value={startKap} onChange={e => setStartKap(Number(e.target.value))} className="w-20" />
               <button className="btn-ghost py-1" onClick={() => onSetAllCapital(startKap)}>Set All</button>
            </div>
        </div>
        
        {/* Team List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {gameState.teams.map(t => (
            <div key={t.id} className="bg-[#1e293b] p-3 rounded-lg border border-white/5 relative">
               <div className="flex justify-between items-start mb-2">
                   <div>
                       <div className="font-bold text-lg">{t.name}</div>
                       <div className="text-xs text-slate-400">
                           {t.industry ? INDUSTRIES[t.industry].label : 'Keine Branche'}
                       </div>
                   </div>
                   <div className="text-right">
                       <div className={`font-mono font-bold ${t.capital < 0 ? 'text-red-500' : 'text-green-400'}`}>
                           {formatCurrency(t.capital)}
                       </div>
                       <div className="text-sm font-bold text-yellow-500">{t.points} Pkt</div>
                   </div>
               </div>

               {/* Joker Section for Insolvent Teams */}
               {t.capital < 0 && !t.jokerActive && (
                   <div className="bg-red-900/20 border border-red-500/50 p-2 rounded mb-2 animate-pulse">
                       <div className="text-xs font-bold text-red-400 mb-1 uppercase tracking-wide">Insolvenz droht!</div>
                       <div className="grid grid-cols-2 gap-2">
                           <button className="btn bg-red-800 text-xs py-1 hover:bg-red-700" onClick={() => onApplyJoker(t.id, 'BANK')}>
                               🏦 Kredit
                           </button>
                           <button className="btn bg-purple-800 text-xs py-1 hover:bg-purple-700" onClick={() => onApplyJoker(t.id, 'SHARK')}>
                               🦈 Investor
                           </button>
                       </div>
                   </div>
               )}
               {t.jokerActive && (
                   <div className="text-xs text-red-400 bg-red-900/10 p-1 rounded text-center mb-2">
                       Joker Aktiv: {t.jokerActive}
                   </div>
               )}

               <div className="row text-[10px] justify-between border-t border-white/5 pt-2">
                   <div className="flex gap-1">
                       <a href={`?team=${t.id}`} target="_blank" className="btn-ghost px-2 py-1">Link</a>
                       <details className="relative inline-block">
                          <summary className="btn-ghost px-2 py-1 cursor-pointer list-none">QR</summary>
                          <div className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded shadow-xl z-50">
                              <img src={getQRUrl(t.id)} className="w-32 h-32" />
                          </div>
                       </details>
                   </div>
                   <div className="flex gap-1">
                       <button className="btn-ghost px-2 py-1" onClick={() => onUpdateTeam({...t, capital: t.capital + 10000})}>+10k</button>
                       <button className="btn-ghost px-2 py-1" onClick={() => onUpdateTeam({...t, capital: t.capital - 10000})}>-10k</button>
                       <button className="btn-danger px-2 py-1" onClick={() => onDeleteTeam(t.id)}>Del</button>
                   </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="panel flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
        {/* Event Cards */}
        <div className="mb-6">
            <h2 className="text-orange-400 mb-2">🔔 Ereignis auslösen</h2>
            <div className="grid grid-cols-2 gap-2 mb-2">
                {PUBLIC_CARDS.map(c => (
                    <button key={c.id} className="btn-ghost text-left text-xs p-2 border border-white/10 hover:bg-orange-500/20"
                        onClick={() => onApplyEvent(c.id, c.amt, c.pts, 'all')}
                    >
                        <div className="font-bold">{c.title}</div>
                        <div className="opacity-70">{c.amt}€ / {c.pts} Pkt</div>
                    </button>
                ))}
            </div>
            <div className="flex gap-2 items-center bg-black/20 p-2 rounded">
                <input type="number" placeholder="Manuell €" className="w-24 text-sm" value={applyAmount} onChange={e => setApplyAmount(Number(e.target.value))} />
                <button className="btn-warn py-1 text-sm" onClick={() => onApplyEvent('MANUAL', applyAmount, 0, 'all')}>Anwenden (Alle)</button>
            </div>
        </div>

        {/* Secret Actions */}
        <div className="flex-1">
            <h2 className="text-indigo-400 mb-2">🕵️ Geheime Aktionen</h2>
            <div className="text-xs muted mb-4">Wähle Karte, Team und Spieler.</div>
            
            {/* Simple Form embedded directly for speed */}
            <div className="grid grid-cols-1 gap-2">
                {SECRET_CARDS.map(sc => (
                     <details key={sc.id} className="bg-[#111] rounded border border-white/10">
                         <summary className="p-3 cursor-pointer text-sm font-bold hover:bg-white/5">{sc.title}</summary>
                         <div className="p-3 border-t border-white/10">
                             <p className="text-xs muted mb-2">{sc.text}</p>
                             <div className="flex flex-col gap-2">
                                 {gameState.teams.map(t => (
                                     <button key={t.id} className="btn-ghost text-xs text-left" 
                                        onClick={() => {
                                            const p = prompt(`Spielername für ${t.name}?`);
                                            if(p) onAssignSecret(t.id, p, sc.id);
                                        }}
                                     >
                                         ➡ Zuweisen an {t.name}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     </details>
                ))}
            </div>

            {/* Active Secrets List */}
            <div className="mt-6">
                <h3 className="font-bold text-sm uppercase muted mb-2">Offene Aktionen</h3>
                {gameState.teams.flatMap(t => t.secretActions.filter(a => a.status === 'open').map(a => ({...a, team: t}))).map(action => (
                    <div key={action.id} className="bg-indigo-900/20 border border-indigo-500/30 p-2 rounded mb-2 text-xs">
                        <div className="font-bold text-white">{action.team.name} - {action.player}</div>
                        <div className="text-indigo-300">{action.title}</div>
                        <button className="mt-2 btn-ghost text-[10px] w-full border border-indigo-500" onClick={() => onResolveSecret(action.teamId, action.id, action.cardId, {type: 'random', success:{amt:0,pts:0,log:'Manuell gelöst'}, fail:{amt:0,pts:0,log:'Manuell gelöst'}})}>
                            Als erledigt markieren
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
