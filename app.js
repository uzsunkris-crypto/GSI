// GSI - Pure JavaScript Application Logic

// 20 Popular Currencies with Symbols (including Naira, Dollar, and top 5 Crypto)
const CURRENCIES = {
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CHF: { symbol: 'CHF ', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  ZAR: { symbol: 'R ', name: 'South African Rand' },
  GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi' },
  KES: { symbol: 'KSh ', name: 'Kenyan Shilling' },
  AED: { symbol: 'AED ', name: 'UAE Dirham' },
  SAR: { symbol: 'SAR ', name: 'Saudi Riyal' },
  BTC: { symbol: '₿', name: 'Bitcoin' },
  ETH: { symbol: 'Ξ', name: 'Ethereum' },
  USDT: { symbol: '₮', name: 'Tether' },
  BNB: { symbol: 'BNB ', name: 'Binance Coin' },
  SOL: { symbol: 'SOL ', name: 'Solana' }
};

// Global App State
let currentUser = null;
let currentCurrency = 'NGN';
let ledgerData = {
  incomes: [],
  withdrawals: [],
  jobs: [],
  assets: [],
  savings: []
};
let activeTab = 'WITHDRAWALS';
let editingAuditId = null;

// --- DOM ELEMENTS ---
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const authForm = document.getElementById('auth-form');
const authPhoneInput = document.getElementById('auth-phone');
const authPasswordInput = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authToggleBtn = document.getElementById('auth-toggle-btn');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmitBtn = document.getElementById('auth-submit-btn');

const userDisplayPhone = document.getElementById('user-display-phone');
const currencySelect = document.getElementById('currency-select');
const logoutBtn = document.getElementById('logout-btn');
const openAboutBtn = document.getElementById('open-about-btn');

const balanceAmountEl = document.getElementById('balance-amount');
const totalIncomeEl = document.getElementById('total-income');
const totalWithdrawnEl = document.getElementById('total-withdrawn');
const withdrawalsCountEl = document.getElementById('withdrawals-count');
const incomesCountEl = document.getElementById('incomes-count');
const jobsCountEl = document.getElementById('jobs-count');
const assetsCountEl = document.getElementById('assets-count');
const savingsCountEl = document.getElementById('savings-count');

// Sidebar Elements
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const appSidebar = document.getElementById('app-sidebar');

const tabContentWithdrawals = document.getElementById('tab-content-withdrawals');
const tabContentIncomes = document.getElementById('tab-content-incomes');
const tabContentJobs = document.getElementById('tab-content-jobs');
const tabContentAssets = document.getElementById('tab-content-assets');
const tabContentSavings = document.getElementById('tab-content-savings');

const withdrawalsListEl = document.getElementById('withdrawals-list');
const incomesListEl = document.getElementById('incomes-list');
const jobsListEl = document.getElementById('jobs-list');
const assetsListEl = document.getElementById('assets-list');
const savingsListEl = document.getElementById('savings-list');

// Modals
const modalAddIncome = document.getElementById('modal-add-income');
const modalWithdraw = document.getElementById('modal-withdraw');
const modalAbout = document.getElementById('modal-about');
const modalAddJob = document.getElementById('modal-add-job');
const modalAddJobExpense = document.getElementById('modal-add-job-expense');
const modalAddAsset = document.getElementById('modal-add-asset');
const modalAddAssetEarning = document.getElementById('modal-add-asset-earning');
const modalAddSaving = document.getElementById('modal-add-saving');
const modalDepositSaving = document.getElementById('modal-deposit-saving');
const modalDeductSaving = document.getElementById('modal-deduct-saving');

// Trigger Buttons
const btnOpenAddIncome = document.getElementById('btn-open-add-income');
const btnOpenWithdraw = document.getElementById('btn-open-withdraw');
const btnOpenAddJob = document.getElementById('btn-open-add-job');
const btnOpenAddAsset = document.getElementById('btn-open-add-asset');
const btnOpenAddSaving = document.getElementById('btn-open-add-saving');

// Income & Withdraw Form Elements
const formAddIncome = document.getElementById('form-add-income');
const incomeSourceSelect = document.getElementById('income-source-select');
const customSourceGroup = document.getElementById('custom-source-group');
const incomeCustomSource = document.getElementById('income-custom-source');
const incomeAmount = document.getElementById('income-amount');
const incomeDate = document.getElementById('income-date');
const incomeNotes = document.getElementById('income-notes');
const addIncomeError = document.getElementById('add-income-error');

const formWithdraw = document.getElementById('form-withdraw');
const withdrawSourceSelect = document.getElementById('withdraw-source-select');
const withdrawSourceAvail = document.getElementById('withdraw-source-avail');
const withdrawAmount = document.getElementById('withdraw-amount');
const withdrawYield = document.getElementById('withdraw-yield');
const withdrawReason = document.getElementById('withdraw-reason');
const withdrawBenefit = document.getElementById('withdraw-benefit');
const withdrawError = document.getElementById('withdraw-error');
const gatekeeperMsg = document.getElementById('gatekeeper-msg');
const btnSubmitWithdraw = document.getElementById('btn-submit-withdraw');

// Job Form Elements
const formAddJob = document.getElementById('form-add-job');
const jobTitleInput = document.getElementById('job-title-input');
const jobAmountInput = document.getElementById('job-amount-input');
const jobTimeframeInput = document.getElementById('job-timeframe-input');
const jobError = document.getElementById('job-error');

const formAddJobExpense = document.getElementById('form-add-job-expense');
const jobExpenseJobId = document.getElementById('job-expense-job-id');
const jobExpenseName = document.getElementById('job-expense-name');
const jobExpenseAmount = document.getElementById('job-expense-amount');
const jobExpenseError = document.getElementById('job-expense-error');

// Asset Form Elements
const formAddAsset = document.getElementById('form-add-asset');
const assetNameInput = document.getElementById('asset-name-input');
const assetCostInput = document.getElementById('asset-cost-input');
const assetPurposeInput = document.getElementById('asset-purpose-input');
const assetError = document.getElementById('asset-error');

const formAddAssetEarning = document.getElementById('form-add-asset-earning');
const assetEarningAssetId = document.getElementById('asset-earning-asset-id');
const assetEarningAmount = document.getElementById('asset-earning-amount');
const assetEarningDate = document.getElementById('asset-earning-date');
const assetEarningDesc = document.getElementById('asset-earning-desc');
const assetEarningError = document.getElementById('asset-earning-error');

// Savings Form Elements
const formAddSaving = document.getElementById('form-add-saving');
const savingTitleInput = document.getElementById('saving-title-input');
const savingTargetInput = document.getElementById('saving-target-input');
const savingError = document.getElementById('saving-error');

const formDepositSaving = document.getElementById('form-deposit-saving');
const depositSavingId = document.getElementById('deposit-saving-id');
const depositSavingAmount = document.getElementById('deposit-saving-amount');
const depositSavingSource = document.getElementById('deposit-saving-source');
const depositSavingError = document.getElementById('deposit-saving-error');

const formDeductSaving = document.getElementById('form-deduct-saving');
const deductSavingId = document.getElementById('deduct-saving-id');
const deductSavingAmount = document.getElementById('deduct-saving-amount');
const deductSavingReason = document.getElementById('deduct-saving-reason');
const deductSavingError = document.getElementById('deduct-saving-error');

// Auth Mode
let isSignupMode = false;

// --- INITIALIZATION ---
function init() {
  const isConfined = localStorage.getItem('gsi_sidebar_confined') === 'true';
  if (appSidebar && isConfined) {
    appSidebar.classList.add('confined');
  }

  currentUser = localStorage.getItem('gsi_session_user');
  if (currentUser) {
    currentCurrency = localStorage.getItem('gsi_currency_' + currentUser) || 'NGN';
    currencySelect.value = currentCurrency;
    loadUserData();
    showApp();
  } else {
    showAuth();
  }

  setupEventListeners();
}

function getCurrencySymbol() {
  return (CURRENCIES[currentCurrency] || CURRENCIES.NGN).symbol;
}

function formatMoney(num) {
  const symbol = getCurrencySymbol();
  const val = Number(num || 0);
  const isCrypto = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'].includes(currentCurrency);
  return symbol + val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: isCrypto ? 6 : 2
  });
}

