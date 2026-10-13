import React, { useState, useEffect } from 'react';
import { HabitDefinition, DailyLog, HabitStatus } from '../types/dashboard';
import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Flame,
  Award,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Save,
  Smartphone,
  Table as TableIcon,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { useCurrentDate, formatDateIndo, getTodayDateStr } from '../utils/dateUtils';

interface DailyTrackerViewProps {
  habits: HabitDefinition[];
  dailyLogs: Record<string, DailyLog>;
  onUpdateDailyLog: (date: string, updatedLog: DailyLog) => void;
  onClearAllDailyLogs?: () => void;
}

export const DailyTrackerView: React.FC<DailyTrackerViewProps> = ({
  habits,
  dailyLogs,
  onUpdateDailyLog,
  onClearAllDailyLogs
}) => {
  const { todayStr, formattedIndo } = useCurrentDate();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards'); // Default to cards for mobile ease!
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Ya, Reset',
    action: () => {}
  });

  const lastTodayStrRef = React.useRef(todayStr);

  // Keep selectedDate in sync when the real day rolls over at midnight (only if user was currently on "today")
  useEffect(() => {
    const prevToday = lastTodayStrRef.current;
    lastTodayStrRef.current = todayStr;
    setSelectedDate(curr => {
      // If user was on previous today (or none set), smoothly advance to new today
      if (!curr || curr === prevToday) {
        return todayStr;
      }
      return curr;
    });
  }, [todayStr]);

  // Helper to step date backward or forward by N days
  const handleShiftDay = (delta: number) => {
    try {
      const parts = selectedDate.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      d.setDate(d.getDate() + delta);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${day}`);
    } catch (e) {
      setSelectedDate(todayStr);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate dynamic date list centered around today and selectedDate
  const dates: { dateStr: string; dayName: string; isWeekend: boolean }[] = [];
  const todayParts = todayStr.split('-').map(Number);
  const anchorDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  // Ensure selectedDate is included even if user jumps to another week or month
  const selParts = (selectedDate || todayStr).split('-').map(Number);
  const selDateObj = new Date(selParts[0], selParts[1] - 1, selParts[2]);

  const startTime = Math.min(anchorDate.getTime() - 21 * 86400000, selDateObj.getTime() - 7 * 86400000);
  const endTime = Math.max(anchorDate.getTime() + 45 * 86400000, selDateObj.getTime() + 7 * 86400000);

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const dayNamesIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const curr = new Date(startDate);
  while (curr <= endDate) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const dayOfWeek = curr.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    dates.push({
      dateStr,
      dayName: dayNamesIndo[dayOfWeek],
      isWeekend
    });
    curr.setDate(curr.getDate() + 1);
  }

  const currentLog = dailyLogs[selectedDate] || {
    date: selectedDate,
    isWeekend: dates.find(d => d.dateStr === selectedDate)?.isWeekend || false,
    entries: {}
  };

  const activeHabits = habits.filter(h => h.isActive);
  const filteredHabits = filterCategory === 'Semua'
    ? activeHabits
    : activeHabits.filter(h => h.category === filterCategory);

  // Handle status update
  const handleStatusChange = (habitId: string, newStatus: HabitStatus) => {
    const habit = habits.find(h => h.id === habitId);
    const existingEntry = currentLog.entries[habitId] || { habitId, status: 'Not Done' };
    
    let newActual = existingEntry.actualValue;
    if (newStatus === 'Done' && (newActual === undefined || newActual === 0) && habit) {
      newActual = habit.targetValue;
    } else if (newStatus === 'Not Done') {
      newActual = 0;
    }

    const updatedLog: DailyLog = {
      ...currentLog,
      entries: {
        ...currentLog.entries,
        [habitId]: {
          ...existingEntry,
          status: newStatus,
          actualValue: newActual
        }
      }
    };
    onUpdateDailyLog(selectedDate, updatedLog);
  };

  // Handle actual value update
  const handleActualValueChange = (habitId: string, val: number) => {
    const habit = habits.find(h => h.id === habitId);
    const existingEntry = currentLog.entries[habitId] || { habitId, status: 'Not Done' };
    const safeVal = Math.max(0, val);

    let autoStatus: HabitStatus = existingEntry.status;
    if (habit && safeVal >= habit.targetValue) {
      autoStatus = 'Done';
    } else if (safeVal > 0) {
      autoStatus = 'Partial';
    } else if (safeVal === 0) {
      autoStatus = 'Not Done';
    }

    const updatedLog: DailyLog = {
      ...currentLog,
      entries: {
        ...currentLog.entries,
        [habitId]: {
          ...existingEntry,
          status: autoStatus,
          actualValue: safeVal
        }
      }
    };
    onUpdateDailyLog(selectedDate, updatedLog);
  };

  // Quick increment/decrement helper for phone usage
  const handleStepValue = (habitId: string, delta: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const existingEntry = currentLog.entries[habitId] || { habitId, status: 'Not Done', actualValue: 0 };
    const currVal = existingEntry.actualValue || 0;
    const newVal = Math.max(0, +(currVal + delta).toFixed(2));
    handleActualValueChange(habitId, newVal);
  };

  // Calculations for selected date
  const loggedHabitsCount = activeHabits.filter(h => currentLog.entries[h.id]?.status === 'Done').length;
  const partialHabitsCount = activeHabits.filter(h => currentLog.entries[h.id]?.status === 'Partial').length;
  const completionRate = activeHabits.length > 0
    ? Math.round(((loggedHabitsCount + partialHabitsCount * 0.5) / activeHabits.length) * 100)
    : 0;

  // Streak & Consistency analysis
  const recordedDates = Object.keys(dailyLogs).filter(d => d <= todayStr);
  const productiveDays = recordedDates.filter(d => {
    const log = dailyLogs[d];
    const done = activeHabits.filter(h => log.entries[h.id]?.status === 'Done').length;
    return done / activeHabits.length >= 0.75;
  }).length;

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">
              Daily Habit Tracker — Mode HP
            </h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
            Tekan tombol centang atau tambah nilai aktual dengan mudah dari ponsel.
          </p>
        </div>

        {/* View Mode Toggle & Stats */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Kartu HP</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>{completionRate}% Selesai</span>
          </div>

          {/* Working Reset Buttons without window.confirm */}
          {Object.keys(currentLog.entries).length > 0 && (
            <button
              type="button"
              onClick={() => {
                setConfirmModal({
                  isOpen: true,
                  title: `Reset Ceklis ${selectedDate}?`,
                  message: `Semua ceklis dan isian mutabaah untuk tanggal ${selectedDate} akan dikosongkan. Kebiasaan di tanggal lain tetap tersimpan.`,
                  confirmLabel: 'Ya, Reset Hari Ini',
                  action: () => {
                    onUpdateDailyLog(selectedDate, {
                      date: selectedDate,
                      isWeekend: currentLog.isWeekend,
                      entries: {}
                    });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    showToast(`✅ Ceklis tanggal ${selectedDate} berhasil dikosongkan!`);
                  }
                });
              }}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold hover:bg-rose-100 active:scale-95 transition-all cursor-pointer text-xs flex items-center gap-1 shadow-xs"
              title="Kosongkan isian tanggal ini"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Hari Ini</span>
            </button>
          )}

          {onClearAllDailyLogs && Object.keys(dailyLogs).length > 0 && (
            <button
              type="button"
              onClick={() => {
                setConfirmModal({
                  isOpen: true,
                  title: 'Reset Semua Tanggal Mutabaah?',
                  message: 'Seluruh riwayat ceklis harian dari 12 Okt - 31 Des akan dikosongkan agar Anda dapat mengisi dari awal dengan data riil Anda.',
                  confirmLabel: 'Ya, Kosongkan Semua Tanggal',
                  action: () => {
                    onClearAllDailyLogs();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    showToast('✅ Seluruh riwayat mutabaah berhasil dikosongkan! Siap diisi data riil.');
                  }
                });
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 active:scale-95 transition-all cursor-pointer text-xs flex items-center gap-1"
              title="Kosongkan semua data ceklis harian"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Reset Semua Hari</span>
              <span className="sm:hidden">Reset Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Date Carousel Strip (Optimized for Mobile Touch) */}
      <div className="bg-white rounded-2xl p-3 md:p-4 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Pilih Tanggal:
            </span>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => handleShiftDay(-1)}
                className="p-1 hover:bg-white rounded text-slate-600 hover:text-teal-700 transition-all cursor-pointer"
                title="Hari Sebelumnya"
                aria-label="Hari Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleShiftDay(1)}
                className="p-1 hover:bg-white rounded text-slate-600 hover:text-teal-700 transition-all cursor-pointer"
                title="Hari Berikutnya"
                aria-label="Hari Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Quick Native Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-slate-700 font-semibold cursor-pointer focus:outline-teal-500"
              title="Pilih tanggal langsung dari kalender"
            />
          </div>

          <div className="flex items-center gap-2">
            {selectedDate !== todayStr && (
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg hover:bg-teal-100 active:scale-95 transition-all cursor-pointer border border-teal-200"
              >
                Ke Hari Ini
              </button>
            )}
            <div className="text-xs text-teal-800 font-bold bg-teal-50/70 border border-teal-200/60 px-2.5 py-1 rounded-lg">
              {selectedDate === todayStr ? `Hari Ini (${formatDateIndo(todayStr, true)})` : formatDateIndo(selectedDate, true)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {dates.map((d) => {
            const isSelected = d.dateStr === selectedDate;
            const log = dailyLogs[d.dateStr];
            const hasData = log && Object.keys(log.entries).length > 0;
            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[54px] py-2 px-1 rounded-xl border text-xs transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm scale-102 font-bold'
                    : d.isWeekend
                    ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:border-teal-400'
                }`}
              >
                <span className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-400 font-semibold'}`}>
                  {d.dayName}
                </span>
                <span className="text-sm font-extrabold my-0.5">
                  {d.dateStr.split('-')[2]}
                </span>
                <span className={`text-[8px] uppercase tracking-tighter ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                  {d.isWeekend ? 'W/E' : 'Rutin'}
                </span>
                {hasData && !isSelected && (
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['Semua', 'Ibadah & Spiritual', 'Pengembangan Diri', 'Akademik & Teknis', 'Kesehatan'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIEW MODE 1: MOBILE TOUCH CARDS (Perfect for Smartphone / HP) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredHabits.map((habit) => {
            const entry = currentLog.entries[habit.id] || { habitId: habit.id, status: 'Not Done' };
            const isDone = entry.status === 'Done';
            const isPartial = entry.status === 'Partial';
            const isNA = entry.status === 'NA';
            const currentActual = entry.actualValue !== undefined ? entry.actualValue : 0;

            // Step size for quick tap
            const stepDelta = habit.targetUnit === 'reps'
              ? 5
              : habit.targetUnit === 'menit'
              ? 10
              : habit.targetUnit === 'juz' || habit.targetUnit === 'halaman'
              ? 0.25
              : habit.targetUnit === 'Rp'
              ? 1000
              : 1;

            return (
              <div
                key={habit.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between gap-3 ${
                  isDone
                    ? 'border-teal-300 ring-1 ring-teal-200/60 bg-gradient-to-br from-teal-50/40 to-white'
                    : isPartial
                    ? 'border-amber-300 ring-1 ring-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {habit.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {habit.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                        Target: {habit.targetValue} {habit.targetUnit}
                      </span>
                    </div>
                  </div>

                  {habit.description && (
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {habit.description}
                    </p>
                  )}
                </div>

                {/* Actual Quantitative Stepper for Mobile */}
                {habit.requiresActualValue && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">
                      Aktual ({habit.targetUnit}):
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStepValue(habit.id, -stepDelta)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 cursor-pointer shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        step={stepDelta}
                        value={currentActual || ''}
                        onChange={(e) => handleActualValueChange(habit.id, parseFloat(e.target.value) || 0)}
                        className="w-16 text-center py-1 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-900"
                        placeholder="0"
                      />

                      <button
                        type="button"
                        onClick={() => handleStepValue(habit.id, stepDelta)}
                        className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold active:bg-teal-100 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Big Finger-Friendly Touch Status Buttons (min 44px) */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleStatusChange(habit.id, 'Done')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isDone
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(habit.id, 'Partial')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPartial
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    ½ Parsial
                  </button>

                  <button
                    onClick={() => handleStatusChange(habit.id, 'Not Done')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      entry.status === 'Not Done'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    Belum
                  </button>

                  <button
                    onClick={() => handleStatusChange(habit.id, 'NA')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isNA
                        ? 'bg-slate-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title="Tidak Berlaku / Libur"
                  >
                    NA
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: FULL DESKTOP TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Kebiasaan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Target Standar</th>
                  <th className="py-3 px-4">Input Aktual</th>
                  <th className="py-3 px-4 text-center">Status Mutabaah</th>
                  <th className="py-3 px-4">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHabits.map((habit) => {
                  const entry = currentLog.entries[habit.id] || { habitId: habit.id, status: 'Not Done' };
                  const isDone = entry.status === 'Done';
                  const isPartial = entry.status === 'Partial';
                  const isNA = entry.status === 'NA';

                  return (
                    <tr
                      key={habit.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isDone ? 'bg-teal-50/20' : isPartial ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{habit.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {habit.frequency} • Prioritas {habit.priority}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          {habit.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {habit.targetValue} {habit.targetUnit}
                      </td>

                      <td className="py-3 px-4">
                        {habit.requiresActualValue ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              step={habit.targetUnit === 'juz' || habit.targetUnit === 'halaman' ? '0.05' : '1'}
                              value={entry.actualValue !== undefined ? entry.actualValue : ''}
                              placeholder={habit.targetValue.toString()}
                              onChange={(e) => handleActualValueChange(habit.id, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-teal-500"
                            />
                            <span className="text-[11px] text-slate-400">{habit.targetUnit}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Ceklis Status</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStatusChange(habit.id, 'Done')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              isDone ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-teal-50'
                            }`}
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleStatusChange(habit.id, 'Partial')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              isPartial ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                            }`}
                          >
                            Partial
                          </button>
                          <button
                            onClick={() => handleStatusChange(habit.id, 'Not Done')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              entry.status === 'Not Done' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            Not Done
                          </button>
                          <button
                            onClick={() => handleStatusChange(habit.id, 'NA')}
                            className={`px-1.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              isNA ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            NA
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Catatan..."
                          value={entry.notes || ''}
                          onChange={(e) => {
                            const updated = {
                              ...currentLog,
                              entries: {
                                ...currentLog.entries,
                                [habit.id]: { ...entry, notes: e.target.value }
                              }
                            };
                            onUpdateDailyLog(selectedDate, updated);
                          }}
                          className="w-full max-w-[160px] px-2 py-1 bg-transparent border-b border-slate-200 text-xs text-slate-700"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        confirmVariant="danger"
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
