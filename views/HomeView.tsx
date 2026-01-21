
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, Thought } from '../types';

interface HomeViewProps {
  tasks: Task[];
  thoughts: Thought[];
  onToggleTask: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ tasks, thoughts, onToggleTask }) => {
  const navigate = useNavigate();
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="flex flex-col pb-32">
      <header className="sticky top-0 z-20 flex items-center bg-background-dark/80 backdrop-blur-md p-6 justify-between border-b border-white/5">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1">Oct 26</span>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight">Today</h2>
        </div>
        <button 
          onClick={() => navigate('/calendar')}
          className="flex items-center justify-center rounded-xl h-12 w-12 bg-card-dark text-white/70 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">calendar_today</span>
        </button>
      </header>

      <main className="flex-1 px-6 pt-4 space-y-10">
        {/* Daily Focus Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">Today's Focus</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-primary">{progress}%</span>
            </div>
          </div>
          <div className="space-y-2">
            {tasks.map(task => (
              <label 
                key={task.id}
                className={`flex items-center gap-x-4 p-4 rounded-xl bg-card-dark/40 border border-white/5 transition-all active:scale-95 cursor-pointer ${task.completed ? 'opacity-60' : ''}`}
              >
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="h-6 w-6 rounded-full border-2 border-primary/40 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0"
                />
                <p className={`text-base font-medium ${task.completed ? 'line-through opacity-50' : ''}`}>
                  {task.text}
                </p>
              </label>
            ))}
          </div>
        </section>

        {/* Captured Thoughts Section */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">Captured Thoughts</h3>
          <div className="space-y-4">
            {thoughts.map(thought => (
              <div 
                key={thought.id}
                onClick={() => navigate(`/thought/${thought.id}`)}
                className="group relative flex flex-col gap-3 bg-card-dark p-5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      {thought.category === 'Strategy' ? 'auto_awesome' : 
                       thought.category === 'Voice Note' ? 'mic' : 'lightbulb'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{thought.category}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold">{thought.timestamp}</p>
                </div>
                <p className="text-slate-200 text-base leading-relaxed font-normal">
                  {thought.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Voice FAB */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
        <button className="group flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_24px_-8px_rgba(37,182,180,0.5)] active:scale-90 transition-transform duration-200">
          <span className="material-symbols-outlined text-4xl font-light">mic</span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Tap to record</span>
      </div>
    </div>
  );
};

export default HomeView;
