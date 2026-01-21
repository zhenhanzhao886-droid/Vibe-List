
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDataMap } from '../types';

interface CalendarViewProps {
  dataMap: AppDataMap;
}

const CalendarView: React.FC<CalendarViewProps> = ({ dataMap }) => {
  const navigate = useNavigate();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calendar logic
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (day: number) => {
    const d = new Date(year, month, day);
    return d.toDateString() === today.toDateString();
  };

  const hasActivity = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const data = dataMap[dateKey];
    return data && (data.tasks.length > 0 || data.thoughts.length > 0);
  };

  const handleDateClick = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/day/${dateKey}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <button onClick={prevMonth} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-white">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-white">{monthName}</h1>
        <button onClick={nextMonth} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-white">chevron_right</span>
        </button>
      </header>

      <div className="px-4 py-2">
        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="flex h-10 items-center justify-center text-[11px] font-bold uppercase tracking-widest text-text-dim">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {/* Empty spaces for first week */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12"></div>
          ))}
          
          {days.map(day => {
            const active = hasActivity(day);
            const selected = isSelected(day);
            return (
              <button 
                key={day} 
                onClick={() => handleDateClick(day)}
                className={`relative h-12 w-full text-sm font-medium transition-all group`}
              >
                <div className={`flex size-10 mx-auto items-center justify-center rounded-full transition-all group-active:scale-90 ${selected ? 'bg-primary text-background-dark font-bold' : 'text-white hover:bg-white/5'}`}>
                  {day}
                </div>
                {active && !selected && (
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/60"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto my-4 h-[1px] w-12 bg-muted-dark/50"></div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <h3 className="px-2 pb-4 text-sm font-bold uppercase tracking-widest text-text-dim">Quick Insights</h3>
        
        <div className="mb-4 overflow-hidden rounded-xl bg-surface-dark shadow-xl border border-white/5">
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Monthly Trend</p>
            </div>
            <p className="text-base font-medium leading-relaxed text-white">
              {days.filter(hasActivity).length} productive days tracked in {monthName.split(' ')[0]}.
            </p>
          </div>
          <div 
            className="w-full bg-center bg-no-repeat aspect-[21/9] bg-cover opacity-40 grayscale" 
            style={{ backgroundImage: `url('https://picsum.photos/seed/${monthName}/400/225')` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 rounded-xl bg-surface-dark p-5 border border-muted-dark/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-text-dim text-lg">history</span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Streak</p>
            </div>
            <p className="mt-1 text-2xl font-bold">5 Days</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-surface-dark p-5 border border-muted-dark/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-text-dim text-lg">analytics</span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Efficiency</p>
            </div>
            <p className="mt-1 text-2xl font-bold">84%</p>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-background-dark/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-8 z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-white/50 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Today</span>
        </button>
        <div className="relative -top-8">
           <button className="flex size-16 items-center justify-center rounded-full bg-primary text-background-dark shadow-2xl shadow-primary/40 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </button>
        </div>
        <button onClick={() => navigate('/calendar')} className="flex flex-col items-center gap-1 text-primary transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">Insights</span>
        </button>
      </nav>
    </div>
  );
};

export default CalendarView;
