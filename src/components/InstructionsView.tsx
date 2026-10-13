import React from 'react';
import { HelpCircle, CheckCircle, FileSpreadsheet, ExternalLink, Cpu, BookOpen, Coins } from 'lucide-react';

export const InstructionsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Petunjuk Lengkap Penggunaan Dashboard & Excel</h2>
          <p className="text-xs text-slate-500">
            Panduan operasional harian, rumus formula Excel, dan integrasi Google Sheets untuk pemula.
          </p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4 text-xs">
        {/* 1. Daily Tracker */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-extrabold">1</span>
            <span>Cara Mengisi Checklist Harian & Input Aktual</span>
          </h3>
          <ul className="list-disc list-inside text-slate-600 space-y-1 pl-2 leading-relaxed">
            <li><strong>Hari Kerja Rutin:</strong> Dihitung dari Senin sampai Jumat. Hari Sabtu dan Minggu ditandai <code>NA</code> secara default dan tidak mengurangi persentase produktivitas rutin.</li>
            <li><strong>Nilai Kuantitatif Aktual:</strong> Jangan hanya mencentang kotak. Masukkan durasi aktual (misal: 65 menit CCNA), repetisi (35 push-up), atau halaman (2 lembar tilawah).</li>
            <li><strong>Status:</strong> Pilih <strong>Done</strong> jika target terpenuhi, <strong>Partial</strong> jika baru setengah (misal jogging 20 dari 30 menit), atau <strong>Not Done</strong> jika terlewat.</li>
            <li><strong>Murojaah vs Ziyadah:</strong> Dibedakan secara tegas. Mengulang hafalan dicatat di kolom Murojaah (1/4 juz), sedangkan hafalan baru dicatat di Ziyadah (1/4 halaman).</li>
          </ul>
        </div>

        {/* 2. Integrasi Google Forms & Sheets */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-extrabold">2</span>
            <span>Alur Integrasi Google Forms &rarr; Google Sheets &rarr; Excel</span>
          </h3>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2">
            <div className="font-bold text-slate-800">Alur Penggunaan:</div>
            <p className="text-slate-600 leading-relaxed">
              1. <strong>Isi Formulir dari HP:</strong> Buat Google Forms untuk pengeluaran harian (kategori, deskripsi, nominal, metode pembayaran). Jadikan link form shortcut di layar beranda ponsel Anda.<br />
              2. <strong>Google Sheets sebagai Database:</strong> Setiap kali Anda submit di HP, Google Forms otomatis menambahkan 1 baris ke Google Sheets yang tertaut.<br />
              3. <strong>Sinkronisasi ke Dashboard Web:</strong> Di tab <em>Financial & Sheets</em> aplikasi ini, tempel link/ID Google Sheets dan klik <strong>Sinkronkan Sekarang</strong>.<br />
              4. <strong>Koneksi ke File Excel (.xlsx):</strong> Di Microsoft Excel 365 desktop, Anda dapat menggunakan <em>Data &gt; Get Data &gt; From Web</em> dengan URL publish-to-web CSV dari Google Sheets Anda untuk refresh otomatis sekali klik.
            </p>
          </div>
        </div>

        {/* 3. Proyek IoT Portofolio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-extrabold">3</span>
            <span>Aturan Penilaian Proyek IoT Portofolio</span>
          </h3>
          <p className="text-slate-600 leading-relaxed pl-2">
            Target tahunan adalah 6 proyek. Sesi <em>brainstorming</em> mingguan wajib menghasilkan progres nyata. Sebuah proyek <strong>hanya dihitung selesai</strong> jika telah memiliki:
            (1) Masalah & Solusi, (2) Prototipe fisik/simulasi bekerja, (3) Dokumentasi teknis & skema, (4) Bukti pengujian data/packet capture, (5) Link repositori GitHub.
          </p>
        </div>

        {/* 4. CCNA 200-301 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-extrabold">4</span>
            <span>Pembelajaran CCNA & Lab Packet Tracer</span>
          </h3>
          <p className="text-slate-600 leading-relaxed pl-2">
            Jadwal: 60 menit per hari, 5 hari seminggu (total target 60 jam di Q4). Materi tidak boleh ditandai sebagai "Dikuasai" hanya karena sudah dibaca. Penguasaan mensyaratkan: Teori selesai + Praktik Packet Tracer berhasil + Nilai kuis minimal 80%.
          </p>
        </div>

        {/* 5. Tabungan Emas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-extrabold">5</span>
            <span>Pencatatan Emas Logam Mulia (Target 40 Gram)</span>
          </h3>
          <p className="text-slate-600 leading-relaxed pl-2">
            Pisahkan antara gram emas yang sudah fisik dimiliki dengan uang yang baru dialokasikan untuk membeli emas. Harga pasar per gram diperbarui secara manual di sheet Settings (tblSettings) bersama tanggal pembaruan agar nilai aset transparan tanpa tergantung API pihak ketiga.
          </p>
        </div>

        {/* 6. Formula & Troubleshooting Excel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-extrabold">6</span>
            <span>Panduan Formula & Troubleshooting Excel</span>
          </h3>
          <ul className="list-disc list-inside text-slate-600 space-y-1 pl-2 leading-relaxed">
            <li><strong>#DIV/0! Error:</strong> Semua formula menggunakan <code>IFERROR(...)</code> dan <code>MAX(1, ...)</code> untuk mencegah pembagian dengan nol saat data awal kosong.</li>
            <li><strong>Menambah Baris Data:</strong> Tabel Excel (Excel Tables) akan otomatis memperluas referensi range (structured reference) saat Anda mengetik baris baru di bawah tabel.</li>
            <li><strong>Menonaktifkan Target:</strong> Jangan menghapus baris tabel jika ingin menghentikan target. Ubah status menjadi "Nonaktif" di sheet Settings agar riwayat data masa lalu tetap aman.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
