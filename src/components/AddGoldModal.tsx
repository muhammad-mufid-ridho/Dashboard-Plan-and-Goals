import React, { useState } from 'react';
import { GoldHolding } from '../types/dashboard';
import { X, Coins } from 'lucide-react';
import { getTodayDateStr } from '../utils/dateUtils';

interface AddGoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gold: GoldHolding) => void;
}

export const AddGoldModal: React.FC<AddGoldModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [date, setDate] = useState(getTodayDateStr);
  const [grams, setGrams] = useState<string>('5');
  const [pricePerGram, setPricePerGram] = useState<string>('1450000');
  const [type, setType] = useState<GoldHolding['type']>('Pembelian Baru');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(grams) || 0;
    const p = parseFloat(pricePerGram) || 0;
    if (g <= 0) return;

    onSave({
      id: `gh_${Date.now()}`,
      date,
      grams: g,
      pricePerGram: p,
      totalCost: g * p,
      type,
      notes: notes.trim() || `${type} ${g}g emas`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-50 text-yellow-700 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Catat Emas Fisik Real</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tanggal Perolehan:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Jenis Kepemilikan:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Tabungan Awal">Tabungan Awal</option>
                <option value="Pembelian Baru">Pembelian Baru</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Berat Fisik (Gram):</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-yellow-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Harga Beli/Gram (Rp):</label>
              <input
                type="number"
                step="1000"
                min="0"
                required
                value={pricePerGram}
                onChange={(e) => setPricePerGram(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Catatan / Merek (Antam, UBS, dll.):</label>
            <input
              type="text"
              placeholder="Contoh: Logam Mulia Antam CertiCard 5g"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
            >
              Simpan Data Emas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
