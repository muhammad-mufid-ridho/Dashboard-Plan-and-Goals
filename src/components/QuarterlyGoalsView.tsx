import React, { useState } from 'react';
import { QuarterlyGoal } from '../types/dashboard';
import { Target, CheckCircle, AlertTriangle, Plus, ChevronRight, Edit3 } from 'lucide-react';

interface QuarterlyGoalsViewProps {
  quarterlyGoals: QuarterlyGoal[];
  onUpdateGoal: (goal: QuarterlyGoal) => void;
  onAddGoal: (goal: QuarterlyGoal) => void;
}

export const QuarterlyGoalsView: React.FC<QuarterlyGoalsViewProps> = ({
  quarterlyGoals,
  onUpdateGoal,
  onAddGoal
}) => {
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Target className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">Quarterly Goals — Q4 2026 (Oktober - Desember)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fokus pada hasil nyata dan bukti pencapaian objektif, bukan sekadar kesibukan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
            {quarterlyGoals.length} Target Kuartal
          </span>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quarterlyGoals.map((qg) => {
          const isEditing = editingGoalId === qg.id;

          return (
            <div
              key={qg.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                    {qg.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1.5 leading-snug">{qg.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-extrabold text-indigo-600">{qg.progressPercent}%</div>
                  <span className="text-[10px] text-slate-400">Progres Q4</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${qg.progressPercent}%` }}
                ></div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Kondisi Awal (Baseline):</div>
                  <div className="font-semibold text-slate-700 mt-0.5">{qg.baseline}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Target Akhir Q4:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{qg.target}</div>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <div className="text-[10px] font-bold text-teal-700 uppercase">Hasil Aktual Saat Ini:</div>
                  <div className="font-medium text-slate-800 mt-0.5">{qg.actualResult}</div>
                </div>
              </div>

              {/* Evidence & Obstacles */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700">Bukti Pencapaian: </span>
                  <span className="text-slate-600">{qg.evidence}</span>
                </div>
                <div>
                  <span className="font-bold text-amber-700">Kendala: </span>
                  <span className="text-slate-600">{qg.obstacles}</span>
                </div>
                <div>
                  <span className="font-bold text-blue-700">Tindak Lanjut: </span>
                  <span className="text-slate-600">{qg.actionPlan}</span>
                </div>
              </div>

              {/* Edit Progress Slider */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 text-[11px]">Ubah Progres:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={qg.progressPercent}
                  onChange={(e) =>
                    onUpdateGoal({
                      ...qg,
                      progressPercent: parseInt(e.target.value) || 0
                    })
                  }
                  className="w-36 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
