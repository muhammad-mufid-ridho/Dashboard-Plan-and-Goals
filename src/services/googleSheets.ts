import { ExpenseTransaction } from '../types/dashboard';
import { getAccessToken } from './auth';

export interface GoogleSheetFetchResult {
  success: boolean;
  transactions: ExpenseTransaction[];
  sheetTitle?: string;
  rowCount: number;
  error?: string;
  sourceType?: 'oauth' | 'public_link';
}

/**
 * Parses simple CSV text into rows of columns, handling quotes and commas.
 */
function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          entry += '"';
          i++; // skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    rows.push(row);
  }
  return rows;
}

/**
 * Maps raw matrix rows (headers + data rows) into typed ExpenseTransaction objects.
 */
function mapRowsToTransactions(rows: string[][]): ExpenseTransaction[] {
  if (rows.length <= 1) return [];

  const headers = rows[0].map(h => (h || '').toString().toLowerCase().trim());
  const findIdx = (keywords: string[]): number => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const timestampIdx = findIdx(['timestamp', 'waktu', 'tanggal/jam', 'submitted']);
  const dateIdx = findIdx(['tanggal', 'date', 'tgl']);
  const categoryIdx = findIdx(['kategori', 'category', 'jenis pengeluaran']);
  const descIdx = findIdx(['deskripsi', 'description', 'uraian', 'keperluan', 'keterangan']);
  const amountIdx = findIdx(['nominal', 'jumlah', 'amount', 'biaya', 'pengeluaran', 'harga']);
  const methodIdx = findIdx(['metode', 'pembayaran', 'payment', 'cara bayar']);
  const notesIdx = findIdx(['catatan', 'notes', 'keterangan tambahan']);

  const parsedTransactions: ExpenseTransaction[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || row.every(cell => !cell || cell.trim() === '')) {
      continue;
    }

    const rawTimestamp = timestampIdx >= 0 ? row[timestampIdx] : new Date().toISOString();
    let rawDate = dateIdx >= 0 ? row[dateIdx] : '';
    if (!rawDate && rawTimestamp) {
      const d = new Date(rawTimestamp);
      if (!isNaN(d.getTime())) {
        rawDate = d.toISOString().split('T')[0];
      } else {
        rawDate = new Date().toISOString().split('T')[0];
      }
    }

    const rawCategory = categoryIdx >= 0 ? row[categoryIdx] : 'Lainnya';
    const rawDesc = descIdx >= 0 ? row[descIdx] : (row[0] || 'Transaksi');

    let rawAmountStr = amountIdx >= 0 ? row[amountIdx] : '0';
    if (!rawAmountStr) rawAmountStr = '0';
    const sanitizedNum = rawAmountStr.toString().replace(/[^0-9.-]/g, '');
    const parsedAmount = Math.abs(parseFloat(sanitizedNum) || 0);

    const rawMethod = methodIdx >= 0 ? row[methodIdx] : 'Tunai';
    const rawNotes = notesIdx >= 0 ? row[notesIdx] : '';

    let category: ExpenseTransaction['category'] = 'Lainnya';
    const catLower = rawCategory.toLowerCase();
    if (catLower.includes('jajan') || catLower.includes('makan') || catLower.includes('food')) {
      category = 'Jajan & Makanan';
    } else if (catLower.includes('transport') || catLower.includes('bensin') || catLower.includes('krl')) {
      category = 'Transportasi';
    } else if (catLower.includes('pribadi') || catLower.includes('personal') || catLower.includes('sabun')) {
      category = 'Kebutuhan Pribadi';
    } else if (catLower.includes('infaq') || catLower.includes('sedekah') || catLower.includes('zakat')) {
      category = 'Infaq';
    } else if (catLower.includes('didik') || catLower.includes('buku') || catLower.includes('kursus') || catLower.includes('ccna')) {
      category = 'Pendidikan & Buku';
    } else if (catLower.includes('iot') || catLower.includes('elektronik') || catLower.includes('hardware')) {
      category = 'IoT & Komponen';
    }

    let paymentMethod: ExpenseTransaction['paymentMethod'] = 'Tunai';
    const methLower = rawMethod.toLowerCase();
    if (methLower.includes('qris')) {
      paymentMethod = 'QRIS';
    } else if (methLower.includes('transfer') || methLower.includes('bank') || methLower.includes('bca') || methLower.includes('mandiri')) {
      paymentMethod = 'Transfer Bank';
    } else if (methLower.includes('wallet') || methLower.includes('gopay') || methLower.includes('ovo') || methLower.includes('shopee')) {
      paymentMethod = 'E-Wallet';
    }

    parsedTransactions.push({
      id: `gs_${i}_${Date.now()}`,
      timestamp: rawTimestamp || new Date().toISOString(),
      date: rawDate || new Date().toISOString().split('T')[0],
      category,
      description: rawDesc || 'Pengeluaran',
      amount: parsedAmount,
      paymentMethod,
      notes: rawNotes,
      source: 'Google Sheets'
    });
  }

  return parsedTransactions;
}

/**
 * Fetches rows from Google Sheet either using OAuth API v4, or via Google Sheets public CSV export.
 */
export async function fetchGoogleSheetExpenses(
  spreadsheetId: string,
  range: string = 'Form Responses 1!A1:G'
): Promise<GoogleSheetFetchResult> {
  // Clean spreadsheetId if user pasted full URL
  let cleanId = spreadsheetId.trim();
  const match = cleanId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    cleanId = match[1];
  }

  const token = await getAccessToken();

  // If token is present, try Google Sheets API v4
  if (token) {
    try {
      const encodedRange = encodeURIComponent(range);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodedRange}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const rows: string[][] = data.values || [];
        const parsed = mapRowsToTransactions(rows);
        return {
          success: true,
          transactions: parsed,
          rowCount: parsed.length,
          sourceType: 'oauth'
        };
      }
    } catch (apiErr) {
      console.warn('OAuth API call failed, attempting public CSV export fallback...', apiErr);
    }
  }

  // Fallback: Fetch via public CSV export (Works instantly if Sheet is shared "Anyone with the link can view")
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:csv`;
    const res = await fetch(csvUrl);

    if (res.ok) {
      const csvText = await res.text();
      // Verify not an HTML login page
      if (!csvText.includes('<!DOCTYPE html>') && !csvText.includes('<html')) {
        const rows = parseCSV(csvText);
        if (rows.length > 0) {
          const parsed = mapRowsToTransactions(rows);
          return {
            success: true,
            transactions: parsed,
            rowCount: parsed.length,
            sourceType: 'public_link'
          };
        }
      }
    }
  } catch (csvErr) {
    console.warn('Public CSV fetch failed:', csvErr);
  }

  // If both methods failed
  if (!token) {
    return {
      success: false,
      transactions: [],
      rowCount: 0,
      error: 'Spreadsheet tidak dapat diakses. Silakan pastikan Google Sheets Anda diset "Siapa saja yang memiliki link dapat melihat" (Anyone with the link can view), atau klik "Koneksikan Akun Google" di atas.'
    };
  }

  return {
    success: false,
    transactions: [],
    rowCount: 0,
    error: 'Gagal mengakses Google Sheets. Pastikan Spreadsheet ID benar dan akun Google Anda memiliki akses ke spreadsheet tersebut.'
  };
}
