import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Team, GameState, RoundDecisions } from '../types';
import { formatCurrency } from '../services/gameLogic';
import DecisionPanel from './DecisionPanel';
import StatCard from './StatCard';
import EventDisplay from './EventDisplay';
import RoundReportModal from './RoundReportModal';
import TutorialModal from './TutorialModal';

interface AppTeamViewProps {
  team: Team;
  gameState: GameState;
  onSubmitDecisions: (decisions: RoundDecisions) => void;
}

const AppTeamView: React.FC<AppTeamViewProps> = ({ team, gameState, onSubmitDecisions }) => {
  const [showReport, setShowReport] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [decisions, setDecisions] = useState<RoundDecisions>(team.currentDecisions);

  // Detect Round Change to show Report
  useEffect(() => {
    // If we have history for the PREVIOUS round (current round - 1), show report
    const lastResult = team.state.history.find(h => h.round === gameState.round - 1);
    
    // Only show report if we haven't seen it yet for this specific history entry
    // A simple check is: did the round number just increase?
    // For simplicity in this demo: if the last history item matches round-1, we assume it's fresh.
    if (gameState.round > 1 && lastResult) {
        // We handle "closing" the report by local state, so this triggers on re-render if we didn't explicitly close it?
        // Better: useEffect on gameState.round changes.
    }
  }, [gameState.round, team.state.history]);

  // Effect to trigger report when round increases
  useEffect(() => {
    if (gameState.round > 1) {
        setShowReport(true);
        // Reset local decisions form state to match the fresh state from props
        setDecisions(team.currentDecisions); 
    }
  }, [gameState.round]); // Only when round number changes

  const handleSubmit = () => {
    onSubmitDecisions({ ...decisions, submitted: true });
  };

  const estimatedFixed = (team.state.employees + decisions.hiringDelta) * 8000;
  const estimatedInvest = decisions.productInvest + decisions.marketingInvest + (decisions.coopInvest ? 2500 : 0);
  const lastResult = team.state.history[team.state.history.length - 1];

  if (gameState.isGameOver) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-10 text-center">
                <h1 className="text-4xl font-bold mb-4">Spiel Vorbei!</h1>
                <div className="text-2xl mb-4">Score: {team.state.history.reduce((a,b) => a+b.totalScore, 0)}</div>
                <div className="text-xl">Endkapital: {formatCurrency(team.state.capital)}</div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-20">
      
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      <header className="bg-white shadow-sm sticky top-0 z-10 border-t-4 border-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center text-white font-bold">ST</div>
              <div>
                  <h1 className="text-lg font-bold text-gray-800 leading-tight">{team.name}</h1>
                  <p className="text-xs text-slate-500">{team.playerCount} Mitglieder</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={() => setShowTutorial(true)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline hidden sm:block">
                Hilfe
              </button>
              <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-600">
                Jahr {gameState.round}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${team.state.capital < 20000 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                 {formatCurrency(team.state.capital)}
              </div>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <StatCard title="Innovation" value={team.state.innovation.toFixed(1)} color="purple" />
           <StatCard title="Bekanntheit" value={team.state.awareness.toFixed(1)} color="orange" />
           <StatCard title="Mitarbeiter" value={team.state.employees} color="blue" />
           <StatCard title="Fixkosten (est.)" value={formatCurrency(estimatedFixed)} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Decisions */}
          <div className="lg:col-span-2 space-y-6">
            <EventDisplay event={gameState.currentEvent} />
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ihre Entscheidungen</h2>
            <DecisionPanel decisions={decisions} onChange={setDecisions} disabled={team.isReady} />
            
            {!team.isReady ? (
                <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg mt-6 flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-4 sm:mb-0">
                        <div className="text-sm opacity-70">Geschätzte Ausgaben (fix + invest)</div>
                        <div className="text-2xl font-bold">{formatCurrency(estimatedFixed + estimatedInvest)}</div>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-lg shadow transition transform hover:scale-105"
                    >
                        Entscheidungen einloggen
                    </button>
                </div>
            ) : (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-bold animate-pulse">
                    Warten auf andere Teams und Spielleitung...
                </div>
            )}
          </div>

          {/* Right Column: Analytics */}
          <div className="space-y-6">
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Finanztrend</h3>
                <div className="h-48 w-full">
                    {team.state.history.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={team.state.history}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                           <XAxis dataKey="round" hide />
                           <Tooltip />
                           <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
                           <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={2} dot={false} />
                         </LineChart>
                       </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            Keine Daten verfügbar
                        </div>
                    )}
                </div>
             </div>

             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Scorecard</h3>
                <div className="h-48 w-full">
                    {team.state.history.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={team.state.history}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                           <XAxis dataKey="round" />
                           <Tooltip cursor={{fill: 'transparent'}} />
                           <Bar dataKey="totalScore" fill="#6366f1" radius={[4, 4, 0, 0]} />
                         </BarChart>
                       </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            Starten Sie Runde 1
                        </div>
                    )}
                </div>
             </div>
          </div>

        </div>
      </main>

      {showReport && lastResult && (
        <RoundReportModal 
            result={lastResult} 
            nextEventTitle="Unbekannt" 
            onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  );
};

export default AppTeamView;