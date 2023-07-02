function login(event){
    event.preventDefault();
    const email=event.target.email.value;
    const password=event.target.password.value;

    const userLogin={
        email,
        password
    }
    document.forms[0].reset();

    axios.post("http://localhost:9100/user/add-signIn", userLogin)
         .then(response=>{
            if(response.status===201){
               alert(response.data.message)
               localStorage.setItem('token', response.data.token)
               window.location.href="../expenseTracker/expense.html"
            }
        }).catch(err=>{
            console.log(JSON.stringify(err))
            document.body.innerHTML+=`<div style="color:red;">${err.message}</div>` 
         })
   }
  