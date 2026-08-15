'use client';

import { Sparkles, Plus } from 'lucide-react';

export default function ContentCalendarPage() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  // Generating a grid for the calendar
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    let date = i - 3; // Offset to match screenshot roughly
    if (date <= 0) return { date: 28 + date, isPrevMonth: true };
    if (date > 31) return { date: date - 31, isNextMonth: true };
    return { date, isCurrentMonth: true };
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Calendar</h1>
          <p className="text-gray-500 text-lg">Plan, schedule, and optimize your local marketing.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-lg shadow-sm text-sm">Month</button>
            <button className="px-6 py-2 text-gray-500 hover:text-gray-900 font-medium rounded-lg text-sm transition-colors">Week</button>
            <button className="px-6 py-2 text-gray-500 hover:text-gray-900 font-medium rounded-lg text-sm transition-colors">List</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-[#3C2EE5] text-white rounded-xl font-medium hover:bg-[#3226c2] shadow-md shadow-indigo-100 transition-colors">
            <Plus className="w-5 h-5" /> New Post
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden relative">
        <div className="grid grid-cols-7 border-b">
          {days.map((day) => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-500 tracking-widest uppercase">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-gray-50 gap-px p-4">
          {calendarDays.map((item, index) => {
            const isToday = item.date === 7 && item.isCurrentMonth;
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-xl p-2 flex flex-col gap-1 min-h-[120px] ${item.isPrevMonth || item.isNextMonth ? 'opacity-40' : ''} ${isToday ? 'ring-2 ring-[#3C2EE5] ring-inset shadow-md' : 'hover:bg-gray-50'} transition-all`}
              >
                <div className="flex justify-between items-start mb-1 px-1 pt-1">
                  <span className={`text-sm font-medium ${isToday ? 'text-[#3C2EE5]' : 'text-gray-500'}`}>
                    {item.date}
                  </span>
                  {isToday && <div className="w-2 h-2 rounded-full bg-red-500 mt-1" />}
                </div>

                {/* Mock Events based on screenshot */}
                {item.date === 1 && item.isCurrentMonth && (
                  <div className="bg-indigo-100 border-l-4 border-[#3C2EE5] p-2 rounded text-xs">
                    <div className="font-semibold text-gray-900 truncate">IG Reel: Sto...</div>
                    <div className="text-gray-500">10:00 AM</div>
                  </div>
                )}
                {item.date === 2 && item.isCurrentMonth && (
                  <div className="bg-green-100 border-l-4 border-green-600 p-2 rounded text-xs">
                    <div className="font-semibold text-gray-900 truncate">WhatsApp ...</div>
                    <div className="text-gray-500">4:00 PM</div>
                  </div>
                )}
                {item.date === 4 && item.isCurrentMonth && (
                  <div className="bg-purple-100 border-l-4 border-purple-600 p-2 rounded text-xs">
                    <div className="font-semibold text-gray-900 truncate">FB Post: Ne...</div>
                    <div className="text-gray-500">12:00 PM</div>
                  </div>
                )}
                {item.date === 6 && item.isCurrentMonth && (
                  <div className="bg-indigo-100 border-l-4 border-[#3C2EE5] p-2 rounded text-xs">
                    <div className="font-semibold text-gray-900 truncate">IG Post: Sp...</div>
                    <div className="text-gray-500">9:00 AM</div>
                  </div>
                )}
                {item.date === 7 && item.isCurrentMonth && (
                  <>
                    <div className="bg-green-100 border-l-4 border-green-600 p-2 rounded text-xs">
                      <div className="font-semibold text-gray-900 truncate">WhatsApp ...</div>
                    </div>
                    <div className="bg-gray-100 border-l-4 border-gray-400 p-2 rounded text-xs opacity-70">
                      <div className="font-semibold text-gray-900 truncate">Draft: Blog ...</div>
                    </div>
                  </>
                )}
                {item.date === 9 && item.isCurrentMonth && (
                  <div className="bg-purple-100 border-l-4 border-purple-600 p-2 rounded text-xs">
                    <div className="font-semibold text-gray-900 truncate">FB Story: B...</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="h-16 border-t bg-white flex items-center justify-between px-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3C2EE5]" />
              <span className="text-sm font-medium text-gray-600">Instagram / Facebook</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-sm font-medium text-gray-600">WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-sm font-medium text-gray-600">Drafts</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg text-green-800 text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-green-600" />
            AI suggests posting on Thursdays at 6PM for peak local engagement.
          </div>
        </div>
      </div>
    </div>
  );
}
