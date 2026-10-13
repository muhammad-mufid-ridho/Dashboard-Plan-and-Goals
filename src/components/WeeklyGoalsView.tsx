import React, { useState } from 'react';
import { WeeklyGoal } from '../types/dashboard';
import {
  CalendarDays,
  CheckCircle,
  HelpCircle,
  Plus,
  Cpu,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface WeeklyGoalsViewProps {
  weeklyGoals: WeeklyGoal[];
  onUpdateWeeklyGoal: (goal: WeeklyGoal) => void;
  onAddWeeklyGoal: (goal: WeeklyGoal) => void;
}

export const WeeklyGoalsView: React.FC<WeeklyGoalsViewProps> = ({
  weeklyGoals,
  onUpdateWeeklyGoal,
  onAddWeeklyGoal
}) => {
  const [selectedWeekId, setSelectedWeekId] = useState<string>(weeklyGoals[0]?.id || 'w1');
  const activeWeek = weeklyGoals.find(w => w.id === selectedWeekId) || weeklyGoals[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CalendarDays className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">Weekly Goals Tracker — Sprint Q4 2026</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengukuran target mingguan: Brainstorming IoT 5 hari, Kajian offline, dan Ziyadah 1.25 halaman/pekan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200">
            {weeklyGoals.length} Pekan Terjadwal
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 font-bold border border-teal-200">
            Rata-rata Target: 88.5%
          </span>
        </div>
      </div>

      {/* Week Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {weeklyGoals.map((wg) => (
          <button
            key={wg.id}
            onClick={() => setSelectedWeekId(wg.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              selectedWeekId === wg.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Pekan {wg.weekNumber}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedWeekId === wg.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {wg.achievementRate}%
            </span>
          </button>
        ))}
      </div>

      {activeWeek && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): The 4 Core Weekly Targets */}
          <div className="lg:col-span-7 space-y-4">
            {/* Target 1: IoT Brainstorming */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Target A: IoT & Networking Project Brainstorming</span>
                </div>
                <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
                  Target: 5 Hari / Pekan
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Brainstorming terstruktur yang mengaitkan hardware IoT dengan konsep jaringan komputer untuk portofolio nyata.
              </p>

              <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                <div className="text-xs font-bold text-slate-700">Realisasi Hari:</div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => onUpdateWeeklyGoal({ ...activeWeek, iotBrainstormDays: d })}
                      className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        activeWeek.iotBrainstormDays >= d
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-400 hover:border-purple-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500 ml-auto font-semibold">
                  {activeWeek.iotBrainstormDays >= 5 ? 'Tercapai Penuh!' : `${activeWeek.iotBrainstormDays}/5 hari`}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Catatan Ide & Progres Brainstorming:
                </label>
                <textarea
                  rows={2}
                  value={activeWeek.iotBrainstormNotes}
                  onChange={(e) => onUpdateWeeklyGoal({ ...activeWeek, iotBrainstormNotes: e.target.value })}
                  placeholder="Deskripsikan ide komponen, protokol (MQTT/HTTP), dan konsep jaringan..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Target 2: Networking Knowledge & Theory */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Target B: Pengembangan Pengetahuan Jaringan</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Fokus topik teori dan lab Packet Tracer yang dipraktikkan pekan ini:
              </p>
              <input
                type="text"
                value={activeWeek.networkingTopicFocus}
                onChange={(e) => onUpdateWeeklyGoal({ ...activeWeek, networkingTopicFocus: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-blue-500 focus:bg-white"
                placeholder="Contoh: Subnetting VLSM, Inter-VLAN Routing, dan Wireshark Packet Inspection"
              />
            </div>

            {/* Target 3: Kajian Offline */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Target C: Kajian Offline (Minimal 1x / Pekan)</span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeWeek.kajianOffline.attended}
                    onChange={(e) =>
                      onUpdateWeeklyGoal({
                        ...activeWeek,
                        kajianOffline: { ...activeWeek.kajianOffline, attended: e.target.checked }
                      })
                    }
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">Sudah Hadir</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Tema Kajian:</label>
                  <input
                    type="text"
                    value={activeWeek.kajianOffline.theme || ''}
                    onChange={(e) =>
                      onUpdateWeeklyGoal({
                        ...activeWeek,
                        kajianOffline: { ...activeWeek.kajianOffline, theme: e.target.value }
                      })
                    }
                    placeholder="Judul / Tema kajian..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Lokasi / Masjid & Pemateri:</label>
                  <input
                    type="text"
                    value={activeWeek.kajianOffline.location || ''}
                    onChange={(e) =>
                      onUpdateWeeklyGoal({
                        ...activeWeek,
                        kajianOffline: { ...activeWeek.kajianOffline, location: e.target.value }
                      })
                    }
                    placeholder="Nama masjid & ustaz..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Poin Pembelajaran Kajian:</label>
                <input
                  type="text"
                  value={activeWeek.kajianOffline.notes || ''}
                  onChange={(e) =>
                    onUpdateWeeklyGoal({
                      ...activeWeek,
                      kajianOffline: { ...activeWeek.kajianOffline, notes: e.target.value }
                    })
                  }
                  placeholder="Catatan ringkas faedah kajian..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Target 4: Hafalan Ziyadah & Murojaah Pekanan */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Target D: Hafalan Al-Qur'an Pekanan</span>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
                  Target Ziyadah: 1.25 Hal / Pekan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Realisasi Ziyadah (Halaman):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.25"
                      value={activeWeek.hafalanZiyadahPages}
                      onChange={(e) =>
                        onUpdateWeeklyGoal({
                          ...activeWeek,
                          hafalanZiyadahPages: parseFloat(e.target.value) || 0
                        })
                      }
                      className="w-24 p-2 bg-white border border-teal-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                    <span className="text-xs text-slate-500">/ 1.25 halaman</span>
                  </div>
                </div>

                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Realisasi Murojaah (Juz):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.25"
                      value={activeWeek.hafalanMurojaahJuz}
                      onChange={(e) =>
                        onUpdateWeeklyGoal({
                          ...activeWeek,
                          hafalanMurojaahJuz: parseFloat(e.target.value) || 0
                        })
                      }
                      className="w-24 p-2 bg-white border border-teal-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                    <span className="text-xs text-slate-500">/ 1.25 juz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Evaluasi & Retrospeksi Pekanan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Evaluasi & Refleksi Pekan {activeWeek.weekNumber}</span>
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {activeWeek.achievementRate}% Tercapai
                </span>
              </div>

              {/* Apa yang sudah tercapai */}
              <div>
                <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                  1. Apa yang sudah berhasil dicapai?
                </label>
                <textarea
                  rows={2}
                  value={activeWeek.evalWhatAchieved}
                  onChange={(e) => onUpdateWeeklyGoal({ ...activeWeek, evalWhatAchieved: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500 focus:bg-white"
                />
              </div>

              {/* Apa yang belum tercapai */}
              <div>
                <label className="text-[11px] font-bold text-rose-700 block mb-1">
                  2. Apa yang belum selesai?
                </label>
                <textarea
                  rows={2}
                  value={activeWeek.evalWhatMissed}
                  onChange={(e) => onUpdateWeeklyGoal({ ...activeWeek, evalWhatMissed: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500 focus:bg-white"
                />
              </div>

              {/* Hambatan Utama */}
              <div>
                <label className="text-[11px] font-bold text-amber-700 block mb-1">
                  3. Apa hambatan atau kendala utama?
                </label>
                <textarea
                  rows={2}
                  value={activeWeek.evalObstacles}
                  onChange={(e) => onUpdateWeeklyGoal({ ...activeWeek, evalObstacles: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500 focus:bg-white"
                />
              </div>

              {/* Rencana Perbaikan Minggu Depan */}
              <div>
                <label className="text-[11px] font-bold text-blue-700 block mb-1">
                  4. Rencana perbaikan pekan berikutnya?
                </label>
                <textarea
                  rows={2}
                  value={activeWeek.evalImprovementPlan}
                  onChange={(e) => onUpdateWeeklyGoal({ ...activeWeek, evalImprovementPlan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500 focus:bg-white"
                />
              </div>

              {/* Annual Realism Check */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Apakah target tahunan masih realistis?</span>
                <button
                  onClick={() =>
                    onUpdateWeeklyGoal({
                      ...activeWeek,
                      isRealisticForAnnual: !activeWeek.isRealisticForAnnual
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeWeek.isRealisticForAnnual
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {activeWeek.isRealisticForAnnual ? 'Ya, Realistis' : 'Perlu Penyesuaian'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
