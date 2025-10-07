import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('');
  const [numResults, setNumResults] = useState(10);
  const [focus, setFocus] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query) return;

    setLoading(true);
    setResults([]);
    setSummary('');
    setError('');

    try {
      const searchQuery = focus ? `${query} ${focus}` : query;
      const domainParam = domain ? `&domain=${encodeURIComponent(domain)}` : '';
      const numResultsParam = `&num_results=${numResults}`;

      console.log('Testing backend connection...');
      
      // Test connection first
      const testResponse = await fetch('http://localhost:8000/health');
      if (!testResponse.ok) {
        throw new Error('Backend server is not responding.');
      }
      console.log('Backend connection OK');

      const apiUrl = `http://localhost:8000/search?q=${encodeURIComponent(searchQuery)}${domainParam}${numResultsParam}`;
      console.log('Making request to:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json(); 
      console.log('Search successful, results:', data);
      
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError('No results found. Try a different search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Search failed: ${error.message}. Make sure backend is running on localhost:8000`);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (url) => {
    setLoading(true);
    setSummary('');
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/summarize?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json(); 
      setSummary(data.summary);
    } catch (error) {
      console.error('Summarize error:', error);
      setError('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Semantic Search</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
          />
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter a domain (e.g., wikipedia.org)"
          />
          <input
            type="text"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="Focus your search"
          />
          <input
            type="number"
            value={numResults}
            onChange={(e) => setNumResults(parseInt(e.target.value) || 10)}
            min="1"
            max="10"
            placeholder="Number of results"
          />
          <button type="submit">Search</button>
        </form>

        {error && (
          <div style={{color: 'red', margin: '10px', padding: '10px', border: '1px solid red'}}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="results-container">
          {loading && <p>Loading...</p>}
          
          {!loading && results.length > 0 && (
            <p style={{margin: '10px 0'}}>Found {results.length} results:</p>
          )}

          {results.length > 0 && (
            <div className="results-list">
              {results.map((item, index) => (
                <div key={index} style={{
                  border: '1px solid #ccc',
                  padding: '15px',
                  margin: '10px 0',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{color: '#007acc', textDecoration: 'none'}}
                    >
                      {item.title || 'No title available'}
                    </a>
                  </h3>
                  
                  <p style={{color: '#333', lineHeight: '1.5'}}>
                    {item.text || 'No preview text available. Click the title to view the content.'}
                  </p>
                  
                  <p style={{color: '#666', fontSize: '0.9em', wordBreak: 'break-all'}}>
                    {item.url}
                  </p>
                  
                  <button 
                    onClick={() => handleSummarize(item.url)}
                    style={{
                      padding: '8px 16px',
                      marginTop: '10px',
                      backgroundColor: '#007acc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Summarize
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {!loading && results.length === 0 && query && !error && (
            <p>No results found. Try a different search term.</p>
          )}
          
          {summary && (
            <div style={{
              border: '2px solid #007acc',
              padding: '15px',
              margin: '20px 0',
              borderRadius: '5px',
              backgroundColor: '#f0f8ff'
            }}>
              <h3 style={{color: '#007acc', marginTop: 0}}>Summary</h3>
              <p style={{lineHeight: '1.6'}}>{summary}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;