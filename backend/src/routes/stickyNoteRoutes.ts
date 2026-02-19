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

router.route('/').get(protect, listStickyNotes).post(protect, createStickyNote);
router.route('/reorder').put(protect, reorderStickyNotes);
router.route('/:id').put(protect, updateStickyNote).delete(protect, deleteStickyNote);

export default router;

