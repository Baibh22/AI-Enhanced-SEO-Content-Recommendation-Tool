import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/drafts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDrafts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
      setLoading(false);
    }
  };

  const createNewDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/drafts', {
        title: 'Untitled Draft',
        content: ''
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Error creating draft:', error);
      if (error.response?.status === 401) {
        onLogout();
      } else {
        alert('Failed to create draft. Please try again.');
      }
    }
  };

  const deleteDraft = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/drafts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchDrafts();
      } catch (error) {
        console.error('Error deleting draft:', error);
        if (error.response?.status === 401) {
          onLogout();
        }
      }
    }
  };

  const getSeoScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getPlainTextFromContent = (content) => {
    if (!content) return '';
    
    try {
      const contentState = JSON.parse(content);
      if (contentState.blocks) {
        return contentState.blocks
          .map(block => block.text)
          .join(' ')
          .trim();
      }
      return content;
    } catch {
      return content;
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    const plainText = getPlainTextFromContent(draft.content);
    return draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           plainText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: drafts.length,
    avgScore: drafts.length > 0 
      ? Math.round(drafts.reduce((sum, d) => sum + d.currentSeoScore, 0) / drafts.length)
      : 0,
    highScore: drafts.length > 0 
      ? Math.max(...drafts.map(d => d.currentSeoScore))
      : 0
  };

  if (loading) {
    return <div className="loading">Loading your drafts...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>SEO Content Tool</h1>
          <p className="welcome-text">Welcome, {user.name}!</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={createNewDraft}>
            New Draft
          </button>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {drafts.length > 0 && (
        <>
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                📝
              </div>
              <div className="stat-content">
                <h3>Total Drafts</h3>
                <p>{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                📊
              </div>
              <div className="stat-content">
                <h3>Average Score</h3>
                <p>{stats.avgScore}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                🏆
              </div>
              <div className="stat-content">
                <h3>Best Score</h3>
                <p>{stats.highScore}</p>
              </div>
            </div>
          </div>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search drafts by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="drafts-grid">
        {filteredDrafts.length === 0 && drafts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h2>No drafts yet</h2>
            <p>Create your first draft to get started with AI-powered SEO optimization</p>
            <button className="btn-primary" onClick={createNewDraft}>
              Create Draft
            </button>
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2>No results found</h2>
            <p>Try adjusting your search terms</p>
          </div>
        ) : (
          filteredDrafts.map(draft => (
            <div 
              key={draft._id} 
              className="draft-card"
              onClick={() => navigate(`/editor/${draft._id}`)}
            >
              <div className="draft-header">
                <h3>{draft.title}</h3>
                <button 
                  className="btn-delete"
                  onClick={(e) => deleteDraft(draft._id, e)}
                  title="Delete draft"
                >
                  ×
                </button>
              </div>
              <p className="draft-preview">
                {(() => {
                  const plainText = getPlainTextFromContent(draft.content);
                  if (!plainText) return 'No content yet...';
                  return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
                })()}
              </p>
              <div className="draft-footer">
                <div className="seo-score">
                  <span 
                    className="score-badge"
                    style={{ backgroundColor: getSeoScoreColor(draft.currentSeoScore) }}
                  >
                    {draft.currentSeoScore}
                  </span>
                </div>
                <span className="draft-date">
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {draft.revisions.length > 0 && (
                <div className="revision-count">
                  {draft.revisions.length} revision{draft.revisions.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
