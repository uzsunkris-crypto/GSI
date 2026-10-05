// YieldLedger - Storage & Business Logic Core

const USERS_KEY = 'gsi_users';
const CURRENT_USER_KEY = 'gsi_current_session';

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load users', e);
    return {};
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getCurrentSession() {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch (e) {
    return null;
  }
}

export function setCurrentSession(phoneNumber) {
  if (phoneNumber) {
    localStorage.setItem(CURRENT_USER_KEY, phoneNumber);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function signupUser(phoneNumber, password) {
  const cleanPhone = phoneNumber.trim().replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.length < 4) {
    return { success: false, message: 'Please enter a valid phone number (at least 4 digits).' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long.' };
  }

  const users = getUsers();
  if (users[cleanPhone]) {
    return { success: false, message: 'An account with this phone number already exists. Please sign in.' };
  }

  users[cleanPhone] = {
    phoneNumber: cleanPhone,
    password: password, // client-side simulation
    createdAt: new Date().toISOString()
  };
  saveUsers(users);

  // Initialize empty ledger for this user
  initUserData(cleanPhone);
  setCurrentSession(cleanPhone);
  return { success: true, user: users[cleanPhone] };
}

export function loginUser(phoneNumber, password) {
  const cleanPhone = phoneNumber.trim().replace(/[^0-9+]/g, '');
  if (!cleanPhone) {
    return { success: false, message: 'Please enter your phone number.' };
  }
  const users = getUsers();
  const user = users[cleanPhone];
  if (!user) {
    return { success: false, message: 'No account found with this phone number. Please sign up first.' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  setCurrentSession(cleanPhone);
  return { success: true, user };
}

export function logoutUser() {
  setCurrentSession(null);
}

// User-specific data
function getDataKey(phone) {
  return `gsi_ledger_${phone}`;
}

export function initUserData(phone) {
  const key = getDataKey(phone);
  if (!localStorage.getItem(key)) {
    const initialData = {
      incomes: [
        {
          id: 'inc_sample_1',
          source: 'Monthly Salary',
          amount: 3500,
          date: new Date().toISOString().split('T')[0],
          notes: 'Primary employment earnings'
        }
      ],
      withdrawals: [
        {
          id: 'wth_sample_1',
          source: 'Monthly Salary',
          amount: 25,
          reason: 'Nutritious High-Protein Meal & Coffee',
          benefit: 'Maintains mental clarity and physical energy for 6 billable client hours',
          expectedYield: 240,
          date: new Date().toISOString().split('T')[0],
          status: 'achieved',
          actualYield: 250,
          successExtent: 'Completed all 6 billable hours smoothly without fatigue. Billed client $250.',
          auditedAt: new Date().toISOString()
        }
      ]
    };
    localStorage.setItem(key, JSON.stringify(initialData));
  }
}

export function getUserLedger(phone) {
  if (!phone) return { incomes: [], withdrawals: [] };
  const key = getDataKey(phone);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      initUserData(phone);
      return JSON.parse(localStorage.getItem(key));
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse ledger', e);
    return { incomes: [], withdrawals: [] };
  }
}

export function saveUserLedger(phone, data) {
  if (!phone) return;
  const key = getDataKey(phone);
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save ledger', e);
  }
}

// Calculations
export function calculateBalances(ledger) {
  const incomes = ledger.incomes || [];
  const withdrawals = ledger.withdrawals || [];

  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalWithdrawn = withdrawals.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const netBalance = totalIncome - totalWithdrawn;

  // Breakdown by source
  const sourceBalances = {};
  incomes.forEach((inc) => {
    const src = inc.source.trim();
    if (!sourceBalances[src]) {
      sourceBalances[src] = { earned: 0, withdrawn: 0, balance: 0 };
    }
    sourceBalances[src].earned += Number(inc.amount || 0);
  });

  withdrawals.forEach((wth) => {
    const src = (wth.source || 'General').trim();
    if (!sourceBalances[src]) {
      sourceBalances[src] = { earned: 0, withdrawn: 0, balance: 0 };
    }
    sourceBalances[src].withdrawn += Number(wth.amount || 0);
  });

  Object.keys(sourceBalances).forEach((src) => {
    sourceBalances[src].balance = sourceBalances[src].earned - sourceBalances[src].withdrawn;
  });

  // Total projected yield and actual yield from audited items
  const totalProjectedYield = withdrawals.reduce((sum, item) => sum + Number(item.expectedYield || 0), 0);
  const totalActualYield = withdrawals.reduce((sum, item) => {
    return sum + (item.actualYield !== null && item.actualYield !== undefined ? Number(item.actualYield) : 0);
  }, 0);

  const auditedCount = withdrawals.filter((w) => w.status !== 'pending').length;
  const achievedCount = withdrawals.filter((w) => w.status === 'achieved').length;

  return {
    totalIncome,
    totalWithdrawn,
    netBalance,
    sourceBalances,
    totalProjectedYield,
    totalActualYield,
    totalWithdrawalsCount: withdrawals.length,
    auditedCount,
    achievedCount
  };
}

// Strict Gatekeeper Rule Verification
export function validateWithdrawalRule(amount, expectedYield, availableBalance) {
  const numAmount = parseFloat(amount);
  const numYield = parseFloat(expectedYield);

  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      allowed: false,
      reason: 'Please enter a valid withdrawal amount greater than 0.'
    };
  }

  if (availableBalance !== undefined && numAmount > availableBalance) {
    return {
      allowed: false,
      reason: `Insufficient balance! You requested $${numAmount.toLocaleString()}, but only $${Math.max(0, availableBalance).toLocaleString()} is available in this source.`
    };
  }

  if (isNaN(numYield)) {
    return {
      allowed: false,
      reason: 'You must specify how much money this withdrawal will yield for you.'
    };
  }

  // The Core Gatekeeper Law:
  // Expected Yield MUST BE STRICTLY BIGGER than Amount!
  if (numYield <= numAmount) {
    return {
      allowed: false,
      reason: `Withdrawal Denied: Expected yield ($${numYield.toLocaleString()}) must be strictly greater than the withdrawal amount ($${numAmount.toLocaleString()}). Every expense must produce a net positive financial return.`
    };
  }

  const netYield = numYield - numAmount;
  return {
    allowed: true,
    netYield: netYield,
    message: `Qualified: This withdrawal projects a net gain of +$${netYield.toLocaleString()}.`
  };
}
