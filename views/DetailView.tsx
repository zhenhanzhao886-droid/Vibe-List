
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Thought, AgentInsight } from '../types';
import { generateThoughtInsight } from '../services/geminiService';

interface DetailViewProps {
  thoughts: Thought[];
}

const DetailView: React.FC<DetailViewProps> = ({ thoughts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const thought = thoughts.find(t => t.id === id);
  const [insight, setInsight] = useState<AgentInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (thought?.transcript || (thought?.text && !thought.insight)) {
      const fetchInsight = async () => {
        setLoading(true);
        const result = await generateThoughtInsight(thought.transcript || thought.text);
        if (result) setInsight(result);
        setLoading(false);
      };
      fetchInsight();
    } else if (thought?.insight) {
      setInsight(thought.insight);
    }
  }, [thought]);

  if (!thought) return <div className="p-6">Thought not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-background-dark/80 backdrop-blur-md border-b border-slate-800">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-sm font-bold tracking-widest uppercase opacity-60">Inspiration Detail</h1>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-2xl">ios_share</span>
        </button>
      </nav>

      <main className="flex-1 px-6 pt-8 pb-32">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <span className="material-symbols-outlined text-sm">mic</span>
            <p className="text-[11px] font-medium tracking-wider uppercase">Raw Transcript • {thought.timestamp}</p>
          </div>
          <h2 className="text-2xl leading-relaxed italic font-light text-slate-200">
            "{thought.transcript || thought.text}"
          </h2>
        </header>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] flex-1 bg-slate-700"></div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Agent Insights</h3>
          <div className="h-[1px] flex-1 bg-slate-700"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-widest text-primary/60 font-bold">Connecting intelligence...</p>
          </div>
        ) : insight ? (
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-xl bg-surface-dark p-6 shadow-sm border border-slate-800">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Core Essence</h4>
              <p className="text-lg font-semibold leading-snug">
                {insight.coreEssence}
              </p>
            </section>

            <section className="rounded-xl bg-surface-dark p-6 shadow-sm border border-slate-800">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">account_tree</span> Logical Framework
              </h4>
              <ul className="space-y-4">
                {insight.logicalFramework.map((point, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="text-primary font-bold text-sm">{(idx + 1).toString().padStart(2, '0')}</span>
                    <p className="text-sm leading-relaxed opacity-80">{point}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Thinking Prompts</h4>
              {insight.thinkingPrompts.map((prompt, idx) => (
                <div key={idx} className="group cursor-pointer bg-slate-900/50 border border-slate-800 p-4 rounded-lg hover:border-primary/50 transition-all">
                  <p className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">
                    {prompt}
                  </p>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <div className="text-center py-10 opacity-40">Insights will appear here.</div>
        )}

        <div className="mt-8 rounded-xl overflow-hidden border border-slate-800">
          <div className="w-full h-40 bg-slate-800 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <img 
              className="w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700" 
              src={`https://picsum.photos/seed/${id}/400/200`} 
              alt="Contextual image" 
            />
            <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[9px] uppercase tracking-widest font-bold">Concept Context</div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs flex justify-center px-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 bg-primary text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full justify-center"
        >
          <span className="material-symbols-outlined">add_task</span>
          <span className="text-sm uppercase tracking-widest">Add to Daily Plan</span>
        </button>
      </div>
    </div>
  );
};

export default DetailView;
