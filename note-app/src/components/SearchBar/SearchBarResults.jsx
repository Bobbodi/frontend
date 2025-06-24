import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const SearchBarWithResults = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Search function
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.get('/api/users/search', {
        params: { query, currentUserId }
      });
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced version of search
  const debouncedSearch = debounce(searchUsers, 300);

  // Handle input change
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container" style={{ position: 'relative' }}>
      <div className="search-bar" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search users..."
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        {searchQuery && (
          <button 
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <ul 
          className="search-results"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000,
            listStyle: 'none',
            padding: 0,
            margin: '5px 0 0 0'
          }}
        >
          {searchResults.map(user => (
            <li 
              key={user._id}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
              onClick={() => {
                // Handle user selection
                console.log('Selected user:', user);
                setShowResults(false);
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{user.fullName}</div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>{user.email}</div>
            </li>
          ))}
        </ul>
      )}

      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          Loading...
        </div>
      )}

      {showResults && !isLoading && searchResults.length === 0 && searchQuery && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchBarWithResults;