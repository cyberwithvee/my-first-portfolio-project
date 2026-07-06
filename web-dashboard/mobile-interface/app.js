document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    
    if(document.getElementById('current-date')) {
        document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric'});
        updateDashboard();
    }

    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('amount').value);
            const desc = document.getElementById('desc').value;
            const category = document.getElementById('category').value;

            const newTransaction = { amount, desc, category, date: new Date().toLocaleDateString() };
            
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions.push(newTransaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            expenseForm.reset();
            alert('Expense synced to dashboard successfully!');
            updateMobileTotal();
        });
        updateMobileTotal();
    }

    function updateDashboard() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const tbody = document.querySelector('#transaction-table tbody');
        if(!tbody) return;
        
        tbody.innerHTML = '';
        let total = 0;

        transactions.forEach(t => {
            total += t.amount;
            const row = `<tr><td>${t.desc}</td><td>${t.category}</td><td>$${t.amount.toFixed(2)}</td></tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        document.getElementById('total-spent').innerText = `$${total.toFixed(2)}`;
        document.getElementById('remaining-budget').innerText = `$${(5000 - total).toFixed(2)}`;
    }

    function updateMobileTotal() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const mobileTotalEl = document.getElementById('mobile-today-total');
        if(!mobileTotalEl) return;
        
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        mobileTotalEl.innerText = `$${total.toFixed(2)}`;
    }
});
