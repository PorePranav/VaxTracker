'use client';
import { useState } from 'react';

export default function GenerateReport({
  childId,
}: {
  childId: string | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function downloadPdf() {
    if (!childId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/generatePdf?childId=${childId}`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'immunization_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={downloadPdf}
      disabled={isLoading || !childId}
      className={`py-2 px-4 bg-primary-600 text-white font-semibold rounded-md w-full ${
        isLoading || !childId ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? 'Generating...' : 'Generate Report'}
    </button>
  );
}
