import React, { useState, useEffect } from 'react';
import { GameState, Team, Assignment } from '../types';
import { YEARS } from '../constants';
import { formatCurrency } from '../services/gameLogic';

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

  useEffect(() => {
    if (initialYear) setSelectedYear(initialYear);
    if (initialOption) setSelectedOption(initialOption as any);
  }, [initialYear, initialOption]);

  const yearConfig = YEARS.find(y => y.year === selectedYear) || YEARS[0];
  const optionConfig = yearConfig[selectedOption];
  const selectedTeam = gameState.teams.find(t => t.id === selectedTeamId);

  const handleBook = () => {
    if (selectedTeamId) {
      onBook(selectedYear, selectedTeamId, selectedOption);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
      <div className="panel flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
        <h2 className="text-2xl">Jahresabschluss buchen</h2>
        <div className="muted mb-6 text-base">
          Wähle Jahr, Team und Option. Der Effekt wird sofort gebucht.
        </div>
        
        <div className="flex flex-col gap-6">
           <div className="bg-black/20 p-4 rounded-xl border border-white/5">
             <label className="block text-sm font-bold uppercase text-slate-400 mb-2">1. Jahr wählen</label>
             <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="w-full text-lg py-3">
               {YEARS.map(y => <option key={y.year} value={y.year}>Jahr {y.year} — {y.title}</option>)}
             </select>
           </div>
           
           <div className="bg-black/20 p-4 rounded-xl border border-white/5">
             <label className="block text-sm font-bold uppercase text-slate-400 mb-2">2. Team wählen</label>
             <select value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} className="w-full text-lg py-3">
                {gameState.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
             </select>
           </div>
           
           <div className="bg-black/20 p-4 rounded-xl border border-white/5">
             <label className="block text-sm font-bold uppercase text-slate-400 mb-2">3. Entscheidung</label>
             <select value={selectedOption} onChange={e => setSelectedOption(e.target.value as any)} className="w-full text-lg py-3">
               <option value="A">Option A</option>
               <option value="B">Option B</option>
               <option value="C">Option C</option>
             </select>
           </div>

           <div className="panel bg-indigo-900/20 border border-indigo-500/30 text-base shadow-lg">
              <div className="mb-2 text-indigo-300 font-bold uppercase tracking-wider text-xs">Vorschau</div>
              {selectedTeam ? (
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-xl text-white">{selectedTeam.name}</div>
                    <div className="text-lg opacity-90">{yearConfig.title}</div>
                    <div className="flex items-center gap-2">
                        <span className="bg-white/10 px-2 py-1 rounded text-sm font-mono font-bold">Option {selectedOption}</span>
                        <span className="muted italic text-sm">{optionConfig.note}</span>
                    </div>
                    <div className="font-mono text-2xl font-bold mt-2 pt-2 border-t border-white/10 flex justify-between">
                        <span className={optionConfig.amt >= 0 ? "text-green-400" : "text-red-400"}>
                            {optionConfig.amt >= 0 ? '+' : ''}{formatCurrency(optionConfig.amt)}
                        </span>
                        <span className={optionConfig.pts >= 0 ? "text-blue-400" : "text-orange-400"}>
                            {optionConfig.pts >= 0 ? '+' : ''}{optionConfig.pts} Pkt
                        </span>
                    </div>
                  </div>
              ) : <div>Bitte Team wählen</div>}
           </div>

           <button className="btn w-full py-4 text-xl font-bold shadow-xl shadow-blue-500/20" onClick={handleBook}>BUCHEN & SPEICHERN</button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm font-bold mb-4 uppercase text-slate-500">Referenz Jahr {selectedYear}</h3>
            <div className="flex flex-col gap-3">
               {(['A','B','C'] as const).map(opt => (
                   <div key={opt} className={`p-3 rounded-lg border ${selectedOption === opt ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 opacity-60'}`}>
                       <div className="font-bold text-sm mb-1">Option {opt}: {yearConfig[opt].note}</div>
                       <div className="text-xs font-mono">{yearConfig[opt].amt} € / {yearConfig[opt].pts} Pkt</div>
                   </div>
               ))}
            </div>
        </div>
      </div>

      <div className="panel flex flex-col h-[calc(100vh-100px)]">
        <h2 className="text-2xl mb-4">Buchungs-Historie</h2>
        <div className="overflow-auto flex-1 custom-scrollbar pr-2">
            <table className="table w-full text-left">
            <thead className="sticky top-0 bg-[#1e293b] z-10 shadow-lg">
                <tr>
                <th className="w-24">Zeit</th>
                <th className="w-16">Jahr</th>
                <th>Team</th>
                <th className="w-16">Opt</th>
                <th className="text-right">€</th>
                <th className="text-right">Pkt</th>
                <th className="w-24"></th>
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
                            <button className="btn-ghost text-xs py-2 px-3 hover:bg-red-900/50 hover:text-red-200 hover:border-red-800" onClick={() => onUndo(a.id)}>Rückgängig</button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
            {gameState.assignments.length === 0 && (
                <div className="text-center py-20 text-slate-600 text-xl font-bold">
                    Noch keine Buchungen vorhanden.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClosingDashboard;