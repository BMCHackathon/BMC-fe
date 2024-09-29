'use client'

import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface FailedScript {
  title: string;
  severity: string;
  auditScript: string;
  remediationScript: string;
  impact: string;
}

interface AuditData {
  title: string;
  description: string;
  impact: string;
  audit: string;
  remediation: string;
}


export default function Report() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AuditData[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const titles = JSON.parse(localStorage.getItem('failedScriptsTitles') || '[]');
      if (titles.length > 0) {
        try {
          const response = await fetch('http://localhost:5000/search', {
            method: 'POST',
            body: JSON.stringify({ titles }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }

          const result: AuditData[] = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const summary = JSON.parse(localStorage.getItem('summary') || '{}');
    if (summary.success === undefined) {
      setSuccessCount(0);
      setFailureCount(0);
      setTotalCount(0);
      return;
    }
    setSuccessCount(summary.success);
    setFailureCount(summary.failure);
    setTotalCount(summary.total);
  }, []);

  const handlePrint = async () => {
    if (reportRef.current) {
      const doc = new jsPDF('p', 'pt', 'a4');
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Set your preferred width
      const pageHeight = 295; // A4 size in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to the PDF and manage page breaks
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('CIS_Audit_Report.pdf');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CIS Audit Report</h1>
        <Button onClick={handlePrint}>
          <Download className="mr-2 h-4 w-4" /> Download Report as PDF
        </Button>
      </div>
      <div ref={reportRef}>
        <h2 className="text-2xl font-semibold">Summary</h2>
        <table className="min-w-full divide-y divide-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              <>
                <tr>
                  <td className="px-6 py-4">Total Scripts</td>
                  <td className="px-6 py-4">{ totalCount}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Passed Scripts</td>
                  <td className="px-6 py-4">{successCount}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Failed Scripts</td>
                  <td className="px-6 py-4">{failureCount}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>

        <h2 className="text-2xl font-semibold">Failed Scripts</h2>
        {data && data.length > 0 ? (
          data.map((script, index) => (
            <div className="mb-8" key={index}>
              <h3 className="text-xl font-semibold">{script.title}</h3>
              <pre className="bg-gray-100 rounded p-4 mb-4">
                <code>{`# Audit Script\n${script.audit}\n\n# Remediation Script\n${script.remediation}`}</code>
              </pre>
              <p><strong>Impact:</strong> {script.impact}</p>
            </div>
          ))
        ) : (
          <p>No failed scripts available.</p>
        )}

        {data && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Audit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Total Scripts: {totalCount}</p>
                  <p className="text-green-600">Passed: {successCount}</p>
                  <p className="text-red-600">Failed: {failureCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
