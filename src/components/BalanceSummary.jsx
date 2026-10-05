import React from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, Target, Award } from 'lucide-react';

export default function BalanceSummary({ stats }) {
  const {
    totalIncome,
    totalWithdrawn,
    netBalance,
    totalProjectedYield,
    totalActualYield,
    totalWithdrawalsCount,
    auditedCount,
    achievedCount
  } = stats;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Net Available Balance */}
      <div className="google-card" style={{ borderLeft: '4px solid #1a73e8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Ledger Balance
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#e8f0fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a73e8'
          }}>
            <DollarSign size={18} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#202124' }}>
          ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
          Total unwithdrawn capital across all sources
        </div>
      </div>

      {/* Total Inflow */}
      <div className="google-card" style={{ borderLeft: '4px solid #1e8e3e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Inflow Recorded
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#e6f4ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e8e3e'
          }}>
            <ArrowUpRight size={18} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e8e3e' }}>
          ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
          Cumulative earnings deposited
        </div>
      </div>

      {/* Total Withdrawn */}
      <div className="google-card" style={{ borderLeft: '4px solid #d93025' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Authorized Withdrawals
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#fce8e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d93025'
          }}>
            <ArrowDownRight size={18} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#d93025' }}>
          ${totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
          {totalWithdrawalsCount} expense{totalWithdrawalsCount === 1 ? '' : 's'} passed strict yield gate
        </div>
      </div>

      {/* Accountability Success Rate */}
      <div className="google-card" style={{ borderLeft: '4px solid #f9ab00' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Actual Yield Generated
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#fef7e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b06000'
          }}>
            <Award size={18} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#b06000' }}>
          ${totalActualYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>
          {achievedCount} of {auditedCount} audited goals achieved ({totalWithdrawalsCount - auditedCount} pending audit)
        </div>
      </div>
    </div>
  );
}
