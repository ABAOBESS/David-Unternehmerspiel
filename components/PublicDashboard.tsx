import React, { useEffect, useState, useRef } from 'react';
import { GameState } from '../types';
import { YEAR_CONFIGS, ICONS, GAME_RULES } from '../constants';
import { formatCurrency, calculateScore } from '../services/gameLogic';
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
  const [showRules, setShowRules] = useState(false);
  const timerRef = useRef<any>(null);

  const sortedTeams = [...gameState.teams].sort((a, b) => calculateScore(b) - calculateScore(a));
  const yearConfig = YEAR_CONFIGS.find(y => y.year === gameState.year) || YEAR_CONFIGS[0];

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

  const handleNewYear = () => {
    onNewYear();
    setTimeLeft(timerMinutes * 60);
    setTimerActive(true);
    audioService.playSquidCue(0.6);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-100px)] relative">
      
      {/* Rules Modal Overlay */}
      {showRules && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowRules(false)}>
          <div className="bg-[#1e293b] border border-white/20 p-8 rounded-2xl max-w-4xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
             <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                 <span>ℹ️</span> Spielregeln
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {GAME_RULES.map((rule, idx) => (
                     <div key={idx} className="bg-white/5 p-4 rounded-xl">
                         <div className="text-2xl mb-2">{rule.icon}</div>
                         <h3 className="font-bold text-xl text-indigo-300 mb-2">{rule.title}</h3>
                         <p className="text-slate-300 leading-relaxed whitespace-pre-line">{rule.text}</p>
                     </div>
                 ))}
             </div>
             <div className="mt-8 text-right">
                 <button className="btn px-8 py-3 text-lg" onClick={() => setShowRules(false)}>Verstanden</button>
             </div>
          </div>
        </div>
      )}

      {/* Sidebar: Ranking */}
      <div className="panel flex flex-col h-full overflow-hidden">
        <h2 className="text-2xl mb-2">🏆 Rangliste</h2>
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {sortedTeams.map((t, i) => {
            const score = calculateScore(t);
            return (
                <div key={t.id} className={`team-row p-3 border ${t.capital < 0 ? 'border-red-500/50 bg-red-900/10' : 'border-white/10'}`}>
                <div className="flex items-center gap-3">
                    <span className={`text-xl font-black w-8 ${i===0?'text-yellow-400':i===1?'text-slate-300':i===2?'text-orange-400':'text-slate-500'}`}>#{i + 1}</span>
                    <div className="flex-1">
                        <div className="font-bold text-lg flex items-center gap-2">
                            <span className="w-6 h-6 inline-block opacity-80" dangerouslySetInnerHTML={{ __html: ICONS[t.icon] || ICONS['gear'] }} />
                            {t.name}
                        </div>
                        <div className="flex justify-between items-center mt-1 text-sm">
                            <div className={`font-mono ${t.capital < 0 ? 'text-red-500 font-bold' : 'text-green-400'}`}>{formatCurrency(t.capital)}</div>
                            <div className="opacity-70">{score} Score</div>
                        </div>
                        {t.jokerActive && (
                            <div className="text-[10px] text-red-300 mt-1 uppercase tracking-wide font-bold">
                                {t.jokerActive === 'BANK' ? '🏦 Bank-Kredit' : '🦈 Investor'}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2">
        
        {/* Controls */}
        <div className="panel flex items-center justify-between py-4 bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border-indigo-500/30">
             <div className="flex items-center gap-6">
                <div className="timer bg-black/40 px-6 py-2 rounded-xl border border-white/10 min-w-[180px] text-center">
                    <div className={`display text-5xl font-mono ${timeLeft === 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</div>
                </div>
                <div className="flex gap-2">
                    <button className="btn w-12 flex items-center justify-center" onClick={() => setTimerActive(true)}>▶</button>
                    <button className="btn-ghost w-12 flex items-center justify-center" onClick={() => setTimerActive(false)}>⏸</button>
                    <button className="btn-ghost w-12 flex items-center justify-center" onClick={() => {setTimerActive(false); setTimeLeft(timerMinutes*60)}}>↺</button>
                </div>
             </div>
             
             <div className="flex gap-4">
                <button className="btn-ghost" onClick={() => setShowRules(true)}>ℹ️ Regeln</button>
                <button className="btn btn-warn shadow-lg shadow-orange-500/20" onClick={handleNewYear}>
                    🚀 JAHR {gameState.year} STARTEN
                </button>
             </div>
        </div>

        {/* Scenario */}
        <div className="panel bg-[#0f172a] border-l-8 border-l-indigo-500 py-8">
          <h2 className="text-indigo-400 uppercase tracking-wide text-sm font-bold mb-2">Aktuelles Szenario: Jahr {gameState.year}</h2>
          <div className="font-extrabold text-4xl mb-4 text-white leading-tight">{yearConfig.title}</div>
          <div className="text-2xl text-slate-300 leading-relaxed font-light">{yearConfig.scenario}</div>
        </div>

        {/* Generic Option Preview (Since actual options depend on Team Path, we show generic A/B/C placeholders or a hint) */}
        <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4 opacity-50">🔀</div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">Pfadabhängige Entscheidungen</h3>
            <p className="text-xl text-slate-400 max-w-2xl">
                Jedes Team sieht jetzt individuelle Optionen auf seinen Tablets, basierend auf der bisherigen Strategie.
                <br/><br/>
                <span className="text-indigo-400">Bitte wählt Option A, B oder C auf eurem Gerät.</span>
            </p>
        </div>

      </div>
    </div>
  );
};

export default PublicDashboard;