function updateCurrencySymbolsInDOM() {
  const symbol = getCurrencySymbol();
  document.querySelectorAll('.currency-symbol').forEach(el => {
    el.textContent = symbol;
  });
}

// --- DATA ACCESS ---
function loadUserData() {
  const key = 'gsi_data_' + currentUser;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      ledgerData = JSON.parse(raw);
    } catch (e) {
      ledgerData = {};
    }
  } else {
    ledgerData = {};
  }

  // Ensure default structures
  ledgerData.incomes = ledgerData.incomes || [
    {
      id: 'inc_' + Date.now(),
      source: 'Primary Income',
      amount: 500000,
      date: new Date().toISOString().split('T')[0],
      notes: 'Initial deposit'
    }
  ];
  ledgerData.withdrawals = ledgerData.withdrawals || [];
  ledgerData.jobs = ledgerData.jobs || [
    {
      id: 'job_sample_1',
      title: 'Full-Time Office Employment',
      expectedAmount: 350000,
      timeframe: '1 Month',
      expenses: [
        { id: 'exp_1', name: 'Bus transport & fuel', amount: 55000 },
        { id: 'exp_2', name: 'Work shift lunches', amount: 35000 },
        { id: 'exp_3', name: 'Work clothing maintenance', amount: 15000 },
        { id: 'exp_4', name: 'Internet & mobile data', amount: 20000 }
      ]
    }
  ];
  ledgerData.assets = ledgerData.assets || [
    {
      id: 'ast_sample_1',
      name: 'MacBook Laptop',
      cost: 450000,
      purpose: 'Freelance programming and client design projects',
      earnings: [
        { id: 'ern_1', amount: 150000, date: new Date().toISOString().split('T')[0], desc: 'Client website redesign' },
        { id: 'ern_2', amount: 350000, date: new Date().toISOString().split('T')[0], desc: 'Mobile app development' }
      ]
    }
  ];
  ledgerData.savings = ledgerData.savings || [
    {
      id: 'svg_sample_1',
      title: 'Emergency Reserve Fund',
      targetAmount: 500000,
      deposits: [
        { id: 'dep_1', amount: 150000, source: 'Primary Income', date: new Date().toISOString().split('T')[0] }
      ],
      deductions: []
    }
  ];

  saveUserData();
}

function saveUserData() {
  if (!currentUser) return;
  localStorage.setItem('gsi_data_' + currentUser, JSON.stringify(ledgerData));
}

// --- BALANCES & STATS ---
function computeStats() {
  const incomes = ledgerData.incomes || [];
  const withdrawals = ledgerData.withdrawals || [];

  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalWithdrawn = withdrawals.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const netBalance = totalIncome - totalWithdrawn;

  // Breakdown by source
  const sourceBalances = {};
  incomes.forEach(inc => {
    const s = (inc.source || 'General').trim();
    sourceBalances[s] = (sourceBalances[s] || 0) + Number(inc.amount || 0);
  });

  withdrawals.forEach(wth => {
    const s = (wth.source || 'General').trim();
    sourceBalances[s] = (sourceBalances[s] || 0) - Number(wth.amount || 0);
  });

  return {
    totalIncome,
    totalWithdrawn,
    netBalance,
    sourceBalances
  };
}

// --- RENDER ALL SECTIONS ---
function render() {
  updateCurrencySymbolsInDOM();

  const stats = computeStats();

  balanceAmountEl.textContent = formatMoney(stats.netBalance);
  totalIncomeEl.textContent = '+' + formatMoney(stats.totalIncome);
  totalWithdrawnEl.textContent = '-' + formatMoney(stats.totalWithdrawn);

  withdrawalsCountEl.textContent = (ledgerData.withdrawals || []).length;
  incomesCountEl.textContent = (ledgerData.incomes || []).length;
  jobsCountEl.textContent = (ledgerData.jobs || []).length;
  assetsCountEl.textContent = (ledgerData.assets || []).length;
  savingsCountEl.textContent = (ledgerData.savings || []).length;

  userDisplayPhone.textContent = currentUser;

  renderWithdrawalsList();
  renderIncomesList();
  renderJobsList();
  renderAssetsList();
  renderSavingsList();
}

