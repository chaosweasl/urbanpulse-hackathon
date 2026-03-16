import React from 'react';

// Feed: PulseCard — displays a single pulse in the feed
// TODO: Show type badge, urgency indicator, author info, timestamp, actions
interface Pulse {
  type: string;
  urgency: 'low' | 'medium' | 'high';
  message: string;
  author: string;
  created_at: string | Date;
}

interface PulseCardProps {
  pulse: Pulse;
}

export function PulseCard({ pulse }: PulseCardProps) {
  // Map urgency levels to Tailwind background colors
  const urgencyColor = {
    low: "bg-green-200",
    medium: "bg-yellow-200",
    high: "bg-red-200"
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-blue-50 mb-3">
      
      {/* Type Badge & Urgency Indicator */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs px-2 py-1 rounded bg-blue-100 font-medium">
          {pulse.type}
        </span>

        {/* Fallback to gray if urgency is missing/invalid */}
        <span className={`text-xs px-2 py-1 rounded font-medium ${urgencyColor[pulse.urgency] || 'bg-gray-200'}`}>
          {pulse.urgency}
        </span>
      </div>

      {/* Message */}
      <p className="text-sm mb-3 text-gray-800">{pulse.message}</p>

      {/* Author & Timestamp */}
      <div className="text-xs text-gray-500 flex justify-between mb-3 border-b pb-3">
        <span>{pulse.author}</span>
        <span>{new Date(pulse.created_at).toLocaleTimeString()}</span>
      </div>

      {/* Actions (MISSING IN ORIGINAL CODE) */}
      <div className="flex gap-4 mt-2">
        <button className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors">
          Reply
        </button>
        <button className="text-xs font-semibold text-gray-600 hover:text-green-600 transition-colors">
          Resolve
        </button>
        <button className="text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors">
          Flag
        </button>
      </div>

    </div>
  )
}
