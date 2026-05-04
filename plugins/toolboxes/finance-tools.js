// Finance Tools Toolbox Plugin
// Contains financial calculators and tools

// Inject CSS styles for finance tools
(function() {
    if (document.getElementById('finance-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'finance-tools-styles';
    style.textContent = `
/* Finance Calculator Widget Styles */
.calc-widget { background: var(--bg-tertiary); padding: 15px; border-radius: 6px; }
.calc-widget input, .calc-widget select { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; background: var(--input-bg); color: var(--text-primary); }
.calc-widget label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
.calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
.calc-card { background: var(--bg-secondary); padding: 10px; border-radius: 4px; text-align: center; }
.calc-card-label { font-size: 12px; color: var(--text-muted); }
.calc-card-value { font-size: 18px; font-weight: 600; }
.calc-card-value.large { font-size: 20px; }
.calc-card-value.positive { color: #27ae60; }
.calc-card-value.negative { color: #c0392b; }
.calc-card-value.info { color: #2980b9; }
.calc-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: 12px; }
.calc-section-title { font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted); }
.calc-highlight { background: var(--success-bg); padding: 10px; border-radius: 4px; margin-bottom: 15px; }
.calc-highlight-title { font-size: 12px; font-weight: 600; color: var(--success-text); margin-bottom: 5px; }
.calc-toggle { display: flex; gap: 0; border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; }
.calc-toggle label { flex: 1; margin: 0; }
.calc-toggle span { display: block; padding: 8px; text-align: center; cursor: pointer; font-size: 12px; background: var(--bg-secondary); color: var(--text-primary); }
.calc-toggle input:checked + span { background: #3498db; color: white; }
.calc-toggle input { display: none; }
`;
    document.head.appendChild(style);
})();

// Define finance tool functions
const taxBrackets = {
    single: [
        {min: 0, max: 12400, rate: 0.10},
        {min: 12400, max: 50400, rate: 0.12},
        {min: 50400, max: 105700, rate: 0.22},
        {min: 105700, max: 201775, rate: 0.24},
        {min: 201775, max: 256225, rate: 0.32},
        {min: 256225, max: 640800, rate: 0.35},
        {min: 640800, max: Infinity, rate: 0.37}
    ],
    married: [
        {min: 0, max: 24800, rate: 0.10},
        {min: 24800, max: 100800, rate: 0.12},
        {min: 100800, max: 211400, rate: 0.22},
        {min: 211400, max: 403550, rate: 0.24},
        {min: 403550, max: 512450, rate: 0.32},
        {min: 512450, max: 788700, rate: 0.35},
        {min: 788700, max: Infinity, rate: 0.37}
    ]
};
const stdDeductions = {single: 16100, married: 32200};

function calculateTax() {
    const incomeEl = document.getElementById('taxIncome');
    const statusEl = document.getElementById('taxStatus');
    const resultsEl = document.getElementById('taxResults');
    if (!incomeEl || !statusEl || !resultsEl) return;

    const income = parseFloat(incomeEl.value) || 0;
    const status = statusEl.value;
    const ded = stdDeductions[status];
    const taxable = Math.max(0, income - ded);
    let totalTax = 0;
    let breakdown = '';

    for (const b of taxBrackets[status]) {
        if (taxable > b.min) {
            const amt = Math.min(taxable, b.max) - b.min;
            const tax = amt * b.rate;
            totalTax += tax;
            if (amt > 0) {
                breakdown += '<div class="calc-row"><span>' + (b.rate*100) + '%</span><span>$' + amt.toLocaleString() + '</span><span class="calc-card-value negative">$' + tax.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>';
            }
        }
    }

    const effRate = income > 0 ? (totalTax / income * 100).toFixed(1) : 0;
    const margBracket = taxBrackets[status].find(function(b) { return taxable >= b.min && taxable < b.max; });
    const margRate = margBracket ? margBracket.rate * 100 : 37;

    resultsEl.innerHTML =
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Standard Deduction</div><div class="calc-card-value positive">$' + ded.toLocaleString() + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Taxable Income</div><div class="calc-card-value">$' + taxable.toLocaleString() + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Tax</div><div class="calc-card-value negative">$' + totalTax.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Effective / Marginal</div><div class="calc-card-value">' + effRate + '% / ' + margRate + '%</div></div>' +
        '</div>' +
        '<div class="calc-section-title">TAX BY BRACKET</div>' +
        breakdown +
        '<div class="calc-row" style="padding:8px 0;font-weight:600;"><span>Take Home (Monthly)</span><span class="calc-card-value positive">$' + ((income - totalTax) / 12).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>';
}

function calculateLoan() {
    const amountEl = document.getElementById('loanAmount');
    const rateEl = document.getElementById('loanRate');
    const yearsEl = document.getElementById('loanYears');
    const extraEl = document.getElementById('loanExtra');
    const resultsEl = document.getElementById('loanResults');
    if (!amountEl || !rateEl || !yearsEl || !resultsEl) return;

    const principal = parseFloat(amountEl.value) || 0;
    const annualRate = (parseFloat(rateEl.value) || 0) / 100;
    const years = parseInt(yearsEl.value) || 0;
    const extraPayment = parseFloat(extraEl.value) || 0;
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;

    if (principal <= 0 || annualRate <= 0 || years <= 0) {
        resultsEl.innerHTML = '<div style="color:#7f8c8d;text-align:center;padding:20px;">Enter loan details above</div>';
        return;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    let balance = principal, totalInterestWithExtra = 0, monthsWithExtra = 0;
    while (balance > 0 && monthsWithExtra < numPayments * 2) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.min(balance, monthlyPayment - interestPayment + extraPayment);
        totalInterestWithExtra += interestPayment;
        balance -= principalPayment;
        monthsWithExtra++;
        if (balance < 0.01) balance = 0;
    }
    const yearsWithExtra = Math.floor(monthsWithExtra / 12);
    const monthsRemainder = monthsWithExtra % 12;
    const interestSaved = totalInterest - totalInterestWithExtra;

    let milestones = '';
    const checkYears = [1, 5, 10, 15, 20, 25, 30].filter(function(y) { return y <= years; });
    let bal = principal, paidPrincipal = 0, paidInterest = 0;
    for (let m = 1; m <= numPayments; m++) {
        const intPmt = bal * monthlyRate;
        const prinPmt = monthlyPayment - intPmt;
        paidInterest += intPmt;
        paidPrincipal += prinPmt;
        bal -= prinPmt;
        if (checkYears.includes(m / 12)) {
            milestones += '<div class="calc-row"><span>Year ' + (m/12) + '</span><span>Balance: $' + Math.max(0,bal).toLocaleString(undefined,{maximumFractionDigits:0}) + '</span><span style="color:var(--text-muted);">Paid: $' + paidPrincipal.toLocaleString(undefined,{maximumFractionDigits:0}) + '</span></div>';
        }
    }

    resultsEl.innerHTML =
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Monthly Payment</div><div class="calc-card-value large info">$' + monthlyPayment.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Interest</div><div class="calc-card-value large negative">$' + totalInterest.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Cost</div><div class="calc-card-value">$' + totalPayment.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Interest Ratio</div><div class="calc-card-value">' + (totalInterest/principal*100).toFixed(1) + '%</div></div>' +
        '</div>' +
        (extraPayment > 0 ? '<div class="calc-highlight"><div class="calc-highlight-title">WITH $' + extraPayment.toLocaleString() + '/mo EXTRA</div><div class="calc-row" style="border:none;font-size:13px;"><span>Payoff: ' + yearsWithExtra + 'y ' + monthsRemainder + 'm</span><span class="calc-card-value positive" style="font-size:13px;">Save $' + interestSaved.toLocaleString(undefined,{maximumFractionDigits:0}) + '</span></div></div>' : '') +
        '<div class="calc-section-title">AMORTIZATION</div>' +
        milestones;
}

function calculateGrowth() {
    const initialEl = document.getElementById('growthInitial');
    const monthlyEl = document.getElementById('growthMonthly');
    const rateEl = document.getElementById('growthRate');
    const yearsEl = document.getElementById('growthYears');
    const resultsEl = document.getElementById('growthResults');
    const compoundEl = document.querySelector('input[name="growthCompound"]:checked');
    if (!initialEl || !monthlyEl || !rateEl || !yearsEl || !resultsEl) return;

    const initial = parseFloat(initialEl.value) || 0;
    const monthly = parseFloat(monthlyEl.value) || 0;
    const rate = (parseFloat(rateEl.value) || 0) / 100;
    const years = parseInt(yearsEl.value) || 0;
    const isMonthly = !compoundEl || compoundEl.value === 'monthly';

    const months = years * 12;
    const totalContrib = initial + (monthly * months);

    let fv = initial;
    if (isMonthly) {
        const monthlyRate = rate / 12;
        for (let i = 0; i < months; i++) fv = fv * (1 + monthlyRate) + monthly;
    } else {
        for (let i = 0; i < years; i++) fv = fv * (1 + rate) + (monthly * 12);
    }
    const growth = fv - totalContrib;

    const milestones = [5, 10, 15, 20, 25, 30, 35, 40].filter(function(y) { return y <= years; });
    let timeline = '';
    for (let j = 0; j < milestones.length; j++) {
        const y = milestones[j];
        let val = initial;
        if (isMonthly) {
            const monthlyRate = rate / 12;
            for (let i = 0; i < y * 12; i++) val = val * (1 + monthlyRate) + monthly;
        } else {
            for (let i = 0; i < y; i++) val = val * (1 + rate) + (monthly * 12);
        }
        timeline += '<div class="calc-row"><span>' + y + ' years</span><span class="calc-card-value positive">$' + val.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>';
    }

    resultsEl.innerHTML =
        '<div class="calc-grid">' +
            '<div class="calc-card"><div class="calc-card-label">Future Value</div><div class="calc-card-value large positive">$' + fv.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Total Contributions</div><div class="calc-card-value large">$' + totalContrib.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Investment Growth</div><div class="calc-card-value large positive">$' + growth.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}) + '</div></div>' +
            '<div class="calc-card"><div class="calc-card-label">Growth Multiple</div><div class="calc-card-value large">' + (totalContrib > 0 ? (fv / totalContrib).toFixed(1) : '0.0') + 'x</div></div>' +
        '</div>' +
        (timeline ? '<div class="calc-section-title">GROWTH TIMELINE</div>' + timeline : '');

    requestAnimationFrame(function() {
        var tool = resultsEl.closest('.tool');
        if (!tool) return;
        var header = tool.querySelector('.tool-header');
        var inner = tool.querySelector('.calc-widget');
        if (!header || !inner) return;
        // Measure the calc-widget's natural height (not flex-stretched) and size the tool to fit.
        // tool-content has 15px padding top + bottom = 30px; add 8px breathing room.
        var newHeight = Math.max(200, Math.min(750, inner.offsetHeight + header.offsetHeight + 38));
        tool.style.height = newHeight + 'px';
        var toolId = tool.getAttribute('data-tool');
        if (typeof positions !== 'undefined' && toolId) {
            if (!positions[toolId]) positions[toolId] = { x: tool.offsetLeft, y: tool.offsetTop, z: 1 };
            positions[toolId].height = newHeight;
            if (typeof savePositions === 'function') savePositions(positions);
        }
    });
}

