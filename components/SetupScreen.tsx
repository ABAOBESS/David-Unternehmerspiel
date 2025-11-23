import React, { useState } from 'react';

interface SetupScreenProps {
  onStartGame: (teamCount: number, totalPlayers: number) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [teamCount, setTeamCount] = useState(5);
  const [totalPlayers, setTotalPlayers] = useState(25);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-indigo-900 mb-2">Startup Tycoon</h1>
           <p className="text-slate-500">Game Master Setup</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Anzahl der Teams
            </label>
            <input 
                type="number" 
                min="2" 
                max="10" 
                value={teamCount} 
                onChange={(e) => setTeamCount(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Gesamtanzahl Spieler
            </label>
            <input 
                type="number" 
                min="2" 
                max="200" 
                value={totalPlayers} 
                onChange={(e) => setTotalPlayers(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
                ca. {Math.floor(totalPlayers / teamCount)} Spieler pro Team
            </p>
          </div>

          <div className="pt-4">
             <button 
                onClick={() => onStartGame(teamCount, totalPlayers)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
             >
                Spiel erstellen & Dashboard öffnen
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;