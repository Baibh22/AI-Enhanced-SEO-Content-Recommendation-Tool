import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor as DraftEditor, EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import axios from 'axios';
import 'draft-js/dist/Draft.css';
import './Editor.css';
import SEOPanel from './SEOPanel';
import RevisionHistory from './RevisionHistory';

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [draft, setDraft] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDraft();
    }
  }, [id]);

  const fetchDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/drafts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const draftData = response.data;
      setDraft(draftData);
      setTitle(draftData.title);
      
      if (draftData.content) {
        try {
          const contentState = convertFromRaw(JSON.parse(draftData.content));
          setEditorState(EditorState.createWithContent(contentState));
        } catch {
          const contentState = ContentState.createFromText(draftData.content);
          setEditorState(EditorState.createWithContent(contentState));
        }
      }
    } catch (error) {
      console.error('Error fetching draft:', error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        alert('Draft not found or access denied');
        navigate('/');
      }
    }
  };

  const saveDraft = async (saveRevision = false) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const contentState = editorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));
      
      await axios.put(`/api/drafts/${id}`, {
        title,
        content: rawContent,
        currentSeoScore: draft?.currentSeoScore || 0,
        keywords: draft?.keywords || [],
        suggestions: draft?.suggestions || [],
        saveRevision
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (saveRevision) {
        await fetchDraft();
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/');
      }
    }
    setSaving(false);
  };

  const analyzeSEO = async () => {
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const contentState = editorState.getCurrentContent();
      const plainText = contentState.getPlainText();
      
      const response = await axios.post('/api/seo/analyze', {
        title,
        content: plainText
      });

      const { seoScore, keywords, suggestions } = response.data;
      
      await axios.put(`/api/drafts/${id}`, {
        title,
        content: JSON.stringify(convertToRaw(contentState)),
        currentSeoScore: seoScore,
        keywords,
        suggestions,
        saveRevision: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await fetchDraft();
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      alert('Failed to analyze content. Please check your API key.');
    }
    setAnalyzing(false);
  };

  return (
    <div className="editor-container">
      <header className="editor-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          onBlur={() => saveDraft()}
        />
        <div className="header-actions">
          <button 
            className="btn-analyze"
            onClick={analyzeSEO}
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing...' : '🔍 Analyze SEO'}
          </button>
          <button 
            className="btn-save"
            onClick={() => saveDraft()}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </header>

      <div className="editor-layout">
        <div className="editor-main">
          <div className="draft-editor">
            <DraftEditor
              editorState={editorState}
              onChange={setEditorState}
              placeholder="Start writing your content..."
            />
          </div>
        </div>

        <div className="editor-sidebar">
          <SEOPanel draft={draft} />
          <RevisionHistory draft={draft} />
        </div>
      </div>
    </div>
  );
}

export default Editor;