// Inject JavaScript functions into DOM for HTML export using base64 encoding
// The injected script only defines things if they don't already exist (for exported HTML)
(function injectScriptsForExport() {
    if (document.getElementById('finance-tools-scripts')) return;

    const functionsToExport = [calculateTax, calculateLoan, calculateGrowth];
    // Wrap in IIFE that checks if already defined (plugin loaded) vs needs defining (exported HTML)
    const code = '(function() {\n' +
        'if (typeof calculateTax !== "undefined") return;\n' +
        'window.taxBrackets = ' + JSON.stringify(taxBrackets) + ';\n' +
        'window.stdDeductions = ' + JSON.stringify(stdDeductions) + ';\n' +
        functionsToExport.map(function(fn) { return 'window.' + fn.name + ' = ' + fn.toString(); }).join(';\n') + ';\n' +
        '})();';
    const encoded = btoa(unescape(encodeURIComponent(code)));

    const script = document.createElement('script');
    script.id = 'finance-tools-scripts';
    script.textContent = 'eval(decodeURIComponent(escape(atob("' + encoded + '"))))';
    (document.body || document.head).appendChild(script);
})();

// Register the Finance toolbox
PluginRegistry.registerToolbox({
    id: 'finance',
    name: 'Finance',
    description: 'Financial calculators and tools',
    icon: '💰',
    color: '#27ae60',
    version: '1.0.0',
    tools: ['dynamic-investment-calculator', 'dynamic-tax-calculator', 'loan-calculator'],
    source: 'external'
});

