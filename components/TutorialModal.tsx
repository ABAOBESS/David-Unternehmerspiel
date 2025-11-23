import React, { useState } from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col min-h-[400px]">
        
        {/* Header with Progress */}
        <div className="bg-indigo-600 p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Willkommen bei Startup Tycoon</h2>
            <div className="flex justify-center gap-2">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-2 w-8 rounded-full ${step >= s ? 'bg-white' : 'bg-indigo-400'}`} />
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
            
            {step === 1 && (
                <>
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Das Ziel</h3>
                    <p className="text-gray-600">
                        Führen Sie Ihr Start-up durch 6 Geschäftsjahre (Runden). 
                        Ihr Ziel ist es, den höchsten <b>Score</b> zu erreichen und <b>nicht pleite</b> zu gehen (Kapital &gt; 0).
                    </p>
                </>
            )}

            {step === 2 && (
                <>
                     <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Die Kennzahlen</h3>
                    <p className="text-gray-600 mb-4">
                        Achten Sie auf Ihre Balance:
                    </p>
                    <ul className="text-left text-sm space-y-2 bg-gray-50 p-4 rounded-lg w-full">
                        <li>💰 <b>Kapital:</b> Sinkt es unter Null, ist das Spiel vorbei.</li>
                        <li>🚀 <b>Innovation:</b> Macht Ihr Produkt attraktiver.</li>
                        <li>📢 <b>Bekanntheit:</b> Bringt Kunden zu Ihrem Produkt.</li>
                        <li>👥 <b>Mitarbeiter:</b> Bestimmen die max. Produktionskapazität.</li>
                    </ul>
                </>
            )}

            {step === 3 && (
                <>
                     <div className="text-6xl mb-4">⚙️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ihre Entscheidungen</h3>
                    <p className="text-gray-600 mb-4">
                        In jeder Runde treffen Sie 4 Entscheidungen:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm w-full">
                        <div className="bg-blue-50 p-2 rounded text-blue-800">Produktentwicklung</div>
                        <div className="bg-pink-50 p-2 rounded text-pink-800">Marketing</div>
                        <div className="bg-green-50 p-2 rounded text-green-800">Personal (Fixkosten)</div>
                        <div className="bg-orange-50 p-2 rounded text-orange-800">Preisstrategie</div>
                    </div>
                </>
            )}

             {step === 4 && (
                <>
                     <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Interaktion & Events</h3>
                    <p className="text-gray-600 mb-4">
                        Jedes Jahr tritt ein zufälliges <b>Marktereignis</b> ein (z.B. Boom oder Krise).
                    </p>
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                        <b>Neu: Markt-Allianz</b><br/>
                        Sie können im Marketing-Bereich eine Kooperation eingehen. Das kostet eine Gebühr, bringt aber effizientere Bekanntheit durch gemeinsame Synergien mit anderen Teams.
                    </div>
                </>
            )}

        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
            <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className={`px-4 py-2 rounded text-gray-600 font-medium ${step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            >
                Zurück
            </button>
            <button 
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 shadow-md transition-transform transform active:scale-95"
            >
                {step === totalSteps ? 'Spiel starten' : 'Weiter'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default TutorialModal;