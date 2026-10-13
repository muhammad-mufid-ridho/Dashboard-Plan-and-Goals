import React, { useState } from 'react';
import { ExpenseTransaction } from '../types/dashboard';
import { X, CheckCircle, Tag, Wallet, Plus } from 'lucide-react';
import { getTodayDateStr } from '../utils/dateUtils';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: ExpenseTransaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [date, setDate] = useState(getTodayDateStr);
  const [category, setCategory] = useState<ExpenseTransaction['category']>('Jajan & Makanan');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('5000');
  const [paymentMethod, setPaymentMethod] = useState<ExpenseTransaction['paymentMethod']>('Tunai');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const quickAmounts = [2000, 5000, 10000, 15000, 25000, 50000];
  const quickCategories: ExpenseTransaction['category'][] = [
    'Jajan & Makanan',
    'Transportasi',
    'Kebutuhan Pribadi',
    'Infaq',
    'Pendidikan & Buku',
    'IoT & Komponen',
    'Lainnya'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount <= 0 || !description.trim()) return;

    const now = new Date();
    const timeStr = `${date} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    onSave({
      id: `tx_${Date.now()}`,
      timestamp: timeStr,
      date,
      category,
      description: description.trim(),
      amount: parsedAmount,
      paymentMethod,
      notes: notes.trim(),
      source: 'Manual'
    });

    setDescription('');
    setAmount('5000');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Catat Pengeluaran (Mode HP)</h3>
            <p className="text-[11px] text-slate-500">Mencatat pengeluaran langsung dari ponsel</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Quick Category Chips */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Pilih Kategori:</label>
            <div className="flex flex-wrap gap-1.5">
              {quickCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer ${
                    category === cat
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Deskripsi / Nama Makanan:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Jajan kue basah pagi, Gorengan, Bensin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-rose-500"
            />
          </div>

          {/* Amount & Quick Amount Buttons */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nominal Pengeluaran (Rp):</label>
            <input
              type="number"
              required
              min="100"
              step="500"
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-extrabold text-rose-600 focus:bg-white focus:outline-rose-500"
            />
            {/* Quick nominal chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 scrollbar-none">
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setAmount(q.toString())}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold border border-rose-200 shrink-0 cursor-pointer"
                >
                  Rp{q.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Metode Bayar:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tanggal:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan (Opsional):</label>
            <input
              type="text"
              placeholder="Nama warung, lokasi..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              Simpan Transaksi Pengeluaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