// 1. RENDER WITHDRAWALS
function renderWithdrawalsList() {
  const withdrawals = ledgerData.withdrawals || [];

  if (withdrawals.length === 0) {
    withdrawalsListEl.innerHTML = `
      <div style="padding: 32px 0; color: #5f6368; font-size: 14px;">
        No withdrawals recorded yet. Click <strong>"− Withdraw Money"</strong> when you want to take out money.
      </div>
    `;
    return;
  }

  let html = '';
  withdrawals.forEach(item => {
    const isEditing = editingAuditId === item.id;
    const isAchieved = item.status === 'achieved';

    html += `
      <div class="list-item" data-id="${item.id}">
        <div class="item-top-row">
          <div>
            <span class="item-title">${escapeHtml(item.reason)}</span>
            <span class="item-meta">From: ${escapeHtml(item.source)}</span>
            <span class="item-date">${item.date}</span>
          </div>
          <div class="item-amount-out">
            -${formatMoney(item.amount)}
          </div>
        </div>

        <div class="item-details">
          <span><strong>Benefit:</strong> ${escapeHtml(item.benefit)}</span>
          <span class="item-dot">•</span>
          <span><strong>Expected to yield:</strong> ${formatMoney(item.expectedYield)}</span>
        </div>

        <div class="audit-inline-container">
          ${!isEditing ? `
            <div class="audit-view-row">
              <label class="audit-checkbox-label">
                <input
                  type="checkbox"
                  class="audit-checkbox"
                  ${isAchieved ? 'checked' : ''}
                  onchange="startEditingAudit('${item.id}', this.checked)"
                >
                <span style="color: ${isAchieved ? '#1e8e3e' : '#5f6368'};">
                  ${isAchieved ? '✓ Achieved what you said this money was for' : 'Tick if you achieved what you said this money was for'}
                </span>
              </label>

              <button
                type="button"
                class="audit-edit-trigger"
                onclick="startEditingAudit('${item.id}', ${isAchieved})"
              >
                ${item.status === 'pending' ? 'Fill outcome' : 'Edit details'}
              </button>
            </div>

            ${(item.successExtent || (item.actualYield !== null && item.actualYield !== undefined)) ? `
              <div class="audit-outcome-text">
                ${item.actualYield !== null && item.actualYield !== undefined ? `
                  <span style="color: #1e8e3e; font-weight: 600; margin-right: 8px;">
                    Earned: ${formatMoney(item.actualYield)}
                  </span>
                ` : ''}
                ${item.successExtent ? `<span>Outcome: ${escapeHtml(item.successExtent)}</span>` : ''}
              </div>
            ` : ''}
          ` : `
            <div class="audit-edit-panel">
              <div style="font-size: 13px; font-weight: 600; color: #202124; margin-bottom: 10px;">
                Did you achieve what you said the money was for?
              </div>

              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 12px;">
                <input
                  type="checkbox"
                  id="edit-audit-achieved-${item.id}"
                  ${isAchieved ? 'checked' : ''}
                  style="width: 16px; height: 16px; accent-color: #1a73e8; cursor: pointer;"
                >
                <span style="font-size: 13px; color: #202124;">
                  Yes, I achieved what I said the money was for (${escapeHtml(item.reason)})
                </span>
              </label>

              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                  <label class="form-field-label">To what extent was it successful?</label>
                  <input
                    type="text"
                    id="edit-audit-extent-${item.id}"
                    placeholder="e.g. Completed work without fatigue, billed client successfully"
                    class="form-input"
                    value="${escapeHtml(item.successExtent || '')}"
                  >
                </div>
                <div>
                  <label class="form-field-label">Actual money earned (${getCurrencySymbol()})</label>
                  <input
                    type="number"
                    step="any"
                    id="edit-audit-yield-${item.id}"
                    placeholder="0.00"
                    class="form-input"
                    value="${item.actualYield !== null && item.actualYield !== undefined ? item.actualYield : ''}"
                  >
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button type="button" class="btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="cancelEditingAudit()">
                  Cancel
                </button>
                <button type="button" class="btn-primary" style="padding: 6px 14px; font-size: 12px;" onclick="saveEditingAudit('${item.id}')">
                  Save
                </button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  });

  withdrawalsListEl.innerHTML = html;
}

// 2. RENDER INCOMES
function renderIncomesList() {
  const incomes = ledgerData.incomes || [];

  if (incomes.length === 0) {
    incomesListEl.innerHTML = `
      <div style="padding: 32px 0; color: #5f6368; font-size: 14px;">
        No income entries yet. Click <strong>"+ Add Income"</strong> to record an income stream.
      </div>
    `;
    return;
  }

  let html = '';
  incomes.forEach(inc => {
    html += `
      <div class="list-item" style="display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <span class="item-title">${escapeHtml(inc.source)}</span>
          <span class="item-date">${inc.date}</span>
          ${inc.notes ? `<div style="font-size: 12px; color: #5f6368; margin-top: 2px;">${escapeHtml(inc.notes)}</div>` : ''}
        </div>
        <div class="item-amount-in">
          +${formatMoney(inc.amount)}
        </div>
      </div>
    `;
  });

  incomesListEl.innerHTML = html;
}

