import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, Edit3, ChevronDown, ChevronUp, Check, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AuditLedger({ ledger, onUpdateWithdrawalAudit }) {
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, ACHIEVED, FAILED
  const [editingId, setEditingId] = useState(null);

  // Audit form state
  const [isAchieved, setIsAchieved] = useState(false);
  const [actualYield, setActualYield] = useState('');
  const [successExtent, setSuccessExtent] = useState('');

  const withdrawals = ledger.withdrawals || [];

  const handleStartAudit = (item) => {
    setEditingId(item.id);
    setIsAchieved(item.status === 'achieved');
    setActualYield(item.actualYield !== null && item.actualYield !== undefined ? item.actualYield : '');
    setSuccessExtent(item.successExtent || '');
  };

  const handleCancelAudit = () => {
    setEditingId(null);
  };

  const handleSaveAudit = (id) => {
    const numActual = actualYield !== '' ? parseFloat(actualYield) : null;
    const newStatus = isAchieved ? 'achieved' : (numActual !== null || successExtent.trim() ? 'failed' : 'pending');

    onUpdateWithdrawalAudit(id, {
      status: newStatus,
      actualYield: numActual,
      successExtent: successExtent.trim(),
      auditedAt: new Date().toISOString()
    });

    setEditingId(null);
  };

  const filteredItems = withdrawals.filter((item) => {
    if (filter === 'PENDING') return item.status === 'pending';
    if (filter === 'ACHIEVED') return item.status === 'achieved';
    if (filter === 'FAILED') return item.status === 'failed';
    return true;
  });

  return (
    <div className="google-card">
      {/* Header & Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid #dadce0',
        paddingBottom: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#202124' }}>
            Accountability & Audit Ledger
          </h2>
          <p style={{ fontSize: '13px', color: '#5f6368', marginTop: '2px' }}>
            Tick whether you achieved your stated goal and document the real financial outcome
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'ALL', label: `All (${withdrawals.length})` },
            { key: 'PENDING', label: `Pending Audit (${withdrawals.filter(w => w.status === 'pending').length})` },
            { key: 'ACHIEVED', label: `Achieved (${withdrawals.filter(w => w.status === 'achieved').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: filter === tab.key ? '#e8f0fe' : '#f1f3f4',
                color: filter === tab.key ? '#1a73e8' : '#5f6368',
                border: filter === tab.key ? '1px solid #d2e3fc' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Items */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 16px',
          color: '#5f6368',
          fontSize: '14px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          No withdrawals match the selected view.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            const netProjected = item.expectedYield - item.amount;

            return (
              <div
                key={item.id}
                style={{
                  border: '1px solid #dadce0',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  boxShadow: '0 1px 2px rgba(60,64,67,0.08)',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {/* Item Top Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#202124' }}>
                        {item.reason}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: '#f1f3f4',
                        color: '#5f6368',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Source: {item.source}
                      </span>
                      <span style={{ fontSize: '12px', color: '#80868b' }}>
                        {item.date}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px', maxWidth: '680px' }}>
                      <strong>Stated Benefit:</strong> {item.benefit}
                    </div>
                  </div>

                  {/* Financial Figures */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#d93025' }}>
                      -${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '12px', color: '#137333', fontWeight: 600 }}>
                      Projected Yield: +${Number(item.expectedYield).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Audit & Accountability Bar */}
                <div style={{
                  backgroundColor: item.status === 'achieved'
                    ? '#e6f4ea'
                    : item.status === 'failed'
                    ? '#fce8e6'
                    : '#fef7e0',
                  border: item.status === 'achieved'
                    ? '1px solid #ceead6'
                    : item.status === 'failed'
                    ? '1px solid #fad2cf'
                    : '1px solid #feefc3',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginTop: '12px'
                }}>
                  {!isEditing ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.status === 'achieved' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#137333', fontWeight: 600, fontSize: '13px' }}>
                            <CheckCircle2 size={18} />
                            <span>Goal Achieved</span>
                          </div>
                        ) : item.status === 'failed' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c5221f', fontWeight: 600, fontSize: '13px' }}>
                            <XCircle size={18} />
                            <span>Did Not Achieve Goal</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b06000', fontWeight: 600, fontSize: '13px' }}>
                            <Clock size={18} />
                            <span>Pending Accountability Audit</span>
                          </div>
                        )}

                        {item.actualYield !== null && item.actualYield !== undefined && (
                          <span style={{ fontSize: '13px', color: '#202124', fontWeight: 500 }}>
                            • Actual Earned: <strong style={{ color: '#137333' }}>${Number(item.actualYield).toLocaleString()}</strong>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartAudit(item)}
                        className="btn-outline"
                        style={{ padding: '4px 12px', fontSize: '12px', height: '30px' }}
                      >
                        <Edit3 size={14} />
                        <span>{item.status === 'pending' ? 'Audit & Verify Now' : 'Edit Outcome'}</span>
                      </button>
                    </div>
                  ) : (
                    /* Inline Audit Editor */
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#202124', marginBottom: '12px' }}>
                        Post-Expense Audit & Accountability Form
                      </div>

                      {/* Checkbox Tick */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#202124',
                        marginBottom: '14px'
                      }}>
                        <input
                          type="checkbox"
                          checked={isAchieved}
                          onChange={(e) => setIsAchieved(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#1a73e8', cursor: 'pointer' }}
                        />
                        <span>
                          <strong>✓ I achieved what I said this money was for</strong> ({item.reason})
                        </span>
                      </label>

                      {/* Actual Yield & Extent */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label className="form-label">Actual Money Yielded / Earned ($)</label>
                          <input
                            type="number"
                            step="any"
                            placeholder="e.g. 250.00"
                            className="form-control"
                            value={actualYield}
                            onChange={(e) => setActualYield(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label">To What Extent Was It Successful?</label>
                          <input
                            type="text"
                            placeholder="e.g. Succeeded 100%, boosted energy to work 6 billable hours"
                            className="form-control"
                            value={successExtent}
                            onChange={(e) => setSuccessExtent(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '13px' }}
                          onClick={handleCancelAudit}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '6px 16px', fontSize: '13px' }}
                          onClick={() => handleSaveAudit(item.id)}
                        >
                          <Check size={16} />
                          <span>Save Audit Record</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Outcome Description display when not editing */}
                  {!isEditing && item.successExtent && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '13px',
                      color: '#3c4043',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                      paddingTop: '6px'
                    }}>
                      <strong>Outcome & Extent:</strong> {item.successExtent}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
