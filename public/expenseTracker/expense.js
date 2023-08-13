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
const records_size=document.getElementById("records-size")
const pageDetail= document.getElementById('page-details')


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
      axios.post('http://13.48.40.12/expense/add-expense', transaction, { headers: { "Authorization": token } })
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
    await axios.delete(`http://13.48.40.12/expense/delete-expense/${id}`, { headers: { "Authorization": token } })
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateValues()
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
  } catch (error) {
    console.error('error removing transaction:', error)
  }
}

var record_per_page=5;
var page_number = 1;

// async function allExpenseResponse(){
//   const token = localStorage.getItem('token');
//   const res= await axios.get(`http://13.48.40.12/expenses?page=${page_number}}`, { headers: { "Authorization": token } })
//   transactions = res.data.allExpenses;
//   const total_records=transactions.length;
//   record_per_page=parseInt(records_size.value);
//   total_page=Math.ceil(total_records/record_per_page)
// }



async function generatePage(){
let prevBtn=`<li class="page-item">
  <a class="page-link" id="prevBtn" onclick="prevBtn()" href="javascript:void(0)" >Previous</a>
</li>`;

let nextBtn=`<li class="page-item">
<a class="page-link" id="nextBtn" onclick="nextBtn()" href="javascript:void(0)" >Next</a>
</li>`;

let buttons='';
let activeClass='';
for(let i=1;i<=total_page; i++){
    if(i==1){
      activeClass='active';
    }else{
      activeClass='';
    }
  buttons += `<li class="page-item dynamic-item ${activeClass}" id="page${i}"><a class="page-link" onclick="page(${i})" href="javascript:void(0)">${i}</a></li>`
}
document.getElementById('pagination').innerHTML=`${prevBtn} ${buttons} ${nextBtn}`;
}

function nextBtn(){
  page_number++;
  console.log('222222222223333333333333333333333333333333311111',total_page)
  if(page_number==total_page){
    document.getElementById('nextBtn').parentElement.classList.add('disabled')
  
  }else{
    document.getElementById('nextBtn').parentElement.classList.remove('disabled')
  }
 
  document.querySelectorAll('.dynamic-item').forEach(item=>{
    item.classList.remove('active')
  })
  document.getElementById(`page${page_number}`).classList.add('active')
  document.getElementById('prevBtn').parentElement.classList.remove('disabled')
 
  start_index=(page_number-1)*record_per_page;
  console.log('171', start_index)
  end_index=start_index+(record_per_page-1);
  console.log('281------------------', end_index)
  list.innerHTML = '';
  for(let i=start_index;i<=end_index;i++){
    addTransactionDOM(transactions[i])
  }
  pageDetail.innerHTML=`Showing ${start_index+1} to ${end_index+1} of ${total_records}`
}

function prevBtn(){
  page_number--;
  console.log('246kkkkkkkkkkkkkkkkkkkk',page_number)
  

  if(page_number==1){
    document.getElementById('prevBtn').parentElement.classList.add('disabled')
  }else{
    document.getElementById('prevBtn').parentElement.classList.remove('disabled')
  }
  document.querySelectorAll('.dynamic-item').forEach(item=>{
    item.classList.remove('active')
  })
 document.getElementById(`page${page_number}`).classList.add('active')
 document.getElementById('nextBtn').parentElement.classList.remove('disabled')
  start_index=(page_number-1)*record_per_page;
  end_index=start_index+(record_per_page-1);
  list.innerHTML = '';
  console.log('281------------------', end_index)
  for(let i=start_index;i<=end_index;i++){
    addTransactionDOM(transactions[i])
  }
  pageDetail.innerHTML=`Showing ${start_index+1} to ${end_index+1} of ${total_records}`
}

records_size.addEventListener('change',async function(e){
  const token = localStorage.getItem('token');
  const res= await axios.get(`http://13.48.40.12/expenses?page=${page_number}}`, { headers: { "Authorization": token } })
  transactions = res.data.allExpenses;
  const total_records=transactions.length;
  record_per_page=parseInt(records_size.value);
  total_page=Math.ceil(total_records/record_per_page)
  let start_index=(page_number-1)*record_per_page;
  let end_index=start_index+(record_per_page-1);
  list.innerHTML = '';
  console.log('281------------------', end_index)
  for(let i=start_index;i<=end_index;i++){
    addTransactionDOM(transactions[i])
  }

  generatePage()
  pageDetail.innerHTML=`Showing ${start_index+1} to ${end_index+1} of ${total_records}`
 

})
function page(index){
  page_number=parseInt(index)
  document.querySelectorAll('.dynamic-item').forEach(item=>{
    item.classList.remove('active')
  })
  document.getElementById(`page${page_number}`).classList.add('active')
  let start_index=(page_number-1)*record_per_page;
  console.log('225', start_index)
  let end_index=start_index+(record_per_page-1);
  console.log('226', end_index)
  list.innerHTML = '';
  for(let i=start_index;i<=end_index;i++){
    addTransactionDOM(transactions[i])
  }
  pageDetail.innerHTML=`Showing ${start_index+1} to ${end_index+1} of ${total_records}`
}
  
window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  try{
const res= await axios.get(`http://13.48.40.12/expenses?page=${page_number}`, { headers: { "Authorization": token } })
console.log('157,------------dil------------00000000000000000000', res)
 
 transactions = res.data.allExpenses;
 total_records=transactions.length;
 console.log('20000005', total_records);
 total_page=Math.ceil(total_records/record_per_page)

 console.log('207',total_page)
 let start_index=(page_number-1)*record_per_page;
 let end_index=start_index+(record_per_page-1);
 console.log('281------------------', end_index)
 for(let i=start_index;i<=end_index;i++){
   addTransactionDOM(transactions[i])
 }
 pageDetail.innerHTML=`Showing ${start_index+1} to ${end_index+1} of ${total_records}`
generatePage();
 
}catch(err){
  console.log(err) 
}

const decodeToken = parseJwt(token);
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
  const data = await axios.get("http://13.48.40.12/expense/get-expense", { headers: { "Authorization": token } })
    .then((response) => {
      console.log('1111111111888888888888444444444444', response)
      
      // for (var i = 0; i < response.data.allExpenses.length; i++) {
      //   addTransactionDOM(response.data.allExpenses[i])
      // }
      // transactions = response.data.allExpenses;
      // console.log("144", transactions)
      // list.innerHTML = '';
      // console.log("list------------------<<<<<", list)
      // transactions.forEach(addTransactionDOM);
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
    const userLeaderBoardArray = await axios.get('http://13.48.40.12/premium/showleaderboard', { headers: { "Authorization": token } })
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
    const response = await axios.get('http://13.48.40.12/userexpense/download', {
      headers: { "Authorization": token }
    });
      console.log('3393393339333339', response)
    if (response.status === 200) {
      const downloadUrl = response.data.fileUrl;
      console.log('342_______________--------------', downloadUrl)
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
    const token = localStorage.getItem('token');
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
      const purchaseResponse = await axios.get("http://13.48.40.12/purchase/premiummembership", {
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
          const response = await axios.post('http://13.48.40.12/purchase/updatetransactionstatus', {
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




