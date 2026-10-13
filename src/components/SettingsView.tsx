import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { HabitDefinition, FinancialSettings, KPICardConfig } from '../types/dashboard';
import { Settings, Eye, EyeOff, Save, Plus, Trash2, Sliders, DollarSign, Coins, Sparkles, RefreshCw, CheckCircle2, User as UserIcon, LogOut } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SettingsViewProps {
  habits: HabitDefinition[];
  settings: FinancialSettings;
  kpiCards: KPICardConfig[];
  onUpdateHabits: (habits: HabitDefinition[]) => void;
  onUpdateSettings: (settings: FinancialSettings) => void;
  onUpdateKPICards: (cards: KPICardConfig[]) => void;
  onClearAllDummyData: () => void;
  onRestoreSampleData: () => void;
  onResetToDefault: () => void;
  onClearDailyLogs?: () => void;
  onClearTransactions?: () => void;
  onClearProjects?: () => void;
  onClearAssets?: () => void;
  onClearQuranRecords?: () => void;
  onClearGold?: () => void;
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  isLoggingIn?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  habits,
  settings,
  kpiCards,
  onUpdateHabits,
  onUpdateSettings,
  onUpdateKPICards,
  onClearAllDummyData,
  onRestoreSampleData,
  onResetToDefault,
  onClearDailyLogs,
  onClearTransactions,
  onClearProjects,
  onClearAssets,
  onClearQuranRecords,
  onClearGold,
  user,
  onLogin,
  onLogout,
  isLoggingIn
}) => {
  const [finSettings, setFinSettings] = useState<FinancialSettings>(settings);
  const [activeTab, setActiveTab] = useState<'dataManagement' | 'financial' | 'habits' | 'widgets' | 'account'>('account');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    variant: 'danger' | 'warning' | 'primary';
    label: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    variant: 'danger',
    label: 'Ya, Lanjutkan'
  });

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleHabitActive = (id: string) => {
    const updated = habits.map(h => (h.id === id ? { ...h, isActive: !h.isActive } : h));
    onUpdateHabits(updated);
  };

  const handleToggleWidget = (id: string) => {
    const updated = kpiCards.map(w => (w.id === id ? { ...w, isVisible: !w.isVisible } : w));
    onUpdateKPICards(updated);
  };

  const handleSaveFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(finSettings);
    setSaveSuccess(true);
    triggerToast('Parameter keuangan dan harga acuan emas berhasil disimpan.');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
              <Settings className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">
              Konfigurasi Sistem & Penyesuaian Data Real
            </h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Hapus seluruh data dummy untuk memulai dari nol dengan data real Anda, atau sesuaikan parameter keuangan.
          </p>
        </div>
      </div>

      {/* Floating or Top Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'account'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Akun Google & Autentikasi</span>
        </button>
        <button
          onClick={() => setActiveTab('dataManagement')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dataManagement'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          🧹 Manajemen Data (Hapus Dummy)
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'financial'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Parameter Keuangan & Emas Real
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'habits'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Daftar Kebiasaan (tblHabits)
        </button>
        <button
          onClick={() => setActiveTab('widgets')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'widgets'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Kustomisasi Kartu KPI
        </button>
      </div>

      {/* TAB: GOOGLE ACCOUNT & AUTHENTICATION */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Koneksi Akun Google & Cloud Session</h3>
            <p className="text-xs text-slate-500 mt-1">
              Hubungkan akun Google Anda untuk mengakses sinkronisasi Google Sheets dan mempersonalisasi dashboard mutabaah.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-12 h-12 rounded-full border-2 border-teal-500 shadow-xs object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-lg border-2 border-teal-300">
                  {user ? (user.displayName || user.email || 'U')[0].toUpperCase() : 'G'}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-slate-800">
                  {user ? (user.displayName || 'Akun Google') : 'Belum Terhubung'}
                </div>
                <div className="text-xs text-slate-500">
                  {user ? user.email : 'Silakan klik tombol di bawah untuk masuk.'}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${user ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {user ? 'Terotentikasi via Firebase & Google' : 'Status: Offline / Tamu'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              {user ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun</span>
                </button>
              ) : onLogin ? (
                <button
                  type="button"
                  onClick={onLogin}
                  disabled={isLoggingIn}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 bg-white rounded-full p-0.5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>{isLoggingIn ? 'Menghubungkan...' : 'Hubungkan Akun Google Sekarang'}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DATA MANAGEMENT (HAPUS DATA DUMMY) */}
      {activeTab === 'dataManagement' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Penyesuaian Data Dummy vs Data Riil</h3>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan opsi ini jika Anda ingin mengosongkan semua contoh transaksi, proyek, mutabaah, dan microstock bawaan agar Anda dapat memasukkan data yang 100% riil dari HP Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Kosongkan Semua Dummy */}
            <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Mulai dari Nol (Data Riil Anda)</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">
                  Menghapus semua data dummy:
                  <br />• 0 transaksi pengeluaran
                  <br />• 0 proyek IoT dummy
                  <br />• 0 aset microstock dummy
                  <br />• 0 gram emas dummy
                  <br />• 0 log hafalan dummy
                  <br />• Mengosongkan mutabaah harian agar siap Anda ceklis sendiri.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Bersihkan Semua Data Dummy?',
                    message: 'Seluruh transaksi contoh, proyek, aset microstock, mutabaah, dan riwayat ceklis harian akan dikosongkan agar Anda dapat mengisi data riil.\n\nDaftar 17 kebiasaan dan silabus CCNA tetap tersimpan.',
                    variant: 'danger',
                    label: 'Ya, Bersihkan Sekarang',
                    action: () => {
                      onClearAllDummyData();
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      triggerToast('✅ Seluruh data dummy berhasil dibersihkan! Dashboard Anda kini bersih dan siap diisi data riil.');
                    }
                  });
                }}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Bersihkan Semua Data Dummy Sekarang</span>
              </button>
            </div>

            {/* Box 2: Muat Ulang Contoh Dummy */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                  <span>Muat Ulang Contoh Template</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika Anda sewaktu-waktu ingin melihat kembali contoh data template lengkap dengan angka simulasi, Anda dapat memulihkannya kapan saja dengan tombol ini.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Muat Ulang Data Template Dummy?',
                    message: 'Data contoh simulasi akan dimuat ulang ke dalam dashboard untuk referensi.',
                    variant: 'primary',
                    label: 'Ya, Muat Ulang',
                    action: () => {
                      onRestoreSampleData();
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      triggerToast('✅ Data contoh template dummy berhasil dipulihkan.');
                    }
                  });
                }}
                className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 active:scale-98 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Contoh Template Dummy</span>
              </button>
            </div>
          </div>

          {/* Granular Module-by-Module Reset */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Opsi Bersihkan Data per Modul (Satu per Satu):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {onClearDailyLogs && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Kosongkan Semua Ceklis Harian?',
                      message: 'Seluruh riwayat centang mutabaah harian dari 12 Okt - 31 Des akan dikosongkan.',
                      variant: 'danger',
                      label: 'Ya, Kosongkan Mutabaah',
                      action: () => {
                        onClearDailyLogs();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                        triggerToast('✅ Seluruh ceklis mutabaah harian berhasil dikosongkan.');
                      }
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗑️ Kosongkan Ceklis Harian</span>
                </button>
              )}

              {onClearTransactions && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Kosongkan Transaksi Pengeluaran?',
                      message: 'Semua transaksi pengeluaran contoh akan dihapus bersih.',
                      variant: 'danger',
                      label: 'Ya, Kosongkan Transaksi',
                      action: () => {
                        onClearTransactions();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                        triggerToast('✅ Seluruh transaksi pengeluaran berhasil dikosongkan.');
                      }
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗑️ Kosongkan Transaksi Keuangan</span>
                </button>
              )}

              {onClearProjects && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Kosongkan Proyek IoT Dummy?',
                      message: 'Semua proyek IoT simulasi akan dihapus bersih.',
                      variant: 'danger',
                      label: 'Ya, Kosongkan Proyek',
                      action: () => {
                        onClearProjects();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                        triggerToast('✅ Seluruh proyek IoT berhasil dikosongkan.');
                      }
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗑️ Kosongkan Proyek IoT</span>
                </button>
              )}

              {onClearAssets && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Kosongkan Aset Microstock?',
                      message: 'Semua data aset microstock contoh akan dihapus bersih.',
                      variant: 'danger',
                      label: 'Ya, Kosongkan Microstock',
                      action: () => {
                        onClearAssets();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                        triggerToast('✅ Seluruh aset microstock berhasil dikosongkan.');
                      }
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗑️ Kosongkan Microstock</span>
                </button>
              )}

              {onClearQuranRecords && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Kosongkan Log Hafalan Quran?',
                      message: 'Semua log mutabaah murojaah dan ziyadah akan dihapus bersih.',
                      variant: 'danger',
                      label: 'Ya, Kosongkan Log Hafalan',
                      action: () => {
                        onClearQuranRecords();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                        triggerToast('✅ Seluruh catatan hafalan Quran berhasil dikosongkan.');
                      }
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗑️ Kosongkan Log Hafalan</span>
                </button>
              )}

              {onClearGold && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Kosongkan Catatan Tabungan Emas?',
                      message: 'Semua catatan emas contoh akan dihapus bersih.',
                      variant: 'danger',
                      label: 'Ya, Kosongkan Emas',
                      action: () => {
                        onClearGold();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                        triggerToast('✅ Seluruh catatan emas berhasil dikosongkan.');
                      }
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗑️ Kosongkan Data Emas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: FINANCIAL PARAMETERS */}
      {activeTab === 'financial' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Sesuaikan Saldo Kas & Target Emas Riil</h3>
            <p className="text-xs text-slate-500">
              Masukkan angka riil saldo tabungan awal Anda saat ini dan target biaya 2027.
            </p>
          </div>

          <form onSubmit={handleSaveFinancial} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Saldo Kas Tabungan Awal Riil (Rp):</label>
              <input
                type="number"
                value={finSettings.startingBalance}
                onChange={(e) => setFinSettings({ ...finSettings, startingBalance: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Budget Pengeluaran Bulanan (Rp):</label>
              <input
                type="number"
                value={finSettings.monthlyExpenseBudget}
                onChange={(e) => setFinSettings({ ...finSettings, monthlyExpenseBudget: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Tabungan Biaya 2027 (Rp):</label>
              <input
                type="number"
                value={finSettings.savingsTarget2027}
                onChange={(e) => setFinSettings({ ...finSettings, savingsTarget2027: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Harga Acuan Pasar Emas / Gram (Rp):</label>
                <input
                  type="number"
                  value={finSettings.currentGoldMarketPrice}
                  onChange={(e) => setFinSettings({ ...finSettings, currentGoldMarketPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tanggal Pembaruan Harga Emas:</label>
                <input
                  type="date"
                  value={finSettings.goldPriceLastUpdated}
                  onChange={(e) => setFinSettings({ ...finSettings, goldPriceLastUpdated: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600">Pengaturan berhasil disimpan!</span>
              )}
              <button
                type="submit"
                className="ml-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: HABITS CONFIG */}
      {activeTab === 'habits' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">
              Total {habits.length} Kebiasaan ({habits.filter(h => h.isActive).length} Aktif)
            </span>
            <span className="text-[11px] text-slate-400">
              Menonaktifkan kebiasaan tidak akan menghapus data riwayat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Kebiasaan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Target Standar</th>
                  <th className="py-3 px-4">Frekuensi</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {habits.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-800">{h.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                        {h.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {h.targetValue} {h.targetUnit}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{h.frequency}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          h.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {h.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleHabitActive(h.id)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          h.isActive
                            ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={h.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {h.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: WIDGETS CONFIG */}
      {activeTab === 'widgets' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Visibilitas Kartu Ringkasan (KPI Cards)</h3>
          <p className="text-xs text-slate-500">
            Aktifkan atau nonaktifkan kartu ringkasan yang ingin ditampilkan di Main Dashboard.
          </p>

          <div className="space-y-2.5 pt-2">
            {kpiCards.map((card) => (
              <div
                key={card.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-800">{card.title}</span>
                <button
                  onClick={() => handleToggleWidget(card.id)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    card.isVisible
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {card.isVisible ? 'Tampil' : 'Sembunyi'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.label}
        confirmVariant={confirmModal.variant}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
