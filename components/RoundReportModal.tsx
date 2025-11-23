import React, { useEffect, useState } from 'react';
import { RoundResult, AIAdvice } from '../types';
import { formatCurrency } from '../services/gameLogic';
import { getConsultantAdvice } from '../services/aiService';

interface RoundReportModalProps {
  result: RoundResult;
  nextEventTitle: string;
  onClose: () => void;
}

const RoundReportModal: React.FC<RoundReportModalProps> = ({ result, nextEventTitle, onClose }) => {
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAi(true);
      const advice = await getConsultantAdvice(result, nextEventTitle);
      setAiAdvice(advice);
      setLoadingAi(false);
    };
    fetchAdvice();
  }, [result, nextEventTitle]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Jahresabschluss: Jahr {result.round}</h2>
              <p className="opacity-80">Ereignis: {result.event.title}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Gesamtscore</div>
              <div className="text-3xl font-bold">{result.totalScore} Pkt</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Financials */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Finanzbericht</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Umsatz ({result.sales} Stk.)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(result.revenue)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Variable Kosten</span>
                <span>- {formatCurrency(result.variableCosts)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Fixkosten (Personal)</span>
                <span>- {formatCurrency(result.fixedCosts)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Investitionen (Prod/Mark)</span>
                <span>- {formatCurrency(result.productCost + result.marketingCost)}</span>
              </div>
              {result.coopCost > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Markt-Allianz (Koop)</span>
                  <span>- {formatCurrency(result.coopCost)}</span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Jahresüberschuss</span>
                <span className={result.profit >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(result.profit)}
                </span>
              </div>
            </div>

            {/* Balanced Scorecard Mini Table */}
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 pt-4">Balanced Scorecard</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-500">Finanzen</div>
                    <div className="font-bold text-indigo-600">{result.scoreFinancial} Pkt</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-500">Innovation</div>
                    <div className="font-bold text-indigo-600">{result.scoreInnovation} Pkt</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-500">Mitarbeiter</div>
                    <div className="font-bold text-indigo-600">{result.scoreEmployees} Pkt</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-500">Planung</div>
                    <div className="font-bold text-indigo-600">{result.scorePlanning} Pkt</div>
                </div>
            </div>
          </div>

          {/* Right: Analysis & AI */}
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                KI-Consultant Analyse
                <span className="ml-2 text-xs font-normal text-gray-500 px-2 py-1 bg-gray-100 rounded">Powered by Gemini</span>
            </h3>
            
            <div className="flex-1 mt-4 bg-indigo-50 rounded-xl p-5 border border-indigo-100">
              {loadingAi ? (
                <div className="flex items-center justify-center h-full text-indigo-400 animate-pulse">
                  Daten werden analysiert...
                </div>
              ) : aiAdvice ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 italic">"{aiAdvice.analysis}"</p>
                  
                  <div>
                    <div className="text-xs font-bold uppercase text-indigo-800 mb-2">Empfehlungen:</div>
                    <ul className="space-y-2">
                      {aiAdvice.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-800">
                          <span className="mr-2 text-indigo-500">➜</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                 <div className="text-sm text-red-500">Keine Analyse verfügbar.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all"
          >
            Nächstes Geschäftsjahr starten
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundReportModal;