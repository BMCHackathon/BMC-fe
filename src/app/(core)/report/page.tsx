// components/ComplianceReport.js
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import cn from 'classnames'; // Assuming you are using classnames utility for conditional classes

// Mock DotPattern component (You can replace it with the actual SVG or component you have)
const DotPattern = ({ className }) => (
  <div className={className} style={{ height: '200px', width: '200px', background: 'rgba(255,255,255,0.2)' }} />
);

const ComplianceReport = () => {
  const [markdownReport, setMarkdownReport] = useState('');
  const [apiData, setApiData] = useState(null);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/compliance-data');
        const data = await response.json();
        setApiData(data);

        // Generate markdown report from the API data
        const markdown = generateMarkdownReport(data);
        setMarkdownReport(markdown);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to generate the markdown report
  const generateMarkdownReport = (data) => {
    return `# Compliance Report\n
    ## Date: ${new Date().toLocaleDateString()}\n
    ## Compliance Details:\n
    ${data.details.map((item) => - ${item.title}: ${item.description}).join('\n')}
    `;
  };

  // Function to download the markdown report
  const downloadMarkdown = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compliance_report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen w-full bg-[radial-gradient(97.14%56.45%_at_51.63%_0%,#7D56F4_0%,#4517D7_30%,#000_100%)] flex flex-col items-center justify-center px-6 py-12">
      {/* DotPattern component with mask image */}
      <DotPattern className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")} />

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">Compliance Report</h1>
        <div className="prose mb-6">
          <ReactMarkdown>{markdownReport}</ReactMarkdown>
        </div>
        <button
          onClick={downloadMarkdown}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ComplianceReport;