// 3. RENDER JOBS & SALARIES (LOSS TRACKER)
function renderJobsList() {
  const jobs = ledgerData.jobs || [];

  if (jobs.length === 0) {
    jobsListEl.innerHTML = `
      <div style="padding: 32px 0; color: #5f6368; font-size: 14px;">
        No jobs or expected earnings tracked yet. Click <strong>"+ Track New Job / Salary"</strong> to see if your work expenses are causing you to run at a loss.
      </div>
    `;
    return;
  }

  let html = '';
  jobs.forEach(job => {
    const expenses = job.expenses || [];
    const totalExp = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const netTakeHome = Number(job.expectedAmount || 0) - totalExp;
    const isLoss = netTakeHome < 0;
    const isBreakEven = netTakeHome === 0;
    const percent = job.expectedAmount > 0 ? ((netTakeHome / job.expectedAmount) * 100).toFixed(1) : 0;

    html += `
      <div class="list-item">
        <div class="item-top-row">
          <div>
            <span class="item-title">${escapeHtml(job.title)}</span>
            <span class="item-meta">Timeframe: ${escapeHtml(job.timeframe)}</span>
            ${isLoss ? `
              <span class="badge-loss">Running at a Loss (${percent}%)</span>
            ` : isBreakEven ? `
              <span class="badge-neutral">Breakeven (0%)</span>
            ` : `
              <span class="badge-profit">Profitable (+${percent}% retained)</span>
            `}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 700; color: ${isLoss ? '#d93025' : '#1e8e3e'};">
              Real Take-Home: ${formatMoney(netTakeHome)}
            </div>
            <div style="font-size: 12px; color: #5f6368;">
              Expected: ${formatMoney(job.expectedAmount)} • Expenses: -${formatMoney(totalExp)}
            </div>
          </div>
        </div>

        <!-- Work Expenses Sub-list -->
        <div style="margin-top: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 600; color: #3c4043;">
              Direct Work Expenses (${expenses.length}):
            </span>
            <button
              type="button"
              class="nav-link-btn"
              style="color: #1a73e8; font-size: 12px;"
              onclick="openAddJobExpenseModal('${job.id}')"
            >
              + Add Expense (Transport, Food, Clothes, Data, Bills)
            </button>
          </div>

          <div class="nested-entries-list">
            ${expenses.length === 0 ? `
              <div style="font-size: 12px; color: #80868b; padding: 4px 0;">
                No direct expenses logged yet. Add your transport, food, clothes, data, or bills for this job.
              </div>
            ` : expenses.map(exp => `
              <div class="nested-entry-row">
                <span>• ${escapeHtml(exp.name)}</span>
                <span>
                  <strong style="color: #d93025;">-${formatMoney(exp.amount)}</strong>
                  <button
                    type="button"
                    style="color: #80868b; margin-left: 8px; font-size: 11px;"
                    onclick="deleteJobExpense('${job.id}', '${exp.id}')"
                    title="Remove expense"
                  >✕</button>
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 12px; text-align: right;">
          <button
            type="button"
            style="color: #80868b; font-size: 11px;"
            onclick="deleteJob('${job.id}')"
          >
            Remove this job tracker
          </button>
        </div>
      </div>
    `;
  });

  jobsListEl.innerHTML = html;
}

// 4. RENDER ASSET PRODUCTIVITY TRACKER
function renderAssetsList() {
  const assets = ledgerData.assets || [];

  if (assets.length === 0) {
    assetsListEl.innerHTML = `
      <div style="padding: 32px 0; color: #5f6368; font-size: 14px;">
        No assets registered yet. Click <strong>"+ Register Asset"</strong> to track your laptop, car, book, phone, or equipment productivity.
      </div>
    `;
    return;
  }

  let html = '';
  assets.forEach(ast => {
    const earnings = ast.earnings || [];
    const totalMade = earnings.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const netReturn = totalMade - Number(ast.cost || 0);
    const hasPaid = totalMade >= Number(ast.cost || 0);
    const recoveryRate = ast.cost > 0 ? ((totalMade / ast.cost) * 100).toFixed(1) : 0;

    html += `
      <div class="list-item">
        <div class="item-top-row">
          <div>
            <span class="item-title">${escapeHtml(ast.name)}</span>
            <span class="item-meta">Bought for: ${formatMoney(ast.cost)}</span>
            ${hasPaid ? `
              <span class="badge-profit">Paid For Itself (${recoveryRate}% Productivity)</span>
            ` : `
              <span class="badge-neutral">Recovered: ${recoveryRate}%</span>
            `}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 700; color: #1e8e3e;">
              Total Made: +${formatMoney(totalMade)}
            </div>
            <div style="font-size: 12px; color: ${netReturn >= 0 ? '#1e8e3e' : '#5f6368'};">
              ${netReturn >= 0 ? `Net Profit: +${formatMoney(netReturn)}` : `To Breakeven: ${formatMoney(Math.abs(netReturn))}`}
            </div>
          </div>
        </div>

        <div class="item-details">
          <strong>Purpose:</strong> ${escapeHtml(ast.purpose)}
        </div>

        <!-- Earnings Log -->
        <div style="margin-top: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 600; color: #3c4043;">
              Earnings History (${earnings.length} entries):
            </span>
            <button
              type="button"
              class="nav-link-btn"
              style="color: #1a73e8; font-size: 12px;"
              onclick="openAddAssetEarningModal('${ast.id}')"
            >
              + Log New Earning From This Asset
            </button>
          </div>

          <div class="nested-entries-list">
            ${earnings.length === 0 ? `
              <div style="font-size: 12px; color: #80868b; padding: 4px 0;">
                No earnings logged yet. Whenever this asset earns you money, log it here.
              </div>
            ` : earnings.map(ern => `
              <div class="nested-entry-row">
                <span>${ern.date} • ${escapeHtml(ern.desc)}</span>
                <span>
                  <strong style="color: #1e8e3e;">+${formatMoney(ern.amount)}</strong>
                  <button
                    type="button"
                    style="color: #80868b; margin-left: 8px; font-size: 11px;"
                    onclick="deleteAssetEarning('${ast.id}', '${ern.id}')"
                    title="Remove entry"
                  >✕</button>
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 12px; text-align: right;">
          <button
            type="button"
            style="color: #80868b; font-size: 11px;"
            onclick="deleteAsset('${ast.id}')"
          >
            Remove asset
          </button>
        </div>
      </div>
    `;
  });

  assetsListEl.innerHTML = html;
}

// 5. RENDER TARGET SAVINGS GOALS (WITH SAD APP REACTION)
function renderSavingsList() {
  const savings = ledgerData.savings || [];

  if (savings.length === 0) {
    savingsListEl.innerHTML = `
      <div style="padding: 32px 0; color: #5f6368; font-size: 14px;">
        No savings targets set yet. Click <strong>"+ New Savings Target"</strong> to state what you want to buy and start saving for it.
      </div>
    `;
    return;
  }

  let html = '';
  savings.forEach(svg => {
    const deposits = svg.deposits || [];
    const deductions = svg.deductions || [];

    const totalDep = deposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const totalDed = deductions.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const currentSaved = Math.max(0, totalDep - totalDed);
    const target = Number(svg.targetAmount || 0);
    const percent = Math.min(100, target > 0 ? ((currentSaved / target) * 100).toFixed(1) : 0);
    const isCompleted = currentSaved >= target && target > 0;

    html += `
      <div class="list-item">
        <div class="item-top-row">
          <div>
            <span class="item-title">${escapeHtml(svg.title)}</span>
            <span class="item-meta">Target Goal: ${formatMoney(target)}</span>
            ${isCompleted ? `<span class="badge-profit">Goal Achieved!</span>` : `<span class="badge-neutral">${percent}% reached</span>`}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 700; color: #1a73e8;">
              ${formatMoney(currentSaved)}
            </div>
            <div style="font-size: 12px; color: #5f6368;">
              saved of ${formatMoney(target)}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar-container">
          <div class="progress-bar-fill ${isCompleted ? 'success' : ''}" style="width: ${percent}%;"></div>
        </div>

        <!-- Savings Actions -->
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button
            type="button"
            class="btn-primary"
            style="font-size: 12px; padding: 5px 14px;"
            onclick="openDepositSavingModal('${svg.id}')"
          >
            + Add to Savings
          </button>
          <button
            type="button"
            class="btn-withdraw"
            style="font-size: 12px; padding: 5px 14px; display: inline-flex; align-items: center; gap: 6px;"
            onclick="openDeductSavingModal('${svg.id}')"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <span>Deduct Money (Sad App)</span>
          </button>
        </div>

        <!-- Deductions / Regret History -->
        ${deductions.length > 0 ? `
          <div style="margin-top: 14px; background-color: #fafbfc; border-radius: 4px; padding: 10px 14px; border: 1px solid #e9ecef;">
            <div style="font-size: 12px; font-weight: 600; color: #495057; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <span>Deduction History (Times your discipline slipped):</span>
            </div>
            ${deductions.map(ded => `
              <div class="deduction-history-item">
                <span>${ded.date} • Reason: <em>${escapeHtml(ded.reason)}</em></span>
                <span style="color: #d93025; font-weight: 600;">-${formatMoney(ded.amount)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="margin-top: 10px; text-align: right;">
          <button
            type="button"
            style="color: #80868b; font-size: 11px;"
            onclick="deleteSavingGoal('${svg.id}')"
          >
            Remove goal
          </button>
        </div>
      </div>
    `;
  });

  savingsListEl.innerHTML = html;
}

// --- AUDIT INLINE ACTIONS ---
window.startEditingAudit = function(id, isChecked) {
  editingAuditId = id;
  renderWithdrawalsList();
  const checkbox = document.getElementById(`edit-audit-achieved-${id}`);
  if (checkbox) {
    checkbox.checked = isChecked;
  }
};

window.cancelEditingAudit = function() {
  editingAuditId = null;
  renderWithdrawalsList();
};

window.saveEditingAudit = function(id) {
  const checkbox = document.getElementById(`edit-audit-achieved-${id}`);
  const extentInput = document.getElementById(`edit-audit-extent-${id}`);
  const yieldInput = document.getElementById(`edit-audit-yield-${id}`);

  const isAchieved = checkbox ? checkbox.checked : false;
  const extent = extentInput ? extentInput.value.trim() : '';
  const actualYieldVal = yieldInput && yieldInput.value.trim() !== '' ? parseFloat(yieldInput.value) : null;

  const item = (ledgerData.withdrawals || []).find(w => w.id === id);
  if (item) {
    item.status = isAchieved ? 'achieved' : (actualYieldVal !== null || extent ? 'failed' : 'pending');
    item.actualYield = actualYieldVal;
    item.successExtent = extent;
    item.auditedAt = new Date().toISOString();

    saveUserData();
  }

  editingAuditId = null;
  render();
};

// --- AUTH ACTIONS ---
function showAuth() {
  authView.style.display = 'flex';
  appView.style.display = 'none';
  authError.style.display = 'none';
}

function showApp() {
  authView.style.display = 'none';
  appView.style.display = 'block';
  render();
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('gsi_users')) || {};
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem('gsi_users', JSON.stringify(users));
}

// --- SETUP ALL EVENT LISTENERS ---
function setupEventListeners() {
  // Toggle Auth Sign in / Sign up
  authToggleBtn.addEventListener('click', () => {
    isSignupMode = !isSignupMode;
    authError.style.display = 'none';
    if (isSignupMode) {
      authSubtitle.textContent = 'Create an account to keep records';
      authSubmitBtn.textContent = 'Sign up';
      authToggleBtn.textContent = 'Already have an account? Sign in';
    } else {
      authSubtitle.textContent = 'Sign in to your account';
      authSubmitBtn.textContent = 'Sign in';
      authToggleBtn.textContent = 'Create account';
    }
  });

  // Auth Form Submit
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = authPhoneInput.value.trim().replace(/[^0-9+]/g, '');
    const password = authPasswordInput.value;

    if (!phone || phone.length < 4) {
      showAuthError('Please enter a valid phone number (at least 4 digits).');
      return;
    }
    if (!password || password.length < 4) {
      showAuthError('Password must be at least 4 characters long.');
      return;
    }

    const users = getUsers();

    if (isSignupMode) {
      if (users[phone]) {
        showAuthError('An account with this phone number already exists. Please sign in.');
        return;
      }
      users[phone] = { phone, password, createdAt: new Date().toISOString() };
      saveUsers(users);
      currentUser = phone;
      localStorage.setItem('gsi_session_user', phone);
      currentCurrency = 'NGN';
      currencySelect.value = currentCurrency;
      loadUserData();
      showApp();
    } else {
      const user = users[phone];
      if (!user) {
        showAuthError('No account found with this phone number. Please create an account.');
        return;
      }
      if (user.password !== password) {
        showAuthError('Incorrect password. Please try again.');
        return;
      }
      currentUser = phone;
      localStorage.setItem('gsi_session_user', phone);
      currentCurrency = localStorage.getItem('gsi_currency_' + currentUser) || 'NGN';
      currencySelect.value = currentCurrency;
      loadUserData();
      showApp();
    }
  });

  function showAuthError(msg) {
    authError.textContent = msg;
    authError.style.display = 'block';
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('gsi_session_user');
    currentUser = null;
    showAuth();
  });

  // Currency Change
  currencySelect.addEventListener('change', () => {
    currentCurrency = currencySelect.value;
    if (currentUser) {
      localStorage.setItem('gsi_currency_' + currentUser, currentCurrency);
    }
    render();
    updateWithdrawalModalBalanceDisplay();
  });

  // SIDEBAR EXPAND / CONFINE TOGGLE
  if (sidebarToggleBtn && appSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isConfined = appSidebar.classList.toggle('confined');
      localStorage.setItem('gsi_sidebar_confined', isConfined);
    });
  }

  // SIDEBAR NAV ITEM SWITCHING
  const tabContentMap = {
    withdrawals: tabContentWithdrawals,
    incomes: tabContentIncomes,
    jobs: tabContentJobs,
    assets: tabContentAssets,
    savings: tabContentSavings
  };

  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tabKey = item.getAttribute('data-tab');
      activeTab = tabKey.toUpperCase();

      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      Object.values(tabContentMap).forEach(content => {
        if (content) content.style.display = 'none';
      });

      if (tabContentMap[tabKey]) {
        tabContentMap[tabKey].style.display = 'block';
      }
    });
  });

  // Modals Open/Close triggers
  btnOpenAddIncome.addEventListener('click', openAddIncomeModal);
  btnOpenWithdraw.addEventListener('click', openWithdrawModal);
  btnOpenAddJob.addEventListener('click', () => {
    jobError.style.display = 'none';
    jobTitleInput.value = '';
    jobAmountInput.value = '';
    jobTimeframeInput.value = '';
    modalAddJob.style.display = 'flex';
  });
  btnOpenAddAsset.addEventListener('click', () => {
    assetError.style.display = 'none';
    assetNameInput.value = '';
    assetCostInput.value = '';
    assetPurposeInput.value = '';
    modalAddAsset.style.display = 'flex';
  });
  btnOpenAddSaving.addEventListener('click', () => {
    savingError.style.display = 'none';
    savingTitleInput.value = '';
    savingTargetInput.value = '';
    modalAddSaving.style.display = 'flex';
  });
  openAboutBtn.addEventListener('click', () => modalAbout.style.display = 'flex');

  // Generic modal closer
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      document.getElementById(targetId).style.display = 'none';
    });
  });

  const allModals = [
    modalAddIncome, modalWithdraw, modalAbout,
    modalAddJob, modalAddJobExpense,
    modalAddAsset, modalAddAssetEarning,
    modalAddSaving, modalDepositSaving, modalDeductSaving
  ];

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // Source select toggle for custom source
  incomeSourceSelect.addEventListener('change', () => {
    if (incomeSourceSelect.value === 'NEW') {
      customSourceGroup.style.display = 'flex';
      incomeCustomSource.required = true;
      incomeCustomSource.focus();
    } else {
      customSourceGroup.style.display = 'none';
      incomeCustomSource.required = false;
    }
  });

  // Add Income Form Submit
  formAddIncome.addEventListener('submit', (e) => {
    e.preventDefault();
    const source = incomeSourceSelect.value === 'NEW'
      ? incomeCustomSource.value.trim()
      : incomeSourceSelect.value.trim();
    const amount = parseFloat(incomeAmount.value);
    const date = incomeDate.value || new Date().toISOString().split('T')[0];
    const notes = incomeNotes.value.trim();

    if (!source) {
      showAddIncomeError('Please specify the income source.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      showAddIncomeError('Please enter a valid positive amount.');
      return;
    }

    ledgerData.incomes.unshift({
      id: 'inc_' + Date.now(),
      source,
      amount,
      date,
      notes
    });

    saveUserData();
    modalAddIncome.style.display = 'none';
    render();
  });

  function showAddIncomeError(msg) {
    addIncomeError.textContent = msg;
    addIncomeError.style.display = 'block';
  }

  // Live Withdrawal Gatekeeper Validation
  withdrawAmount.addEventListener('input', runGatekeeperCheck);
  withdrawYield.addEventListener('input', runGatekeeperCheck);
  withdrawSourceSelect.addEventListener('change', () => {
    updateWithdrawalModalBalanceDisplay();
    runGatekeeperCheck();
  });

  // Form Withdraw Submit
  formWithdraw.addEventListener('submit', (e) => {
    e.preventDefault();
    const source = withdrawSourceSelect.value;
    const amount = parseFloat(withdrawAmount.value);
    const expectedYield = parseFloat(withdrawYield.value);
    const reason = withdrawReason.value.trim();
    const benefit = withdrawBenefit.value.trim();

    const stats = computeStats();
    const available = stats.sourceBalances[source] !== undefined ? stats.sourceBalances[source] : 0;

    if (!reason) {
      showWithdrawError('Please state the reason for this withdrawal.');
      return;
    }
    if (!benefit) {
      showWithdrawError('Please state the benefit of this amount.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      showWithdrawError('Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > available) {
      showWithdrawError(`Insufficient balance! You only have ${formatMoney(available)} available in ${source}.`);
      return;
    }
    if (isNaN(expectedYield) || expectedYield <= amount) {
      showWithdrawError('The money this amount will yield must be strictly bigger than the withdrawal amount itself.');
      return;
    }

    ledgerData.withdrawals.unshift({
      id: 'wth_' + Date.now(),
      source,
      amount,
      reason,
      benefit,
      expectedYield,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      actualYield: null,
      successExtent: '',
      auditedAt: null
    });

    saveUserData();
    modalWithdraw.style.display = 'none';
    render();
  });

  function showWithdrawError(msg) {
    withdrawError.textContent = msg;
    withdrawError.style.display = 'block';
  }

  // 1. JOB / SALARY SUBMISSIONS
  formAddJob.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = jobTitleInput.value.trim();
    const amount = parseFloat(jobAmountInput.value);
    const timeframe = jobTimeframeInput.value.trim();

    if (!title) return;
    if (isNaN(amount) || amount <= 0) {
      jobError.textContent = 'Please enter a valid expected amount.';
      jobError.style.display = 'block';
      return;
    }

    ledgerData.jobs.unshift({
      id: 'job_' + Date.now(),
      title,
      expectedAmount: amount,
      timeframe: timeframe || '1 Month',
      expenses: []
    });

    saveUserData();
    modalAddJob.style.display = 'none';
    render();
  });

  formAddJobExpense.addEventListener('submit', (e) => {
    e.preventDefault();
    const jId = jobExpenseJobId.value;
    const name = jobExpenseName.value.trim();
    const amount = parseFloat(jobExpenseAmount.value);

    if (!name || isNaN(amount) || amount <= 0) {
      jobExpenseError.textContent = 'Please enter a valid expense description and amount.';
      jobExpenseError.style.display = 'block';
      return;
    }

    const job = (ledgerData.jobs || []).find(j => j.id === jId);
    if (job) {
      job.expenses = job.expenses || [];
      job.expenses.push({
        id: 'exp_' + Date.now(),
        name,
        amount
      });
      saveUserData();
    }

    modalAddJobExpense.style.display = 'none';
    render();
  });

  // 2. ASSET SUBMISSIONS
  formAddAsset.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = assetNameInput.value.trim();
    const cost = parseFloat(assetCostInput.value);
    const purpose = assetPurposeInput.value.trim();

    if (!name || !purpose) return;
    if (isNaN(cost) || cost <= 0) {
      assetError.textContent = 'Please enter a valid purchase cost.';
      assetError.style.display = 'block';
      return;
    }

    ledgerData.assets.unshift({
      id: 'ast_' + Date.now(),
      name,
      cost,
      purpose,
      earnings: []
    });

    saveUserData();
    modalAddAsset.style.display = 'none';
    render();
  });

  formAddAssetEarning.addEventListener('submit', (e) => {
    e.preventDefault();
    const astId = assetEarningAssetId.value;
    const amount = parseFloat(assetEarningAmount.value);
    const date = assetEarningDate.value || new Date().toISOString().split('T')[0];
    const desc = assetEarningDesc.value.trim();

    if (!desc || isNaN(amount) || amount <= 0) {
      assetEarningError.textContent = 'Please enter a valid earning amount and description.';
      assetEarningError.style.display = 'block';
      return;
    }

    const ast = (ledgerData.assets || []).find(a => a.id === astId);
    if (ast) {
      ast.earnings = ast.earnings || [];
      ast.earnings.unshift({
        id: 'ern_' + Date.now(),
        amount,
        date,
        desc
      });
      saveUserData();
    }

    modalAddAssetEarning.style.display = 'none';
    render();
  });

  // 3. SAVINGS SUBMISSIONS
  formAddSaving.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = savingTitleInput.value.trim();
    const targetAmount = parseFloat(savingTargetInput.value);

    if (!title || isNaN(targetAmount) || targetAmount <= 0) {
      savingError.textContent = 'Please specify what you want to buy and target amount.';
      savingError.style.display = 'block';
      return;
    }

    ledgerData.savings.unshift({
      id: 'svg_' + Date.now(),
      title,
      targetAmount,
      deposits: [],
      deductions: []
    });

    saveUserData();
    modalAddSaving.style.display = 'none';
    render();
  });

  formDepositSaving.addEventListener('submit', (e) => {
    e.preventDefault();
    const sId = depositSavingId.value;
    const amount = parseFloat(depositSavingAmount.value);
    const source = depositSavingSource.value;

    if (isNaN(amount) || amount <= 0) {
      depositSavingError.textContent = 'Please enter a valid positive deposit amount.';
      depositSavingError.style.display = 'block';
      return;
    }

    const svg = (ledgerData.savings || []).find(s => s.id === sId);
    if (svg) {
      svg.deposits = svg.deposits || [];
      svg.deposits.unshift({
        id: 'dep_' + Date.now(),
        amount,
        source,
        date: new Date().toISOString().split('T')[0]
      });
      saveUserData();
    }

    modalDepositSaving.style.display = 'none';
    render();
  });

  // DEDUCT SAVINGS (THE SAD APP CONFIRMATION)
  formDeductSaving.addEventListener('submit', (e) => {
    e.preventDefault();
    const sId = deductSavingId.value;
    const amount = parseFloat(deductSavingAmount.value);
    const reason = deductSavingReason.value.trim();

    if (!reason || isNaN(amount) || amount <= 0) {
      deductSavingError.textContent = 'Please state how much and why you are taking money out.';
      deductSavingError.style.display = 'block';
      return;
    }

    const svg = (ledgerData.savings || []).find(s => s.id === sId);
    if (svg) {
      const totalDep = (svg.deposits || []).reduce((s, d) => s + Number(d.amount || 0), 0);
      const totalDed = (svg.deductions || []).reduce((s, d) => s + Number(d.amount || 0), 0);
      const currentSaved = Math.max(0, totalDep - totalDed);

      if (amount > currentSaved) {
        deductSavingError.textContent = `You cannot deduct ${formatMoney(amount)} because you only have ${formatMoney(currentSaved)} saved in this goal.`;
        deductSavingError.style.display = 'block';
        return;
      }

      svg.deductions = svg.deductions || [];
      svg.deductions.unshift({
        id: 'ded_' + Date.now(),
        amount,
        reason,
        date: new Date().toISOString().split('T')[0]
      });
      saveUserData();
    }

    modalDeductSaving.style.display = 'none';
    render();
  });
}

