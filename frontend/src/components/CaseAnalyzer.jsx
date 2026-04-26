import React, { useState } from 'react';

const CaseAnalyzer = () => {
  const [lawyerQuery, setLawyerQuery] = useState('');
  const [caseFacts, setCaseFacts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token'); 
      
      if (!token) {
        throw new Error('You must be logged in to use the AI Assistant.');
      }

      // This is correct! Talk to your backend, NOT directly to Groq.
      const response = await fetch('http://localhost:5000/api/ai/analyze-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lawyerQuery: lawyerQuery,
          caseFacts: caseFacts
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze case.');
      }

      setResult(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>⚖️ AI Legal Case Analyzer</h2>
      <p>Search the historical Bangladesh legal database for precedents and strategies.</p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Legal Topic / Query:</label>
          <input 
            type="text" 
            value={lawyerQuery}
            onChange={(e) => setLawyerQuery(e.target.value)}
            placeholder="e.g., labour compensation, property dispute..."
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Current Case Facts (Optional):</label>
          <textarea 
            value={caseFacts}
            onChange={(e) => setCaseFacts(e.target.value)}
            placeholder="Briefly describe the facts of your client's case..."
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '12px', 
            backgroundColor: isLoading ? '#9ca3af' : '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '🤖 Analyzing Database...' : 'Analyze Case'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>📚 Sources Used from Database:</h3>
            <ul style={{ paddingLeft: '20px', color: '#047857', fontWeight: 'bold' }}>
              {result.sources_used && result.sources_used.length > 0 
                ? result.sources_used.map((source, index) => <li key={index}>{source}</li>)
                : <li>No specific historical acts found.</li>
              }
            </ul>
          </div>

          <hr style={{ borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />

          <div>
            <h3>🧠 AI Analysis:</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {result.ai_response}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default CaseAnalyzer;