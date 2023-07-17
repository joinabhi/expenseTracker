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




window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  // console.log('Decoded Token:', decodeToken);

  const isPremiumUser = decodeToken.ispremiumuser;
  // console.log("Is Premium User:", isPremiumUser);

  if (isPremiumUser) {
    console.log("User is already a Premium User");
    document.getElementById('rzp-btn1').style.display = "none";
    document.getElementById('message').innerHTML = "You are a Premium User";
    showleaderboard();
    // download();
    // return; // Stop further execution
  }
  const data = await axios.get("http://localhost:9100/expense/get-expense", { headers: { "Authorization": token } })
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

function showleaderboard(){
  const parentElement=document.getElementById('message')
  const leaderBoardButton = document.createElement('input')
  leaderBoardButton.type = 'button'
  leaderBoardButton.style.backgroundColor = 'green'
  leaderBoardButton.style.color = 'white'
  leaderBoardButton.value = 'Leader Board'
  leaderBoardButton.onclick = async () => {
    leaderBoardButton.style.display = 'none'
    const token = localStorage.getItem('token')
    console.log('151>>>>>>>>>>>>>>>>>>>>>>>>>>>>', token)
    const userLeaderBoardArray = await axios.get('http://localhost:9100/premium/showleaderboard', { headers: { "Authorization": token } })
    console.log('234>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<',userLeaderBoardArray)
    const parentElement = document.getElementById('listofexpenses')
    parentElement.innerHTML = parentElement.innerHTML + '<h1>Leader Board</h1>'
    const dataObject=userLeaderBoardArray.data
    console.log('157nnnnnnnnnnnnnnnnnnnnnnnn',dataObject)
    dataObject.forEach((userDetails)=>{
    parentElement.innerHTML+=`<li>Name:${userDetails.name}---->Total amount:${userDetails.totalExpense}</li>`
    })
  }
parentElement.appendChild(leaderBoardButton);
}



function parseJwt(token) {
  console.log('141', token)
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function download() {
  try {
    const token=localStorage.getItem('token')
    const response = await axios.get('http://localhost:9100/userexpense/download', {
      headers: { "Authorization": token }
    });

    if (response.status === 201) {
      const downloadUrl = response.data.fileUrl;
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'myexpense.csv';
      downloadLink.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}


document.getElementById("rzp-btn1").onclick = async function (e) {
  try {
    // const token = localStorage.getItem('token');
    // const decodeToken = parseJwt(token);
    // console.log('Decoded Token:', decodeToken);

    // const isPremiumUser = decodeToken.ispremiumuser;
    // console.log("Is Premium User:", isPremiumUser);

    // if (isPremiumUser) {
    //   console.log("User is already a Premium User");
    //   document.getElementById('rzp-btn1').style.display = "none";
    //   document.getElementById('message').innerHTML = "You are a Premium User";
    //   showleaderboard()
    //   return; // Stop further execution
    // }
      const purchaseResponse = await axios.get("http://localhost:9100/purchase/premiummembership", {
      headers: {
        "Authorization": token
      }
    });

    console.log("Purchase Response:", purchaseResponse);

    var options = {
      key: purchaseResponse.data.key_id,
      order_id: purchaseResponse.data.order.id,
      handler: async function (purchaseResponse) {
        try {
          const response = await axios.post('http://localhost:9100/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: purchaseResponse.razorpay_payment_id
          }, {
            headers: {
              "Authorization": token
            }
          });

          console.log("Transaction status updated");

          alert("You are a Premium User Now");
          document.getElementById('rzp-btn1').style.display = "none";
          document.getElementById('message').innerHTML = "You are a Premium User";
          console.log('266', response)
          localStorage.setItem('token', response.data.token)
          showleaderboard();
          // download();
          
    
         } catch (error) {
          console.log(error);
          alert('Something went wrong');
        }
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (purchaseResponse) {
      console.log(purchaseResponse);
      alert('Payment failed');
    });
  } catch (error) {
    console.log(error);
    alert('Something went wrong');
  }
};




