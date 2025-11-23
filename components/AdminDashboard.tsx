import React, { useState } from 'react';
import { GameState, Team } from '../types';
import { PUBLIC_CARDS, SECRET_CARDS, SECRET_EXPLAIN, SECRET_EFFECTS, ICONS } from '../constants';
import { uid, formatCurrency } from '../services/gameLogic';
import { audioService } from '../services/audioService';

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
}

const AdminDashboard: React.FC<Props> = ({ 
  gameState, onUpdateTeam, onAddTeam, onDeleteTeam, onSetAllCapital, onReset,
  onApplyEvent, onAssignSecret, onResolveSecret
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamIcon, setNewTeamIcon] = useState('gear');
  const [startKap, setStartKap] = useState(100000);
  
  const [selectedCardId, setSelectedCardId] = useState(PUBLIC_CARDS[0].id);
  const [applyAmount, setApplyAmount] = useState(PUBLIC_CARDS[0].amt);
  const [applyPoints, setApplyPoints] = useState(PUBLIC_CARDS[0].pts);
  const [applyTarget, setApplyTarget] = useState('all');
  const [sirenMode, setSirenMode] = useState<'twotone'|'whoop'|'beacon'|'off'>('twotone');
  const [volume, setVolume] = useState(0.6);

  const [secretTeamId, setSecretTeamId] = useState('');
  const [secretPlayer, setSecretPlayer] = useState('');
  const [secretCardId, setSecretCardId] = useState(SECRET_CARDS[0].id);

  // QR Code Generation
  const getQRUrl = (teamId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?team=${teamId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
  };

  const handleAddTeam = () => {
    onAddTeam(newTeamName || `Team ${gameState.teams.length + 1}`, newTeamIcon, startKap);
    setNewTeamName('');
  };

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
    const c = PUBLIC_CARDS.find(card => card.id === id);
    if (c) {
      setApplyAmount(c.amt);
      setApplyPoints(c.pts);
    }
  };

  const handleApplyPublic = () => {
    onApplyEvent(selectedCardId, applyAmount, applyPoints, applyTarget);
    audioService.playSiren(sirenMode, volume);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6">
      {/* Team Management */}
      <div className="panel flex flex-col h-[calc(100vh-100px)]">
        <h2>Teams verwalten</h2>
        
        <div className="bg-black/20 p-4 rounded-xl mb-4 border border-white/5">
            <div className="row mb-3">
              <input placeholder="Neues Team" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="flex-1 text-lg" />
              <select value={newTeamIcon} onChange={e => setNewTeamIcon(e.target.value)} className="w-16 text-2xl">
                 {Object.keys(ICONS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <button className="btn font-bold text-xl px-4" onClick={handleAddTeam}>+</button>
            </div>
            <div className="row items-center justify-between">
               <div className="flex items-center gap-2">
                   <label className="text-xs uppercase font-bold text-slate-400">Startkapital</label>
                   <input type="number" value={startKap} onChange={e => setStartKap(Number(e.target.value))} className="w-28 text-right font-mono" />
               </div>
               <div className="flex gap-2">
                   <button className="btn-ghost text-xs py-2" onClick={() => onSetAllCapital(startKap)}>Set All</button>
                   <button className="btn-danger text-xs py-2" onClick={() => { if(confirm('Reset all?')) onReset(); }}>Reset</button>
               </div>
            </div>
        </div>
        
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
          {gameState.teams.map(t => (
            <div key={t.id} className="team-row p-3">
               <div className="flex flex-col flex-1">
                 <div className="font-bold text-lg">{t.name}</div>
                 <div className="row mt-1">
                     <a href={`?team=${t.id}`} target="_blank" className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded hover:bg-blue-800">Link</a>
                     <details className="inline-block relative">
                        <summary className="cursor-pointer text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">QR Code</summary>
                        <div className="absolute top-8 left-0 z-50 bg-white p-4 rounded-xl shadow-2xl border-4 border-indigo-500 w-[200px] h-[200px] flex items-center justify-center">
                             <img src={getQRUrl(t.id)} alt="QR" className="w-full h-full" />
                        </div>
                     </details>
                 </div>
               </div>
               <div className="flex flex-col text-right">
                 <div className="font-mono text-lg font-bold text-green-400">{formatCurrency(t.capital)}</div>
                 <div className="text-sm font-bold text-slate-400">{t.points} Pkt</div>
               </div>
               <div className="flex flex-col gap-1">
                 <button className="btn-ghost text-[10px] py-1 px-2 h-6" onClick={() => onUpdateTeam({...t, capital: t.capital + 1000})}>+1k</button>
                 <button className="btn-ghost text-[10px] py-1 px-2 h-6" onClick={() => onUpdateTeam({...t, capital: t.capital - 1000})}>-1k</button>
                 <button className="btn-danger text-[10px] py-1 px-2 h-6" onClick={() => onDeleteTeam(t.id)}>X</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events & Secrets */}
      <div className="flex flex-col gap-6 h-[calc(100vh-100px)] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Public Events Section */}
        <div className="panel border-l-4 border-l-orange-500">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-orange-400 m-0">🔔 Öffentliches Ereignis</h2>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                  <span className="text-xs uppercase muted">Sirene</span>
                  <select value={sirenMode} onChange={(e: any) => setSirenMode(e.target.value)} className="bg-transparent border-none py-0 text-sm h-6">
                      <option value="twotone">EU-Sirene</option>
                      <option value="whoop">Whoop</option>
                      <option value="beacon">Beacon</option>
                      <option value="off">Stumm</option>
                  </select>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <select value={selectedCardId} onChange={e => handleCardSelect(e.target.value)} className="md:col-span-2 text-lg font-bold">
                  {PUBLIC_CARDS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div className="flex items-center gap-2">
                 <input type="number" value={applyAmount} onChange={e => setApplyAmount(Number(e.target.value))} className="w-full text-right font-mono text-lg" placeholder="€" />
                 <span className="muted">€</span>
              </div>
              <div className="flex items-center gap-2">
                 <input type="number" value={applyPoints} onChange={e => setApplyPoints(Number(e.target.value))} className="w-full text-right font-mono text-lg" placeholder="Pkt" />
                 <span className="muted">Pkt</span>
              </div>
           </div>
           
           <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
               <div className="flex items-center gap-4">
                  <span className="muted">Anwenden auf:</span>
                  <select value={applyTarget} onChange={e => setApplyTarget(e.target.value)} className="w-48">
                      <option value="all">Alle Teams</option>
                      {gameState.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
               </div>
               <button className="btn-warn text-lg px-8 shadow-lg shadow-orange-500/20" onClick={handleApplyPublic}>
                   ⚡ AUSFÜHREN
               </button>
           </div>
        </div>

        {/* Secret Actions Section */}
        <div className="panel border-l-4 border-l-indigo-500 flex-1">
            <h2 className="text-xl text-indigo-400">🕵️ Geheime Aktionen</h2>
            
            <div className="bg-[#0b162c] p-6 rounded-xl mb-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select value={secretTeamId} onChange={e => setSecretTeamId(e.target.value)} className="text-lg">
                        <option value="">1. Team wählen...</option>
                        {gameState.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input placeholder="2. Spieler Name" value={secretPlayer} onChange={e => setSecretPlayer(e.target.value)} className="text-lg" />
                    <select value={secretCardId} onChange={e => setSecretCardId(e.target.value)} className="text-lg">
                        {SECRET_CARDS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <button className="btn w-full py-4 text-lg shadow-indigo-500/20" disabled={!secretTeamId || !secretPlayer} onClick={() => onAssignSecret(secretTeamId, secretPlayer, secretCardId)}>
                    Karte verdeckt zuteilen
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-4">
                   <h3 className="text-sm font-bold uppercase tracking-widest muted m-0">Offene Aktionen</h3>
                   <span className="text-xs bg-white/10 px-2 py-1 rounded">{gameState.teams.reduce((acc, t) => acc + t.secretActions.filter(a => a.status === 'open').length, 0)} Aktiv</span>
                </div>
                
                {gameState.teams.flatMap(t => t.secretActions.filter(a => a.status === 'open').map(a => ({...a, teamName: t.name}))).length === 0 && (
                    <div className="text-center py-8 text-slate-500 bg-black/10 rounded-xl border border-dashed border-slate-700">
                        Keine offenen geheimen Aktionen.
                    </div>
                )}
                
                {gameState.teams.flatMap(t => t.secretActions.filter(a => a.status === 'open').map(a => ({...a, teamName: t.name}))).map(action => (
                    <div key={action.id} className="panel bg-[#1e293b] border border-white/10 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                         <div className="pl-4">
                             <div className="flex justify-between items-start mb-3">
                                 <div>
                                     <div className="font-bold text-lg text-white">{action.teamName}</div>
                                     <div className="text-indigo-300 font-medium">{action.player}</div>
                                 </div>
                                 <span className="bg-indigo-900/50 text-indigo-200 border border-indigo-500/30 px-3 py-1 rounded text-sm font-bold">
                                     {action.title}
                                 </span>
                             </div>
                             
                             <div className="text-slate-300 mb-4 bg-black/20 p-3 rounded">{action.text}</div>
                             
                             <div className="flex flex-wrap gap-3">
                                 {SECRET_EFFECTS[action.cardId]?.options.map((opt, idx) => (
                                     <div key={idx} className="flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                         <button className="btn-ghost text-sm font-bold hover:bg-white/10 hover:text-white transition-colors" onClick={() => {
                                             let target = undefined;
                                             if (opt.target) {
                                                target = prompt('Ziel-Team ID eingeben (siehe Teams Liste)') || undefined; 
                                             }
                                             onResolveSecret(action.teamId, action.id, action.cardId, opt, target);
                                         }}>
                                             {opt.label}
                                         </button>
                                         {opt.target && (
                                             <select 
                                                 className="text-sm w-32 bg-black/40 border-none h-8" 
                                                 onChange={(e) => onResolveSecret(action.teamId, action.id, action.cardId, opt, e.target.value)}
                                             >
                                                 <option value="">Ziel wählen...</option>
                                                 {gameState.teams.filter(t => t.id !== action.teamId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                             </select>
                                         )}
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Helper / Reference (Collapsed by default for space) */}
        <details className="panel">
            <summary className="font-bold cursor-pointer text-lg">📚 Referenz: Geheime Karten</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {SECRET_CARDS.map(card => (
                    <div key={card.id} className="bg-black/20 p-4 rounded border border-white/5 text-sm">
                        <strong className="text-orange-400 block mb-1">{card.title}</strong>
                        <div className="opacity-70 mb-2">{card.text}</div>
                        <div className="text-xs text-blue-300 border-t border-white/5 pt-2 mt-2">{SECRET_EXPLAIN[card.id]?.tip}</div>
                    </div>
                ))}
            </div>
        </details>
      </div>
    </div>
  );
};

export default AdminDashboard;