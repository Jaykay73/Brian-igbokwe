import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ScoreDial } from './components/ScoreDial';
import { Loader } from './components/Loader';
import './index.css';

interface TrustResult {
  score: number;
  decision: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrustResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_email', 'demo@bitcheck.com'); // Required by the backend
    
    // Since we only want the trust score for the frontend, we can optionally 
    // tell the backend not to run heavy explainability/forensics if supported,
    // but the backend uses default values. We'll just let it run.
    formData.append('run_explainability', 'false');
    formData.append('run_c2pa', 'false');

    try {
      const response = await fetch('https://jaykay73-bitcheck-image.hf.space/verify/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to verify image. Please try again.');
      }

      const data = await response.json();
      
      if (data && data.trust) {
        setResult({
          score: data.trust.trust_score !== undefined ? data.trust.trust_score : 0,
          decision: data.trust.decision || 'unknown'
        });
      } else {
        throw new Error('Invalid response format from server.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <header className="header">
          <h1>BitCheck AI</h1>
          <p>Verify the authenticity of any image instantly.</p>
        </header>

        <main>
          {!result && !isLoading && (
            <>
              <UploadZone 
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                onClearFile={resetState}
              />
              
              {error && (
                <div style={{ color: 'var(--danger)', marginTop: '1rem', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button 
                className="btn-primary"
                onClick={handleVerify}
                disabled={!selectedFile}
              >
                Analyze Image
              </button>
            </>
          )}

          {isLoading && <Loader />}

          {result && !isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ScoreDial score={result.score} decision={result.decision} />
              <button className="btn-secondary" onClick={resetState}>
                Verify Another Image
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
