import { Response } from 'express';
import StickyNote from '../models/StickyNote';

/**
 * Retrieve all sticky notes for the current user.
 * Sorted by user-defined order, then by creation date.
 */
export const listStickyNotes = async (req: any, res: Response) => {
  try {
    const notes = await StickyNote.find({ user: req.user._id }).sort({ order: 1, createdAt: 1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching sticky notes:', error);
    res.status(500).json({ message: 'Error fetching sticky notes' });
  }
};

/**
 * Create a new sticky note.
 * Automatically calculates the 'order' index to place it at the end of the list.
 */
export const createStickyNote = async (req: any, res: Response) => {
  try {
    const { text, color } = req.body;

    // Determine the highest 'order' value to append the new note
    const max = await StickyNote.findOne({ user: req.user._id }).sort({ order: -1 }).select('order');
    const nextOrder = typeof max?.order === 'number' ? max.order + 1 : 0;

    const note = await StickyNote.create({
      user: req.user._id,
      text: typeof text === 'string' ? text : '',
      color: color || 'yellow',
      order: nextOrder,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating sticky note:', error);
    res.status(400).json({ message: 'Error creating sticky note' });
  }
};

/**
 * Update a sticky note's content, color, or order.
 * Includes ownership verification.
 */
export const updateStickyNote = async (req: any, res: Response) => {
  try {
    const note = await StickyNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Sticky note not found' });

    // Security check
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { text, color, order } = req.body;
    if (text !== undefined) note.text = text;
    if (color !== undefined) note.color = color;
    if (order !== undefined) note.order = order;

    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    console.error('Error updating sticky note:', error);
    res.status(500).json({ message: 'Server error during update' });
  }
};

/**
 * Delete a sticky note.
 * Includes ownership verification.
 */
export const deleteStickyNote = async (req: any, res: Response) => {
  try {
    const note = await StickyNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Sticky note not found' });

    // Security check
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Sticky note successfully deleted' });
  } catch (error) {
    console.error('Error deleting sticky note:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

/**
 * Mass reorder sticky notes.
 * Receives an array of IDs in the preferred order and updates their 'order' fields.
 * Uses MongoDB BulkWrite for efficiency.
 */
export const reorderStickyNotes = async (req: any, res: Response) => {
  try {
    const { orderedIds } = req.body as { orderedIds?: string[] };
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array' });
    }

    // Filter IDs to ensure we only update notes actually owned by the user
    const notes = await StickyNote.find({ user: req.user._id, _id: { $in: orderedIds } }).select('_id');
    const allowed = new Set(notes.map((n) => n._id.toString()));

    const bulk = orderedIds
      .filter((id) => allowed.has(id))
      .map((id, idx) => ({
        updateOne: {
          filter: { _id: id, user: req.user._id },
          update: { $set: { order: idx } },
        },
      }));

    if (bulk.length > 0) {
      await StickyNote.bulkWrite(bulk);
    }

    // Return the newly sorted list to the client
    const updated = await StickyNote.find({ user: req.user._id }).sort({ order: 1, createdAt: 1 });
    res.json(updated);
  } catch (error) {
    console.error('Error reordering sticky notes:', error);
    res.status(500).json({ message: 'Error reordering sticky notes' });
  }
};
