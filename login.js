function login(event){
    event.preventDefault();
    const email=event.target.email.value;
    const password=event.target.password.value;

    const userLogin={
        email,
        password
    }
    document.forms[0].reset();

    axios.post("http://localhost:9100/user/add-login", userLogin)
         .then(response=>{
            alert(data.data.message)
         }).catch(err=>{
            console.log(JSON.stringify(err))
            document.body.innerHTML+=`<div style="color:red;">${err.message}</div>` 
         })
            

}