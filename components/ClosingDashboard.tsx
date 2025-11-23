import React, { useState, useEffect } from 'react';
import { GameState, Assignment } from '../types';
import { YEAR_CONFIGS } from '../constants';
import { formatCurrency, getOptionsForTeam } from '../services/gameLogic';

interface Props {
  gameState: GameState;
  initialYear?: number;
  initialOption?: string;
  onBook: (year: number, teamId: string, option: 'A'|'B'|'C') => void;
  onUndo: (assignmentId: string) => void;
}

const ClosingDashboard: React.FC<Props> = ({ gameState, initialYear, initialOption, onBook, onUndo }) => {
  const [selectedYear, setSelectedYear] = useState(initialYear || gameState.year);
  const [selectedTeamId, setSelectedTeamId] = useState(gameState.teams[0]?.id || '');
  const [selectedOption, setSelectedOption] = useState<'A'|'B'|'C'>((initialOption as any) || 'A');

  const selectedTeam = gameState.teams.find(t => t.id === selectedTeamId);
  const options = selectedTeam ? getOptionsForTeam(selectedYear, selectedTeam) : null;
  const optionConfig = options ? options[selectedOption] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
      <div className="panel flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
        <h2 className="text-2xl">Jahresabschluss</h2>
        
        <div className="flex flex-col gap-6">
           <div className="bg-black/20 p-4 rounded-xl border border-white/5">
             <label className="block text-sm font-bold uppercase text-slate-400 mb-2">1. Team</label>
             <select value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} className="w-full text-lg py-3">
                {gameState.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
             </select>
           </div>
           
           <div className="bg-black/20 p-4 rounded-xl border border-white/5">
             <label className="block text-sm font-bold uppercase text-slate-400 mb-2">2. Jahr</label>
             <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="w-full text-lg py-3">
               {YEAR_CONFIGS.map(y => <option key={y.year} value={y.year}>Jahr {y.year}</option>)}
             </select>
           </div>
           
           <div className="bg-black/20 p-4 rounded-xl border border-white/5">
             <label className="block text-sm font-bold uppercase text-slate-400 mb-2">3. Entscheidung</label>
             <div className="grid grid-cols-3 gap-2">
                 {(['A','B','C'] as const).map(opt => (
                     <button 
                        key={opt}
                        onClick={() => setSelectedOption(opt)}
                        className={`py-3 rounded font-bold text-lg ${selectedOption === opt ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                     >
                         {opt}
                     </button>
                 ))}
             </div>
           </div>

           <div className="panel bg-indigo-900/20 border border-indigo-500/30 text-base shadow-lg">
              <div className="mb-2 text-indigo-300 font-bold uppercase tracking-wider text-xs">Vorschau</div>
              {selectedTeam && optionConfig ? (
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-xl text-white">{optionConfig.title}</div>
                    <div className="muted italic text-sm">{optionConfig.note}</div>
                    <div className="font-mono text-2xl font-bold mt-2 pt-2 border-t border-white/10 flex justify-between">
                        <span className={optionConfig.amt >= 0 ? "text-green-400" : "text-red-400"}>
                            {formatCurrency(optionConfig.amt)}
                        </span>
                        <span className={optionConfig.pts >= 0 ? "text-blue-400" : "text-orange-400"}>
                            {optionConfig.pts} Pkt
                        </span>
                    </div>
                  </div>
              ) : <div>Bitte Team wählen</div>}
           </div>

           <button className="btn w-full py-4 text-xl font-bold shadow-xl shadow-blue-500/20" onClick={() => selectedTeamId && onBook(selectedYear, selectedTeamId, selectedOption)}>
               BUCHEN
           </button>
        </div>
      </div>

      <div className="panel flex flex-col h-[calc(100vh-100px)]">
        <h2 className="text-2xl mb-4">Buchungs-Historie</h2>
        <div className="overflow-auto flex-1 custom-scrollbar pr-2">
            <table className="table w-full text-left">
            <thead className="sticky top-0 bg-[#1e293b] z-10 shadow-lg">
                <tr>
                <th>Zeit</th>
                <th>Jahr</th>
                <th>Team</th>
                <th>Opt</th>
                <th className="text-right">€</th>
                <th className="text-right">Pkt</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {[...gameState.assignments].reverse().map(a => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                        <td className="font-mono text-sm text-slate-400">{new Date(a.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="text-center font-bold text-slate-300">{a.year}</td>
                        <td className="font-bold text-white text-lg">{a.teamName}</td>
                        <td className="text-center"><span className="bg-white/10 px-2 py-1 rounded font-bold">{a.option}</span></td>
                        <td className={`text-right font-mono font-bold ${a.amt>=0?'text-green-400':'text-red-400'}`}>{a.amt/1000}k</td>
                        <td className={`text-right font-bold ${a.pts>=0?'text-blue-400':'text-orange-400'}`}>{a.pts}</td>
                        <td className="text-right">
                            <button className="btn-ghost text-xs py-2 px-3 hover:bg-red-900/50 hover:text-red-200" onClick={() => onUndo(a.id)}>X</button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ClosingDashboard;
