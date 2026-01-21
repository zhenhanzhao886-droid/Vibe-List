
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DayView from './views/DayView';
import DetailView from './views/DetailView';
import CalendarView from './views/CalendarView';
import { Task, Thought, AppDataMap, DayData } from './types';

const App: React.FC = () => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // Initialize with some seed data
  const [dataMap, setDataMap] = useState<AppDataMap>({
    [getTodayStr()]: {
      tasks: [
        { id: '1', text: 'Morning meditation & deep work', completed: true },
        { id: '2', text: 'Review product architecture', completed: true },
        { id: '3', text: 'Draft the keynote for Friday', completed: false },
      ],
      thoughts: [
        {
          id: 't1',
          category: 'Strategy',
          text: "What if the interface isn't a screen but a conversation?",
          timestamp: '12m ago'
        }
      ]
    },
    '2023-10-24': {
      tasks: [{ id: 'old-1', text: 'Finished quarterly review', completed: true }],
      thoughts: [{ id: 'old-t1', category: 'Philosophy', text: 'Intentionality over volume.', timestamp: 'Oct 24' }]
    }
  });

  const toggleTask = (date: string, id: string) => {
    setDataMap(prev => {
      const day = prev[date] || { tasks: [], thoughts: [] };
      return {
        ...prev,
        [date]: {
          ...day,
          tasks: day.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }
      };
    });
  };

  const deleteTask = (date: string, id: string) => {
    setDataMap(prev => {
      const day = prev[date] || { tasks: [], thoughts: [] };
      return {
        ...prev,
        [date]: {
          ...day,
          tasks: day.tasks.filter(t => t.id !== id)
        }
      };
    });
  };

  const addTask = (date: string, text: string) => {
    setDataMap(prev => {
      const day = prev[date] || { tasks: [], thoughts: [] };
      const newTask = { id: Date.now().toString(), text, completed: false };
      return {
        ...prev,
        [date]: { ...day, tasks: [...day.tasks, newTask] }
      };
    });
  };

  const addThought = (date: string, thought: Thought) => {
    setDataMap(prev => {
      const day = prev[date] || { tasks: [], thoughts: [] };
      return {
        ...prev,
        [date]: { ...day, thoughts: [thought, ...day.thoughts] }
      };
    });
  };

  // Flatten thoughts for DetailView lookups
  const allThoughts = Object.values(dataMap).flatMap(d => d.thoughts);

  return (
    <HashRouter>
      <div className="min-h-screen bg-background-dark text-white overflow-x-hidden selection:bg-primary/30 font-display">
        <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-background-dark border-x border-white/5">
          <Routes>
            <Route path="/" element={<Navigate to={`/day/${getTodayStr()}`} replace />} />
            <Route 
              path="/day/:date" 
              element={
                <DayView 
                  dataMap={dataMap} 
                  onToggleTask={toggleTask} 
                  onDeleteTask={deleteTask}
                  onAddTask={addTask}
                  onAddThought={addThought}
                />
              } 
            />
            <Route path="/thought/:id" element={<DetailView thoughts={allThoughts} />} />
            <Route path="/calendar" element={<CalendarView dataMap={dataMap} />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
