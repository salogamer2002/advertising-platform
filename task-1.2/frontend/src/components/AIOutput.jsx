import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AIOutput({ result, briefData, onReset }) {
  const outputRef = useRef(null);

  const handleExportPDF = async () => {
    if (!outputRef.current) return;

    try {
      const canvas = await html2canvas(outputRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${result.campaignTitle.replace(/\s+/g, '_')}_Brief.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your AI-Generated Brief</h2>
          <p className="text-gray-600">Creative direction document ready for your campaign</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} className="btn-outline">
            Start New Brief
          </button>
          <button onClick={handleExportPDF} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as PDF
          </button>
        </div>
      </div>

      {/* AI Output Document */}
      <div ref={outputRef} className="card p-8 space-y-8">
        {/* Document Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Creative Brief</p>
              <h1 className="text-3xl font-bold text-gray-900">{result.campaignTitle}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Client: <strong>{briefData.clientName}</strong></span>
            <span>Industry: <strong>{briefData.industry}</strong></span>
            <span>Budget: <strong>{result.budget}</strong></span>
          </div>
        </div>

        {/* Headlines Section */}
        <Section title="Campaign Headlines" icon={HeadlineIcon}>
          <div className="space-y-3">
            {result.headlines.map((headline, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <p className="text-lg text-gray-800 font-medium">{headline}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Tone of Voice */}
        <Section title="Tone of Voice Guide" icon={VoiceIcon}>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-brand-500 text-white rounded-full text-sm font-medium">
                {result.toneOfVoice.primary}
              </span>
              {result.toneOfVoice.characteristics.map((char) => (
                <span key={char} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {char}
                </span>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed">{result.toneOfVoice.description}</p>
          </div>
        </Section>

        {/* Channel Recommendations */}
        <Section title="Recommended Channels" icon={ChannelIcon}>
          <div className="space-y-4">
            {result.channelRecommendations.map((channel) => (
              <div key={channel.channel} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{channel.channel}</span>
                    <span className="text-brand-600 font-bold">{channel.allocation}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${channel.allocation}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Hero Image Concept */}
        <Section title="Key Visual Direction" icon={ImageIcon}>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed mb-6">{result.heroImageConcept.description}</p>
            
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Color Palette</p>
                <div className="flex gap-2">
                  {result.heroImageConcept.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Style</p>
                <span className="px-3 py-1.5 bg-white rounded-lg text-gray-800 font-medium shadow-sm">
                  {result.heroImageConcept.style}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Key Messages */}
        <Section title="Key Messages" icon={MessageIcon}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.keyMessages.map((message, index) => (
              <li key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-800">{message}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Call to Action */}
        <Section title="Primary Call to Action" icon={CTAIcon}>
          <div className="bg-brand-500 text-white rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">{result.callToAction}</p>
            <p className="text-brand-100 mt-2">Recommended CTA for this campaign</p>
          </div>
        </Section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          Generated by AI Creative Brief Builder | {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon />
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Icons
function HeadlineIcon() {
  return (
    <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function ChannelIcon() {
  return (
    <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function CTAIcon() {
  return (
    <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  );
}
