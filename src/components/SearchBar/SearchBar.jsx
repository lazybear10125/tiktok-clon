import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { trendingKeywords, searchSuggestions } from '../../data/mockData';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const { searchHistory, addSearchQuery, removeSearchQuery, clearSearchHistory } = useApp();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicking outside to close popover
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    const finalTerm = term || query;
    if (!finalTerm.trim()) return;
    addSearchQuery(finalTerm);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(finalTerm.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter autocomplete suggestions based on query
  const filteredSuggestions = query.trim()
    ? searchSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className={styles.searchWrapper} ref={containerRef}>
      <div className={`${styles.searchBox} ${isOpen ? styles.active : ''}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm tài khoản và video"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />

        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <span className={styles.splitter} />

        <button
          className={styles.searchBtn}
          onClick={() => handleSearch()}
          aria-label="Submit search"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className={styles.dropdown}>
          {query.trim() ? (
            /* Autocomplete Suggestions */
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Gợi ý tìm kiếm</span>
              </div>
              <div className={styles.list}>
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className={styles.item}
                      onClick={() => {
                        setQuery(item);
                        handleSearch(item);
                      }}
                    >
                      <Search size={16} className={styles.itemIcon} />
                      <span className={styles.itemText}>{item}</span>
                      <ArrowUpRight size={14} className={styles.itemArrow} />
                    </div>
                  ))
                ) : (
                  <div
                    className={styles.item}
                    onClick={() => handleSearch(query)}
                  >
                    <Search size={16} className={styles.itemIcon} />
                    <span className={styles.itemText}>Tìm "{query}"</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleGroup}>
                      <Clock size={15} />
                      <span className={styles.sectionTitle}>Lịch sử tìm kiếm</span>
                    </div>
                    <button
                      className={styles.clearAllBtn}
                      onClick={clearSearchHistory}
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className={styles.historyList}>
                    {searchHistory.map((item, idx) => (
                      <div key={idx} className={styles.historyItem}>
                        <div
                          className={styles.historyClickable}
                          onClick={() => {
                            setQuery(item);
                            handleSearch(item);
                          }}
                        >
                          <Clock size={14} className={styles.historyIcon} />
                          <span className={styles.historyText}>{item}</span>
                        </div>
                        <button
                          className={styles.deleteHistoryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearchQuery(item);
                          }}
                          aria-label="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleGroup}>
                    <TrendingUp size={15} className={styles.trendingIconColor} />
                    <span className={styles.sectionTitle}>Bạn có thể thích</span>
                  </div>
                </div>
                <div className={styles.trendingGrid}>
                  {trendingKeywords.map((kw, idx) => (
                    <div
                      key={idx}
                      className={styles.trendingBadge}
                      onClick={() => {
                        setQuery(kw);
                        handleSearch(kw);
                      }}
                    >
                      <span className={styles.trendingRank}>{idx + 1}</span>
                      <span className={styles.trendingText}>{kw}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
