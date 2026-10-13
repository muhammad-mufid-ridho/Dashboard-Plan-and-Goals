import React, { useState } from 'react';
import {
  HabitDefinition,
  DailyLog,
  WeeklyGoal,
  QuarterlyGoal,
  IoTProject,
  CCNATopic,
  MicrostockAsset,
  GoldHolding,
  ExpenseTransaction,
  FinancialSettings,
  KPICardConfig
} from '../types/dashboard';
import {
  CheckCircle2,
  Clock,
  Cpu,
  Image,
  Coins,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Flame,
  Check,
  ChevronRight,
  Trash2,
  RefreshCw,
  Sparkles,
  Settings
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { useCurrentDate, formatDateIndo } from '../utils/dateUtils';

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'danger' | 'warning' | 'primary';
  action: () => void;
}

interface DashboardViewProps {
  habits: HabitDefinition[];
  dailyLogs: Record<string, DailyLog>;
  weeklyGoals: WeeklyGoal[];
  quarterlyGoals: QuarterlyGoal[];
  iotProjects: IoTProject[];
  ccnaTopics: CCNATopic[];
  microstockAssets: MicrostockAsset[];
  goldHoldings: GoldHolding[];
  transactions: ExpenseTransaction[];
  settings: FinancialSettings;
  kpiCards: KPICardConfig[];
  onToggleHabitToday: (habitId: string, status: 'Done' | 'Partial' | 'Not Done') => void;
  onUpdateActualToday?: (habitId: string, val: number) => void;
  onNavigateTab: (tab: any) => void;
  onClearAllDummyData?: () => void;
  onRestoreSampleData?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  habits,
  dailyLogs,
  weeklyGoals,
  quarterlyGoals,
  iotProjects,
  ccnaTopics,
  microstockAssets,
  goldHoldings,
  transactions,
  settings,
  kpiCards,
  onToggleHabitToday,
  onNavigateTab,
  onClearAllDummyData,
  onRestoreSampleData
}) => {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Ya, Lanjutkan',
    variant: 'danger',
    action: () => {}
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const { todayStr, monthStr, formattedIndo } = useCurrentDate();
  const todayKey = todayStr;
  const todayLog = dailyLogs[todayKey] || { date: todayKey, isWeekend: false, entries: {} };

  // Calculate Habit metrics dynamically
  const activeHabits = habits.filter(h => h.isActive);
  const doneHabitsToday = activeHabits.filter(h => todayLog.entries[h.id]?.status === 'Done').length;
  const partialHabitsToday = activeHabits.filter(h => todayLog.entries[h.id]?.status === 'Partial').length;
  const habitPercentageToday = activeHabits.length > 0 
    ? Math.round(((doneHabitsToday + partialHabitsToday * 0.5) / activeHabits.length) * 100)
    : 0;

  // CCNA metrics dynamically
  const totalStudyMinutes = ccnaTopics.reduce((acc, t) => acc + (t.studyMinutes || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const masteredTopicsCount = ccnaTopics.filter(t => t.masteryStatus === 'Dikuasai').length;
  const ccnaMasteryPercent = Math.round((masteredTopicsCount / Math.max(1, ccnaTopics.length)) * 100);

  // IoT metrics dynamically
  const completedIoTCount = iotProjects.filter(p => p.status === 'Completed').length;
  const activeIoTCount = iotProjects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;

  // Microstock metrics purely dynamic from actual data
  const totalUploadedStock = microstockAssets.reduce((acc, a) => acc + a.uploadedCount, 0);
  const totalApprovedStock = microstockAssets.reduce((acc, a) => acc + a.approvedCount, 0);
  const totalStockEarnings = microstockAssets.reduce((acc, a) => acc + a.revenueUsd, 0).toFixed(2);

  // Gold metrics purely dynamic from actual data
  const totalGoldGrams = goldHoldings.reduce((acc, g) => acc + g.grams, 0);
  const totalGoldCost = goldHoldings.reduce((acc, g) => acc + g.totalCost, 0);
  const currentGoldMarketValue = totalGoldGrams * settings.currentGoldMarketPrice;
  const goldProfitLoss = currentGoldMarketValue - totalGoldCost;

  // Financial metrics purely dynamic from actual transactions
  const totalExpensesMonth = transactions
    .filter(t => t.date.startsWith(monthStr))
    .reduce((acc, t) => acc + t.amount, 0);
  const remainingBudget = settings.monthlyExpenseBudget - totalExpensesMonth;
  const actualCashBalance = settings.startingBalance - totalExpensesMonth;
  const savingsProgress2027 = Math.round((actualCashBalance / Math.max(1, settings.savingsTarget2027)) * 100);

  // Consistency Trend (Past 7 Days dynamically ending on today)
  const recentDays = [];
  const parts = todayStr.split('-').map(Number);
  const baseD = new Date(parts[0], parts[1] - 1, parts[2]);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseD);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dStr = `${y}-${m}-${day}`;
    const log = dailyLogs[dStr];
    let pct = 0;
    if (dStr === todayStr) {
      pct = habitPercentageToday;
    } else if (log && activeHabits.length > 0) {
      const done = activeHabits.filter(h => log.entries[h.id]?.status === 'Done').length;
      const partial = activeHabits.filter(h => log.entries[h.id]?.status === 'Partial').length;
      pct = Math.round(((done + partial * 0.5) / activeHabits.length) * 100);
    }
    const shortLabel = formatDateIndo(dStr).split(' ').slice(0, 2).join(' ');
    recentDays.push({ day: shortLabel, pct });
  }

  const currentWeek = weeklyGoals[0] || {
    id: 'w1',
    weekNumber: 1,
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    iotBrainstormDays: 0,
    iotBrainstormNotes: 'Mulai rancang arsitektur pekan ini',
    networkingTopicFocus: 'Network Fundamentals',
    kajianOffline: { attended: false },
    hafalanZiyadahPages: 0,
    hafalanMurojaahJuz: 0,
    achievementRate: 0,
    evalWhatAchieved: '',
    evalWhatMissed: '',
    evalObstacles: '',
    evalImprovementPlan: '',
    isRealisticForAnnual: true
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Goal Progress Strip */}
      <div className="bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#14B8A6] rounded-2xl p-4 md:p-5 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white backdrop-blur-xs border border-white/20">
            <Flame className="w-3.5 h-3.5 text-[#FF6B6B]" />
            <span>Sprint Q4 Aktif (12 Okt - 31 Des 2026)</span>
          </div>
          <h2 className="text-base md:text-xl font-extrabold tracking-tight">
            Personal Growth Dashboard 2026
          </h2>
          <p className="text-xs text-teal-100 max-w-2xl leading-relaxed">
            Data metrik terhubung real-time. Anda dapat menghapus data contoh kapan saja di pengaturan atau tiap modul untuk mulai mengisi data nyata Anda.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => onNavigateTab('daily')}
            className="px-3.5 py-2 bg-white text-teal-900 rounded-xl text-xs font-bold shadow-sm hover:bg-teal-50 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Mutabaah HP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* In-App Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Quick Dummy Data Status & Clear Banner */}
      {transactions.length > 0 || iotProjects.length > 0 ? (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="font-extrabold text-amber-950">Mode Data Contoh Template Aktif</div>
              <div className="text-[11px] text-amber-800 leading-snug">
                Saat ini terisi data contoh simulasi. Anda dapat mengosongkannya untuk mulai mengisi data nyata dari HP.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onClearAllDummyData && (
              <button
                type="button"
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Bersihkan Semua Data Dummy?',
                    message: 'Semua transaksi pengeluaran contoh, proyek IoT dummy, aset microstock, mutabaah, dan riwayat ceklis harian akan dikosongkan agar Anda dapat mengisi data riil.\n\nDaftar 17 kebiasaan dan silabus CCNA tetap tersimpan aman.',
                    confirmLabel: 'Ya, Bersihkan Dummy',
                    variant: 'danger',
                    action: () => {
                      onClearAllDummyData();
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      showToast('✅ Seluruh data dummy berhasil dibersihkan! Dashboard Anda kini bersih dan siap diisi data riil.');
                    }
                  });
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan Dummy</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-xl font-bold hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Atur Riil</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 md:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-emerald-900">
              Mode Data Riil Aktif — Bersih dari data dummy. Siap diisi dari HP Anda!
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onRestoreSampleData && (
              <button
                type="button"
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Muat Ulang Contoh Dummy?',
                    message: 'Data contoh simulasi akan dimuat ulang ke dashboard sebagai referensi template.',
                    confirmLabel: 'Ya, Muat Contoh',
                    variant: 'primary',
                    action: () => {
                      onRestoreSampleData();
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      showToast('✅ Contoh template berhasil dimuat ulang!');
                    }
                  });
                }}
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Muat Ulang Contoh</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {/* Card 1: Habit Today */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-teal-700">Habit Hari Ini</span>
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {habitPercentageToday}%
          </div>
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 mt-2">
            <span>{doneHabitsToday}/{activeHabits.length} selesai</span>
            <span className="font-semibold text-teal-600">{partialHabitsToday} parsial</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${habitPercentageToday}%` }}></div>
          </div>
        </div>

        {/* Card 2: CCNA Hours */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-blue-700">Belajar CCNA</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {totalStudyHours} <span className="text-xs font-semibold text-slate-400">/ 60 Jam</span>
          </div>
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 mt-2">
            <span>{masteredTopicsCount} Modul</span>
            <span className="font-semibold text-blue-600">{ccnaMasteryPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (parseFloat(totalStudyHours) / 60) * 100)}%` }}></div>
          </div>
        </div>

        {/* Card 3: IoT Projects */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-purple-700">Proyek IoT</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {completedIoTCount} <span className="text-xs font-semibold text-slate-400">/ 6 Selesai</span>
          </div>
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 mt-2">
            <span>{activeIoTCount} aktif/draft</span>
            <span className="font-semibold text-purple-600">
              {Math.round((completedIoTCount / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${(completedIoTCount / 6) * 100}%` }}></div>
          </div>
        </div>

        {/* Card 4: Microstock Portfolio */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-amber-700">Microstock</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Image className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {totalUploadedStock} <span className="text-xs font-semibold text-slate-400">/ 1.000</span>
          </div>
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 mt-2">
            <span>{totalApprovedStock} diterima</span>
            <span className="font-semibold text-amber-600">${totalStockEarnings}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalUploadedStock / 1000) * 100)}%` }}></div>
          </div>
        </div>

        {/* Card 5: Gold Savings */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-yellow-700">Emas Fisik</span>
            <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
              <Coins className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {totalGoldGrams.toFixed(1)} <span className="text-xs font-semibold text-slate-400">/ 40g</span>
          </div>
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 mt-2">
            <span>Nilai: Rp{(currentGoldMarketValue / 1000000).toFixed(1)}M</span>
            <span className={`font-semibold ${goldProfitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {goldProfitLoss >= 0 ? '+' : ''}{(goldProfitLoss / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalGoldGrams / 40) * 100)}%` }}></div>
          </div>
        </div>

        {/* Card 6: Expense / Budget */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Pengeluaran {formatDateIndo(todayStr).split(' ')[1] || 'Bulan Ini'}
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
          <div className="text-base md:text-xl font-extrabold text-slate-800 tracking-tight truncate">
            Rp{totalExpensesMonth.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 mt-2">
            <span>Sisa Budget</span>
            <span className="font-semibold text-teal-600">Rp{remainingBudget.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalExpensesMonth > settings.monthlyExpenseBudget ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, (totalExpensesMonth / Math.max(1, settings.monthlyExpenseBudget)) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist Hari Ini & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Today Checklist & Trend Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today Checklist Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Checklist & Input Aktual Hari Ini</h3>
                <p className="text-xs text-slate-500">
                  {formatDateIndo(todayStr, true)} — Nilai kuantitatif langsung memperbarui statistik dashboard
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                {doneHabitsToday}/{activeHabits.length} Selesai
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {activeHabits.map((h) => {
                const entry = todayLog.entries[h.id] || { habitId: h.id, status: 'Not Done' };
                const isDone = entry.status === 'Done';
                const isPartial = entry.status === 'Partial';

                return (
                  <div
                    key={h.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-teal-50/60 border-teal-200 text-teal-950'
                        : isPartial
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() =>
                          onToggleHabitToday(
                            h.id,
                            isDone ? 'Not Done' : 'Done'
                          )
                        }
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          isDone
                            ? 'bg-teal-600 text-white shadow-xs'
                            : isPartial
                            ? 'bg-amber-500 text-white'
                            : 'border-2 border-slate-300 hover:border-teal-500 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5" />}
                        {isPartial && <span className="text-[10px] font-bold">½</span>}
                      </button>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
                          {h.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Target: {h.targetValue} {h.targetUnit}
                          {entry.actualValue !== undefined && (
                            <span className="font-semibold text-teal-700 ml-1.5">
                              (Aktual: {entry.actualValue} {h.targetUnit})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onToggleHabitToday(h.id, isPartial ? 'Not Done' : 'Partial')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                          isPartial
                            ? 'bg-amber-500 text-white border-amber-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        ½
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consistency Trend Chart */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Tren Konsistensi Harian</h3>
                <p className="text-xs text-slate-500">Persentase kepatuhan habit 7 hari terakhir (Target: &gt;85%)</p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                Rata-rata: 88.1%
              </span>
            </div>

            <div className="h-44 md:h-48 w-full flex items-end justify-between gap-2 md:gap-3 pt-6 pb-2 px-3 md:px-4 bg-slate-50/50 rounded-xl border border-slate-100">
              {recentDays.map((d, idx) => {
                const heightPct = Math.max(15, d.pct);
                const isToday = idx === recentDays.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold py-0.5 px-1.5 rounded pointer-events-none z-10">
                      {d.pct}%
                    </div>
                    <div className="text-[9px] md:text-[10px] font-bold text-slate-600 mb-1">{d.pct}%</div>
                    <div className="w-full max-w-[34px] bg-slate-200 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '70%' }}>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-700 ${
                          isToday
                            ? 'bg-gradient-to-t from-teal-600 to-[#4ECDC4] shadow-sm shadow-teal-500/40'
                            : d.pct >= 90
                            ? 'bg-teal-500'
                            : 'bg-teal-400/80'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <div className={`text-[9px] md:text-[10px] font-semibold mt-2 ${isToday ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
                      {d.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Weekly Focus & Milestones Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Mingguan Snapshot */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800">Target Pekan Ini (W1)</h3>
              <button
                onClick={() => onNavigateTab('weekly')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Brainstorm IoT */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Brainstorming IoT</span>
                  <span className="text-purple-600">{currentWeek.iotBrainstormDays}/5 Hari</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {currentWeek.iotBrainstormNotes}
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(currentWeek.iotBrainstormDays / 5) * 100}%` }}></div>
                </div>
              </div>

              {/* Kajian Offline */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Kajian Offline Pekanan</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${currentWeek.kajianOffline.attended ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {currentWeek.kajianOffline.attended ? 'Hadir' : 'Rencana'}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-1">
                  {currentWeek.kajianOffline.theme || 'Kajian Pekanan'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentWeek.kajianOffline.location || 'Masjid Terdekat'}
                </div>
              </div>

              {/* Ziyadah Target */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Ziyadah Tambahan Pekanan</span>
                  <span className="text-teal-700 font-bold">{currentWeek.hafalanZiyadahPages} / 1.25 Hal</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Target harian: 0.25 halaman x 5 hari kerja
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(currentWeek.hafalanZiyadahPages / 1.25) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Goals Progress Overview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800">Sasaran Kuartal 4</h3>
              <button
                onClick={() => onNavigateTab('quarterly')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Detail Q4</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {quarterlyGoals.slice(0, 4).map((qg) => (
                <div key={qg.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate pr-2">{qg.title}</span>
                    <span className="text-teal-700 shrink-0 font-bold">{qg.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${qg.progressPercent}%` }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{qg.actualResult}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        confirmVariant={confirmModal.variant}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
