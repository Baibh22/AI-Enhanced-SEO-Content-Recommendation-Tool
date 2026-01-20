const express = require('express');
const router = express.Router();
const Draft = require('../models/Draft');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const drafts = await Draft.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const draft = await Draft.findOne({ _id: req.params.id, userId: req.userId });
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Received POST request:', req.body);
    
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const draft = new Draft({
      userId: req.userId,
      title: req.body.title,
      content: req.body.content || '',
      currentSeoScore: 0,
      keywords: [],
      suggestions: []
    });
    await draft.save();
    console.log('Draft created:', draft._id);
    res.status(201).json(draft);
  } catch (error) {
    console.error('Error creating draft:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const draft = await Draft.findOne({ _id: req.params.id, userId: req.userId });
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    if (req.body.saveRevision) {
      draft.revisions.push({
        content: draft.content,
        seoScore: draft.currentSeoScore,
        keywords: draft.keywords,
        suggestions: draft.suggestions
      });
    }

    draft.title = req.body.title || draft.title;
    draft.content = req.body.content || draft.content;
    draft.currentSeoScore = req.body.currentSeoScore !== undefined ? req.body.currentSeoScore : draft.currentSeoScore;
    draft.keywords = req.body.keywords || draft.keywords;
    draft.suggestions = req.body.suggestions || draft.suggestions;

    await draft.save();
    res.json(draft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const draft = await Draft.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