// Investment Growth Calculator
PluginRegistry.registerTool({
    id: 'dynamic-investment-calculator',
    name: 'Investment Growth Calculator',
    description: 'Interactive calculator with inputs for initial amount, monthly contribution, rate, and years',
    icon: '📈',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['investment', 'growth', 'compound', 'savings', 'retirement'],
    title: 'Investment Calculator',
    content: '<div class="calc-widget"><div class="calc-grid"><div><label>Initial Investment</label><input type="number" id="growthInitial" value="10000" oninput="calculateGrowth()"></div><div><label>Monthly Contribution</label><input type="number" id="growthMonthly" value="500" oninput="calculateGrowth()"></div><div><label>Annual Return %</label><input type="number" id="growthRate" value="7" step="0.1" oninput="calculateGrowth()"></div><div><label>Years</label><input type="number" id="growthYears" value="30" oninput="calculateGrowth()"></div></div><div style="margin-bottom:15px;"><label>Compounding</label><div class="calc-toggle"><label><input type="radio" name="growthCompound" value="monthly" checked onchange="calculateGrowth()"><span>Monthly</span></label><label><input type="radio" name="growthCompound" value="annual" onchange="calculateGrowth()"><span>Annual</span></label></div></div><div id="growthResults"></div></div>',
    onInit: 'calculateGrowth',
    defaultWidth: 380,
    defaultHeight: 450,
    source: 'external'
});

