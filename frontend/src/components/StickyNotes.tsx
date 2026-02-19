import { useEffect, useRef, useState } from 'react';
import { StickyNote, Plus, ChevronRight, ChevronDown, X, Palette } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { stickyNotesAPI } from '../services/api';

interface Note {
  id: string;
  text: string;
  color: NoteColor;
  order: number;
}

type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'gray';

const colorOptions: { id: NoteColor; label: string }[] = [
  { id: 'yellow', label: 'Yellow' },
  { id: 'pink', label: 'Pink' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'purple', label: 'Purple' },
  { id: 'gray', label: 'Gray' },
];

const noteCardClasses: Record<NoteColor, string> = {
  yellow:
    'border-yellow-200 dark:border-yellow-900/40 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/30',
  pink:
    'border-rose-200 dark:border-rose-900/40 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/35 dark:to-pink-900/25',
  blue:
    'border-blue-200 dark:border-blue-900/40 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/35 dark:to-sky-900/25',
  green:
    'border-emerald-200 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 to-lime-100 dark:from-emerald-900/30 dark:to-lime-900/20',
  purple:
    'border-violet-200 dark:border-violet-900/40 bg-gradient-to-br from-violet-50 to-fuchsia-100 dark:from-violet-900/35 dark:to-fuchsia-900/25',
  gray:
    'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-800/40',
};

export default function StickyNotes({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const saveTimersRef = useRef<Record<string, number>>({});

  const togglePanel = () => onOpenChange(!isOpen);

  // Load notes from cloud when opening
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await stickyNotesAPI.list();
        if (cancelled) return;
        const normalized: Note[] = (Array.isArray(data) ? data : []).map((n: any) => ({
          id: n._id || n.id,
          text: n.text || '',
          color: (n.color as NoteColor) || 'yellow',
          order: typeof n.order === 'number' ? n.order : 0,
        }));
        normalized.sort((a, b) => a.order - b.order);
        setNotes(normalized);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load sticky notes');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Cleanup pending timers to avoid leaks
  useEffect(() => {
    return () => {
      Object.values(saveTimersRef.current).forEach((t) => window.clearTimeout(t));
      saveTimersRef.current = {};
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const updated = Array.from(notes);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    const reOrdered = updated.map((n, idx) => ({ ...n, order: idx }));
    setNotes(reOrdered);
    // Persist ordering (cloud)
    stickyNotesAPI.reorder(reOrdered.map((n) => n.id)).catch(() => {
      // silent fail; UI stays responsive
    });
  };

  const handleAddNote = async () => {
    try {
      setError('');
      const created = await stickyNotesAPI.create({ text: '', color: 'yellow' });
      const note: Note = {
        id: created._id || created.id,
        text: created.text || '',
        color: (created.color as NoteColor) || 'yellow',
        order: typeof created.order === 'number' ? created.order : notes.length,
      };
      setNotes((prev) => {
        const next = [...prev, note].map((n, idx) => ({ ...n, order: idx }));
        stickyNotesAPI.reorder(next.map((n) => n.id)).catch(() => {});
        return next;
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to create note');
    }
  };

  const scheduleSave = (id: string, updates: Partial<Pick<Note, 'text' | 'color'>>) => {
    const existing = saveTimersRef.current[id];
    if (existing) window.clearTimeout(existing);
    saveTimersRef.current[id] = window.setTimeout(() => {
      stickyNotesAPI.update(id, updates).catch(() => {});
      delete saveTimersRef.current[id];
    }, 600);
  };

  const handleChangeNote = (id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
    scheduleSave(id, { text });
  };

  const handleChangeColor = (id: string, color: NoteColor) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)));
    scheduleSave(id, { color });
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setError('');
      await stickyNotesAPI.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id).map((n, idx) => ({ ...n, order: idx })));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete note');
    }
  };

  return (
    <>
      {/* Sticky-note toggle button (near theme toggle) - hidden when panel open */}
      {!isOpen && (
        <button
          type="button"
          onClick={togglePanel}
          className="fixed top-4 right-14 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-sm transition-colors"
          aria-label="Open sticky notes"
        >
          <StickyNote className="w-5 h-5" />
        </button>
      )}

      {/* Right-side slide panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-40
          w-full sm:w-80 md:w-96
          transform transition-transform duration-300 ease-out
          bg-white/95 dark:bg-gray-900/95 border-l border-gray-200 dark:border-gray-800
          backdrop-blur-md
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Sticky Notes
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              aria-label={isCollapsed ? 'Expand notes' : 'Collapse notes'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={togglePanel}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              aria-label="Close sticky notes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Drag to re-order. Saved to your account.
                </p>
                {error && (
                  <p className="text-xs text-red-500 mt-1 truncate">{error}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddNote}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sticky-notes-column">
                {(providedDroppable) => (
                  <div
                    ref={providedDroppable.innerRef}
                    {...providedDroppable.droppableProps}
                    className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto"
                  >
                    {isLoading && notes.length === 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-4">
                        Loading notes…
                      </div>
                    )}
                    {notes.map((note, index) => (
                      <Draggable key={note.id} draggableId={note.id} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            className={`
                              rounded-xl border
                              ${noteCardClasses[note.color]}
                              shadow-sm px-3 py-2 text-sm text-gray-800 dark:text-gray-100
                              transition-all duration-150
                              ${snapshotDraggable.isDragging ? 'shadow-lg scale-[1.02]' : ''}
                            `}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                <Palette className="w-3 h-3" />
                                <span>Color</span>
                              </div>
                              <select
                                value={note.color}
                                onChange={(e) => handleChangeColor(note.id, e.target.value as NoteColor)}
                                className="text-[10px] bg-white/60 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded px-1 py-0.5 outline-none"
                                aria-label="Sticky note color"
                              >
                                {colorOptions.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              value={note.text}
                              onChange={(e) => handleChangeNote(note.id, e.target.value)}
                              className="w-full bg-transparent resize-none outline-none text-xs leading-snug placeholder:text-gray-400 dark:placeholder:text-gray-500"
                              rows={3}
                              placeholder="Write a quick note…"
                            />
                            <div className="flex justify-end mt-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-[10px] text-gray-400 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {providedDroppable.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
    </>
  );
}

