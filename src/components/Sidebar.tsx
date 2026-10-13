import React from 'react';
import { User } from 'firebase/auth';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Target,
  Trophy,
  Cpu,
  Network,
  BookOpen,
  Image,
  Wallet,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  X,
  LogOut
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'daily'
  | 'weekly'
  | 'quarterly'
  | 'annual'
  | 'iot'
  | 'ccna'
  | 'quran'
  | 'microstock'
  | 'finance'
  | 'settings'
  | 'instructions';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onExportExcel: () => void;
  isExporting?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  isLoggingIn?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onExportExcel,
  isExporting,
  isMobileOpen,
  onCloseMobile,
  user,
  onLogin,
  onLogout,
  isLoggingIn
}) => {
  const menuItems = [
    { id: 'dashboard' as NavigationTab, label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'daily' as NavigationTab, label: 'Daily Habits (HP)', icon: CheckSquare, badge: 'Senin-Jum' },
    { id: 'weekly' as NavigationTab, label: 'Weekly Goals', icon: CalendarDays },
    { id: 'quarterly' as NavigationTab, label: 'Quarterly Goals', icon: Target, badge: 'Q4' },
    { id: 'annual' as NavigationTab, label: 'Annual 2026', icon: Trophy, badge: '4 Pilar' },
    { id: 'iot' as NavigationTab, label: 'IoT Projects', icon: Cpu },
    { id: 'ccna' as NavigationTab, label: 'CCNA & Jaringan', icon: Network },
    { id: 'quran' as NavigationTab, label: "Hafalan & Qur'an", icon: BookOpen },
    { id: 'microstock' as NavigationTab, label: 'Microstock Portfolio', icon: Image },
    { id: 'finance' as NavigationTab, label: 'Financial & Sheets', icon: Wallet },
    { id: 'settings' as NavigationTab, label: 'Konfigurasi Sistem', icon: Settings },
    { id: 'instructions' as NavigationTab, label: 'Panduan & Formula', icon: HelpCircle },
  ];

  const handleItemClick = (id: NavigationTab) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0D9488] via-[#0F766E] to-[#115E59] text-white">
      {/* Brand Header */}
      <div className="p-4 md:p-5 border-b border-teal-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-[#4ECDC4]">26</span>
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-white leading-tight">GROWTH 2026</div>
            <div className="text-[11px] font-medium text-teal-200/80">Mobile & Web Dashboard</div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Status Bar in Sidebar */}
      <div className="px-3 py-2 border-b border-teal-700/40 bg-teal-900/30">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-teal-300 shrink-0 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-teal-200 text-teal-900 font-bold flex items-center justify-center text-xs shrink-0">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user.displayName || 'Pengguna'}
                </div>
                <div className="text-[10px] text-teal-200 truncate">
                  {user.email || 'Google Terhubung'}
                </div>
              </div>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-teal-200 hover:text-rose-200 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : onLogin ? (
          <button
            type="button"
            onClick={onLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white text-teal-900 rounded-xl text-xs font-bold shadow-sm hover:bg-teal-50 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{isLoggingIn ? 'Menghubungkan...' : 'Hubungkan Akun Google'}</span>
          </button>
        ) : null}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-teal-200/60">
          Modul & Pelacak
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0F766E] shadow-md shadow-teal-950/20 translate-x-1'
                  : 'text-teal-50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D9488]' : 'text-teal-200'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                    isActive ? 'bg-[#4ECDC4]/20 text-[#0F766E]' : 'bg-black/20 text-teal-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Excel Download CTA */}
      <div className="p-4 border-t border-teal-700/50 bg-teal-950/20 space-y-3">
        <button
          onClick={onExportExcel}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#4ECDC4] hover:bg-[#3dbdb4] active:scale-98 text-teal-950 font-bold text-xs shadow-md shadow-teal-900/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{isExporting ? 'Membuat .xlsx...' : 'Download File Excel (.xlsx)'}</span>
        </button>

        <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
          <div className="flex justify-between text-[10px] font-semibold text-teal-100">
            <span>Sprint Q4 2026</span>
            <span className="text-[#4ECDC4]">81 Hari Tersisa</span>
          </div>
          <div className="w-full bg-black/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#4ECDC4] h-full rounded-full" style={{ width: '12%' }}></div>
          </div>
          <div className="text-[9px] text-teal-200/80 mt-1">12 Okt 2026 → 31 Des 2026</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-68 shrink-0 select-none shadow-xl border-r border-[#14B8A6]/20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          ></div>
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
