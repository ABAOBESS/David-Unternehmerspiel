import React, { useEffect, useState, useRef } from 'react';
import { GameState } from '../types';
import { YEARS, ICONS, ABC_STORY, YEAR_SCENARIO } from '../constants';
import { formatCurrency } from '../services/gameLogic';
import { audioService } from '../services/audioService';

interface Props {
  gameState: GameState;
  onNewYear: () => void;
  onNavigateToClosing: (year: number, option: string) => void;
}

const PublicDashboard: React.FC<Props> = ({ gameState, onNewYear, onNavigateToClosing }) => {
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<any>(null);

  const sortedTeams = [...gameState.teams].sort((a, b) => (b.capital + b.points * 100) - (a.capital + a.points * 100));
  const currentScenario = YEAR_SCENARIO[gameState.year] || YEAR_SCENARIO[1];
  const yearConfig = YEARS.find(y => y.year === gameState.year) || YEARS[0];
  const stories = ABC_STORY[gameState.year] || {A:{title:'',story:''}, B:{title:'',story:''}, C:{title:'',story:''}};

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
             setTimerActive(false);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  const handleStartTimer = () => setTimerActive(true);
  const handlePauseTimer = () => setTimerActive(false);
  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMinutes * 60);
  };
  
  const handleNewYear = () => {
    onNewYear();
    setTimeLeft(timerMinutes * 60);
    setTimerActive(true);
    audioService.playSquidCue(0.6);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 h-[calc(100vh-100px)]">
      {/* Sidebar: Ranking */}
      <div className="panel flex flex-col h-full overflow-hidden">
        <h2 className="text-2xl mb-2">🏆 Rangliste</h2>
        <div className="muted mb-4 text-base">Live-Stand der Teams</div>
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {sortedTeams.map((t, i) => (
            <div key={t.id} className="team-row p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <span className={`text-xl font-black w-8 ${i===0?'text-yellow-400':i===1?'text-slate-300':i===2?'text-orange-400':'text-slate-500'}`}>#{i + 1}</span>
                <div className="flex-1">
                    <div className="font-bold text-xl flex items-center gap-2">
                        <span className="w-6 h-6 inline-block opacity-80" dangerouslySetInnerHTML={{ __html: ICONS[t.icon] || ICONS['gear'] }} />
                        {t.name}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <div className="font-mono text-lg text-green-400">{formatCurrency(t.capital)}</div>
                        <div className={`pill ${i === 0 ? 'pill-ok' : i === 1 ? 'pill-warn' : 'pill-danger'}`}>
                            {t.points} Pkt
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Scenario & Options */}
      <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2">
        
        {/* Top Bar: Controls & Timer */}
        <div className="panel flex flex-col xl:flex-row gap-6 items-center justify-between bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border-indigo-500/30">
             <div className="flex items-center gap-6 w-full xl:w-auto">
                <div className="timer bg-black/40 px-6 py-2 rounded-xl border border-white/10 text-center min-w-[200px]">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">Verbleibende Zeit</div>
                    <div className={`display text-6xl ${timeLeft === 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button className="btn px-6" onClick={handleStartTimer}>▶ Start</button>
                        <button className="btn-ghost" onClick={handlePauseTimer}>⏸</button>
                        <button className="btn-ghost" onClick={handleResetTimer}>↺</button>
                    </div>
                    <div className="flex items-center gap-2 text-sm muted">
                        <input type="number" value={timerMinutes} onChange={e => setTimerMinutes(Number(e.target.value))} className="w-16 text-center bg-black/30 border-none h-8" />
                        Minuten
                    </div>
                </div>
             </div>

             <div className="flex flex-col items-end gap-2 w-full xl:w-auto text-right">
                <div className="text-sm muted">Aktuelles Jahr: <strong className="text-white text-lg">{gameState.year}</strong></div>
                <button className="btn btn-warn text-lg px-8 shadow-lg shadow-orange-500/20" onClick={handleNewYear}>
                    🚀 NEUES JAHR STARTEN
                </button>
             </div>
        </div>

        {/* Scenario Box */}
        <div className="panel bg-[#0f172a] border-l-8 border-l-indigo-500">
          <h2 className="text-indigo-400 uppercase tracking-wide text-lg mb-2">Szenario Jahr {gameState.year}</h2>
          <div className="font-extrabold text-4xl mb-4 text-white leading-tight">{currentScenario.title}</div>
          <div className="text-xl text-slate-300 leading-relaxed max-w-5xl">{currentScenario.text}</div>
        </div>

        {/* Options Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['A', 'B', 'C'] as const).map(optKey => {
            const optData = yearConfig[optKey];
            const storyData = stories[optKey];
            return (
              <div key={optKey} className="abc-opt flex flex-col h-full" onClick={() => onNavigateToClosing(gameState.year, optKey)}>
                <div className="flex justify-between items-start mb-4">
                    <div className="text-6xl font-black text-white/10">{optKey}</div>
                    <div className="text-right">
                        <div className={`text-xl font-bold ${optData.amt >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {optData.amt >= 0 ? '+' : ''}{formatCurrency(optData.amt)}
                        </div>
                        <div className={`text-lg font-bold ${optData.pts >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                            {optData.pts >= 0 ? '+' : ''}{optData.pts} Pkt
                        </div>
                    </div>
                </div>
                
                <div className="text-2xl font-bold mb-3 text-white">{optData.note}</div>
                <div className="text-lg text-slate-400 leading-normal flex-1">
                    {storyData.story || optData.note}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-indigo-400 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Klicken zum Buchen
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;