// Tax Calculator
PluginRegistry.registerTool({
    id: 'dynamic-tax-calculator',
    name: 'Tax Calculator',
    description: 'US federal income tax calculator with bracket breakdown',
    icon: '🧾',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['tax', 'income', 'federal', 'bracket'],
    title: 'Tax Calculator',
    content: '<div class="calc-widget"><div class="calc-grid"><div><label>Annual Income</label><input type="number" id="taxIncome" value="75000" oninput="calculateTax()"></div><div><label>Filing Status</label><select id="taxStatus" onchange="calculateTax()"><option value="single">Single</option><option value="married">Married Filing Jointly</option></select></div></div><div id="taxResults"></div></div>',
    onInit: 'calculateTax',
    defaultWidth: 360,
    defaultHeight: 400,
    source: 'external'
});

// Loan Calculator
PluginRegistry.registerTool({
    id: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Mortgage and loan calculator with amortization schedule',
    icon: '🏦',
    version: '1.0.0',
    toolbox: 'finance',
    tags: ['loan', 'mortgage', 'amortization', 'payment'],
    title: 'Loan Calculator',
    content: '<div class="calc-widget"><div class="calc-grid"><div><label>Loan Amount</label><input type="number" id="loanAmount" value="300000" oninput="calculateLoan()"></div><div><label>Interest Rate %</label><input type="number" id="loanRate" value="6.5" step="0.125" oninput="calculateLoan()"></div><div><label>Loan Term (Years)</label><input type="number" id="loanYears" value="30" oninput="calculateLoan()"></div><div><label>Extra Payment/mo</label><input type="number" id="loanExtra" value="0" oninput="calculateLoan()"></div></div><div id="loanResults"></div></div>',
    onInit: 'calculateLoan',
    defaultWidth: 380,
    defaultHeight: 450,
    source: 'external'
});

console.log('Finance Tools plugin loaded');