// --- MODAL POPULATORS & GLOBAL HELPERS ---
function openAddIncomeModal() {
  addIncomeError.style.display = 'none';
  incomeAmount.value = '';
  incomeNotes.value = '';
  incomeCustomSource.value = '';
  customSourceGroup.style.display = 'none';
  incomeDate.value = new Date().toISOString().split('T')[0];

  const sources = Array.from(new Set((ledgerData.incomes || []).map(i => i.source.trim()))).filter(Boolean);
  let html = '';
  sources.forEach(s => {
    html += `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`;
  });
  html += '<option value="NEW">+ Add New Income Source...</option>';
  incomeSourceSelect.innerHTML = html;

  modalAddIncome.style.display = 'flex';
}

function openWithdrawModal() {
  withdrawError.style.display = 'none';
  withdrawAmount.value = '';
  withdrawYield.value = '';
  withdrawReason.value = '';
  withdrawBenefit.value = '';
  gatekeeperMsg.innerHTML = '';
  btnSubmitWithdraw.disabled = true;

  const stats = computeStats();
  const sources = Object.keys(stats.sourceBalances);

  let html = '';
  if (sources.length === 0) {
    html = '<option value="General">General (0.00)</option>';
  } else {
    sources.forEach(s => {
      html += `<option value="${escapeHtml(s)}">${escapeHtml(s)} (${formatMoney(stats.sourceBalances[s])} available)</option>`;
    });
  }
  withdrawSourceSelect.innerHTML = html;

  updateWithdrawalModalBalanceDisplay();
  modalWithdraw.style.display = 'flex';
}

