import React from 'react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="gsi-modal-backdrop" onClick={onClose}>
      <div className="gsi-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#202124' }}>
            About GSI
          </h2>
          <button
            onClick={onClose}
            style={{ fontSize: '18px', color: '#5f6368', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontSize: '14px', color: '#3c4043', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '14px' }}>
            <strong>GSI</strong> stands for <strong>Get, Save, and Invest</strong>.
          </p>
          <p style={{ marginBottom: '14px' }}>
            It is a personal financial tracking platform built to help you track where every unit of money goes. 
            Before any money can be withdrawn, the system requires you to prove that the expense will yield more money than the amount taken out.
          </p>
          <p style={{ marginBottom: '14px' }}>
            Even for daily expenses like food or clothes, you must state what you will earn because of it. If the expected yield is not bigger than the withdrawal, the system blocks it.
          </p>
          <p style={{ color: '#5f6368', fontSize: '13px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
            Note: Real money is not deposited or withdrawn through this app. It is designed purely for you to keep account.
          </p>
        </div>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button onClick={onClose} className="btn-gsi-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
