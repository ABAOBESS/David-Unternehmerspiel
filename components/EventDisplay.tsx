import React from 'react';
import { GameEvent } from '../types';

interface EventDisplayProps {
  event: GameEvent;
}

const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
  return (
    <div className="bg-white border-l-4 border-indigo-500 shadow-md rounded-r-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-indigo-500 uppercase mb-1">Aktuelles Ereignis</h3>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
          <p className="text-gray-600">{event.description}</p>
        </div>
        <div className="flex flex-col gap-2 text-right">
            <span className={`px-2 py-1 text-xs font-bold rounded ${event.marketMultiplier >= 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Markt: {Math.round(event.marketMultiplier * 100)}%
            </span>
            <span className={`px-2 py-1 text-xs font-bold rounded ${event.costMultiplier <= 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Kosten: {Math.round(event.costMultiplier * 100)}%
            </span>
        </div>
      </div>
    </div>
  );
};

export default EventDisplay;