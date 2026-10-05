import React, { useState } from 'react';

export default function AddIncomeModal({ isOpen, onClose, existingSources, onAddIncome }) {
  const [source, setSource] = useState(existingSources.length > 0 ? existingSources[0] : 'NEW');
  const [customSource, setCustomSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSource = source === 'NEW' ? customSource.trim() : source.trim();
    const numAmount = parseFloat(amount);

    if (!finalSource) {
      setError('Please provide the income source name.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    onAddIncome({
      id: 'inc_' + Date.now(),
      source: finalSource,
      amount: numAmount,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes.trim()
    });

    setAmount('');
    setCustomSource('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="gsi-modal-backdrop" onClick={onClose}>
      <div className="gsi-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#202124' }}>
            Add Income
          </h2>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#5f6368', padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            color: '#d93025',
            fontSize: '13px',
            marginBottom: '14px',
            backgroundColor: '#fdf2f2',
            padding: '8px 12px',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="gsi-field">
            <label className="gsi-label">Income Source</label>
            <select
              className="gsi-input"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              {existingSources.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="NEW">+ Add New Income Source...</option>
            </select>
          </div>

          {source === 'NEW' && (
            <div className="gsi-field">
              <label className="gsi-label">Source Name</label>
              <input
                type="text"
                placeholder="e.g. Salary, Business, Freelance, Store"
                className="gsi-input"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div className="gsi-field">
            <label className="gsi-label">Amount ($)</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className="gsi-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="gsi-field">
            <label className="gsi-label">Date</label>
            <input
              type="date"
              className="gsi-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="gsi-field">
            <label className="gsi-label">Notes (Optional)</label>
            <input
              type="text"
              placeholder="Optional detail"
              className="gsi-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px'
          }}>
            <button type="button" onClick={onClose} className="btn-gsi-outline">
              Cancel
            </button>
            <button type="submit" className="btn-gsi-primary">
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