function updateWithdrawalModalBalanceDisplay() {
  const stats = computeStats();
  const s = withdrawSourceSelect.value || 'General';
  const avail = stats.sourceBalances[s] !== undefined ? stats.sourceBalances[s] : 0;
  withdrawSourceAvail.textContent = 'Available: ' + formatMoney(avail);
}

function runGatekeeperCheck() {
  withdrawError.style.display = 'none';

  const amountVal = parseFloat(withdrawAmount.value);
  const yieldVal = parseFloat(withdrawYield.value);
  const source = withdrawSourceSelect.value || 'General';

  const stats = computeStats();
  const available = stats.sourceBalances[source] !== undefined ? stats.sourceBalances[source] : 0;

  const hasAmount = !isNaN(amountVal) && amountVal > 0;
  const hasYield = !isNaN(yieldVal);

  if (!hasAmount || !hasYield) {
    gatekeeperMsg.innerHTML = '';
    btnSubmitWithdraw.disabled = true;
    return;
  }

  if (amountVal > available) {
    gatekeeperMsg.innerHTML = `
      <div class="alert-error">
        <strong>Insufficient Balance:</strong> You requested ${formatMoney(amountVal)}, but only ${formatMoney(available)} is available in ${escapeHtml(source)}.
      </div>
    `;
    btnSubmitWithdraw.disabled = true;
    return;
  }

  // Strict Gatekeeper Law: Yield must be strictly greater than amount
  if (yieldVal <= amountVal) {
    gatekeeperMsg.innerHTML = `
      <div class="alert-error">
        <strong>Cannot withdraw:</strong> The money this amount will yield (${formatMoney(yieldVal)}) must be bigger than the amount you want to withdraw (${formatMoney(amountVal)}). Even if it is food, write the amount you will earn because you ate that food; if it is cloth, write what wearing it will yield for you. If not, the system will not allow you to withdraw.
      </div>
    `;
    btnSubmitWithdraw.disabled = true;
    return;
  }

  gatekeeperMsg.innerHTML = `
    <div class="alert-success">
      ✓ Approved: Projected yield (${formatMoney(yieldVal)}) is bigger than the withdrawal amount (${formatMoney(amountVal)}).
    </div>
  `;
  btnSubmitWithdraw.disabled = false;
}

