import React, { memo } from 'react';

// Feed: PulseCard — displays a single pulse in the feed
export interface Pulse {
  id?: string;
  type: string;
  urgency: 'low' | 'medium' | 'high';
  message: string;
  author: string;
  created_at: string | Date;
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
}

interface PulseCardProps {
  pulse: Pulse;
}

// Map urgency levels to Tailwind background colors (moved outside to prevent recreation on every render)
const URGENCY_COLORS: Record<Pulse['urgency'], string> = {
  low: 'bg-green-200',
  medium: 'bg-yellow-200',
  high: 'bg-red-200',
};

export const PulseCard = memo(function PulseCard({ pulse }: PulseCardProps) {
  const { type, urgency, message, author, created_at } = pulse;
  const bgColorClass = URGENCY_COLORS[urgency] || 'bg-gray-200';
  
  // Format the time efficiently and consistently
  const timeString = new Date(created_at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-3 bg-white">
      {/* Left colored strip (25%) */}
      <div className={`w-1/4 shrink-0 ${bgColorClass}`} />

      {/* Right content (75%) */}
      <div className="w-3/4 p-4 bg-blue-50/50 flex flex-col">
        {/* Type badge */}
        <span className="text-[10px] px-2.5 py-1 rounded bg-blue-100 font-bold uppercase tracking-wider mb-2 w-fit text-blue-800 shadow-sm">
          {type}
        </span>

        {/* Message / Task */}
        <p className="text-sm mb-3 text-gray-800 leading-relaxed font-medium">
          {message}
        </p>

        {/* Author & timestamp */}
        <div className="text-xs text-gray-500 flex justify-between items-center mt-auto border-t border-blue-100 pt-2">
          <span className="font-semibold text-gray-700 truncate mr-2">{author}</span>
          <span className="whitespace-nowrap font-medium text-gray-500">{timeString}</span>
        </div>
      </div>
    </div>
  );
});
