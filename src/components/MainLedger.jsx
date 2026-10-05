import React, { useState } from 'react';

export default function MainLedger({
  ledger,
  stats,
  onOpenAddIncome,
  onOpenWithdrawal,
  onUpdateWithdrawalAudit
}) {
  const [activeTab, setActiveTab] = useState('WITHDRAWALS'); // 'WITHDRAWALS' | 'INCOMES'
  const [editingAuditId, setEditingAuditId] = useState(null);

  // Form states for audit
  const [auditAchieved, setAuditAchieved] = useState(false);
  const [actualYield, setActualYield] = useState('');
  const [successExtent, setSuccessExtent] = useState('');

  const withdrawals = ledger.withdrawals || [];
  const incomes = ledger.incomes || [];

  const handleStartAudit = (item) => {
    setEditingAuditId(item.id);
    setAuditAchieved(item.status === 'achieved');
    setActualYield(item.actualYield !== null && item.actualYield !== undefined ? item.actualYield : '');
    setSuccessExtent(item.successExtent || '');
  };

  const handleSaveAudit = (id) => {
    const numActual = actualYield !== '' ? parseFloat(actualYield) : null;
    const newStatus = auditAchieved ? 'achieved' : (numActual !== null || successExtent.trim() ? 'failed' : 'pending');

    onUpdateWithdrawalAudit(id, {
      status: newStatus,
      actualYield: numActual,
      successExtent: successExtent.trim(),
      auditedAt: new Date().toISOString()
    });

    setEditingAuditId(null);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Balance Section - No boxes, pure clean typography */}
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '13px', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Available Balance
        </span>
        <div style={{ fontSize: '38px', fontWeight: 600, color: '#202124', margin: '4px 0' }}>
          ${stats.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '13px', color: '#5f6368' }}>
          Total Income: <span style={{ color: '#1e8e3e', fontWeight: 500 }}>+${stats.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          {'  '}•{'  '}
          Total Withdrawn: <span style={{ color: '#d93025', fontWeight: 500 }}>-${stats.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
          <button onClick={onOpenAddIncome} className="btn-gsi-primary">
            + Add Income
          </button>
          <button onClick={onOpenWithdrawal} className="btn-gsi-withdraw">
            − Withdraw Money
          </button>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '24px 0 16px 0' }} />

      {/* Clean Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('WITHDRAWALS')}
          style={{
            padding: '10px 0',
            fontSize: '15px',
            fontWeight: activeTab === 'WITHDRAWALS' ? 600 : 400,
            color: activeTab === 'WITHDRAWALS' ? '#1a73e8' : '#5f6368',
            borderBottom: activeTab === 'WITHDRAWALS' ? '2px solid #1a73e8' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Where your money went ({withdrawals.length})
        </button>

        <button
          onClick={() => setActiveTab('INCOMES')}
          style={{
            padding: '10px 0',
            fontSize: '15px',
            fontWeight: activeTab === 'INCOMES' ? 600 : 400,
            color: activeTab === 'INCOMES' ? '#1a73e8' : '#5f6368',
            borderBottom: activeTab === 'INCOMES' ? '2px solid #1a73e8' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Income sources ({incomes.length})
        </button>
      </div>

      {/* WITHDRAWALS LIST */}
      {activeTab === 'WITHDRAWALS' && (
        <div>
          {withdrawals.length === 0 ? (
            <div style={{ padding: '32px 0', color: '#5f6368', fontSize: '14px' }}>
              No withdrawals recorded yet. Click <strong>"− Withdraw Money"</strong> when you want to take out money.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {withdrawals.map((item) => {
                const isEditing = editingAuditId === item.id;
                const isAchieved = item.status === 'achieved';

                return (
                  <div
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      padding: '18px 0'
                    }}
                  >
                    {/* Top line: Reason, Source, Date & Amount */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#202124', marginRight: '10px' }}>
                          {item.reason}
                        </span>
                        <span style={{ fontSize: '12px', color: '#5f6368', marginRight: '10px' }}>
                          From: {item.source}
                        </span>
                        <span style={{ fontSize: '12px', color: '#80868b' }}>
                          {item.date}
                        </span>
                      </div>

                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#d93025' }}>
                        -${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Stated Benefit & Expected Yield */}
                    <div style={{ fontSize: '13px', color: '#3c4043', marginTop: '6px' }}>
                      <span><strong>Benefit:</strong> {item.benefit}</span>
                      <span style={{ margin: '0 8px', color: '#80868b' }}>•</span>
                      <span><strong>Expected to yield:</strong> ${Number(item.expectedYield).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    {/* Accountability & Audit Space */}
                    <div style={{ marginTop: '12px', paddingLeft: '2px' }}>
                      {!isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={isAchieved}
                              onChange={() => handleStartAudit(item)}
                              style={{ width: '16px', height: '16px', accentColor: '#1a73e8', cursor: 'pointer' }}
                            />
                            <span style={{
                              fontSize: '13px',
                              fontWeight: 500,
                              color: isAchieved ? '#1e8e3e' : '#5f6368'
                            }}>
                              {isAchieved
                                ? '✓ Achieved what you said this money was for'
                                : 'Tick if you achieved what you said this money was for'}
                            </span>
                          </label>

                          <button
                            onClick={() => handleStartAudit(item)}
                            style={{ fontSize: '12px', color: '#1a73e8', fontWeight: 500 }}
                          >
                            {item.status === 'pending' ? 'Fill outcome' : 'Edit details'}
                          </button>
                        </div>
                      ) : (
                        /* Inline Audit Edit Form */
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '14px',
                          borderRadius: '4px',
                          marginTop: '8px'
                        }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', marginBottom: '10px' }}>
                            Did you achieve what you said the money was for?
                          </div>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                            <input
                              type="checkbox"
                              checked={auditAchieved}
                              onChange={(e) => setAuditAchieved(e.target.checked)}
                              style={{ width: '16px', height: '16px', accentColor: '#1a73e8', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '13px', color: '#202124' }}>
                              Yes, I achieved what I said the money was for ({item.reason})
                            </span>
                          </label>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div>
                              <label className="gsi-label">To what extent was it successful?</label>
                              <input
                                type="text"
                                placeholder="e.g. Ate the food, worked full shift without fatigue, met daily goal"
                                className="gsi-input"
                                value={successExtent}
                                onChange={(e) => setSuccessExtent(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="gsi-label">Actual money earned ($)</label>
                              <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                className="gsi-input"
                                value={actualYield}
                                onChange={(e) => setActualYield(e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setEditingAuditId(null)}
                              className="btn-gsi-outline"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveAudit(item.id)}
                              className="btn-gsi-primary"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display outcome if saved and not editing */}
                      {!isEditing && (item.successExtent || item.actualYield !== null) && (
                        <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '6px', paddingLeft: '24px' }}>
                          {item.actualYield !== null && (
                            <span style={{ color: '#1e8e3e', fontWeight: 600, marginRight: '8px' }}>
                              Earned: ${Number(item.actualYield).toLocaleString()}
                            </span>
                          )}
                          {item.successExtent && (
                            <span>Outcome: {item.successExtent}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* INCOMES LIST */}
      {activeTab === 'INCOMES' && (
        <div>
          {incomes.length === 0 ? (
            <div style={{ padding: '32px 0', color: '#5f6368', fontSize: '14px' }}>
              No income entries yet. Click <strong>"+ Add Income"</strong> to record an income stream.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {incomes.map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    padding: '14px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#202124', marginRight: '10px' }}>
                      {inc.source}
                    </span>
                    <span style={{ fontSize: '12px', color: '#80868b' }}>
                      {inc.date}
                    </span>
                    {inc.notes && (
                      <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '2px' }}>
                        {inc.notes}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e8e3e' }}>
                    +${Number(inc.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