// Window global helper functions for the 3 new sections
window.openAddJobExpenseModal = function(jobId) {
  jobExpenseJobId.value = jobId;
  jobExpenseError.style.display = 'none';
  jobExpenseName.value = '';
  jobExpenseAmount.value = '';
  modalAddJobExpense.style.display = 'flex';
};

window.deleteJobExpense = function(jobId, expId) {
  const job = (ledgerData.jobs || []).find(j => j.id === jobId);
  if (job) {
    job.expenses = (job.expenses || []).filter(e => e.id !== expId);
    saveUserData();
    render();
  }
};

window.deleteJob = function(jobId) {
  if (confirm('Are you sure you want to remove this job tracker?')) {
    ledgerData.jobs = (ledgerData.jobs || []).filter(j => j.id !== jobId);
    saveUserData();
    render();
  }
};

window.openAddAssetEarningModal = function(astId) {
  assetEarningAssetId.value = astId;
  assetEarningError.style.display = 'none';
  assetEarningAmount.value = '';
  assetEarningDesc.value = '';
  assetEarningDate.value = new Date().toISOString().split('T')[0];
  modalAddAssetEarning.style.display = 'flex';
};

window.deleteAssetEarning = function(astId, ernId) {
  const ast = (ledgerData.assets || []).find(a => a.id === astId);
  if (ast) {
    ast.earnings = (ast.earnings || []).filter(e => e.id !== ernId);
    saveUserData();
    render();
  }
};

