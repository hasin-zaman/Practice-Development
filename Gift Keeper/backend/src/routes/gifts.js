const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Gift = require('../models/Gift');

// Get all gifts for a user
router.get('/', auth, async (req, res) => {
  try {
    const gifts = await Gift.find({ user: req.user.id }).sort({ date: -1 });
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({ error: 'Error fetching gifts' });
  }
});

// Add a new gift
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('Gift name is required'),
  body('recipient').trim().notEmpty().withMessage('Recipient is required'),
  body('recipientBirthday').optional().isISO8601().withMessage('Valid birthday date is required'),
  body('occasion').trim().notEmpty().withMessage('Occasion is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('type').isIn(['given', 'received']).withMessage('Type must be either given or received')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const gift = new Gift({
      ...req.body,
      user: req.user.id
    });

    await gift.save();
    res.status(201).json(gift);
  } catch (error) {
    console.error('Error creating gift:', error);
    res.status(500).json({ error: 'Error creating gift' });
  }
});

// Update a gift
router.put('/:id', auth, [
  body('name').optional().trim().notEmpty().withMessage('Gift name cannot be empty'),
  body('recipient').optional().trim().notEmpty().withMessage('Recipient cannot be empty'),
  body('recipientBirthday').optional().isISO8601().withMessage('Valid birthday date is required'),
  body('occasion').optional().trim().notEmpty().withMessage('Occasion cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('type').optional().isIn(['given', 'received']).withMessage('Type must be either given or received')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const gift = await Gift.findOne({ _id: req.params.id, user: req.user.id });
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    Object.keys(req.body).forEach(update => {
      gift[update] = req.body[update];
    });

    await gift.save();
    res.json(gift);
  } catch (error) {
    console.error('Error updating gift:', error);
    res.status(500).json({ error: 'Error updating gift' });
  }
});

module.exports = router;