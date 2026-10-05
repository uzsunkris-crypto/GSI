import React, { useState } from 'react';
import { Plus, Wallet, Calendar, FileText, ChevronRight, X } from 'lucide-react';

export default function IncomeManager({ ledger, onAddIncome }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Extract unique existing sources
  const existingSources = Array.from(
    new Set((ledger.incomes || []).map((i) => i.source.trim()))
  ).filter(Boolean);

  const handleOpenModal = () => {
    setSource(existingSources.length > 0 ? existingSources[0] : 'NEW');
    setCustomSource('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSource = source === 'NEW' ? customSource.trim() : source.trim();
    const numAmount = parseFloat(amount);

    if (!finalSource) {
      setError('Please provide the income source name.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive income amount.');
      return;
    }

    onAddIncome({
      id: 'inc_' + Date.now(),
      source: finalSource,
      amount: numAmount,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes.trim()
    });

    setIsModalOpen(false);
  };

  // Group incomes by source to show breakdown
  const sourceSummaries = {};
  (ledger.incomes || []).forEach((inc) => {
    const s = inc.source.trim();
    if (!sourceSummaries[s]) {
      sourceSummaries[s] = { total: 0, count: 0, lastDate: inc.date };
    }
    sourceSummaries[s].total += Number(inc.amount || 0);
    sourceSummaries[s].count += 1;
    if (inc.date > sourceSummaries[s].lastDate) {
      sourceSummaries[s].lastDate = inc.date;
    }
  });

  return (
    <div className="google-card" style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            backgroundColor: '#e6f4ea',
            color: '#137333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={19} />
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#202124' }}>
              Income Sources & Inflows
            </h2>
            <p style={{ fontSize: '13px', color: '#5f6368' }}>
              Manage and track where each dollar enters your financial pool
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="btn-primary"
          style={{ backgroundColor: '#1e8e3e' }}
        >
          <Plus size={16} />
          <span>Add Income Inflow</span>
        </button>
      </div>

      {/* Sources Breakdown Grid */}
      {Object.keys(sourceSummaries).length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '32px 16px',
          color: '#5f6368',
          fontSize: '14px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px dashed #dadce0'
        }}>
          No income sources recorded yet. Click <strong>"Add Income Inflow"</strong> to set up your primary income stream.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {Object.entries(sourceSummaries).map(([srcName, info]) => (
            <div
              key={srcName}
              style={{
                border: '1px solid #dadce0',
                borderRadius: '8px',
                padding: '14px 16px',
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#202124' }}>
                  {srcName}
                </div>
                <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '2px' }}>
                  {info.count} entry{info.count === 1 ? '' : 'ies'} • Last: {info.lastDate}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#137333' }}>
                  +${info.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Income Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid #dadce0',
              paddingBottom: '14px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#202124' }}>
                Record Income Inflow
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', color: '#5f6368', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fce8e6',
                color: '#c5221f',
                border: '1px solid #fad2cf',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Income Source</label>
                <select
                  className="form-control"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {existingSources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="NEW">+ Create New Source Category...</option>
                </select>
              </div>

              {source === 'NEW' && (
                <div className="form-group">
                  <label className="form-label">New Source Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Consulting, Freelance Gig, Store Sales, Dividends"
                    className="form-control"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Inflow Amount ($)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date Received</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Source Details (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Optional details about how this income was earned"
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '24px',
                borderTop: '1px solid #dadce0',
                paddingTop: '16px'
              }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ backgroundColor: '#1e8e3e' }}
                >
                  Deposit to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
