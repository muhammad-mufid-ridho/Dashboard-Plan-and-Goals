import ExcelJS from 'exceljs';
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
  QuranRecord
} from '../types/dashboard';

export interface ExportDataPayload {
  habits: HabitDefinition[];
  dailyLogs: Record<string, DailyLog>;
  weeklyGoals: WeeklyGoal[];
  quarterlyGoals: QuarterlyGoal[];
  iotProjects: IoTProject[];
  ccnaTopics: CCNATopic[];
  microstockAssets: MicrostockAsset[];
  goldHoldings: GoldHolding[];
  transactions: ExpenseTransaction[];
  settings: FinancialSettings;
  quranRecords: QuranRecord[];
}

// Styling Constants
const THEME = {
  headerBg: '4ECDC4',      // Turquoise primary
  headerText: 'FFFFFF',    // White
  subHeaderBg: 'E6FAF8',   // Light mint
  cardBg: 'F8FAFC',        // Slate-50 soft
  border: 'CBD5E1',        // Slate-300
  accentCoral: 'FF6B6B',   // Coral accent
  textDark: '1E293B',      // Slate-800
  textMuted: '64748B',     // Slate-500
  successBg: 'DCFCE7',     // Green light
  warningBg: 'FEF3C7',     // Yellow light
  dangerBg: 'FEE2E2',      // Red light
};

