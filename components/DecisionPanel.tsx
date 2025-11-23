import React from 'react';
import { RoundDecisions, PriceStrategy } from '../types';
import { PRICES } from '../constants';

interface DecisionPanelProps {
  decisions: RoundDecisions;
  onChange: (newDecisions: RoundDecisions) => void;
  disabled: boolean;
}

const DecisionPanel: React.FC<DecisionPanelProps> = ({ decisions, onChange, disabled }) => {
  
  const handleChange = (key: keyof RoundDecisions, value: any) => {
    if (disabled) return;
    onChange({ ...decisions, [key]: value });
  };

  if (disabled && decisions.submitted) {
    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Entscheidungen eingereicht</h2>
            <p className="text-green-700">Bitte warten Sie auf die Runden-Auswertung durch die Spielleitung.</p>
        </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Product Dev */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">1</span>
          Produktentwicklung
        </h3>
        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="prod" checked={decisions.productInvest === 0} onChange={() => handleChange('productInvest', 0)} disabled={disabled} className="mr-3" />
            <div className="flex-1">
              <div className="font-semibold">Keine Optimierung</div>
              <div className="text-xs text-gray-500">0 € (Innovation stagniert)</div>
            </div>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="prod" checked={decisions.productInvest === 10000} onChange={() => handleChange('productInvest', 10000)} disabled={disabled} className="mr-3" />
            <div className="flex-1">
              <div className="font-semibold">Standard Weiterentwicklung</div>
              <div className="text-xs text-gray-500">10.000 € (+ Innovation)</div>
            </div>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="prod" checked={decisions.productInvest === 20000} onChange={() => handleChange('productInvest', 20000)} disabled={disabled} className="mr-3" />
            <div className="flex-1">
              <div className="font-semibold">F&E Offensive</div>
              <div className="text-xs text-gray-500">20.000 € (++ Innovation)</div>
            </div>
          </label>
        </div>
      </div>

      {/* Marketing */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs mr-2">2</span>
          Marketing & Sales
        </h3>
        <div className="space-y-2 mb-4">
             <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="mark" checked={decisions.marketingInvest === 0} onChange={() => handleChange('marketingInvest', 0)} disabled={disabled} className="mr-3" />
            <div className="flex-1">
              <div className="font-semibold">Mundpropaganda</div>
              <div className="text-xs text-gray-500">0 €</div>
            </div>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="mark" checked={decisions.marketingInvest === 5000} onChange={() => handleChange('marketingInvest', 5000)} disabled={disabled} className="mr-3" />
            <div className="flex-1">
              <div className="font-semibold">Online Kampagne</div>
              <div className="text-xs text-gray-500">5.000 € (+ Bekanntheit)</div>
            </div>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="mark" checked={decisions.marketingInvest === 15000} onChange={() => handleChange('marketingInvest', 15000)} disabled={disabled} className="mr-3" />
            <div className="flex-1">
              <div className="font-semibold">TV & Print</div>
              <div className="text-xs text-gray-500">15.000 € (++ Bekanntheit)</div>
            </div>
          </label>
        </div>

        {/* Co-op */}
        <div className="pt-3 border-t border-dashed border-gray-200">
           <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={decisions.coopInvest} 
                onChange={(e) => handleChange('coopInvest', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
              />
              <div className="ml-3">
                 <span className="block text-sm font-medium text-gray-700">Markt-Allianz beitreten</span>
                 <span className="block text-xs text-gray-500">Kosten: 2.500 €. Bonus auf Bekanntheit durch Synergien.</span>
              </div>
           </label>
        </div>
      </div>

      {/* HR */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">3</span>
          Personal (Fixkosten)
        </h3>
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Änderung:</span>
            <span className={`font-bold ${decisions.hiringDelta > 0 ? 'text-green-600' : decisions.hiringDelta < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {decisions.hiringDelta > 0 ? '+' : ''}{decisions.hiringDelta} MA
            </span>
        </div>
        <input 
            type="range" 
            min="-2" 
            max="2" 
            step="1" 
            value={decisions.hiringDelta} 
            onChange={(e) => handleChange('hiringDelta', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>-2 (Abbau)</span>
            <span>0 (Halten)</span>
            <span>+2 (Ausbau)</span>
        </div>
      </div>

      {/* Price & Planning */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs mr-2">4</span>
          Strategie & Planung
        </h3>
        
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Preisstrategie</label>
            <select 
                value={decisions.priceStrategy}
                onChange={(e) => handleChange('priceStrategy', e.target.value)}
                disabled={disabled}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
                {Object.values(PriceStrategy).map(p => (
                    <option key={p} value={p}>{p} ({PRICES[p]} €)</option>
                ))}
            </select>
        </div>

        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Absatzplanung (Stück)</label>
             <input 
                type="number"
                min="0"
                max="20000"
                value={decisions.plannedSales}
                onChange={(e) => handleChange('plannedSales', parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
             />
             <p className="text-xs text-gray-500 mt-1">Schätzung für BSC Planungsqualität</p>
        </div>
      </div>
    </div>
  );
};

export default DecisionPanel;