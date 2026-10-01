const express = require('express');
const router = express.Router();
const Notice = require('../models/notice.model');

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notices.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found.' });
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: 'Invalid notice ID.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create notice.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!notice) return res.status(404).json({ message: 'Notice not found.' });
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update notice.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found.' });
    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid notice ID.' });
  }
});

module.exports = router;