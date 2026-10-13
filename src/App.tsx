/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './services/auth';
import { generateExcelWorkbook } from './services/excelGenerator';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { DailyTrackerView } from './components/DailyTrackerView';
import { WeeklyGoalsView } from './components/WeeklyGoalsView';
import { QuarterlyGoalsView } from './components/QuarterlyGoalsView';
import { AnnualGoalsView } from './components/AnnualGoalsView';
import { IoTProjectsView } from './components/IoTProjectsView';
import { CCNATrackerView } from './components/CCNATrackerView';
import { QuranTrackerView } from './components/QuranTrackerView';
import { MicrostockTrackerView } from './components/MicrostockTrackerView';
import { FinancialTrackerView } from './components/FinancialTrackerView';
import { SettingsView } from './components/SettingsView';
import { InstructionsView } from './components/InstructionsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { useCurrentDate, getTodayDateStr } from './utils/dateUtils';

import {
  DEFAULT_HABITS,
  INITIAL_DAILY_LOGS,
  INITIAL_WEEKLY_GOALS,
  INITIAL_QUARTERLY_GOALS,
  INITIAL_IOT_PROJECTS,
  INITIAL_CCNA_TOPICS,
  INITIAL_MICROSTOCK_ASSETS,
  INITIAL_GOLD_HOLDINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_FINANCIAL_SETTINGS,
  INITIAL_KPI_CARDS,
  INITIAL_QURAN_RECORDS
} from './data/defaultData';

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
  KPICardConfig,
  QuranRecord
} from './types/dashboard';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Dynamic Date tracker that automatically advances at midnight / screen wake
  const { todayStr, formattedIndo } = useCurrentDate();

  // App Central State with LocalStorage
  const [habits, setHabits] = useState<HabitDefinition[]>(() => {
    const saved = localStorage.getItem('pgd_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem('pgd_dailyLogs');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem('pgd_weeklyGoals');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_GOALS;
  });

  const [quarterlyGoals, setQuarterlyGoals] = useState<QuarterlyGoal[]>(() => {
    const saved = localStorage.getItem('pgd_quarterlyGoals');
    return saved ? JSON.parse(saved) : INITIAL_QUARTERLY_GOALS;
  });

  const [iotProjects, setIotProjects] = useState<IoTProject[]>(() => {
    const saved = localStorage.getItem('pgd_iotProjects');
    return saved ? JSON.parse(saved) : INITIAL_IOT_PROJECTS;
  });

  const [ccnaTopics, setCcnaTopics] = useState<CCNATopic[]>(() => {
    const saved = localStorage.getItem('pgd_ccnaTopics');
    return saved ? JSON.parse(saved) : INITIAL_CCNA_TOPICS;
  });

  const [microstockAssets, setMicrostockAssets] = useState<MicrostockAsset[]>(() => {
    const saved = localStorage.getItem('pgd_microstock');
    return saved ? JSON.parse(saved) : INITIAL_MICROSTOCK_ASSETS;
  });

  const [goldHoldings, setGoldHoldings] = useState<GoldHolding[]>(() => {
    const saved = localStorage.getItem('pgd_goldHoldings');
    return saved ? JSON.parse(saved) : INITIAL_GOLD_HOLDINGS;
  });

  const [transactions, setTransactions] = useState<ExpenseTransaction[]>(() => {
    const saved = localStorage.getItem('pgd_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [settings, setSettings] = useState<FinancialSettings>(() => {
    const saved = localStorage.getItem('pgd_settings');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_SETTINGS;
  });

  const [kpiCards, setKpiCards] = useState<KPICardConfig[]>(() => {
    const saved = localStorage.getItem('pgd_kpiCards');
    return saved ? JSON.parse(saved) : INITIAL_KPI_CARDS;
  });

  const [quranRecords, setQuranRecords] = useState<QuranRecord[]>(() => {
    const saved = localStorage.getItem('pgd_quranRecords');
    return saved ? JSON.parse(saved) : INITIAL_QURAN_RECORDS;
  });

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('pgd_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('pgd_dailyLogs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('pgd_weeklyGoals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem('pgd_quarterlyGoals', JSON.stringify(quarterlyGoals));
  }, [quarterlyGoals]);

  useEffect(() => {
    localStorage.setItem('pgd_iotProjects', JSON.stringify(iotProjects));
  }, [iotProjects]);

  useEffect(() => {
    localStorage.setItem('pgd_ccnaTopics', JSON.stringify(ccnaTopics));
  }, [ccnaTopics]);

  useEffect(() => {
    localStorage.setItem('pgd_microstock', JSON.stringify(microstockAssets));
  }, [microstockAssets]);

  useEffect(() => {
    localStorage.setItem('pgd_goldHoldings', JSON.stringify(goldHoldings));
  }, [goldHoldings]);

  useEffect(() => {
    localStorage.setItem('pgd_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pgd_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pgd_kpiCards', JSON.stringify(kpiCards));
  }, [kpiCards]);

  useEffect(() => {
    localStorage.setItem('pgd_quranRecords', JSON.stringify(quranRecords));
  }, [quranRecords]);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Auth Initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser) => setUser(authedUser),
      () => setUser(null)
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setUser(res.user);
        showToast(`✅ Berhasil masuk sebagai ${res.user.displayName || res.user.email || 'Pengguna'}!`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'Gagal masuk dengan akun Google.';
      if (err?.code === 'auth/popup-blocked') {
        message = '⚠️ Pop-up login diblokir browser. Harap izinkan pop-up (pop-up blocker) di peramban Anda.';
      } else if (err?.code === 'auth/popup-closed-by-user') {
        message = 'Jendela login ditutup sebelum proses selesai.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        message = 'Permintaan login dibatalkan.';
      } else if (err?.message) {
        message = `Gagal login: ${err.message}`;
      }
      showToast(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      showToast('Berhasil keluar dari akun Google.');
    } catch (err) {
      setUser(null);
    }
  };

  // Habit quick toggle on Dashboard
  const handleToggleHabitToday = (habitId: string, status: 'Done' | 'Partial' | 'Not Done') => {
    const todayKey = todayStr;
    const currentTodayLog = dailyLogs[todayKey] || {
      date: todayKey,
      isWeekend: false,
      entries: {}
    };

    const targetHabit = habits.find(h => h.id === habitId);
    let actualVal = currentTodayLog.entries[habitId]?.actualValue;
    if (status === 'Done' && (actualVal === undefined || actualVal === 0) && targetHabit) {
      actualVal = targetHabit.targetValue;
    } else if (status === 'Not Done') {
      actualVal = 0;
    }

    const updatedLog: DailyLog = {
      ...currentTodayLog,
      entries: {
        ...currentTodayLog.entries,
        [habitId]: {
          habitId,
          status,
          actualValue: actualVal
        }
      }
    };

    setDailyLogs(prev => ({
      ...prev,
      [todayKey]: updatedLog
    }));
  };

  const handleUpdateActualToday = (habitId: string, val: number) => {
    const todayKey = todayStr;
    const currentTodayLog = dailyLogs[todayKey] || {
      date: todayKey,
      isWeekend: false,
      entries: {}
    };

    const targetHabit = habits.find(h => h.id === habitId);
    let status: 'Done' | 'Partial' | 'Not Done' = 'Not Done';
    if (targetHabit && val >= targetHabit.targetValue) {
      status = 'Done';
    } else if (val > 0) {
      status = 'Partial';
    }

    const updatedLog: DailyLog = {
      ...currentTodayLog,
      entries: {
        ...currentTodayLog.entries,
        [habitId]: {
          habitId,
          status,
          actualValue: val
        }
      }
    };

    setDailyLogs(prev => ({
      ...prev,
      [todayKey]: updatedLog
    }));
  };

  // Delete Handlers for Individual Records
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleClearAllTransactions = () => {
    setTransactions([]);
  };

  const handleDeleteProject = (id: string) => {
    setIotProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleClearAllProjects = () => {
    setIotProjects([]);
  };

  const handleDeleteAsset = (id: string) => {
    setMicrostockAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleClearAllAssets = () => {
    setMicrostockAssets([]);
  };

  const handleDeleteQuranRecord = (id: string) => {
    setQuranRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAllQuranRecords = () => {
    setQuranRecords([]);
  };

  const handleAddGold = (newGold: GoldHolding) => {
    setGoldHoldings(prev => [newGold, ...prev]);
  };

  const handleDeleteGold = (id: string) => {
    setGoldHoldings(prev => prev.filter(g => g.id !== id));
  };

  const handleClearAllGold = () => {
    setGoldHoldings([]);
  };

  // Master Clear: Wipes all dummy content to start fresh with real user data!
  const handleClearAllDummyData = () => {
    setTransactions([]);
    setIotProjects([]);
    setMicrostockAssets([]);
    setGoldHoldings([]);
    setQuranRecords([]);
    setDailyLogs({}); // reset mutabaah logs to completely clean slate
    // Reset CCNA modules to unstudied state
    setCcnaTopics(prev =>
      prev.map(t => ({
        ...t,
        theoryLearned: false,
        labCompleted: false,
        quizScore: 0,
        studyMinutes: 0,
        studyDate: undefined,
        mistakesNotes: '',
        masteryStatus: 'Belum Dikuasai'
      }))
    );
    // Reset weekly goals
    setWeeklyGoals(prev =>
      prev.map(w => ({
        ...w,
        iotBrainstormDays: 0,
        iotBrainstormNotes: '',
        hafalanZiyadahPages: 0,
        hafalanMurojaahJuz: 0,
        achievementRate: 0,
        evalWhatAchieved: '',
        evalWhatMissed: '',
        evalObstacles: '',
        evalImprovementPlan: '',
        kajianOffline: { attended: false }
      }))
    );
  };

  // Master Restore: Restores initial template sample data
  const handleRestoreSampleData = () => {
    setHabits(DEFAULT_HABITS);
    setDailyLogs(INITIAL_DAILY_LOGS);
    setWeeklyGoals(INITIAL_WEEKLY_GOALS);
    setQuarterlyGoals(INITIAL_QUARTERLY_GOALS);
    setIotProjects(INITIAL_IOT_PROJECTS);
    setCcnaTopics(INITIAL_CCNA_TOPICS);
    setMicrostockAssets(INITIAL_MICROSTOCK_ASSETS);
    setGoldHoldings(INITIAL_GOLD_HOLDINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(INITIAL_FINANCIAL_SETTINGS);
    setKpiCards(INITIAL_KPI_CARDS);
    setQuranRecords(INITIAL_QURAN_RECORDS);
  };

  // Export authentic Excel workbook
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const blob = await generateExcelWorkbook({
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
        quranRecords
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Personal_Growth_Dashboard_2026.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export Excel workbook:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6F8] font-sans antialiased text-slate-800 relative">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-md p-3.5 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center justify-between gap-3">
          <span>{toastNotification}</span>
          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar (Desktop Sidebar + Mobile Drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onExportExcel={handleExportExcel}
        isExporting={isExporting}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header with Mobile Hamburger */}
        <Header
          title={
            currentTab === 'dashboard'
              ? 'Personal Growth 2026'
              : currentTab === 'daily'
              ? 'Daily Habits (HP)'
              : currentTab === 'weekly'
              ? 'Weekly Goals'
              : currentTab === 'quarterly'
              ? 'Quarterly Goals (Q4)'
              : currentTab === 'annual'
              ? 'Annual Goals 2026'
              : currentTab === 'iot'
              ? 'IoT Projects'
              : currentTab === 'ccna'
              ? 'CCNA & Jaringan'
              : currentTab === 'quran'
              ? "Hafalan & Qur'an"
              : currentTab === 'microstock'
              ? 'Microstock'
              : currentTab === 'finance'
              ? 'Financial Tracker'
              : currentTab === 'settings'
              ? 'Pengaturan & Data'
              : 'Panduan'
          }
          subtitle="Sprint Q4 (12 Okt - 31 Des 2026) | Konsistensi, Portofolio & Keuangan"
          currentDate={formattedIndo}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onExportExcel={handleExportExcel}
          onOpenAddTransaction={() => setIsAddTxModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isExporting={isExporting}
          isLoggingIn={isLoggingIn}
        />

        {/* Dynamic Content Views with safe bottom padding on mobile */}
        <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-24 md:pb-8 scrollbar-thin">
          {currentTab === 'dashboard' && (
            <DashboardView
              habits={habits}
              dailyLogs={dailyLogs}
              weeklyGoals={weeklyGoals}
              quarterlyGoals={quarterlyGoals}
              iotProjects={iotProjects}
              ccnaTopics={ccnaTopics}
              microstockAssets={microstockAssets}
              goldHoldings={goldHoldings}
              transactions={transactions}
              settings={settings}
              kpiCards={kpiCards}
              onToggleHabitToday={handleToggleHabitToday}
              onUpdateActualToday={handleUpdateActualToday}
              onNavigateTab={setCurrentTab}
              onClearAllDummyData={handleClearAllDummyData}
              onRestoreSampleData={handleRestoreSampleData}
            />
          )}

          {currentTab === 'daily' && (
            <DailyTrackerView
              habits={habits}
              dailyLogs={dailyLogs}
              onUpdateDailyLog={(date, updatedLog) =>
                setDailyLogs(prev => ({ ...prev, [date]: updatedLog }))
              }
              onClearAllDailyLogs={() => setDailyLogs({})}
            />
          )}

          {currentTab === 'weekly' && (
            <WeeklyGoalsView
              weeklyGoals={weeklyGoals}
              onUpdateWeeklyGoal={(goal) =>
                setWeeklyGoals(prev => prev.map(g => (g.id === goal.id ? goal : g)))
              }
              onAddWeeklyGoal={(goal) => setWeeklyGoals(prev => [...prev, goal])}
            />
          )}

          {currentTab === 'quarterly' && (
            <QuarterlyGoalsView
              quarterlyGoals={quarterlyGoals}
              onUpdateGoal={(goal) =>
                setQuarterlyGoals(prev => prev.map(g => (g.id === goal.id ? goal : g)))
              }
              onAddGoal={(goal) => setQuarterlyGoals(prev => [...prev, goal])}
            />
          )}

          {currentTab === 'annual' && (
            <AnnualGoalsView
              iotProjects={iotProjects}
              microstockAssets={microstockAssets}
              goldHoldings={goldHoldings}
              ccnaTopics={ccnaTopics}
              settings={settings}
              onNavigateTab={setCurrentTab}
              onAddGold={handleAddGold}
              onDeleteGold={handleDeleteGold}
              onClearAllGold={handleClearAllGold}
            />
          )}

          {currentTab === 'iot' && (
            <IoTProjectsView
              projects={iotProjects}
              onAddProject={(proj) => setIotProjects(prev => [...prev, proj])}
              onUpdateProject={(proj) =>
                setIotProjects(prev => prev.map(p => (p.id === proj.id ? proj : p)))
              }
              onDeleteProject={handleDeleteProject}
              onClearAllProjects={handleClearAllProjects}
            />
          )}

          {currentTab === 'ccna' && (
            <CCNATrackerView
              topics={ccnaTopics}
              onUpdateTopic={(topic) =>
                setCcnaTopics(prev => prev.map(t => (t.id === topic.id ? topic : t)))
              }
            />
          )}

          {currentTab === 'quran' && (
            <QuranTrackerView
              records={quranRecords}
              onAddRecord={(rec) => setQuranRecords(prev => [rec, ...prev])}
              onDeleteRecord={handleDeleteQuranRecord}
              onClearAllRecords={handleClearAllQuranRecords}
            />
          )}

          {currentTab === 'microstock' && (
            <MicrostockTrackerView
              assets={microstockAssets}
              onAddAsset={(ast) => setMicrostockAssets(prev => [ast, ...prev])}
              onDeleteAsset={handleDeleteAsset}
              onClearAllAssets={handleClearAllAssets}
            />
          )}

          {currentTab === 'finance' && (
            <FinancialTrackerView
              transactions={transactions}
              settings={settings}
              user={user}
              onAddTransaction={(tx) => setTransactions(prev => [tx, ...prev])}
              onImportTransactions={(imported) => {
                setTransactions(prev => [...imported, ...prev]);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAllTransactions={handleClearAllTransactions}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              habits={habits}
              settings={settings}
              kpiCards={kpiCards}
              onUpdateHabits={setHabits}
              onUpdateSettings={setSettings}
              onUpdateKPICards={setKpiCards}
              onClearAllDummyData={handleClearAllDummyData}
              onRestoreSampleData={handleRestoreSampleData}
              onResetToDefault={handleRestoreSampleData}
              onClearDailyLogs={() => setDailyLogs({})}
              onClearTransactions={handleClearAllTransactions}
              onClearProjects={handleClearAllProjects}
              onClearAssets={handleClearAllAssets}
              onClearQuranRecords={handleClearAllQuranRecords}
              onClearGold={handleClearAllGold}
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              isLoggingIn={isLoggingIn}
            />
          )}

          {currentTab === 'instructions' && <InstructionsView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenQuickAdd={() => setIsAddTxModalOpen(true)}
        />
      </div>

      {/* Global Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        onSave={(tx) => setTransactions(prev => [tx, ...prev])}
      />
    </div>
  );
}
