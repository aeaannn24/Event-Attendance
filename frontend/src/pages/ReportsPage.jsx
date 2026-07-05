import { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';

const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const downloadFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const formatDate = (date) => {
  if (!date) return 'Unknown';
  return date;
};

const ReportsPage = ({ attendanceRecords = [], events = [], students = [] }) => {
  const [reportType, setReportType] = useState('daily');
  const [message, setMessage] = useState('Choose a report type, then export or print.');

  const reportRows = useMemo(() => {
    if (reportType === 'event') {
      return events.map((event) => {
        const eventRecords = attendanceRecords.filter((record) => record.eventName === event.title);
        const present = eventRecords.filter((record) => record.status === 'Present').length;
        const absent = eventRecords.filter((record) => record.status !== 'Present').length;
        return {
          event: event.title,
          date: event.date,
          location: event.location,
          total: eventRecords.length,
          present,
          absent,
          male: eventRecords.filter((record) => record.gender === 'male').length,
          female: eventRecords.filter((record) => record.gender === 'female').length,
        };
      });
    }

    const grouped = attendanceRecords.reduce((acc, record) => {
      const date = formatDate(record.submissionDate);
      if (!acc[date]) {
        acc[date] = { date, total: 0, present: 0, absent: 0, male: 0, female: 0 };
      }
      acc[date].total += 1;
      if (record.status === 'Present') acc[date].present += 1;
      else acc[date].absent += 1;
      if (record.gender === 'female') acc[date].female += 1;
      else acc[date].male += 1;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [attendanceRecords, events, reportType]);

  const totals = useMemo(() => {
    const present = attendanceRecords.filter((record) => record.status === 'Present').length;
    const female = attendanceRecords.filter((record) => record.gender === 'female').length;
    return {
      students: students.length,
      events: events.length,
      records: attendanceRecords.length,
      present,
      absent: attendanceRecords.length - present,
      male: attendanceRecords.length - female,
      female,
    };
  }, [attendanceRecords, events, students]);

  const title = reportType === 'daily' ? 'Daily Attendance Summary' : 'Event Attendance Performance';
  const headers = reportType === 'daily'
    ? ['Date', 'Total Records', 'Present', 'Absent', 'Male', 'Female']
    : ['Event', 'Date', 'Location', 'Total Records', 'Present', 'Absent', 'Male', 'Female'];

  const rowValues = (row) => reportType === 'daily'
    ? [row.date, row.total, row.present, row.absent, row.male, row.female]
    : [row.event, row.date, row.location, row.total, row.present, row.absent, row.male, row.female];

  const buildCsv = () => [
    [title],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
    ['Total Students', totals.students],
    ['Total Events', totals.events],
    ['Attendance Records', totals.records],
    ['Present', totals.present],
    ['Absent', totals.absent],
    ['Male', totals.male],
    ['Female', totals.female],
    [],
    headers,
    ...reportRows.map(rowValues),
  ].map((row) => row.map(escapeCsv).join(',')).join('\n');

  const buildHtmlTable = () => `
    <table>
      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
      <tbody>
        ${reportRows.map((row) => `<tr>${rowValues(row).map((value) => `<td>${value ?? ''}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;

  const buildPrintableHtml = () => `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }
          h1 { margin-bottom: 4px; }
          .meta { color: #64748b; margin-bottom: 24px; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat { border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; }
          .stat strong { display: block; font-size: 22px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="meta">Generated ${new Date().toLocaleString()}</p>
        <div class="stats">
          <div class="stat"><span>Records</span><strong>${totals.records}</strong></div>
          <div class="stat"><span>Present</span><strong>${totals.present}</strong></div>
          <div class="stat"><span>Absent</span><strong>${totals.absent}</strong></div>
          <div class="stat"><span>Students</span><strong>${totals.students}</strong></div>
        </div>
        ${buildHtmlTable()}
      </body>
    </html>
  `;

  const handleExportCsv = () => {
    downloadFile(`${reportType}-attendance-report.csv`, buildCsv(), 'text/csv;charset=utf-8');
    setMessage('CSV report downloaded.');
  };

  const handleExportExcel = () => {
    downloadFile(`${reportType}-attendance-report.xls`, buildPrintableHtml(), 'application/vnd.ms-excel;charset=utf-8');
    setMessage('Excel-compatible report downloaded.');
  };

  const handlePrint = () => {
    const reportWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!reportWindow) {
      setMessage('Popup blocked. Allow popups to print or save as PDF.');
      return;
    }
    reportWindow.document.write(buildPrintableHtml());
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
    setMessage('Print dialog opened. Choose Save as PDF if needed.');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-panel/70 bg-panel/70 p-6 shadow-[0_28px_80px_rgba(7,26,47,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Reports</h1>
            <p className="mt-2 text-sm text-slate-400">Export attendance analytics with gender counts, event totals, and daily summaries.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setReportType('daily')} className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${reportType === 'daily' ? 'bg-accent text-slate-950' : 'bg-panel/70 text-slate-300 hover:bg-panel/80'}`}>
              Daily Report
            </button>
            <button onClick={() => setReportType('event')} className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${reportType === 'event' ? 'bg-accent text-slate-950' : 'bg-panel/70 text-slate-300 hover:bg-panel/80'}`}>
              Event Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Records', totals.records],
          ['Present', totals.present],
          ['Male', totals.male],
          ['Female', totals.female],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-panel/70 bg-panel/70 p-5 shadow-[0_20px_50px_rgba(7,26,47,0.25)]">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-panel/70 bg-panel/70 p-6 shadow-[0_28px_80px_rgba(7,26,47,0.35)]">
          <h2 className="text-lg font-semibold text-white">Export Reports</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 hover:brightness-95">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button onClick={handleExportExcel} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </button>
            <button onClick={handleExportCsv} className="rounded-3xl bg-panel/70 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-panel/80">Export CSV</button>
            <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-panel/70 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-panel/80">
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
          <p className="mt-5 rounded-3xl bg-panel/60 px-4 py-3 text-sm text-slate-400">{message}</p>
        </div>

        <div className="rounded-3xl border border-panel/70 bg-panel/70 p-6 shadow-[0_28px_80px_rgba(7,26,47,0.35)]">
          <h2 className="text-lg font-semibold text-white">Report Summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="rounded-3xl border border-panel/70 bg-panel/60 p-4">
              <p className="font-semibold text-white">Selected Report</p>
              <p>{title}</p>
            </div>
            <div className="rounded-3xl border border-panel/70 bg-panel/60 p-4">
              <p className="font-semibold text-white">Coverage</p>
              <p>{totals.students} students, {totals.events} events, {totals.records} attendance records.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-panel/70 bg-panel/70 shadow-[0_28px_80px_rgba(7,26,47,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-panel/70 text-left text-sm">
            <thead className="bg-panel/60 text-slate-400">
              <tr>{headers.map((header) => <th key={header} className="px-5 py-4">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-panel/70 bg-panel/80">
              {reportRows.map((row, index) => (
                <tr key={`${reportType}-${index}`}>
                  {rowValues(row).map((value, valueIndex) => (
                    <td key={`${reportType}-${index}-${valueIndex}`} className="px-5 py-4 text-slate-300">{value}</td>
                  ))}
                </tr>
              ))}
              {reportRows.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className="px-5 py-10 text-center text-slate-500">No report data available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
