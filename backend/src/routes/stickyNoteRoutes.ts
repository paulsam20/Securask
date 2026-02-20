import express from 'express';
import {
  listStickyNotes,
  createStickyNote,
  updateStickyNote,
  deleteStickyNote,
  reorderStickyNotes,
} from '../controllers/stickyNoteController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Sticky Note Routes
 * Protected routes for managing user-specific quick notes.
 */

// Base endpoints: List all notes and Create a new one
router.route('/')
  .get(protect, listStickyNotes)
  .post(protect, createStickyNote);

// Bulk order update endpoint
router.route('/reorder')
  .put(protect, reorderStickyNotes);

// Single note endpoints: Update state and Delete
router.route('/:id')
  .put(protect, updateStickyNote)
  .delete(protect, deleteStickyNote);

export default router;
