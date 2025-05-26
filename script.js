const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-income");
const money_minus = document.getElementById("money-expense");
const list = document.getElementById("list");
const form = document.getElementById("transaction");
const text = document.getElementById("text");
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const filterCategory = document.getElementById("filter-category");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const getFilteredTransactions = () => {
    const selected = filterCategory.value;
    return selected === "All" ? transactions : transactions.filter(tx => tx.category === selected);
};

const updateValues = () => {
    const filtered = getFilteredTransactions();
    const amounts = filtered.map(tx => tx.amount);

    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const income = amounts.filter(v => v > 0).reduce((acc, v) => acc + v, 0).toFixed(2);
    const expense = Math.abs(amounts.filter(v => v < 0).reduce((acc, v) => acc + v, 0)).toFixed(2);

    balance.textContent = `$${total}`;
    money_plus.textContent = `+ $${income}`;
    money_minus.textContent = `- $${expense}`;
};

const addTransactionToDOM = ({id, text: txt, amount: amt, category: cat}) => {
    const sign = amt < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(amt < 0 ? "minus" : "plus");
    item.innerHTML = `
    ${txt}
    <span>${sign}${Math.abs(amt)}</span>
    <small>[${cat}]</small>
    <button class="delete-btn" onclick="removeTransaction(${id})">x</button>
  `;
    list.appendChild(item);
};

const renderTransactions = () => {
    list.innerHTML = "";
    getFilteredTransactions().forEach(addTransactionToDOM);
};

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateId = () => Math.floor(Math.random() * 100000000);

const resetForm = () => {
    text.value = "";
    amount.value = "";
    category.value = "Other";
};

const addTransaction = e => {
    e.preventDefault();
    if (!text.value.trim() || !amount.value.trim()) {
        alert("Please add a name, category and amount");
        return;
    }

    transactions.push({
        id: generateId(),
        text: text.value,
        amount: +amount.value,
        category: category.value
    });

    updateLocalStorage();
    resetForm();
    renderTransactions();
    updateValues();
};

const removeTransaction = id => {
    transactions = transactions.filter(tx => tx.id !== id);
    updateLocalStorage();
    renderTransactions();
    updateValues();
};

window.removeTransaction = removeTransaction;

form.addEventListener("submit", addTransaction);
filterCategory.addEventListener("change", () => {
    renderTransactions();
    updateValues();
});

renderTransactions();
updateValues();

