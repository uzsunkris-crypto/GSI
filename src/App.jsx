import React, { useState, useEffect } from 'react';
import {
  getCurrentSession,
  getUserLedger,
  saveUserLedger,
  calculateBalances,
  logoutUser
} from './storage';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import MainLedger from './components/MainLedger';
import AddIncomeModal from './components/AddIncomeModal';
import WithdrawalModal from './components/WithdrawalModal';
import AboutModal from './components/AboutModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentSession());
  const [ledger, setLedger] = useState(() => getUserLedger(getCurrentSession()));

  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const data = getUserLedger(currentUser);
      setLedger(data);
    }
  }, [currentUser]);

  const handleLoginSuccess = (phone) => {
    setCurrentUser(phone);
    const data = getUserLedger(phone);
    setLedger(data);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleAddIncome = (incomeItem) => {
    const updated = {
      ...ledger,
      incomes: [incomeItem, ...(ledger.incomes || [])]
    };
    setLedger(updated);
    saveUserLedger(currentUser, updated);
  };

  const handleRecordWithdrawal = (withdrawalItem) => {
    const updated = {
      ...ledger,
      withdrawals: [withdrawalItem, ...(ledger.withdrawals || [])]
    };
    setLedger(updated);
    saveUserLedger(currentUser, updated);
  };

  const handleUpdateWithdrawalAudit = (id, auditData) => {
    const updatedWithdrawals = (ledger.withdrawals || []).map((w) => {
      if (w.id === id) {
        return { ...w, ...auditData };
      }
      return w;
    });

    const updated = {
      ...ledger,
      withdrawals: updatedWithdrawals
    };
    setLedger(updated);
    saveUserLedger(currentUser, updated);
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const stats = calculateBalances(ledger);
  const existingSources = Array.from(
    new Set((ledger.incomes || []).map((i) => i.source.trim()))
  ).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar
        phoneNumber={currentUser}
        onLogout={handleLogout}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main style={{ flex: 1 }}>
        <MainLedger
          ledger={ledger}
          stats={stats}
          onOpenAddIncome={() => setIsAddIncomeOpen(true)}
          onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
          onUpdateWithdrawalAudit={handleUpdateWithdrawalAudit}
        />
      </main>

      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        existingSources={existingSources}
        onAddIncome={handleAddIncome}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        ledger={ledger}
        onRecordWithdrawal={handleRecordWithdrawal}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