export async function generateExcelWorkbook(payload: ExportDataPayload): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Personal Growth Dashboard 2026';
  wb.lastModifiedBy = 'Pesawaran Mengaji';
  wb.created = new Date();
  wb.modified = new Date();

  // Helper to style header cells
  const styleHeaderCell = (cell: ExcelJS.Cell, bgHex: string = THEME.headerBg, fgHex: string = THEME.headerText) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + bgHex },
    };
    cell.font = {
      name: 'Segoe UI',
      size: 11,
      bold: true,
      color: { argb: 'FF' + fgHex },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF' + THEME.border } },
      bottom: { style: 'medium', color: { argb: 'FF0D9488' } },
      left: { style: 'thin', color: { argb: 'FF' + THEME.border } },
      right: { style: 'thin', color: { argb: 'FF' + THEME.border } },
    };
  };

  const styleDataCell = (cell: ExcelJS.Cell, align: 'left' | 'center' | 'right' = 'left', isAltRow = false) => {
    if (isAltRow) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' },
      };
    }
    cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF' + THEME.textDark } };
    cell.alignment = { vertical: 'middle', horizontal: align, wrapText: false };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    };
  };

  // ==========================================
  // SHEET 1: DASHBOARD (Main Executive Overview)
  // ==========================================
  const wsDash = wb.addWorksheet('Dashboard', {
    properties: { tabColor: { argb: 'FF4ECDC4' }, showGridLines: true },
    views: [{ showGridLines: true }]
  });

  wsDash.columns = [
    { width: 4 },  // A (margin)
    { width: 28 }, // B
    { width: 20 }, // C
    { width: 20 }, // D
    { width: 28 }, // E
    { width: 22 }, // F
    { width: 22 }, // G
  ];

  // Title Banner
  wsDash.mergeCells('B2:G2');
  const dashTitle = wsDash.getCell('B2');
  dashTitle.value = 'PERSONAL GROWTH DASHBOARD 2026';
  dashTitle.font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF0F766E' } };
  dashTitle.alignment = { vertical: 'middle', horizontal: 'left' };

  wsDash.mergeCells('B3:G3');
  const dashSub = wsDash.getCell('B3');
  dashSub.value = 'Sprint Kuartal 4: 12 Oktober 2026 s/d 31 Desember 2026 | Konsistensi, Portofolio & Keuangan';
  dashSub.font = { name: 'Segoe UI', size: 11, italic: true, color: { argb: 'FF64748B' } };

  // Section 1: KPI CARDS ROW 1 (Productivity & Spiritual)
  wsDash.mergeCells('B5:C5');
  wsDash.getCell('B5').value = '1. KEBIASAAN HARI INI';
  styleHeaderCell(wsDash.getCell('B5'));
  wsDash.mergeCells('B6:C6');
  wsDash.getCell('B6').value = {
    formula: `IFERROR(COUNTIF('Daily Tracker'!E5:U5, "Done") / MAX(1, COUNTIF('Daily Tracker'!E5:U5, "<>NA")), 1.0)`,
    result: 0.94
  };
  wsDash.getCell('B6').numFmt = '0.0%';
  wsDash.getCell('B6').font = { name: 'Segoe UI', size: 24, bold: true, color: { argb: 'FF0D9488' } };
  wsDash.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };

  wsDash.mergeCells('D5:E5');
  wsDash.getCell('D5').value = '2. BELAJAR CCNA (JAM AKTUAL)';
  styleHeaderCell(wsDash.getCell('D5'));
  wsDash.mergeCells('D6:E6');
  wsDash.getCell('D6').value = {
    formula: `SUM('CCNA Tracker'!H5:H19)/60`,
    result: 23.5
  };
  wsDash.getCell('D6').numFmt = '0.0 "Jam"';
  wsDash.getCell('D6').font = { name: 'Segoe UI', size: 24, bold: true, color: { argb: 'FF2563EB' } };
  wsDash.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };

  wsDash.mergeCells('F5:G5');
  wsDash.getCell('F5').value = '3. PROYEK IoT SELESAI';
  styleHeaderCell(wsDash.getCell('F5'));
  wsDash.mergeCells('F6:G6');
  wsDash.getCell('F6').value = {
    formula: `COUNTIF('Project Manager'!I5:I15, "Completed")`,
    result: 2
  };
  wsDash.getCell('F6').numFmt = '0 "dari 6 Target"';
  wsDash.getCell('F6').font = { name: 'Segoe UI', size: 24, bold: true, color: { argb: 'FF7C3AED' } };
  wsDash.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };

  // Section 2: KPI CARDS ROW 2 (Assets & Financial)
  // Dynamic calculations from payload for Excel results
  const calcUploadedStock = payload.microstockAssets.reduce((acc, a) => acc + a.uploadedCount, 0);
  const calcApprovedStock = payload.microstockAssets.reduce((acc, a) => acc + a.approvedCount, 0);
  const calcGoldGrams = payload.goldHoldings.reduce((acc, g) => acc + g.grams, 0);
  const calcExpenses = payload.transactions.reduce((acc, t) => acc + t.amount, 0);
  const calcCompletedIot = payload.iotProjects.filter(p => p.status === 'Completed').length;
  const calcMasteredCcna = payload.ccnaTopics.filter(t => t.masteryStatus === 'Dikuasai').length;
  const calcCcnaHours = +(payload.ccnaTopics.reduce((acc, t) => acc + t.studyMinutes, 0) / 60).toFixed(1);

  // Section 2: KPI CARDS ROW 2 (Assets & Financial)
  wsDash.mergeCells('B8:C8');
  wsDash.getCell('B8').value = '4. PORTOFOLIO MICROSTOCK';
  styleHeaderCell(wsDash.getCell('B8'));
  wsDash.mergeCells('B9:C9');
  wsDash.getCell('B9').value = {
    formula: `SUM('Microstock Tracker'!D5:D30)`,
    result: calcUploadedStock
  };
  wsDash.getCell('B9').numFmt = '#,##0 "Aset / 1.000"';
  wsDash.getCell('B9').font = { name: 'Segoe UI', size: 22, bold: true, color: { argb: 'FFD97706' } };
  wsDash.getCell('B9').alignment = { vertical: 'middle', horizontal: 'center' };

  wsDash.mergeCells('D8:E8');
  wsDash.getCell('D8').value = '5. AKUMULASI EMAS (GRAM)';
  styleHeaderCell(wsDash.getCell('D8'));
  wsDash.mergeCells('D9:E9');
  wsDash.getCell('D9').value = {
    formula: `SUM('Annual Goals'!D15:D30)`,
    result: calcGoldGrams
  };
  wsDash.getCell('D9').numFmt = '0.0 "Gram / 40g"';
  wsDash.getCell('D9').font = { name: 'Segoe UI', size: 22, bold: true, color: { argb: 'FFB45309' } };
  wsDash.getCell('D9').alignment = { vertical: 'middle', horizontal: 'center' };

  wsDash.mergeCells('F8:G8');
  wsDash.getCell('F8').value = '6. PENGELUARAN BULAN INI';
  styleHeaderCell(wsDash.getCell('F8'));
  wsDash.mergeCells('F9:G9');
  wsDash.getCell('F9').value = {
    formula: `SUM('Financial Dashboard'!D8:D14)`,
    result: calcExpenses
  };
  wsDash.getCell('F9').numFmt = '"Rp " #,##0';
  wsDash.getCell('F9').font = { name: 'Segoe UI', size: 22, bold: true, color: { argb: 'FFDC2626' } };
  wsDash.getCell('F9').alignment = { vertical: 'middle', horizontal: 'center' };

  // Executive Summary Table on Dashboard
  wsDash.getCell('B12').value = 'RINGKASAN TARGET TAHUNAN & REALISASI 2026';
  wsDash.getCell('B12').font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF0F766E' } };

  const dashSummaryHeaders = ['Pilar Target', 'Kategori', 'Target 2026', 'Realisasi Aktual', 'Progres (%)', 'Status'];
  dashSummaryHeaders.forEach((h, idx) => {
    const colLetter = String.fromCharCode(66 + idx); // B, C, D, E, F, G
    const cell = wsDash.getCell(`${colLetter}13`);
    cell.value = h;
    styleHeaderCell(cell, '0F766E');
  });

  const summaryRows = [
    ['IoT & Networking Projects', 'Teknis & Portofolio', '6 Proyek Siap Portofolio', `${calcCompletedIot} Selesai dari ${payload.iotProjects.length} Proyek`, calcCompletedIot / 6, calcCompletedIot >= 6 ? 'Tercapai' : 'On Track'],
    ['CCNA 200-301 Certification Prep', 'Akademik & Karir', '15 Modul (60 Jam Belajar)', `${calcMasteredCcna} Modul Dikuasai (${calcCcnaHours} Jam)`, Math.min(1, calcCcnaHours / 60), calcCcnaHours >= 60 ? 'Tercapai' : 'On Track'],
    ['Microstock Asset Portfolio', 'Kreatif & Passive Income', '1.000 Aset Unggah', `${calcUploadedStock} Aset (${calcApprovedStock} Diterima)`, Math.min(1, calcUploadedStock / 1000), calcUploadedStock >= 1000 ? 'Tercapai' : 'In Progress'],
    ['Emas Logam Mulia Murni', 'Aset & Tabungan', '40.0 Gram Fisik', `${calcGoldGrams.toFixed(1)} Gram Fisik Terkumpul`, Math.min(1, calcGoldGrams / 40), calcGoldGrams >= 40 ? 'Tercapai' : 'On Track'],
    ['Hafalan & Al-Qur\'an', 'Ibadah & Spiritual', 'Murojaah 1/4 Juz & Ziyadah 1/4 Hal', `${payload.quranRecords.length} Catatan Mutabaah`, 0.90, 'Active'],
    ['Budget Pengeluaran Bulanan', 'Keuangan', `Maksimal Rp${payload.settings.monthlyExpenseBudget.toLocaleString('id-ID')}`, `Rp${calcExpenses.toLocaleString('id-ID')} Terpakai`, Math.min(1, calcExpenses / Math.max(1, payload.settings.monthlyExpenseBudget)), calcExpenses <= payload.settings.monthlyExpenseBudget ? 'Terkendali' : 'Overbudget'],
  ];

  summaryRows.forEach((row, rIdx) => {
    const rowNum = 14 + rIdx;
    row.forEach((val, cIdx) => {
      const colLetter = String.fromCharCode(66 + cIdx);
      const cell = wsDash.getCell(`${colLetter}${rowNum}`);
      cell.value = val;
      styleDataCell(cell, cIdx === 0 || cIdx === 1 ? 'left' : cIdx === 4 ? 'right' : 'center', rIdx % 2 === 1);
      if (cIdx === 4 && typeof val === 'number') {
        cell.numFmt = '0.0%';
      }
    });
  });

  // Navigation Links on Dashboard
  wsDash.getCell('B22').value = 'NAVIGASI CEPAT WORKBOOK';
  wsDash.getCell('B22').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF0F766E' } };

  const navLinks = [
    ['[1] Daily Tracker', 'Klik untuk checklist harian 12 Okt - 31 Des 2026'],
    ['[2] Weekly Goals', 'Klik untuk target mingguan, IoT brainstorming, & kajian'],
    ['[3] Quarterly Goals', 'Klik untuk evaluasi kuartal 4 Oktober-Desember'],
    ['[4] Annual Goals', 'Klik untuk target tahunan IoT, CCNA, Microstock & Emas'],
    ['[5] Project Manager', 'Klik untuk detail komponen, protokol & repositori IoT'],
    ['[6] CCNA Tracker', 'Klik untuk silabus 15 modul jaringan & Packet Tracer'],
    ['[7] Quran & Memorization', 'Klik untuk catatan terpisah Murojaah & Ziyadah'],
    ['[8] Microstock Tracker', 'Klik untuk rekap platform Shutterstock & Adobe Stock'],
    ['[9] Financial Dashboard', 'Klik untuk rekap pengeluaran, saldo, & budget'],
    ['[10] Transactions Import', 'Klik untuk data transaksi mentah (Google Forms)'],
    ['[11] Settings', 'Klik untuk konfigurasi habit, budget, & harga emas'],
    ['[12] Instructions', 'Klik untuk petunjuk penggunaan pemula & koneksi Sheets']
  ];

  navLinks.forEach((nav, idx) => {
    const r = 23 + Math.floor(idx / 2);
    const c = idx % 2 === 0 ? 'B' : 'E';
    const c2 = idx % 2 === 0 ? 'D' : 'G';
    wsDash.mergeCells(`${c}${r}:${c2}${r}`);
    const cell = wsDash.getCell(`${c}${r}`);
    cell.value = `${nav[0]} — ${nav[1]}`;
    cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF0D9488' } };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
  });

  // ==========================================
  // SHEET 2: DAILY TRACKER (tblDailyLog)
  // ==========================================
  const wsDaily = wb.addWorksheet('Daily Tracker', {
    properties: { tabColor: { argb: 'FF0D9488' } },
    views: [{ state: 'frozen', xSplit: 4, ySplit: 4 }]
  });

  const dailyHeaders = [
    'No', 'Tanggal', 'Hari', 'Tipe Hari',
    // Ibadah (7)
    'Murojaah (1/4 Juz)', 'Tilawah (2 Lembar)', 'Ziyadah (1/4 Hal)', 'Infaq (Rp)', 'Salat Duha', 'Salat Tahajud', 'Salat Witir',
    // Diri (3)
    'Speaking EN (Menit)', 'Reading EN (Menit)', 'Telepon Ortu',
    // Akademik (3)
    'Math/Fisika (Soal)', 'CCNA (Menit)', 'Microstock (Foto)',
    // Kesehatan (4)
    'Push-up (Reps)', 'Sit-up (Reps)', 'Back-up (Reps)', 'Jogging (Menit)',
    // Summary
    'Done Count', 'Total Habit Aktif', '% Penyelesaian Harian'
  ];

  wsDaily.getRow(4).values = dailyHeaders;
  dailyHeaders.forEach((_, idx) => {
    const cell = wsDaily.getRow(4).getCell(idx + 1);
    styleHeaderCell(cell, idx < 4 ? '0F766E' : idx >= 21 ? '0D9488' : '4ECDC4');
  });

  // Set widths
  wsDaily.getColumn(1).width = 6;
  wsDaily.getColumn(2).width = 14;
  wsDaily.getColumn(3).width = 12;
  wsDaily.getColumn(4).width = 14;
  for (let c = 5; c <= 21; c++) {
    wsDaily.getColumn(c).width = 15;
  }
  wsDaily.getColumn(22).width = 12;
  wsDaily.getColumn(23).width = 15;
  wsDaily.getColumn(24).width = 18;

  // Title on Row 2
  wsDaily.mergeCells('B2:I2');
  wsDaily.getCell('B2').value = 'DAILY HABIT TRACKER (12 OKTOBER - 31 DESEMBER 2026)';
  wsDaily.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF0F766E' } };

  // Generate date rows from 2026-10-12 to 2026-12-31
  const startDate = new Date(2026, 9, 12); // Oct 12, 2026
  const endDate = new Date(2026, 11, 31);  // Dec 31, 2026
  const dayNamesIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  let rowCounter = 5;
  let currentDate = new Date(startDate);
  let dayIdx = 1;

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayName = dayNamesIndo[dayOfWeek];

    const row = wsDaily.getRow(rowCounter);
    row.getCell(1).value = dayIdx;
    row.getCell(2).value = dateStr;
    row.getCell(3).value = dayName;
    row.getCell(4).value = isWeekend ? 'Akhir Pekan' : 'Hari Kerja Rutin';

    // Check if we have logs for this date (e.g., today 2026-10-12)
    const log = payload.dailyLogs[dateStr];
    
    // Default or logged values
    if (log && log.entries) {
      row.getCell(5).value = log.entries['h_quran_murojaah']?.status || 'Done';
      row.getCell(6).value = log.entries['h_quran_tilawah']?.status || 'Done';
      row.getCell(7).value = log.entries['h_quran_ziyadah']?.status || 'Done';
      row.getCell(8).value = log.entries['h_infaq']?.actualValue || 2000;
      row.getCell(9).value = log.entries['h_duha']?.status || 'Done';
      row.getCell(10).value = log.entries['h_tahajud']?.status || 'Done';
      row.getCell(11).value = log.entries['h_witir']?.status || 'Done';
      row.getCell(12).value = log.entries['h_english_speaking']?.actualValue || 10;
      row.getCell(13).value = log.entries['h_english_reading']?.actualValue || 10;
      row.getCell(14).value = log.entries['h_call_parents']?.status || 'Done';
      row.getCell(15).value = log.entries['h_math_physics']?.actualValue || 1;
      row.getCell(16).value = log.entries['h_ccna_study']?.actualValue || 65;
      row.getCell(17).value = log.entries['h_microstock_upload']?.actualValue || 5;
      row.getCell(18).value = log.entries['h_pushup']?.actualValue || 35;
      row.getCell(19).value = log.entries['h_situp']?.actualValue || 30;
      row.getCell(20).value = log.entries['h_backup']?.actualValue || 30;
      row.getCell(21).value = log.entries['h_jogging']?.actualValue || 20;
    } else {
      // Unrecorded dates (clean slate)
      for (let c = 5; c <= 21; c++) {
        row.getCell(c).value = isWeekend ? 'NA' : '';
      }
    }

    // Formulas for Done Count and % Completion
    // Done count: counts cells equal to "Done" or numeric values >= target
    row.getCell(22).value = {
      formula: `COUNTIF(E${rowCounter}:U${rowCounter}, "Done") + COUNTIF(E${rowCounter}:U${rowCounter}, ">0")`,
      result: log ? 17 : 0
    };
    row.getCell(23).value = 17; // 17 active habits
    row.getCell(24).value = {
      formula: `IF(D${rowCounter}="Akhir Pekan", IF(V${rowCounter}>0, V${rowCounter}/W${rowCounter}, "NA"), V${rowCounter}/W${rowCounter})`,
      result: log ? 1.0 : 0
    };
    row.getCell(24).numFmt = '0.0%';

    // Style the cells
    for (let c = 1; c <= 24; c++) {
      styleDataCell(row.getCell(c), c <= 4 ? 'center' : c === 24 ? 'right' : 'center', rowCounter % 2 === 1);
    }

    currentDate.setDate(currentDate.getDate() + 1);
    rowCounter++;
    dayIdx++;
  }

  // ==========================================
  // SHEET 3: WEEKLY GOALS (tblWeeklyGoals)
  // ==========================================
  const wsWeekly = wb.addWorksheet('Weekly Goals', {
    properties: { tabColor: { argb: 'FF38BDF8' } }
  });

  wsWeekly.mergeCells('B2:H2');
  wsWeekly.getCell('B2').value = 'WEEKLY GOALS TRACKER — Q4 2026 (MINGGU 1 S/D 12)';
  wsWeekly.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF0284C7' } };

  const weeklyHeaders = [
    'Pekan', 'Rentang Tanggal', 'IoT Brainstorm (Hari/5)', 'Topik Jaringan & Lab',
    'Kajian Offline', 'Ziyadah Hal (Target 1.25)', 'Murojaah Juz (1.25)',
    '% Pencapaian', 'Evaluasi Tercapai', 'Evaluasi Belum Tercapai',
    'Hambatan Utama', 'Rencana Perbaikan Pekan Depan'
  ];

  wsWeekly.getRow(4).values = weeklyHeaders;
  weeklyHeaders.forEach((_, idx) => {
    styleHeaderCell(wsWeekly.getRow(4).getCell(idx + 1), '0284C7');
  });

  [8, 22, 18, 28, 24, 18, 18, 14, 28, 28, 28, 30].forEach((w, idx) => {
    wsWeekly.getColumn(idx + 1).width = w;
  });

  payload.weeklyGoals.forEach((wg, idx) => {
    const r = 5 + idx;
    const row = wsWeekly.getRow(r);
    row.getCell(1).value = `Pekan ${wg.weekNumber}`;
    row.getCell(2).value = `${wg.startDate} s/d ${wg.endDate}`;
    row.getCell(3).value = wg.iotBrainstormDays;
    row.getCell(4).value = wg.networkingTopicFocus;
    row.getCell(5).value = wg.kajianOffline.attended ? `Hadir: ${wg.kajianOffline.theme || 'Kajian'}` : 'Belum Hadir';
    row.getCell(6).value = wg.hafalanZiyadahPages;
    row.getCell(7).value = wg.hafalanMurojaahJuz;
    row.getCell(8).value = wg.achievementRate / 100;
    row.getCell(8).numFmt = '0.0%';
    row.getCell(9).value = wg.evalWhatAchieved;
    row.getCell(10).value = wg.evalWhatMissed;
    row.getCell(11).value = wg.evalObstacles;
    row.getCell(12).value = wg.evalImprovementPlan;

    for (let c = 1; c <= 12; c++) {
      styleDataCell(row.getCell(c), c === 8 ? 'right' : c <= 3 ? 'center' : 'left', idx % 2 === 1);
    }
  });

  // ==========================================
  // SHEET 4: QUARTERLY GOALS (tblQuarterlyGoals)
  // ==========================================
  const wsQuarterly = wb.addWorksheet('Quarterly Goals', {
    properties: { tabColor: { argb: 'FF818CF8' } }
  });

  wsQuarterly.mergeCells('B2:G2');
  wsQuarterly.getCell('B2').value = 'QUARTERLY GOALS (OKTOBER - DESEMBER 2026)';
  wsQuarterly.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF4338CA' } };

  const quarterlyHeaders = [
    'No', 'Sasaran Utama Q4', 'Kategori', 'Kondisi Awal (Baseline)', 'Target Akhir Q4',
    'Hasil Aktual', 'Bukti Pencapaian', 'Progres (%)', 'Kendala / Hambatan', 'Tindak Lanjut & Solusi'
  ];

  wsQuarterly.getRow(4).values = quarterlyHeaders;
  quarterlyHeaders.forEach((_, idx) => {
    styleHeaderCell(wsQuarterly.getRow(4).getCell(idx + 1), '4338CA');
  });

  [6, 30, 20, 24, 28, 28, 30, 14, 30, 32].forEach((w, idx) => {
    wsQuarterly.getColumn(idx + 1).width = w;
  });

  payload.quarterlyGoals.forEach((qg, idx) => {
    const r = 5 + idx;
    const row = wsQuarterly.getRow(r);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = qg.title;
    row.getCell(3).value = qg.category;
    row.getCell(4).value = qg.baseline;
    row.getCell(5).value = qg.target;
    row.getCell(6).value = qg.actualResult;
    row.getCell(7).value = qg.evidence;
    row.getCell(8).value = qg.progressPercent / 100;
    row.getCell(8).numFmt = '0.0%';
    row.getCell(9).value = qg.obstacles;
    row.getCell(10).value = qg.actionPlan;

    for (let c = 1; c <= 10; c++) {
      styleDataCell(row.getCell(c), c === 1 || c === 8 ? 'center' : 'left', idx % 2 === 1);
    }
  });

  // ==========================================
  // SHEET 5: ANNUAL GOALS 2026 (tblAnnualGoals & tblGold)
  // ==========================================
  const wsAnnual = wb.addWorksheet('Annual Goals', {
    properties: { tabColor: { argb: 'FFB45309' } }
  });

  wsAnnual.mergeCells('B2:G2');
  wsAnnual.getCell('B2').value = 'ANNUAL GOALS 2026 — 4 PILAR TARGET UTAMA';
  wsAnnual.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFB45309' } };

  // Pillar 1: IoT
  wsAnnual.mergeCells('B4:G4');
  wsAnnual.getCell('B4').value = 'PILAR 1: PROYEK IoT (TARGET 6 PROYEK PORTOFOLIO LENGKAP)';
  styleHeaderCell(wsAnnual.getCell('B4'), 'B45309');

  const annualIotHeaders = ['Target Proyek', 'Kriteria Selesai', 'Realisasi Saat Ini', 'Progres', 'Status', 'Catatan'];
  wsAnnual.getRow(5).values = ['', ...annualIotHeaders];
  annualIotHeaders.forEach((_, idx) => {
    styleHeaderCell(wsAnnual.getRow(5).getCell(idx + 2), 'D97706');
  });

  const rowIot = wsAnnual.getRow(6);
  rowIot.getCell(2).value = '6 Proyek IoT';
  rowIot.getCell(3).value = 'Memiliki Prototipe, Kode Repo, Uji, & Dokumen';
  rowIot.getCell(4).value = { formula: `COUNTIF('Project Manager'!I5:I15, "Completed")`, result: 2 };
  rowIot.getCell(5).value = { formula: `D6/6`, result: 0.33 };
  rowIot.getCell(5).numFmt = '0.0%';
  rowIot.getCell(6).value = 'In Progress';
  rowIot.getCell(7).value = '2 Selesai, 2 Sedang Prototyping Q4';
  for (let c = 2; c <= 7; c++) styleDataCell(rowIot.getCell(c), c === 4 || c === 5 || c === 6 ? 'center' : 'left');

  // Pillar 2: Microstock
  wsAnnual.mergeCells('B8:G8');
  wsAnnual.getCell('B8').value = 'PILAR 2: MICROSTOCK PORTFOLIO (TARGET 1.000 ASET)';
  styleHeaderCell(wsAnnual.getCell('B8'), 'B45309');

  const rowMs = wsAnnual.getRow(10);
  rowMs.getCell(2).value = '1.000 Aset';
  rowMs.getCell(3).value = 'Shutterstock & Adobe Stock Terverifikasi';
  rowMs.getCell(4).value = { formula: `SUM('Microstock Tracker'!D5:D30)`, result: 785 };
  rowMs.getCell(5).value = { formula: `D10/1000`, result: 0.785 };
  rowMs.getCell(5).numFmt = '0.0%';
  rowMs.getCell(6).value = 'Ahead of Pace';
  rowMs.getCell(7).value = 'Tingkat penerimaan 85%, total earnings $84.50';
  for (let c = 2; c <= 7; c++) styleDataCell(rowMs.getCell(c), c === 4 || c === 5 || c === 6 ? 'center' : 'left');

  // Pillar 3: Emas 40 Gram
  wsAnnual.mergeCells('B12:G12');
  wsAnnual.getCell('B12').value = 'PILAR 3: AKUMULASI LOGAM MULIA EMAS (TARGET 40 GRAM FISIK)';
  styleHeaderCell(wsAnnual.getCell('B12'), 'B45309');

  const goldTableHeaders = ['Tanggal', 'Keterangan / Jenis', 'Gram Fisik', 'Harga/Gram (Rp)', 'Total Biaya (Rp)', 'Nilai Pasar (Rp)'];
  wsAnnual.getRow(13).values = ['', ...goldTableHeaders];
  goldTableHeaders.forEach((_, idx) => {
    styleHeaderCell(wsAnnual.getRow(13).getCell(idx + 2), 'D97706');
  });

  payload.goldHoldings.forEach((gh, idx) => {
    const r = 14 + idx;
    const row = wsAnnual.getRow(r);
    row.getCell(2).value = gh.date;
    row.getCell(3).value = gh.notes || gh.type;
    row.getCell(4).value = gh.grams;
    row.getCell(5).value = gh.pricePerGram;
    row.getCell(5).numFmt = '"Rp " #,##0';
    row.getCell(6).value = { formula: `D${r}*E${r}`, result: gh.totalCost };
    row.getCell(6).numFmt = '"Rp " #,##0';
    row.getCell(7).value = { formula: `D${r}*Settings!C12`, result: gh.grams * payload.settings.currentGoldMarketPrice };
    row.getCell(7).numFmt = '"Rp " #,##0';

    for (let c = 2; c <= 7; c++) {
      styleDataCell(row.getCell(c), c === 2 || c === 4 ? 'center' : c >= 5 ? 'right' : 'left', idx % 2 === 1);
    }
  });

  const goldTotalRow = 14 + payload.goldHoldings.length;
  wsAnnual.getCell(`C${goldTotalRow}`).value = 'TOTAL AKUMULASI EMAS';
  wsAnnual.getCell(`C${goldTotalRow}`).font = { bold: true };
  wsAnnual.getCell(`D${goldTotalRow}`).value = { formula: `SUM(D14:D${goldTotalRow - 1})`, result: 31.0 };
  wsAnnual.getCell(`D${goldTotalRow}`).numFmt = '0.0 "g"';
  wsAnnual.getCell(`D${goldTotalRow}`).font = { bold: true };
  wsAnnual.getCell(`F${goldTotalRow}`).value = { formula: `SUM(F14:F${goldTotalRow - 1})`, result: 38500000 };
  wsAnnual.getCell(`F${goldTotalRow}`).numFmt = '"Rp " #,##0';
  wsAnnual.getCell(`G${goldTotalRow}`).value = { formula: `SUM(G14:G${goldTotalRow - 1})`, result: 45415000 };
  wsAnnual.getCell(`G${goldTotalRow}`).numFmt = '"Rp " #,##0';

  [18, 22, 34, 16, 20, 22, 22].forEach((w, idx) => {
    wsAnnual.getColumn(idx + 1).width = w;
  });

  // ==========================================
  // SHEET 6: PROJECT MANAGER (tblProjects)
  // ==========================================
  const wsProjects = wb.addWorksheet('Project Manager', {
    properties: { tabColor: { argb: 'FF10B981' } }
  });

  wsProjects.mergeCells('B2:H2');
  wsProjects.getCell('B2').value = 'IoT & NETWORKING PROJECT MANAGER';
  wsProjects.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF047857' } };

  const projectHeaders = [
    'ID', 'Nama Proyek IoT', 'Masalah yang Diselesaikan', 'Ide Solusi',
    'Komponen Hardware', 'Protokol Komunikasi', 'Konsep Jaringan',
    'Tahapan', 'Status', 'Progres (%)', 'Target Selesai',
    'Dokumentasi & GitHub', 'Uji / Evaluasi Akhir', 'Hitung Portofolio 2026'
  ];

  wsProjects.getRow(4).values = projectHeaders;
  projectHeaders.forEach((_, idx) => {
    styleHeaderCell(wsProjects.getRow(4).getCell(idx + 1), '047857');
  });

  [10, 32, 32, 34, 28, 24, 28, 16, 16, 14, 16, 28, 32, 22].forEach((w, idx) => {
    wsProjects.getColumn(idx + 1).width = w;
  });

  payload.iotProjects.forEach((proj, idx) => {
    const r = 5 + idx;
    const row = wsProjects.getRow(r);
    row.getCell(1).value = proj.id;
    row.getCell(2).value = proj.name;
    row.getCell(3).value = proj.problemStatement;
    row.getCell(4).value = proj.solutionIdea;
    row.getCell(5).value = proj.hardwareComponents.join(', ');
    row.getCell(6).value = proj.communicationProtocol;
    row.getCell(7).value = proj.networkingConcept;
    row.getCell(8).value = proj.phase;
    row.getCell(9).value = proj.status;
    row.getCell(10).value = proj.progressPercent / 100;
    row.getCell(10).numFmt = '0.0%';
    row.getCell(11).value = proj.targetDate;
    row.getCell(12).value = proj.githubUrl || '-';
    row.getCell(13).value = proj.testProof || proj.finalEvaluation || 'Dalam perancangan';
    row.getCell(14).value = proj.isAnnualCounted ? 'Ya (Memenuhi 5 Syarat)' : 'Belum (Masih Draft)';

    for (let c = 1; c <= 14; c++) {
      styleDataCell(row.getCell(c), c === 1 || c === 8 || c === 9 || c === 10 || c === 11 || c === 14 ? 'center' : 'left', idx % 2 === 1);
    }
  });

  // ==========================================
  // SHEET 7: CCNA TRACKER (tblCCNA)
  // ==========================================
  const wsCCNA = wb.addWorksheet('CCNA Tracker', {
    properties: { tabColor: { argb: 'FF2563EB' } }
  });

  wsCCNA.mergeCells('B2:H2');
  wsCCNA.getCell('B2').value = 'CCNA 200-301 & NETWORK ENGINEERING TRACKER';
  wsCCNA.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1D4ED8' } };

  const ccnaHeaders = [
    'Modul', 'Nama Materi Silabus CCNA', 'Teori Selesai', 'Lab Praktik Selesai',
    'Nilai Kuis / Ujian', 'Tingkat Pemahaman', 'Tanggal Belajar', 'Durasi (Menit)',
    'Catatan Kesalahan & Troubleshooting', 'Status Penguasaan'
  ];

  wsCCNA.getRow(4).values = ccnaHeaders;
  ccnaHeaders.forEach((_, idx) => {
    styleHeaderCell(wsCCNA.getRow(4).getCell(idx + 1), '1D4ED8');
  });

  [8, 38, 14, 16, 16, 18, 16, 16, 36, 20].forEach((w, idx) => {
    wsCCNA.getColumn(idx + 1).width = w;
  });

  payload.ccnaTopics.forEach((top, idx) => {
    const r = 5 + idx;
    const row = wsCCNA.getRow(r);
    row.getCell(1).value = `Modul ${top.moduleNumber}`;
    row.getCell(2).value = top.title;
    row.getCell(3).value = top.theoryLearned ? 'Ya' : 'Belum';
    row.getCell(4).value = top.labCompleted ? 'Ya' : 'Belum';
    row.getCell(5).value = top.quizScore;
    row.getCell(6).value = top.understandingLevel;
    row.getCell(7).value = top.studyDate || '-';
    row.getCell(8).value = top.studyMinutes;
    row.getCell(9).value = top.mistakesNotes || '-';
    row.getCell(10).value = top.masteryStatus;

    for (let c = 1; c <= 10; c++) {
      styleDataCell(row.getCell(c), c === 1 || c === 3 || c === 4 || c === 5 || c === 6 || c === 7 || c === 8 || c === 10 ? 'center' : 'left', idx % 2 === 1);
    }
  });

  // Summary Row CCNA
  const ccnaTotalRow = 5 + payload.ccnaTopics.length;
  wsCCNA.getCell(`B${ccnaTotalRow}`).value = 'TOTAL DURASI BELAJAR (MENIT & JAM)';
  wsCCNA.getCell(`B${ccnaTotalRow}`).font = { bold: true };
  wsCCNA.getCell(`H${ccnaTotalRow}`).value = { formula: `SUM(H5:H${ccnaTotalRow - 1})`, result: 1410 };
  wsCCNA.getCell(`H${ccnaTotalRow}`).font = { bold: true };
  wsCCNA.getCell(`I${ccnaTotalRow}`).value = { formula: `H${ccnaTotalRow}/60`, result: 23.5 };
  wsCCNA.getCell(`I${ccnaTotalRow}`).numFmt = '0.0 "Jam"';
  wsCCNA.getCell(`I${ccnaTotalRow}`).font = { bold: true };

  // ==========================================
  // SHEET 8: QURAN & MEMORIZATION (tblQuran)
  // ==========================================
  const wsQuran = wb.addWorksheet('Quran and Memorization', {
    properties: { tabColor: { argb: 'FF059669' } }
  });

  wsQuran.mergeCells('B2:G2');
  wsQuran.getCell('B2').value = 'MUTABAAH AL-QUR\'AN — MUROJAAH & ZIYADAH TERPISAH';
  wsQuran.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF047857' } };

  const quranHeaders = [
    'No', 'Tanggal', 'Jenis Kegiatan', 'Surah / Ayat Mulai', 'Surah / Ayat Akhir',
    'Jumlah (Juz/Hal)', 'Satuan', 'Kualitas Kelancaran', 'Catatan Murojaah'
  ];

  wsQuran.getRow(4).values = quranHeaders;
  quranHeaders.forEach((_, idx) => {
    styleHeaderCell(wsQuran.getRow(4).getCell(idx + 1), '047857');
  });

  [6, 14, 18, 24, 24, 16, 12, 18, 30].forEach((w, idx) => {
    wsQuran.getColumn(idx + 1).width = w;
  });

  payload.quranRecords.forEach((qr, idx) => {
    const r = 5 + idx;
    const row = wsQuran.getRow(r);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = qr.date;
    row.getCell(3).value = qr.type === 'Murojaah' ? 'Murojaah (Ulang Hafalan)' : 'Ziyadah (Tambah Hafalan)';
    row.getCell(4).value = qr.surahFrom;
    row.getCell(5).value = qr.surahTo || '-';
    row.getCell(6).value = qr.juzOrPageAmount;
    row.getCell(7).value = qr.unit;
    row.getCell(8).value = qr.quality;
    row.getCell(9).value = qr.notes || '-';

    for (let c = 1; c <= 9; c++) {
      styleDataCell(row.getCell(c), c === 1 || c === 2 || c === 3 || c === 6 || c === 7 || c === 8 ? 'center' : 'left', idx % 2 === 1);
    }
  });

  // ==========================================
  // SHEET 9: MICROSTOCK TRACKER (tblMicrostock)
  // ==========================================
  const wsMicrostock = wb.addWorksheet('Microstock Tracker', {
    properties: { tabColor: { argb: 'FFD97706' } }
  });

  wsMicrostock.mergeCells('B2:H2');
  wsMicrostock.getCell('B2').value = 'MICROSTOCK PORTFOLIO TRACKER (TARGET 1.000 ASET)';
  wsMicrostock.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFB45309' } };

  const msHeaders = [
    'No', 'Tanggal', 'Platform Utama', 'Judul / Deskripsi Aset', 'Tipe Aset',
    'Jumlah Unggah', 'Diterima (Approved)', 'Ditolak (Rejected)', 'Dalam Review',
    'Aset Terjual', 'Pendapatan ($ USD)'
  ];

  wsMicrostock.getRow(4).values = msHeaders;
  msHeaders.forEach((_, idx) => {
    styleHeaderCell(wsMicrostock.getRow(4).getCell(idx + 1), 'B45309');
  });

  [6, 14, 18, 34, 14, 15, 18, 18, 16, 14, 18].forEach((w, idx) => {
    wsMicrostock.getColumn(idx + 1).width = w;
  });

  payload.microstockAssets.forEach((ms, idx) => {
    const r = 5 + idx;
    const row = wsMicrostock.getRow(r);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = ms.date;
    row.getCell(3).value = ms.platform;
    row.getCell(4).value = ms.title;
    row.getCell(5).value = ms.assetType;
    row.getCell(6).value = ms.uploadedCount;
    row.getCell(7).value = ms.approvedCount;
    row.getCell(8).value = ms.rejectedCount;
    row.getCell(9).value = ms.underReviewCount;
    row.getCell(10).value = ms.salesCount;
    row.getCell(11).value = ms.revenueUsd;
    row.getCell(11).numFmt = '"$"#,##0.00';

    for (let c = 1; c <= 11; c++) {
      styleDataCell(row.getCell(c), c === 1 || c === 2 || c === 3 || c === 5 ? 'center' : c >= 6 ? 'right' : 'left', idx % 2 === 1);
    }
  });

  // Summary Row Microstock
  const msTotalRow = 5 + payload.microstockAssets.length;
  wsMicrostock.getCell(`D${msTotalRow}`).value = 'TOTAL TERAKUMULASI';
  wsMicrostock.getCell(`D${msTotalRow}`).font = { bold: true };
  wsMicrostock.getCell(`F${msTotalRow}`).value = { formula: `SUM(F5:F${msTotalRow - 1})`, result: 21 };
  wsMicrostock.getCell(`F${msTotalRow}`).font = { bold: true };
  wsMicrostock.getCell(`G${msTotalRow}`).value = { formula: `SUM(G5:G${msTotalRow - 1})`, result: 18 };
  wsMicrostock.getCell(`G${msTotalRow}`).font = { bold: true };
  wsMicrostock.getCell(`K${msTotalRow}`).value = { formula: `SUM(K5:K${msTotalRow - 1})`, result: 11.6 };
  wsMicrostock.getCell(`K${msTotalRow}`).numFmt = '"$"#,##0.00';
  wsMicrostock.getCell(`K${msTotalRow}`).font = { bold: true };

  // ==========================================
  // SHEET 10: FINANCIAL DASHBOARD
  // ==========================================
  const wsFinDash = wb.addWorksheet('Financial Dashboard', {
    properties: { tabColor: { argb: 'FFEF4444' } }
  });

  wsFinDash.mergeCells('B2:G2');
  wsFinDash.getCell('B2').value = 'FINANCIAL DASHBOARD & SAVINGS MONITOR';
  wsFinDash.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFB91C1C' } };

  // KPI Financial Cards
  wsFinDash.mergeCells('B4:C4');
  wsFinDash.getCell('B4').value = 'SALDO KAS SAAT INI';
  styleHeaderCell(wsFinDash.getCell('B4'), 'B91C1C');
  wsFinDash.mergeCells('B5:C5');
  wsFinDash.getCell('B5').value = { formula: `Settings!C9 - SUM(D8:D14)`, result: 3648000 };
  wsFinDash.getCell('B5').numFmt = '"Rp " #,##0';
  wsFinDash.getCell('B5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF0D9488' } };

  wsFinDash.mergeCells('D4:E4');
  wsFinDash.getCell('D4').value = 'SISA BUDGET BULAN INI';
  styleHeaderCell(wsFinDash.getCell('D4'), 'B91C1C');
  wsFinDash.mergeCells('D5:E5');
  wsFinDash.getCell('D5').value = { formula: `Settings!C10 - SUM(D8:D14)`, result: 648000 };
  wsFinDash.getCell('D5').numFmt = '"Rp " #,##0';
  wsFinDash.getCell('D5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF2563EB' } };

  wsFinDash.mergeCells('F4:G4');
  wsFinDash.getCell('F4').value = 'TARGET TABUNGAN BIAYA 2027';
  styleHeaderCell(wsFinDash.getCell('F4'), 'B91C1C');
  wsFinDash.mergeCells('F5:G5');
  wsFinDash.getCell('F5').value = { formula: `B5 / Settings!C11`, result: 0.243 };
  wsFinDash.getCell('F5').numFmt = '0.0%';
  wsFinDash.getCell('F5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF7C3AED' } };

  // Rekap per Kategori Table
  wsFinDash.mergeCells('B7:E7');
  wsFinDash.getCell('B7').value = 'REKAP PENGELUARAN PER KATEGORI (SUMIF DARI TRANSAKSI)';
  styleHeaderCell(wsFinDash.getCell('B7'), '991B1B');

  const catHeaders = ['Kategori Pengeluaran', 'Jumlah Transaksi', 'Total Pengeluaran (Rp)', 'Porsi (%)'];
  wsFinDash.getRow(8).values = ['', ...catHeaders];
  catHeaders.forEach((_, idx) => {
    styleHeaderCell(wsFinDash.getRow(8).getCell(idx + 2), 'DC2626');
  });

  const categories = [
    'Jajan & Makanan',
    'Transportasi',
    'Kebutuhan Pribadi',
    'Infaq',
    'Pendidikan & Buku',
    'IoT & Komponen',
    'Lainnya'
  ];

  categories.forEach((cat, idx) => {
    const r = 9 + idx;
    const row = wsFinDash.getRow(r);
    row.getCell(2).value = cat;
    row.getCell(3).value = { formula: `COUNTIF('Transactions Import'!C5:C100, "${cat}")`, result: 2 };
    row.getCell(4).value = { formula: `SUMIF('Transactions Import'!C5:C100, "${cat}", 'Transactions Import'!E5:E100)`, result: 22000 };
    row.getCell(4).numFmt = '"Rp " #,##0';
    row.getCell(5).value = { formula: `D${r}/SUM(D$9:D$15)`, result: 0.15 };
    row.getCell(5).numFmt = '0.0%';

    for (let c = 2; c <= 5; c++) {
      styleDataCell(row.getCell(c), c === 2 ? 'left' : c === 3 ? 'center' : 'right', idx % 2 === 1);
    }
  });

  [6, 26, 18, 24, 16, 20, 20].forEach((w, idx) => {
    wsFinDash.getColumn(idx + 1).width = w;
  });

  // ==========================================
  // SHEET 11: TRANSACTIONS IMPORT (tblTransactions)
  // ==========================================
  const wsTx = wb.addWorksheet('Transactions Import', {
    properties: { tabColor: { argb: 'FFDC2626' } },
    views: [{ state: 'frozen', xSplit: 2, ySplit: 4 }]
  });

  wsTx.mergeCells('B2:G2');
  wsTx.getCell('B2').value = 'DATA TRANSAKSI MENTAH (TERHUBUNG KE GOOGLE FORMS / SHEETS)';
  wsTx.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF991B1B' } };

  const txHeaders = [
    'No', 'Timestamp', 'Kategori', 'Deskripsi Pengeluaran', 'Nominal (Rp)',
    'Metode Pembayaran', 'Catatan', 'Sumber Data'
  ];

  wsTx.getRow(4).values = txHeaders;
  txHeaders.forEach((_, idx) => {
    styleHeaderCell(wsTx.getRow(4).getCell(idx + 1), '991B1B');
  });

  [6, 22, 22, 34, 18, 18, 24, 16].forEach((w, idx) => {
    wsTx.getColumn(idx + 1).width = w;
  });

  payload.transactions.forEach((tx, idx) => {
    const r = 5 + idx;
    const row = wsTx.getRow(r);
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = tx.timestamp;
    row.getCell(3).value = tx.category;
    row.getCell(4).value = tx.description;
    row.getCell(5).value = tx.amount;
    row.getCell(5).numFmt = '"Rp " #,##0';
    row.getCell(6).value = tx.paymentMethod;
    row.getCell(7).value = tx.notes || '-';
    row.getCell(8).value = tx.source;

    for (let c = 1; c <= 8; c++) {
      styleDataCell(row.getCell(c), c === 1 || c === 2 || c === 6 || c === 8 ? 'center' : c === 5 ? 'right' : 'left', idx % 2 === 1);
    }
  });

  // ==========================================
  // SHEET 12: SETTINGS (tblSettings & tblHabits)
  // ==========================================
  const wsSettings = wb.addWorksheet('Settings', {
    properties: { tabColor: { argb: 'FF64748B' } }
  });

  wsSettings.mergeCells('B2:G2');
  wsSettings.getCell('B2').value = 'PENGATURAN SISTEM & KONFIGURASI TARGET (tblSettings)';
  wsSettings.getCell('B2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF334155' } };

  // Parameter Keuangan
  wsSettings.mergeCells('B4:C4');
  wsSettings.getCell('B4').value = 'KONFIGURASI FINANSIAL & EMAS';
  styleHeaderCell(wsSettings.getCell('B4'), '475569');

  const finConfigs = [
    ['Saldo Kas Awal', payload.settings.startingBalance, '"Rp " #,##0'],
    ['Budget Pengeluaran Bulanan', payload.settings.monthlyExpenseBudget, '"Rp " #,##0'],
    ['Target Tabungan 2027', payload.settings.savingsTarget2027, '"Rp " #,##0'],
    ['Harga Pasar Emas/Gram (Manual)', payload.settings.currentGoldMarketPrice, '"Rp " #,##0'],
    ['Target Gram Emas Tahunan', payload.settings.goldTargetGrams, '0.0 "g"'],
  ];

  finConfigs.forEach((cfg, idx) => {
    const r = 5 + idx;
    wsSettings.getCell(`B${r}`).value = cfg[0];
    wsSettings.getCell(`C${r}`).value = cfg[1];
    wsSettings.getCell(`C${r}`).numFmt = cfg[2] as string;
    styleDataCell(wsSettings.getCell(`B${r}`), 'left');
    styleDataCell(wsSettings.getCell(`C${r}`), 'right');
  });

  // Daftar Kebiasaan Aktif
  wsSettings.mergeCells('B12:G12');
  wsSettings.getCell('B12').value = 'DAFTAR KEBIASAAN HARIAN (tblHabits)';
  styleHeaderCell(wsSettings.getCell('B12'), '475569');

  const habitDefHeaders = ['ID', 'Nama Kebiasaan', 'Kategori', 'Target Kuantitatif', 'Frekuensi', 'Status Aktif', 'Prioritas'];
  wsSettings.getRow(13).values = ['', ...habitDefHeaders];
  habitDefHeaders.forEach((_, idx) => {
    styleHeaderCell(wsSettings.getRow(13).getCell(idx + 2), '334155');
  });

  payload.habits.forEach((h, idx) => {
    const r = 14 + idx;
    const row = wsSettings.getRow(r);
    row.getCell(2).value = h.id;
    row.getCell(3).value = h.name;
    row.getCell(4).value = h.category;
    row.getCell(5).value = `${h.targetValue} ${h.targetUnit}`;
    row.getCell(6).value = h.frequency;
    row.getCell(7).value = h.isActive ? 'Aktif' : 'Nonaktif';
    row.getCell(8).value = h.priority;

    for (let c = 2; c <= 8; c++) {
      styleDataCell(row.getCell(c), c === 2 || c === 5 || c === 6 || c === 7 || c === 8 ? 'center' : 'left', idx % 2 === 1);
    }
  });

  [6, 24, 34, 22, 20, 18, 16, 16].forEach((w, idx) => {
    wsSettings.getColumn(idx + 1).width = w;
  });

  // ==========================================
  // SHEET 13: INSTRUCTIONS (Panduan Penggunaan)
  // ==========================================
  const wsInst = wb.addWorksheet('Instructions', {
    properties: { tabColor: { argb: 'FF0D9488' } }
  });

  wsInst.columns = [
    { width: 4 },
    { width: 28 },
    { width: 75 }
  ];

  wsInst.mergeCells('B2:C2');
  wsInst.getCell('B2').value = 'PANDUAN LENGKAP PENGGUNAAN PERSONAL GROWTH DASHBOARD 2026';
  wsInst.getCell('B2').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF0F766E' } };

  const instructions = [
    ['1. Filosofi & Rentang Waktu', 'Dashboard ini dirancang untuk sprint 12 Oktober 2026 s/d 31 Desember 2026. Fokusnya adalah konsistensi nyata, data objektif, dan portofolio teknis yang dapat diverifikasi.'],
    ['2. Daily Habit Tracker', '• Hari Senin s/d Jumat adalah hari kerja rutin yang dihitung dalam konsistensi.\n• Hari Sabtu & Minggu bersifat opsional; jika tidak diisi akan diberi tanda NA dan tidak mengurangi persentase.\n• Gunakan nilai kuantitatif aktual (menit, repetisi, foto, juz) dan bukan hanya tanda centang.\n• Murojaah (1/4 juz) dan Ziyadah (1/4 hal) dicatat terpisah.'],
    ['3. Integrasi Google Forms & Sheets', '1. Buat Google Form dengan pertanyaan: Kategori (Dropdown), Deskripsi (Teks Singkat), Nominal (Angka), Metode Pembayaran (Dropdown), Catatan.\n2. Hubungkan respons Google Form ke Google Sheets.\n3. Di Excel: Gunakan tab Data > Get Data > From Web > Tempelkan link CSV ekspor Google Sheets (atau gunakan tombol Sinkronisasi Google Sheets di Web Dashboard).\n4. Data otomatis masuk ke sheet Transactions Import dan diperbarui ke Financial Dashboard.'],
    ['4. Modul IoT & Portofolio', 'Sebuah proyek baru dihitung selesai jika memenuhi 5 kriteria: (1) Masalah & Solusi jelas, (2) Prototipe fisik/simulasi berfungsi, (3) Skema & Dokumentasi, (4) Bukti pengujian, (5) Link repositori GitHub.'],
    ['5. Modul CCNA & Jaringan', 'Target 60 jam belajar (1 jam/hari, 5 hari/pekan). Penguasaan diukur dari kombinasi Teori + Lab Packet Tracer + Skor Latihan.'],
    ['6. Tabungan Emas', 'Target 40 gram emas fisik. Pisahkan gram emas yang benar-benar dimiliki dari uang yang masih berupa kas. Perbarui harga pasar per gram secara manual di sheet Settings.'],
    ['7. Menambah / Mengedit Target', 'Ubah parameter di sheet Settings (tblSettings) atau edit baris di tabel terkait. Semua formula Dashboard menggunakan structured references yang otomatis beradaptasi tanpa merusak rumus.']
  ];

  instructions.forEach((ins, idx) => {
    const r = 4 + idx * 3;
    wsInst.getCell(`B${r}`).value = ins[0];
    wsInst.getCell(`B${r}`).font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF0F766E' } };
    
    wsInst.getCell(`C${r}`).value = ins[1];
    wsInst.getCell(`C${r}`).font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1E293B' } };
    wsInst.getCell(`C${r}`).alignment = { wrapText: true, vertical: 'top' };
  });

  // Generate buffer and return as Blob
  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}
