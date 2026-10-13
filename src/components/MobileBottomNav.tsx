import React from 'react';
import { LayoutDashboard, CheckSquare, Wallet, Target, Menu, Plus } from 'lucide-react';
import { NavigationTab } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenMobileMenu: () => void;
  onOpenQuickAdd: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onOpenQuickAdd
}) => {
  const isTargetTab = currentTab === 'weekly' || currentTab === 'quarterly' || currentTab === 'annual';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg pb-safe">
      {/* 1. Dashboard */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <LayoutDashboard className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-teal-600 scale-110' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </button>

      {/* 2. Daily Habits (Mutabaah HP) */}
      <button
        onClick={() => onSelectTab('daily')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'daily' ? 'text-teal-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <CheckSquare className={`w-5 h-5 ${currentTab === 'daily' ? 'text-teal-600 scale-110' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Habit HP</span>
      </button>

      {/* Quick Add Floating Center Button */}
      <button
        onClick={onOpenQuickAdd}
        title="Catat Cepat dari HP"
        className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-[#0D9488] to-[#4ECDC4] text-white w-12 h-12 rounded-full shadow-lg shadow-teal-600/30 active:scale-95 transition-all cursor-pointer border-2 border-white"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 3. Keuangan (Financial) */}
      <button
        onClick={() => onSelectTab('finance')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          currentTab === 'finance' ? 'text-teal-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Wallet className={`w-5 h-5 ${currentTab === 'finance' ? 'text-teal-600 scale-110' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Keuangan</span>
      </button>

      {/* 4. Target / Menu */}
      <button
        onClick={onOpenMobileMenu}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isTargetTab ? 'text-teal-700 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">Semua</span>
      </button>
    </nav>
  );
};
