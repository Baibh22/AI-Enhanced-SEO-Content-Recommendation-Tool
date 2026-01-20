import React from 'react';
import './SEOPanel.css';

function SEOPanel({ draft }) {
  if (!draft) return null;

  const getSeoScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSeoScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const hasAnalysis = draft.currentSeoScore > 0 || draft.keywords.length > 0 || draft.suggestions.length > 0;

  return (
    <div className="seo-panel">
      <h3>SEO Analysis</h3>
      
      {!hasAnalysis ? (
        <div className="no-analysis">
          <p>Click "Analyze SEO" to get AI-powered insights on your content.</p>
          <ul className="analysis-features">
            <li>📊 SEO Score based on title-content match</li>
            <li>🔑 Keywords extracted from content</li>
            <li>💡 Actionable improvement suggestions</li>
          </ul>
        </div>
      ) : (
        <>
          <div className="seo-score-display">
            <div 
              className="score-circle"
              style={{ borderColor: getSeoScoreColor(draft.currentSeoScore) }}
            >
              <span className="score-number">{draft.currentSeoScore}</span>
              <span className="score-label">{getSeoScoreLabel(draft.currentSeoScore)}</span>
            </div>
          </div>

          {draft.keywords && draft.keywords.length > 0 && (
            <div className="seo-section">
              <h4>📌 Keywords from Content</h4>
              <div className="keywords-list">
                {draft.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {draft.suggestions && draft.suggestions.length > 0 && (
            <div className="seo-section">
              <h4>💡 Improvement Suggestions</h4>
              <ul className="suggestions-list">
                {draft.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SEOPanel;
