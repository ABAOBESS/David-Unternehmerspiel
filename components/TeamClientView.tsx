import React, { useState } from 'react';
import { GameState, Team, IndustryType } from '../types';
import { formatCurrency, getOptionsForTeam } from '../services/gameLogic';
import { YEAR_CONFIGS, ICONS, INDUSTRIES } from '../constants';

interface Props {
  team: Team;
  gameState: GameState;
}

const TeamClientView: React.FC<Props> = ({ team, gameState }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  
  // Year 0 Logic (Industry Selection)
  if (!team.industry) {
     const handleSelectIndustry = (ind: IndustryType) => {
         // In a real app, this would call an API. 
         // For this local sync demo, we can't easily write back without a callback prop or context.
         // However, the architecture passes 'onSubmit' usually. 
         // Since App.tsx manages state via localstorage sync mostly for admin,
         // we will just show a "Bitte beim Spielleiter melden" or simpler: 
         // Assume this component is mostly read-only OR needs a way to push back.
         // *CRITICAL FIX*: Providing visual feedback but asking them to tell the GM, 
         // OR assuming the GM sets it. 
         // BUT user asked for "Year 0 Industry Selection".
         // Let's implement a local selection that effectively just shows "Waiting for GM" 
         // or we need a way to 'submit' this decision.
         setSelectedIndustry(ind);
     };

     if (selectedIndustry) {
         return (
             <div className="min-h-screen bg-[#0b1328] flex flex-col items-center justify-center p-6 text-center text-white">
                 <div className="text-6xl mb-4">{INDUSTRIES[selectedIndustry].icon}</div>
                 <h1 className="text-2xl font-bold mb-2">Ihr seid ein {INDUSTRIES[selectedIndustry].label}</h1>
                 <p className="opacity-70 mb-8">Bitte teilt dies der Spielleitung mit, um das Spiel zu starten!</p>
                 <div className="p-4 bg-white/10 rounded-lg animate-pulse">
                     Warten auf Start von Jahr 1...
                 </div>
             </div>
         );
     }

     return (
        <div className="min-h-screen bg-[#0b1328] p-4 text-[#e6eef6]">
            <h1 className="text-2xl font-bold text-center mb-6 mt-4">Wählt eure Branche</h1>
            <div className="grid gap-4">
                {(Object.keys(INDUSTRIES) as IndustryType[]).map(key => (
                    <button key={key} onClick={() => handleSelectIndustry(key)} className="panel bg-[#1e293b] text-left hover:border-cyan-400 transition-all p-6 group">
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{INDUSTRIES[key].icon}</div>
                        <div className="font-bold text-xl text-white mb-1">{INDUSTRIES[key].label}</div>
                        <div className="text-sm opacity-70">{INDUSTRIES[key].desc}</div>
                    </button>
                ))}
            </div>
        </div>
     );
  }

  // Normal Game Loop
  const yearConfig = YEAR_CONFIGS.find(y => y.year === gameState.year) || YEAR_CONFIGS[0];
  const options = getOptionsForTeam(gameState.year, team);
  
  // Check if team has already been booked for this year (assignment exists)
  const isBooked = gameState.assignments.some(a => a.teamId === team.id && a.year === gameState.year);

  return (
    <div className="min-h-screen bg-[#0b1328] p-4 text-[#e6eef6] pb-20">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header */}
        <div className="panel bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-l-4 border-l-cyan-400 relative overflow-hidden">
           <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10" dangerouslySetInnerHTML={{ __html: ICONS[team.icon] || ICONS['gear'] }} />
              <div>
                  <h1 className="text-xl font-bold leading-none">{team.name}</h1>
                  <div className="text-xs text-cyan-300 flex items-center gap-1">
                      {team.industry ? INDUSTRIES[team.industry].icon + ' ' + INDUSTRIES[team.industry].label : 'Keine Branche'}
                  </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
              <div>
                  <div className="text-xs muted uppercase">Kapital</div>
                  <div className={`text-2xl font-mono font-bold ${team.capital < 0 ? 'text-red-500' : 'text-green-400'}`}>
                      {formatCurrency(team.capital)}
                  </div>
              </div>
              <div>
                  <div className="text-xs muted uppercase">Score</div>
                  <div className="text-2xl font-mono font-bold text-yellow-500">
                      {team.points}
                  </div>
              </div>
           </div>

            {/* Joker Badge */}
            {team.jokerActive && (
                <div className="mt-3 bg-red-500/20 border border-red-500/50 p-2 rounded text-xs text-red-200 flex items-center gap-2">
                    <span>⚠️</span>
                    {team.jokerActive === 'BANK' ? 'Bank-Kredit aktiv (-10k/Jahr)' : 'Investor hat Kontrolle (-60% Score)'}
                </div>
            )}
        </div>

        {/* Current Round Info */}
        <div className="panel">
           <div className="flex justify-between items-center mb-2">
               <h2 className="m-0 text-lg">Jahr {gameState.year}: {yearConfig.title}</h2>
               <span className="pill pill-ok">Live</span>
           </div>
           <div className="bg-black/30 p-3 rounded text-sm italic mb-4 border-l-2 border-white/20">
               "{yearConfig.scenario}"
           </div>

           {isBooked ? (
               <div className="bg-green-500/20 border border-green-500 p-4 rounded text-center">
                   <div className="text-2xl mb-2">✅</div>
                   <div className="font-bold text-green-400">Entscheidung eingeloggt</div>
                   <div className="text-sm opacity-80 mt-1">Warte auf das nächste Jahr...</div>
               </div>
           ) : options ? (
               <div className="space-y-3">
                   <div className="text-xs uppercase font-bold text-slate-400 mb-1">Deine Optionen (Tippen zum Wählen)</div>
                   {(['A','B','C'] as const).map(key => {
                       const opt = options[key];
                       return (
                           <div key={key} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${team.selectedOption === key ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-[#1e293b] border-transparent hover:border-white/20'}`}
                                onClick={() => {
                                    // In a real networked app, this sends data. Here we assume visual selection for the user 
                                    // to show the GM.
                                    // ideally we set a state 'selectedOption' on the team object in App state
                                    // But user is "Client View"
                                    alert(`Du hast Option ${key} gewählt:\n\n${opt.note}\n\nBitte zeige dies der Spielleitung zur Bestätigung!`);
                                }}
                           >
                               <div className="flex justify-between items-center mb-2">
                                   <span className="font-bold text-lg text-white">Option {key}</span>
                                   <div className="text-right text-xs">
                                       <div className={opt.amt >= 0 ? "text-green-400" : "text-red-400"}>{opt.amt >= 0 ? '+' : ''}{opt.amt}€</div>
                                       <div className={opt.pts >= 0 ? "text-yellow-400" : "text-orange-400"}>{opt.pts >= 0 ? '+' : ''}{opt.pts} Pkt</div>
                                   </div>
                               </div>
                               <div className="text-sm opacity-80">{opt.title}</div>
                               <div className="text-xs text-slate-500 mt-1">{opt.note}</div>
                           </div>
                       )
                   })}
               </div>
           ) : (
               <div className="opacity-50 text-center">Keine Optionen verfügbar.</div>
           )}
        </div>

        {/* Messages */}
        <div className="panel">
            <h2 className="text-sm muted uppercase mb-3">Nachrichten</h2>
            {team.secretActions.length === 0 ? (
                <div className="text-center py-4 opacity-30 text-xs">Keine Nachrichten.</div>
            ) : (
                <div className="space-y-2">
                    {team.secretActions.map(action => (
                        <div key={action.id} className="p-3 rounded bg-white/5 border border-white/10 text-xs">
                            <div className="font-bold text-orange-200">{action.title}</div>
                            <div className="opacity-70">{action.text}</div>
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
