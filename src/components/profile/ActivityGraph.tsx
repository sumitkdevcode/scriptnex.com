'use client';

import React, { useMemo } from 'react';

interface ActivityGraphProps {
  calendar: Record<string, number>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ActivityGraph({ calendar }: ActivityGraphProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Adjust to the start of the week (Sunday)
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks = [];
    const monthLabels: { label: string; index: number }[] = [];
    let currentMonth = -1;

    for (let w = 0; w < 53; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (w * 7) + d);
        
        if (date > today) {
          days.push(null);
          continue;
        }

        const dateString = date.toISOString().split('T')[0];
        const count = calendar[dateString] || 0;
        
        // Track month changes for labels
        if (d === 0 && date.getMonth() !== currentMonth) {
          currentMonth = date.getMonth();
          monthLabels.push({ label: MONTHS[currentMonth], index: w });
        }

        days.push({
          date: dateString,
          count,
          level: getLevel(count),
        });
      }
      weeks.push(days);
    }

    return { weeks, monthLabels };
  }, [calendar]);

  function getLevel(count: number) {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  }

  const levelColors = [
    'bg-[#2a2d35]',
    'bg-[#00623d]',
    'bg-[#009c5d]',
    'bg-[#00d285]',
    'bg-[#00ff9f]',
  ];

  return (
    <div className="flex flex-col select-none">
      <div className="flex gap-2">
        {/* Day labels (Sun, Tue, Thu, Sat) */}
        <div className="flex flex-col gap-[3px] text-[10px] text-[#64748b] pt-[20px] shrink-0">
          <div className="h-[11px] flex items-center">Sun</div>
          <div className="h-[11px]" />
          <div className="h-[11px] flex items-center">Tue</div>
          <div className="h-[11px]" />
          <div className="h-[11px] flex items-center">Thu</div>
          <div className="h-[11px]" />
          <div className="h-[11px] flex items-center">Sat</div>
        </div>

        {/* Scrollable Container for Labels + Grid */}
        <div className="flex-1 overflow-x-auto pb-2 custom-scrollbar">
          <div className="inline-flex flex-col">
            {/* Month Labels */}
            <div className="flex text-[10px] text-[#64748b] h-5 relative mb-1">
              {monthLabels.map((m, i) => (
                <div 
                  key={i} 
                  className="absolute whitespace-nowrap" 
                  style={{ left: `${wIdxToPx(m.index)}px` }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-colors group relative ${
                        day ? levelColors[day.level] : 'bg-transparent'
                      }`}
                    >
                      {day && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap pointer-events-none">
                          <div className="bg-[#1a1c23] border border-[#2a2d35] text-[#f8fafc] text-[10px] py-1 px-2 rounded shadow-xl font-medium">
                            <span className="text-[#00d285]">{day.count}</span> submissions on {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="w-1.5 h-1.5 bg-[#1a1c23] border-r border-b border-[#2a2d35] rotate-45 absolute -bottom-[3px] left-1/2 -translate-x-1/2"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-[#64748b]">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {levelColors.map((color, i) => (
            <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${color}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function wIdxToPx(index: number) {
  // 11px box + 3px gap
  return index * (11 + 3);
}
