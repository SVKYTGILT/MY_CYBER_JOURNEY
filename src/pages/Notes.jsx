import React, { useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '../lib/supabaseClient';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ==========================================
  // LOAD USER'S NOTES
  // ==========================================

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const { data, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADD NEW NOTE
  // ==========================================

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    setError('');

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError('You must be logged in to create a note.');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add new note to the top
      setNotes((currentNotes) => [data, ...currentNotes]);

      // Clear form
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding note:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE NOTE
  // ==========================================

  const handleDeleteNote = async (id) => {
    try {
      setError('');

      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error.message);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <div className="glass-card p-8 rounded-2xl text-center">
          <p className="text-pink-300">
            Loading your notes...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          Cyber Notes
        </h1>

        <p className="text-gray-400">
          Record and manage your cybersecurity learning notes and commands.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* Add Note Form */}
      <form
        onSubmit={handleAddNote}
        className="glass-card p-6 rounded-2xl mb-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-pink-300">
          Add New Note
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Note Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Nmap Commands, OWASP Top 10..."
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Note Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note details, commands, or key takeaways here..."
            rows="4"
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300 resize-none"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-rose-500/25"
        >
          {saving ? 'Saving...' : 'Add Note'}
        </button>
      </form>

      {/* Notes */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-pink-300">
          Your Notes ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <p className="text-gray-500 italic">
              No notes added yet. Create your first note above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {notes.map((note) => (
              <div
                key={note.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              >

                <div>

                  {/* Title + Date */}
                  <div className="flex justify-between items-start mb-3 gap-3">

                    <h3 className="text-lg font-bold text-white">
                      {note.title}
                    </h3>

                    <span className="text-xs text-gray-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-pink-500/20 whitespace-nowrap">
                      {formatDate(note.created_at)}
                    </span>

                  </div>

                  {/* Content */}
                  <p className="text-gray-300 text-sm whitespace-pre-wrap mb-6 leading-relaxed">
                    {note.content}
                  </p>

                </div>

                {/* Delete */}
                <div className="flex justify-end pt-4 border-t border-pink-500/10">

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    Delete Note
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}
