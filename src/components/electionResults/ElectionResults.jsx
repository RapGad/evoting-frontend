import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ElectionResults.css';
import axios from 'axios';

// Dummy data matching your backend structure

const ElectionResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const url = import.meta.env.VITE_BACKEND_URL


  useEffect(() => {
    // Simulate API call with dummy data
    const fetchResults = async () => {
        setIsLoading(true);
        try {
          // Axios GET request to your backend API
          const response = await axios.get(`${url}api/student/vote-summary`);
          
          // Use actual API response if available, otherwise fallback to dummy data
          const apiResults =response.data 
          
          setResults(apiResults);
          if (apiResults.length > 0) {
            setActiveCategory(apiResults[0].categoryName);
          }
        } catch (err) {
          console.error('API Error:', err);
          setError(err.response?.data?.message || 'Failed to load election results');
        
        } finally {
          setIsLoading(false);
        }
      };
  
    fetchResults();
  }, []);

  const getWinner = (candidates) => {
    if (!candidates || candidates.length === 0) return null;
    return candidates.reduce((prev, current) => 
      (prev.totalVotes > current.totalVotes) ? prev : current
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading election results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <p>No election results available yet</p>
      </div>
    );
  }

  const activeResult = results.find(r => r.categoryName === activeCategory) || results[0];
  const winner = getWinner(activeResult.candidates);

  return (
    <div className="election-results-container">
      <motion.div 
        className="results-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Election Results</h2>
        <div className="category-selector">
          {results.map((result) => (
            <button
              key={result._id}
              className={`category-tab ${activeCategory === result.categoryName ? 'active' : ''}`}
              onClick={() => setActiveCategory(result.categoryName)}
            >
              {result.categoryName}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="results-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="table-header">
          <h3>{activeResult.categoryName}</h3>
          {winner && (
            <div className="winner-badge">
              Winner: {winner.candidateName} ({winner.totalVotes} votes)
            </div>
          )}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Candidate</th>
              <th>Votes</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {activeResult.candidates
              .sort((a, b) => b.totalVotes - a.totalVotes)
              .map((candidate, index) => (
                <motion.tr
                  key={candidate.candidateId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={winner?.candidateId === candidate.candidateId ? 'winner-row' : ''}
                >
                  <td>{index + 1}</td>
                  <td>
                    <div className="candidate-info">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidateName)}&background=random`}
                        alt={candidate.candidateName}
                        className="candidate-photo"
                      />
                      <span>{candidate.candidateName}</span>
                    </div>
                  </td>
                  <td>{candidate.totalVotes}</td>
                  <td>
                    {((candidate.totalVotes / activeResult.categoryTotalVotes) * 100).toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
        <div className="total-votes">
          Total Votes Cast: {activeResult.categoryTotalVotes}
        </div>
      </motion.div>
    </div>
  );
};

export default ElectionResults;