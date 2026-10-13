import React, { useState } from 'react';
import { ExpenseTransaction, FinancialSettings } from '../types/dashboard';
import { User } from 'firebase/auth';
import { fetchGoogleSheetExpenses } from '../services/googleSheets';
import { ConfirmModal } from './ConfirmModal';
import { useCurrentDate, formatDateIndo } from '../utils/dateUtils';
import {
  Wallet,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  DollarSign,
  Trash2
} from 'lucide-react';

interface FinancialTrackerViewProps {
  transactions: ExpenseTransaction[];
  settings: FinancialSettings;
  user: User | null;
  onAddTransaction: (tx: ExpenseTransaction) => void;
  onImportTransactions: (txs: ExpenseTransaction[]) => void;
  onDeleteTransaction: (id: string) => void;
  onClearAllTransactions: () => void;
  onOpenAddModal: () => void;
}

export const FinancialTrackerView: React.FC<FinancialTrackerViewProps> = ({
  transactions,
  settings,
  user,
  onAddTransaction,
  onImportTransactions,
  onDeleteTransaction,
  onClearAllTransactions,
  onOpenAddModal
}) => {
  const { todayStr, monthStr, formattedIndo } = useCurrentDate();
  const [spreadsheetIdInput, setSpreadsheetIdInput] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);
  const [confirmClearModal, setConfirmClearModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Recaps
  const todayExpenses = transactions
    .filter(t => t.date === todayStr)
    .reduce((acc, t) => acc + t.amount, 0);

  const monthExpenses = transactions
    .filter(t => t.date.startsWith(monthStr))
    .reduce((acc, t) => acc + t.amount, 0);

  const remainingBudget = settings.monthlyExpenseBudget - monthExpenses;
  const currentCashBalance = settings.startingBalance - monthExpenses;
  const savingsPct2027 = Math.round((currentCashBalance / Math.max(1, settings.savingsTarget2027)) * 100);

  // Category Breakdown
  const categories = [
    'Jajan & Makanan',
    'Transportasi',
    'Kebutuhan Pribadi',
    'Infaq',
    'Pendidikan & Buku',
    'IoT & Komponen',
    'Lainnya'
  ] as const;

  const categoryTotals: Record<string, number> = {};
  categories.forEach(c => (categoryTotals[c] = 0));
  transactions
    .filter(t => t.date.startsWith(monthStr))
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const handleSyncGoogleSheets = async () => {
    if (!spreadsheetIdInput.trim()) {
      setSyncStatus({ success: false, message: 'Masukkan ID atau tautan Google Sheets terlebih dahulu.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    const result = await fetchGoogleSheetExpenses(spreadsheetIdInput.trim(), 'Form Responses 1!A1:G');

    setIsSyncing(false);
    if (result.success) {
      if (result.transactions.length > 0) {
        onImportTransactions(result.transactions);
        setSyncStatus({
          success: true,
          message: `Berhasil mengimpor ${result.transactions.length} baris transaksi baru dari Google Sheets!`
        });
      } else {
        setSyncStatus({
          success: true,
          message: 'Koneksi berhasil terhubung! Belum ada baris transaksi baru yang terdeteksi.'
        });
      }
    } else {
      setSyncStatus({
        success: false,
        message: result.error || 'Gagal menyinkronkan data Google Sheets.'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Wallet className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">
              Financial Tracker & Google Sheets Monitor
            </h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Mencatat pengeluaran harian via Google Forms dari HP atau catat langsung. Data dummy dapat dihapus kapan saja.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearModal(true)}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Dummy</span>
            </button>
          )}

          <button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Panduan Form HP</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* In-App Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Google Sheets Sync Strip */}
      <div className="bg-gradient-to-r from-teal-50 via-white to-teal-50/40 p-4.5 rounded-2xl border border-teal-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <span>Integrasi Satu Arah: Google Forms &rarr; Google Sheets &rarr; Dashboard</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {user ? `Akun: ${user.email}` : 'Masuk akun Google di header untuk sinkronisasi live'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={spreadsheetIdInput}
            onChange={(e) => setSpreadsheetIdInput(e.target.value)}
            placeholder="Tempel Tautan atau Spreadsheet ID Google Forms Anda"
            className="flex-1 p-2.5 bg-white border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-teal-600 font-medium"
          />
          <button
            onClick={handleSyncGoogleSheets}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menghubungkan...' : 'Sinkronkan Sekarang'}</span>
          </button>
        </div>

        {syncStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              syncStatus.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {syncStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{syncStatus.message}</span>
          </div>
        )}
      </div>

      {/* Setup Guide Modal / Accordion */}
      {showSetupGuide && (
        <div className="bg-white rounded-2xl p-5 border border-teal-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span>Panduan Setup Google Forms ke Google Sheets & Excel</span>
            </h3>
            <button
              onClick={() => setShowSetupGuide(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>Langkah 1: Buat Google Forms di HP Anda</strong><br />
              Buat form dengan 5 pertanyaan:
              <br />• <strong>Tanggal</strong> (Date, atau gunakan otomatis Timestamp)
              <br />• <strong>Kategori</strong> (Pilihan: Jajan & Makanan, Transportasi, Kebutuhan Pribadi, Infaq, Pendidikan & Buku, IoT & Komponen, Lainnya)
              <br />• <strong>Deskripsi</strong> (Jawaban Singkat, misal: Jajan pagi Rp5.000)
              <br />• <strong>Nominal</strong> (Angka, contoh: 5000)
              <br />• <strong>Metode Pembayaran</strong> (Pilihan: Tunai, QRIS, Transfer Bank, E-Wallet)
            </p>
            <p>
              <strong>Langkah 2: Hubungkan ke Google Sheets</strong><br />
              Di tab "Tanggapan" Google Forms, klik ikon spreadsheet hijau untuk membuat Google Sheet otomatis (misal diberi nama "Expense Tracker 2026").
            </p>
            <p>
              <strong>Langkah 3: Sinkronisasi</strong><br />
              Salin URL Google Sheet tersebut, tempel pada kolom input di atas, lalu klik <strong>"Sinkronkan Sekarang"</strong>. Setiap transaksi baru akan otomatis masuk ke tabel transaksi dan memperbarui rekap keuangan!
            </p>
          </div>
        </div>
      )}

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Pengeluaran Hari Ini (12 Okt)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            Rp{todayExpenses.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {transactions.filter(t => t.date === todayStr).length} transaksi dicatat
          </div>
        </div>

        {/* Month Expenses */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-rose-600 uppercase">Total Pengeluaran Bulan Ini</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            Rp{monthExpenses.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Budget Bulanan: Rp{settings.monthlyExpenseBudget.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-teal-600 uppercase">Saldo Kas Tabungan Aktual</div>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">
            Rp{currentCashBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Saldo Awal: Rp{settings.startingBalance.toLocaleString('id-ID')}
          </div>
        </div>

        {/* 2027 Goals */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-purple-600 uppercase">Target Tabungan Biaya 2027</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">
            {savingsPct2027}% <span className="text-xs text-slate-400 font-semibold">Tercapai</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, savingsPct2027))}%` }}></div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Transactions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Distribusi Pengeluaran per Kategori</h3>
          <div className="space-y-3 text-xs">
            {categories.map((cat) => {
              const total = categoryTotals[cat] || 0;
              const pct = monthExpenses > 0 ? Math.round((total / monthExpenses) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>{cat}</span>
                    <span className="font-bold text-slate-900">
                      Rp{total.toLocaleString('id-ID')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raw Transactions Table with Individual Delete (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Riwayat Transaksi Harian</h3>
            <span className="text-xs text-slate-500">{transactions.length} Baris Data</span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Wallet className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-xs font-bold text-slate-600">Belum Ada Transaksi</div>
              <p className="text-[11px] max-w-xs mx-auto">
                Silakan klik tombol <strong>"Catat Pengeluaran"</strong> untuk memasukkan transaksi riil pertama Anda atau hubungkan Google Sheets.
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{tx.description}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="text-teal-700 font-semibold">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.paymentMethod}</span>
                      {tx.source === 'Google Sheets' && (
                        <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">
                          Sheets
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900 text-sm">
                        Rp{tx.amount.toLocaleString('id-ID')}
                      </div>
                      {tx.notes && <div className="text-[10px] text-slate-400">{tx.notes}</div>}
                    </div>

                    {/* Delete Single Transaction Button */}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                      title="Hapus transaksi ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing All Dummy Transactions */}
      <ConfirmModal
        isOpen={confirmClearModal}
        title="Kosongkan Semua Transaksi Dummy?"
        message="Semua transaksi pengeluaran contoh akan dihapus bersih sehingga Anda dapat mencatat transaksi nyata dari HP atau menghubungkan Google Sheets."
        confirmLabel="Ya, Hapus Semua"
        confirmVariant="danger"
        onConfirm={() => {
          onClearAllTransactions();
          setConfirmClearModal(false);
          showToast('✅ Semua transaksi dummy berhasil dihapus! Daftar transaksi kini kosong dan siap diisi data riil.');
        }}
        onCancel={() => setConfirmClearModal(false)}
      />
    </div>
  );
};
