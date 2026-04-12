import * as XLSX from 'xlsx';
import { FORM_TYPES, STATUS_OPTIONS } from './constants.js';

/**
 * Export data to an Excel (.xlsx) file
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the Excel sheet
 */1
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns based on content
    const columnWidths = Object.keys(data[0]).map((key) => {
      const maxContentLength = Math.max(
        key.length,
        ...data.map((row) => {
          const value = row[key];
          return value ? String(value).length : 0;
        })
      );
      return { wch: Math.min(Math.max(maxContentLength + 2, 10), 40) };
    });
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const finalFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    XLSX.writeFile(workbook, finalFilename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export data to Excel. Please try again.');
  }
};

/**
 * Export data to a CSV file
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const finalFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    downloadBlob(blob, finalFilename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data to CSV. Please try again.');
  }
};

/**
 * Export data to JSON file
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToJSON = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], {
      type: 'application/json;charset=utf-8;',
    });

    const finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
    downloadBlob(blob, finalFilename);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export data to JSON. Please try again.');
  }
};

/**
 * Format lead data for export - transforms raw lead objects into export-friendly flat objects
 * @param {Array<Object>} leads - Array of lead objects
 * @returns {Array<Object>} Formatted data ready for export
 */
export const formatLeadsForExport = (leads) => {
  if (!leads || leads.length === 0) return [];

  return leads.map((lead, index) => {
    const formTypeConfig = FORM_TYPES[lead.formType];
    const statusConfig = STATUS_OPTIONS.find((s) => s.value === lead.status);

    return {
      'Sr. No.': index + 1,
      'Lead ID': lead.id || '-',
      'Form Type': formTypeConfig ? formTypeConfig.title : lead.formType || '-',
      'Full Name': lead.fullName || '-',
      'Mobile': lead.mobile || '-',
      'Email': lead.email || '-',
      'Vehicle Number': lead.vehicleNumber || '-',
      'Vehicle Type': lead.vehicleType || '-',
      'Manufacturing Year': lead.manufacturingYear || '-',
      'Previous Insurer': lead.previousInsurer || '-',
      'Policy Expiry': lead.policyExpiry ? formatExportDate(lead.policyExpiry) : '-',
      'City': lead.city || '-',
      'State': lead.state || '-',
      'Pincode': lead.pincode || '-',
      'Status': statusConfig ? statusConfig.label : lead.status || '-',
      'Source': lead.source || '-',
      'Remarks': lead.remarks || '-',
      'Created Date': lead.createdAt ? formatExportDate(lead.createdAt) : '-',
      'Updated Date': lead.updatedAt ? formatExportDate(lead.updatedAt) : '-',
      'Assigned To': lead.assignedTo || '-',
    };
  });
};

/**
 * Export multiple sheets to a single Excel workbook
 * @param {Object<string, Array<Object>>} sheetsData - Object with sheet names as keys and data arrays as values
 * @param {string} filename - Name of the file
 */
export const exportMultiSheetExcel = (sheetsData, filename = 'export') => {
  if (!sheetsData || Object.keys(sheetsData).length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const workbook = XLSX.utils.book_new();

    Object.entries(sheetsData).forEach(([sheetName, data]) => {
      if (data && data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Auto-size columns
        const columnWidths = Object.keys(data[0]).map((key) => {
          const maxLength = Math.max(
            key.length,
            ...data.map((row) => String(row[key] || '').length)
          );
          return { wch: Math.min(Math.max(maxLength + 2, 10), 40) };
        });
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));
      }
    });

    const finalFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    XLSX.writeFile(workbook, finalFilename);
  } catch (error) {
    console.error('Error exporting multi-sheet Excel:', error);
    throw new Error('Failed to export data. Please try again.');
  }
};

/**
 * Generate a summary/report export with leads grouped by form type
 * @param {Array<Object>} leads - Array of all leads
 * @param {string} filename - Name of the file
 */
export const exportLeadReport = (leads, filename = 'lead-report') => {
  if (!leads || leads.length === 0) {
    console.warn('No leads to export');
    return;
  }

  // Group leads by form type
  const groupedByType = {};
  leads.forEach((lead) => {
    const type = lead.formType || 'unknown';
    if (!groupedByType[type]) {
      groupedByType[type] = [];
    }
    groupedByType[type].push(lead);
  });

  // Create summary data
  const summaryData = Object.entries(groupedByType).map(([type, typeLeads]) => {
    const formConfig = FORM_TYPES[type];
    return {
      'Insurance Type': formConfig ? formConfig.title : type,
      'Total Leads': typeLeads.length,
      'New': typeLeads.filter((l) => l.status === 'new').length,
      'Contacted': typeLeads.filter((l) => l.status === 'contacted').length,
      'Converted': typeLeads.filter((l) => l.status === 'converted').length,
      'Closed': typeLeads.filter((l) => l.status === 'closed').length,
      'Conversion Rate': `${(
        (typeLeads.filter((l) => l.status === 'converted').length / typeLeads.length) *
        100
      ).toFixed(1)}%`,
    };
  });

  // Add total row
  summaryData.push({
    'Insurance Type': 'TOTAL',
    'Total Leads': leads.length,
    'New': leads.filter((l) => l.status === 'new').length,
    'Contacted': leads.filter((l) => l.status === 'contacted').length,
    'Converted': leads.filter((l) => l.status === 'converted').length,
    'Closed': leads.filter((l) => l.status === 'closed').length,
    'Conversion Rate': `${(
      (leads.filter((l) => l.status === 'converted').length / leads.length) *
      100
    ).toFixed(1)}%`,
  });

  // Build sheets object
  const sheetsData = {
    Summary: summaryData,
    'All Leads': formatLeadsForExport(leads),
  };

  // Add per-type sheets
  Object.entries(groupedByType).forEach(([type, typeLeads]) => {
    const formConfig = FORM_TYPES[type];
    const sheetName = formConfig ? formConfig.shortTitle : type;
    sheetsData[sheetName] = formatLeadsForExport(typeLeads);
  });

  const timestamp = new Date().toISOString().split('T')[0];
  exportMultiSheetExcel(sheetsData, `${filename}-${timestamp}`);
};

// ===== Internal Helper Functions =====

/**
 * Format a date for export display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string (DD/MM/YYYY HH:MM)
 */
const formatExportDate = (date) => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '-';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Trigger a browser download for a Blob
 * @param {Blob} blob - The file blob
 * @param {string} filename - The download filename
 */
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
