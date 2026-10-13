import React from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Calendar, Download, PlusCircle, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  currentDate: string;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onExportExcel: () => void;
  onOpenAddTransaction: () => void;
  onOpenMobileMenu?: () => void;
  isExporting?: boolean;
  isLoggingIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  currentDate,
  user,
  onLogin,
  onLogout,
  onExportExcel,
  onOpenAddTransaction,
  onOpenMobileMenu,
  isExporting,
  isLoggingIn
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4 sticky top-0 z-20 backdrop-blur-md bg-white/95">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Hamburger Button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base md:text-xl font-extrabold text-slate-800 tracking-tight truncate">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
              <Calendar className="w-3 h-3 text-teal-600" />
              <span>{currentDate}</span>
            </span>
          </div>
          {subtitle && (
            <p className="hidden md:block text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
        {/* Add Transaction Shortcut */}
        <button
          onClick={onOpenAddTransaction}
          className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/60"
        >
          <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Catat Pengeluaran</span>
          <span className="sm:hidden text-[11px]">Catat</span>
        </button>

        {/* Excel Export Button */}
        <button
          onClick={onExportExcel}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 px-2.5 md:px-3.5 py-1.5 md:py-2 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          title="Download File Excel (.xlsx)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isExporting ? 'Membuat...' : 'Download .xlsx'}</span>
          <span className="sm:hidden text-[11px]">Excel</span>
        </button>

        {/* Google Authentication Status */}
        {user ? (
          <div className="flex items-center gap-1.5 pl-1.5 md:pl-2 border-l border-slate-200">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-teal-500 shadow-xs object-cover"
              />
            ) : (
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                {user.displayName || 'Google Account'}
              </div>
              <div className="text-[10px] text-teal-600 font-medium truncate max-w-[110px]">
                Sheets OK
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Keluar"
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div>
            <GoogleSignInButton onClick={onLogin} isLoading={isLoggingIn} />
          </div>
        )}
      </div>
    </header>
  );
};
