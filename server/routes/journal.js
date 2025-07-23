// server/routes/journal.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');

// @route   GET api/journal
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/journal
// @desc    Add new journal entry
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, mood, tags } = req.body;

  try {
    const newEntry = new JournalEntry({
      title,
      content,
      mood,
      tags: tags.split(',').map(tag => tag.trim()),
      user: req.user.id,
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, mood, tags } = req.body;

  // Build entry object
  const entryFields = {};
  if (title) entryFields.title = title;
  if (content) entryFields.content = content;
  if (mood) entryFields.mood = mood;
  if (tags) entryFields.tags = tags.split(',').map(tag => tag.trim());

  try {
    let entry = await JournalEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    // Make sure user owns entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    entry = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      { $set: entryFields },
      { new: true }
    );

    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let entry = await JournalEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    // Make sure user owns entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await JournalEntry.findByIdAndDelete(req.params.id);


    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;