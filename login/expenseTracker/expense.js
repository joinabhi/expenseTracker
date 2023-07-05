const balance = document.getElementById(
  "balance"
);
const money_plus = document.getElementById(
  "money-plus"
);
const money_minus = document.getElementById(
  "money-minus"
);
const list = document.getElementById("list");
const form = document.getElementById("form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category")

let transactions = []



function addTransaction(e) {
  e.preventDefault();
  if (description.value.trim() === '' || category.value.trim() === '' || amount.value.trim() === '') {
    alert('please fill competely')
  } else {
    const transaction = {
      description: description.value,
      category: category.value,
      amount: +amount.value

    }
    console.log(transaction)
    try {
      const token = localStorage.getItem('token')
      axios.post('http://localhost:9100/expense/add-expense', transaction, { headers: { "Authorization": token } })
        .then(response => {
          console.log("34", response)
          const newTransaction = response.data.expenseDetails;
          addTransactionDOM(newTransaction);

          transactions.push(newTransaction)
          console.log("39--------------------------------", transactions)
          updateValues();
        })
    } catch (error) {
      console.log('error adding transaction', error)
    }
    document.forms[0].reset();
  }
}

// function generateID() {
//   return Math.floor(Math.random() * 1000000000);
// }

//Add Trasactions to DOM list
function addTransactionDOM(transaction) {
  //GET sign
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  //Add Class Based on Value
  item.classList.add(
    transaction.amount < 0 ? "minus" : "plus"
  );

  item.innerHTML = `
    ${transaction.id}<span>${transaction.description}</span><span>${transaction.category}</span><span>${sign}${Math.abs(
    transaction.amount
  )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
  list.appendChild(item);
}

//4

//Update the balance income and expence
function updateValues() {
  const amounts = transactions.map(
    (transaction) => transaction.amount
  );
  const total = amounts
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense =
    (amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => (acc += item), 0) *
      -1).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}
//6 
async function removeTransaction(id) {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:9100/expense/delete-expense/${id}`, { headers: { "Authorization": token } })
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateValues()
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
  } catch (error) {
    console.error('error removing transaction:', error)
  }
}


// const init=()=>{
//   try{
//     axios.get('http:localhost:9100/expense/get-expense')
//     .then(response => {
//       console.log('113-------------------', response)
//       for(var i=0;i<response.data.allExpenses.length;i++){
//         addTransactionDOM(response.data.allExpenses[i])

//       }
//       // addTransactionDOM()
//       transactions=response.data.allExpenses;
//       console.log('122------------------------------------------------------', transactions )
//       list.innerHTML = '';
//       transactions.forEach(addTransactionDOM);
//       updateValues();
//     })
//   }

//       catch(error){
//         console.log('Error retrieving transactions:', error);
//       }
// }

// init();

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token')
  const data = axios.get("http://localhost:9100/expense/get-expense", { headers: { "Authorization": token } })
    .then((response) => {
      console.log(response)

      for (var i = 0; i < response.data.allExpenses.length; i++) {
        addTransactionDOM(response.data.allExpenses[i])
      }
      transactions = response.data.allExpenses;
      console.log("144", transactions)
      list.innerHTML = '';
      console.log("list------------------<<<<<", list)
      transactions.forEach(addTransactionDOM);
      updateValues();
    })
    .catch((error) => {
      console.log(error)
    })
})

form.addEventListener('submit', addTransaction);

document.getElementById("rzp-btn1").onclick = async function (e) {
  try {
    const token = localStorage.getItem('token');
    console.log('164qqqqqqqqqqqqqqqqqq', token);
    const response = await axios.get('http://localhost:9100/purchase/premiummembership', {
      headers: { "Authorization": token } // Add 'Bearer' before the token
    });
    console.log("165=====================================", response);

    var options = {
      "key": response.data.key_id,
      "order_id": response.data.order.id,
      "handler": async function (response) {
        try {
          await axios.post('http://localhost:9100/purchase/updatetransactionstatus', {
            order_id: options.order_id, // Use 'options.order_id' instead of 'option.order_id'
            payment_id: response.razorpay_payment_id // Use 'response.razorpay_payment_id' instead of 'response.rezorpay_payment_id'
          }, { headers: { "Authorization": token } }); // Add 'Bearer' before the token
          
          alert("You are a Premium User Now");
        } catch (error) {
          console.log(error);
          alert('Something went wrong');
        }
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
      console.log(response);
      alert('Payment failed');
    });
  } catch (error) {
    console.log(error);
    alert('Something went wrong');
  }
};

  

