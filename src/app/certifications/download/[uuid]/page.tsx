'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function DirectDownloadPage() {
  const { uuid } = useParams();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const processedRef = useRef(false);

  useEffect(() => {
    api.get<{ certificate: any }>(`/certifications/verify/${uuid}`)
      .then(res => setCert(res.data.certificate))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uuid]);

  useEffect(() => {
    if (!loading && cert && imageLoaded && !processedRef.current) {
      processedRef.current = true;
      // Small delay to ensure browser has painted
      setTimeout(() => void generatePdf(), 500);
    }
  }, [loading, cert, imageLoaded]);

  const generatePdf = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('certificate-to-capture');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Using JPEG as it's more reliable in jsPDF
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      
      // Draw background to avoid white edges
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 297, 210, 'F');
      
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      pdf.save(`ScriptNex-Certificate-${cert.user.name.replace(/\s+/g, '-')}.pdf`);
      
      // Signal success to parent if needed
      window.parent.postMessage({ type: 'DOWNLOAD_COMPLETE', uuid }, '*');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      window.parent.postMessage({ type: 'DOWNLOAD_ERROR', error: String(err) }, '*');
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading data...</div>;
  if (!cert) return <div style={{ color: 'white' }}>Certificate not found.</div>;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>
      <div
        id="certificate-to-capture"
        style={{
          width: '1123px',
          height: '794px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Actual Image Tag for better load detection */}
        <img 
          src="/certificate.png" 
          alt="" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error('Failed to load certificate template')}
        />
        
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8%',
          zIndex: 10,
          fontFamily: "'Times New Roman', serif"
        }}>
          <div style={{ flex: 1 }}></div>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', color: '#1f2937' }}>
            {cert.user.name}
          </h1>
          <p style={{ fontSize: '24px', color: '#4b5563', marginBottom: '32px' }}>
            has successfully completed the certification exam for
          </p>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#00d285', marginBottom: '48px' }}>
            {cert.certification.title}
          </h2>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 15%', marginTop: 'auto', paddingBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #9ca3af', marginBottom: '8px', padding: '0 24px' }}>
                {new Date(cert.created_at).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}>Date</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #9ca3af', marginBottom: '8px', padding: '0 24px' }}>
                {cert.percentage || 100}%
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#6b7280' }}>Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
