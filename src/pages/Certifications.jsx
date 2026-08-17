import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { supabase, getCurrentUser } from '../lib/supabaseClient';

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ==========================================
  // LOAD CERTIFICATIONS
  // ==========================================

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const { data, error: certificationsError } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (certificationsError) throw certificationsError;

      setCertifications(data || []);
    } catch (error) {
      console.error('Error loading certifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EXPORT ALL CERTIFICATIONS TO PDF
  // ==========================================

  const exportCertificationsPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Cyber Journey - Certifications', 14, 22);

    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    if (certifications.length === 0) {
      doc.text('No certifications added yet.', 14, 42);
    } else {
      let y = 44;

      certifications.forEach((certification, index) => {
        if (y > 270) {
          doc.addPage();
          y = 22;
        }

        doc.setFontSize(12);
        doc.text(`${index + 1}. ${certification.name}`, 14, y);
        y += 7;

        if (certification.issuer) {
          doc.setFontSize(10);
          doc.text(`Issuer: ${certification.issuer}`, 20, y);
          y += 6;
        }

        if (certification.date) {
          doc.setFontSize(10);
          doc.text(`Date: ${certification.date}`, 20, y);
          y += 6;
        }

        y += 5;
      });
    }

    doc.save('certifications.pdf');
  };

  // ==========================================
  // ADD CERTIFICATION
  // ==========================================

  const handleAddCertification = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);
    setError('');

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError('You must be logged in to add a certification.');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('certifications')
        .insert([
          {
            user_id: user.id,
            name: name.trim(),
            issuer: issuer.trim(),
            date: date.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setCertifications((current) => [data, ...current]);

      setName('');
      setIssuer('');
      setDate('');
    } catch (error) {
      console.error('Error adding certification:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CERTIFICATION
  // ==========================================

  const handleDeleteCertification = async (id) => {
    try {
      setError('');

      const { error: deleteError } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setCertifications((current) =>
        current.filter((certification) => certification.id !== id)
      );
    } catch (error) {
      console.error('Error deleting certification:', error);
      setError(error.message);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <div className="glass-card p-8 rounded-2xl text-center">
          <p className="text-pink-300">
            Loading your certifications...
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
          Certifications
        </h1>

        <p className="text-gray-400">
          Track the cybersecurity certifications you earn along your journey.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* Add Certification */}
      <form
        onSubmit={handleAddCertification}
        className="glass-card p-6 rounded-2xl mb-10"
      >
        <h2 className="text-xl font-semibold mb-5 text-pink-300">
          Add Certification
        </h2>

        {/* Certification Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Certification Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., CompTIA Security+"
            required
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
          />
        </div>

        {/* Issuer */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Issuing Organization
          </label>

          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g., CompTIA"
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
          />
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-1">
            Date Earned
          </label>

          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g., August 2026"
            className="w-full bg-black/40 border border-pink-400/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-rose-500/25"
        >
          {saving ? 'Saving...' : 'Add Certification'}
        </button>
      </form>

      {/* Certification List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-pink-300">
          Your Certifications ({certifications.length})
        </h2>

        {certifications.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <p className="text-gray-500 italic">
              No certifications added yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {certifications.map((certification) => (
              <div
                key={certification.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              >

                <div>
                  <div className="flex justify-between items-start gap-3 mb-3">

                    <h3 className="text-lg font-bold text-white">
                      {certification.name}
                    </h3>

                    {certification.date && (
                      <span className="text-xs text-gray-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-pink-500/20 whitespace-nowrap">
                        {certification.date}
                      </span>
                    )}

                  </div>

                  {certification.issuer && (
                    <p className="text-pink-300 text-sm mb-4">
                      {certification.issuer}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-pink-500/10 gap-2">

                  <button
                    onClick={exportCertificationsPdf}
                    className="text-cyan-200 hover:text-cyan-100 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-cyan-500/10"
                  >
                    ⬇️ Export PDF
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteCertification(certification.id)
                    }
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    Delete
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
