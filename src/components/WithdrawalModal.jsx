import React, { useState } from 'react';

export default function WithdrawalModal({ isOpen, onClose, ledger, onRecordWithdrawal }) {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [benefit, setBenefit] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Extract unique sources with balances
  const incomes = ledger.incomes || [];
  const withdrawals = ledger.withdrawals || [];

  const sourceMap = {};
  incomes.forEach((i) => {
    const s = i.source.trim();
    sourceMap[s] = (sourceMap[s] || 0) + Number(i.amount || 0);
  });
  withdrawals.forEach((w) => {
    const s = (w.source || 'General').trim();
    sourceMap[s] = (sourceMap[s] || 0) - Number(w.amount || 0);
  });

  const availableSources = Object.keys(sourceMap);
  const selectedSource = source || (availableSources.length > 0 ? availableSources[0] : 'General');
  const sourceBalance = sourceMap[selectedSource] !== undefined ? sourceMap[selectedSource] : 0;

  const numAmount = parseFloat(amount);
  const numYield = parseFloat(expectedYield);

  const hasEnteredNumbers = !isNaN(numAmount) && !isNaN(numYield);
  const isYieldBigger = hasEnteredNumbers && numYield > numAmount && numAmount > 0;
  const isInsufficient = hasEnteredNumbers && numAmount > sourceBalance;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please state the reason for this withdrawal.');
      return;
    }
    if (!benefit.trim()) {
      setError('Please state the benefit of this amount.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }
    if (isInsufficient) {
      setError(`Insufficient balance in ${selectedSource}. You only have $${sourceBalance.toLocaleString()} available.`);
      return;
    }
    if (!isYieldBigger) {
      setError('The money this amount will yield must be bigger than the amount itself.');
      return;
    }

    onRecordWithdrawal({
      id: 'wth_' + Date.now(),
      source: selectedSource,
      amount: numAmount,
      reason: reason.trim(),
      benefit: benefit.trim(),
      expectedYield: numYield,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      actualYield: null,
      successExtent: '',
      auditedAt: null
    });

    // Reset and close
    setAmount('');
    setReason('');
    setBenefit('');
    setExpectedYield('');
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
            Withdraw Money
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="gsi-label">Source of Income</label>
              <span style={{ fontSize: '12px', color: '#5f6368' }}>
                Available: ${sourceBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <select
              className="gsi-input"
              value={selectedSource}
              onChange={(e) => setSource(e.target.value)}
            >
              {availableSources.length === 0 && <option value="General">General</option>}
              {availableSources.map((s) => (
                <option key={s} value={s}>
                  {s} (${sourceMap[s].toLocaleString()} available)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="gsi-field">
              <label className="gsi-label">Amount to withdraw ($)</label>
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
              <label className="gsi-label">How much it will yield ($)</label>
              <input
                type="number"
                step="any"
                placeholder="Must be > withdrawal"
                className="gsi-input"
                value={expectedYield}
                onChange={(e) => setExpectedYield(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="gsi-field">
            <label className="gsi-label">Reason for the amount</label>
            <input
              type="text"
              placeholder="e.g. Food, cloth, book, equipment"
              className="gsi-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="gsi-field">
            <label className="gsi-label">Benefit of the amount</label>
            <textarea
              rows={2}
              placeholder="State the benefit this purchase will give you"
              className="gsi-input"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              required
            />
          </div>

          {/* Validation Status Notice */}
          <div style={{
            margin: '16px 0',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            {hasEnteredNumbers && !isYieldBigger ? (
              <div style={{
                color: '#d93025',
                backgroundColor: '#fdf2f2',
                padding: '10px 12px',
                borderRadius: '4px'
              }}>
                <strong>Cannot withdraw:</strong> The money this amount will yield (${numYield || 0}) must be bigger than the amount you want to withdraw (${numAmount || 0}). Even if it is food, write the amount you will earn because you ate that food; if it is cloth, write what wearing it will yield for you. If not, the system will not allow you to withdraw.
              </div>
            ) : hasEnteredNumbers && isYieldBigger ? (
              <div style={{
                color: '#1e8e3e',
                backgroundColor: '#edf7ed',
                padding: '10px 12px',
                borderRadius: '4px'
              }}>
                ✓ Approved: Projected yield (${numYield.toLocaleString()}) is bigger than withdrawal amount (${numAmount.toLocaleString()}).
              </div>
            ) : null}
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
            <button
              type="submit"
              className="btn-gsi-primary"
              disabled={!isYieldBigger || isInsufficient}
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
