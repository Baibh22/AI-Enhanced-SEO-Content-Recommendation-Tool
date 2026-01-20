import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './RevisionHistory.css';

function RevisionHistory({ draft }) {
  if (!draft || !draft.revisions || draft.revisions.length === 0) {
    return (
      <div className="revision-history">
        <h3>Revision History</h3>
        <p className="no-revisions">No revisions yet. Analyze your content to track improvements.</p>
      </div>
    );
  }

  const chartData = draft.revisions.map((revision, index) => ({
    name: `Rev ${index + 1}`,
    score: revision.seoScore
  }));

  chartData.push({
    name: 'Current',
    score: draft.currentSeoScore
  });

  return (
    <div className="revision-history">
      <h3>Revision History</h3>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="revisions-list">
        {draft.revisions.slice().reverse().map((revision, index) => (
          <div key={index} className="revision-item">
            <div className="revision-header">
              <span className="revision-number">
                Revision {draft.revisions.length - index}
              </span>
              <span className="revision-score">
                Score: {revision.seoScore}
              </span>
            </div>
            <div className="revision-date">
              {new Date(revision.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RevisionHistory;
