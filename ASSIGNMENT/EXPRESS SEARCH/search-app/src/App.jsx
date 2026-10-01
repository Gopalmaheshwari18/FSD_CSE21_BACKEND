import React from 'react';

function App() {
  const pdfs = [
    {
      name: 'HTML',
      // Sample PDF about HTML (publicly accessible)
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      name: 'CSS',
      // Sample PDF about CSS (publicly accessible)
      url: 'https://www.africau.edu/images/default/sample.pdf',
    },
    {
      name: 'JS',
      // Sample PDF about JavaScript (publicly accessible)
      url: 'https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf',
    },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>Download PDFs</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        {pdfs.map((pdf) => (
          <a
            key={pdf.name}
            href={pdf.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
            }}
          >
            Download {pdf.name} PDF
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;
