
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDataMap, Task, Thought } from '../types';

interface DayViewProps {
  dataMap: AppDataMap;
  onToggleTask: (date: string, id: string) => void;
  onDeleteTask: (date: string, id: string) => void;
  onAddTask: (date: string, text: string) => void;
  onAddThought: (date: string, thought: Thought) => void;
}

const DayView: React.FC<DayViewProps> = ({ dataMap, onToggleTask, onDeleteTask, onAddTask, onAddThought }) => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [newTaskText, setNewTaskText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage('Listening...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && date) {
          const newThought: Thought = {
            id: `v-${Date.now()}`,
            category: 'Voice Note',
            text: transcript,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            transcript: transcript
          };
          onAddThought(date, newThought);
          setStatusMessage('Captured!');
          setTimeout(() => setStatusMessage(null), 2000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setStatusMessage(`Error: ${event.error}`);
        setTimeout(() => setStatusMessage(null), 3000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [date, onAddThought]);

  if (!date) return null;

  const dayData = dataMap[date] || { tasks: [], thoughts: [] };
  const { tasks, thoughts } = dayData;

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const dateObj = new Date(date);
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const isToday = new Date().toISOString().split('T')[0] === date;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(date, newTaskText.trim());
      setNewTaskText('');
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col pb-32">
      <header className="sticky top-0 z-20 flex items-center bg-background-dark/80 backdrop-blur-md p-6 justify-between border-b border-white/5">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1">{displayDate}</span>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight">{isToday ? 'Today' : dayName}</h2>
        </div>
        <button 
          onClick={() => navigate('/calendar')}
          className="flex items-center justify-center rounded-xl h-12 w-12 bg-card-dark text-white/70 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">calendar_today</span>
        </button>
      </header>

      <main className="flex-1 px-6 pt-4 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">Focus</h3>
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
          
          <form onSubmit={handleAddTask} className="mb-4">
            <input 
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-card-dark/20 border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary border placeholder-slate-600 transition-all"
            />
          </form>

          <div className="space-y-2">
            {tasks.length === 0 && (
              <p className="text-sm text-slate-500 italic py-4">No tasks defined for this day.</p>
            )}
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`group flex items-center justify-between p-4 rounded-xl bg-card-dark/40 border border-white/5 transition-all ${task.completed ? 'opacity-60' : ''}`}
              >
                <label className="flex items-center gap-x-4 flex-1 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => onToggleTask(date, task.id)}
                    className="h-6 w-6 rounded-full border-2 border-primary/40 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0"
                  />
                  <p className={`text-base font-medium ${task.completed ? 'line-through opacity-50' : ''}`}>
                    {task.text}
                  </p>
                </label>
                <button 
                  onClick={() => onDeleteTask(date, task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                  aria-label="Delete task"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">Captured Thoughts</h3>
          <div className="space-y-4">
            {thoughts.length === 0 && (
              <p className="text-sm text-slate-500 italic py-4">No thoughts captured.</p>
            )}
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
                <p className="text-slate-200 text-base leading-relaxed font-normal line-clamp-2">
                  {thought.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Voice FAB */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
        {statusMessage && (
          <div className="bg-primary/90 text-background-dark text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg animate-bounce">
            {statusMessage}
          </div>
        )}
        <button 
          onClick={toggleRecording}
          className={`group flex h-20 w-20 items-center justify-center rounded-full shadow-[0_12px_24px_-8px_rgba(37,182,180,0.5)] active:scale-90 transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary text-white'}`}
        >
          <span className="material-symbols-outlined text-4xl font-light">
            {isRecording ? 'stop' : 'mic'}
          </span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {isRecording ? 'Stop Recording' : 'Capture Voice'}
        </span>
      </div>
    </div>
  );
};

export default DayView;