window.deleteAsset = function(astId) {
  if (confirm('Are you sure you want to remove this asset?')) {
    ledgerData.assets = (ledgerData.assets || []).filter(a => a.id !== astId);
    saveUserData();
    render();
  }
};

window.openDepositSavingModal = function(sId) {
  depositSavingId.value = sId;
  depositSavingError.style.display = 'none';
  depositSavingAmount.value = '';

  const sources = Array.from(new Set((ledgerData.incomes || []).map(i => i.source.trim()))).filter(Boolean);
  let html = '';
  if (sources.length === 0) {
    html = '<option value="General Income">General Income</option>';
  } else {
    sources.forEach(s => {
      html += `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`;
    });
  }
  depositSavingSource.innerHTML = html;

  modalDepositSaving.style.display = 'flex';
};

window.openDeductSavingModal = function(sId) {
  deductSavingId.value = sId;
  deductSavingError.style.display = 'none';
  deductSavingAmount.value = '';
  deductSavingReason.value = '';
  modalDeductSaving.style.display = 'flex';
};

window.deleteSavingGoal = function(sId) {
  if (confirm('Are you sure you want to remove this savings goal?')) {
    ledgerData.savings = (ledgerData.savings || []).filter(s => s.id !== sId);
    saveUserData();
    render();
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', init);
