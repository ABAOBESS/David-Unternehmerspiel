import React, { useState } from 'react';
import { GameState, Team, IndustryType } from '../types';
import { formatCurrency, getOptionsForTeam } from '../services/gameLogic';
import { YEAR_CONFIGS, ICONS, INDUSTRIES } from '../constants';

interface Props {
  team: Team;
  gameState: GameState;
  onSetIndustry?: (ind: IndustryType) => void;
  onSelectOption?: (opt: 'A'|'B'|'C') => void;
}

const TeamClientView: React.FC<Props> = ({ team, gameState, onSetIndustry, onSelectOption }) => {
  const [localSelection, setLocalSelection] = useState<IndustryType | null>(null);

  // --- Year 0: Industry Selection ---
  if (!team.industry) {
     const handleSelect = (ind: IndustryType) => {
         if (onSetIndustry) {
             onSetIndustry(ind);
             setLocalSelection(ind);
         }
     };

     // If already selected locally (or confirmed via props), show Confirmation/Waiting screen
     if (team.industry || localSelection) {
         const activeIndustry = team.industry || localSelection;
         const info = INDUSTRIES[activeIndustry!];
         
         return (
             <div className="min-h-screen bg-[#0b1328] flex flex-col items-center justify-center p-6 text-center text-white">
                 <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-6xl mb-6 shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                    {info.icon}
                 </div>
                 <h1 className="text-3xl font-bold mb-2">Auswahl bestätigt!</h1>
                 <h2 className="text-xl text-indigo-300 mb-6">Ihr startet als: {info.label}</h2>
                 
                 <div className="bg-white/10 p-6 rounded-xl border border-white/10 max-w-sm w-full animate-pulse">
                     <p className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">Status</p>
                     <p className="text-lg">Warten auf Spielstart (Jahr 1)...</p>
                 </div>
                 <p className="mt-8 text-sm opacity-50">Bitte schaut auf das Haupt-Dashboard.</p>
             </div>
         );
     }

     // Selection Screen
     return (
        <div className="min-h-screen bg-[#0b1328] p-4 text-[#e6eef6] flex flex-col">
            <header className="py-6 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Willkommen, {team.name}</h1>
                <p className="text-slate-400">Wählt eure Branche für den Spielstart</p>
            </header>
            
            <div className="flex-1 grid gap-4 pb-8 max-w-lg mx-auto w-full">
                {(Object.keys(INDUSTRIES) as IndustryType[]).map(key => (
                    <button 
                        key={key} 
                        onClick={() => handleSelect(key)} 
                        className="panel bg-[#1e293b] text-left hover:border-cyan-400 hover:bg-[#253248] transition-all p-6 group rounded-2xl relative overflow-hidden shadow-lg"
                    >
                        <div className="absolute right-[-20px] top-[-20px] text-[100px] opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                            {INDUSTRIES[key].icon}
                        </div>
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left relative z-10">
                            {INDUSTRIES[key].icon}
                        </div>
                        <div className="font-bold text-2xl text-white mb-2 relative z-10">{INDUSTRIES[key].label}</div>
                        <div className="text-sm text-slate-400 relative z-10 leading-relaxed">{INDUSTRIES[key].desc}</div>
                    </button>
                ))}
            </div>
        </div>
     );
  }

  // --- Main Game Loop (Year 1+) ---
  const yearConfig = YEAR_CONFIGS.find(y => y.year === gameState.year) || YEAR_CONFIGS[0];
  const options = getOptionsForTeam(gameState.year, team);
  
  // Check if team has already been booked for this year (assignment exists)
  const isBooked = gameState.assignments.some(a => a.teamId === team.id && a.year === gameState.year);

  return (
    <div className="min-h-screen bg-[#0b1328] p-4 text-[#e6eef6] pb-20">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header */}
        <div className="panel bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-l-4 border-l-cyan-400 relative overflow-hidden shadow-lg">
           <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center" dangerouslySetInnerHTML={{ __html: ICONS[team.icon] || ICONS['gear'] }} />
              <div>
                  <h1 className="text-2xl font-bold leading-none mb-1">{team.name}</h1>
                  <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-cyan-900/30 px-2 py-1 rounded w-fit">
                      {team.industry ? INDUSTRIES[team.industry].icon + ' ' + INDUSTRIES[team.industry].label : 'Keine Branche'}
                  </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 relative z-10">
              <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Kapital</div>
                  <div className={`text-2xl font-mono font-bold ${team.capital < 0 ? 'text-red-500' : 'text-green-400'}`}>
                      {formatCurrency(team.capital)}
                  </div>
              </div>
              <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Score</div>
                  <div className="text-2xl font-mono font-bold text-yellow-500">
                      {team.points}
                  </div>
              </div>
           </div>

            {/* Joker Badge */}
            {team.jokerActive && (
                <div className="mt-4 bg-red-500/10 border border-red-500/40 p-3 rounded-lg text-xs text-red-200 flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                        <div className="font-bold text-red-400 uppercase">Joker Aktiv</div>
                        {team.jokerActive === 'BANK' ? 'Bank-Kredit: -10.000€ Zinsen pro Jahr.' : 'Investor: Dein End-Score wird um 60% gekürzt.'}
                    </div>
                </div>
            )}
        </div>

        {/* Current Round Info */}
        <div className="panel shadow-lg">
           <div className="flex justify-between items-center mb-3">
               <h2 className="m-0 text-lg font-bold text-white">Jahr {gameState.year}: {yearConfig.title}</h2>
               <span className="pill pill-ok text-[10px] uppercase tracking-wider">Live</span>
           </div>
           <div className="bg-[#0f172a] p-4 rounded-lg text-sm text-slate-300 italic mb-5 border-l-2 border-indigo-500 leading-relaxed shadow-inner">
               "{yearConfig.scenario}"
           </div>

           {isBooked ? (
               <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-xl text-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                   <div className="text-4xl mb-3 animate-bounce">✅</div>
                   <div className="font-bold text-green-400 text-lg">Entscheidung verbucht</div>
                   <div className="text-sm opacity-80 mt-2">Lehnt euch zurück. Warten auf das nächste Jahr...</div>
               </div>
           ) : options ? (
               <div className="space-y-4">
                   <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-2 text-center">Wähle eine Option</div>
                   {(['A','B','C'] as const).map(key => {
                       const opt = options[key];
                       const isSelected = team.selectedOption === key;
                       return (
                           <button 
                                key={key} 
                                onClick={() => onSelectOption && onSelectOption(key)}
                                className={`w-full relative p-5 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 text-left ${isSelected ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-[#1e293b] border-transparent hover:border-white/10 hover:bg-[#253248]'}`}
                           >
                               <div className={`absolute top-4 right-4 text-xs font-bold border rounded px-2 py-1 transition-colors ${isSelected ? 'bg-cyan-500 text-black border-cyan-500' : 'text-slate-500 border-slate-700'}`}>
                                   {isSelected ? 'GEWÄHLT' : `OPT ${key}`}
                               </div>
                               
                               <div className="font-bold text-lg text-white mb-1 pr-20">{opt.title}</div>
                               <div className="text-sm text-slate-400 mb-4">{opt.note}</div>
                               
                               <div className="flex gap-3 text-sm font-mono font-bold bg-black/20 p-2 rounded-lg w-fit">
                                   <div className={opt.amt >= 0 ? "text-green-400" : "text-red-400"}>{opt.amt >= 0 ? '+' : ''}{formatCurrency(opt.amt)}</div>
                                   <div className="text-slate-600">|</div>
                                   <div className={opt.pts >= 0 ? "text-blue-400" : "text-orange-400"}>{opt.pts >= 0 ? '+' : ''}{opt.pts} Pkt</div>
                               </div>
                           </button>
                       )
                   })}
               </div>
           ) : (
               <div className="opacity-50 text-center py-8">Keine Optionen verfügbar.</div>
           )}
        </div>

        {/* Messages */}
        <div className="panel">
            <h2 className="text-xs muted uppercase font-bold tracking-widest mb-4">Geheime Nachrichten</h2>
            {team.secretActions.length === 0 ? (
                <div className="text-center py-6 opacity-30 text-sm border-2 border-dashed border-white/5 rounded-xl">Keine Nachrichten.</div>
            ) : (
                <div className="space-y-3">
                    {team.secretActions.map(action => (
                        <div key={action.id} className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 text-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 bg-white/10 rounded-bl text-[10px] font-mono opacity-50">SECRET</div>
                            <div className="font-bold text-indigo-200 mb-1">{action.title}</div>
                            <div className="opacity-80 leading-relaxed">{action.text}</div>
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