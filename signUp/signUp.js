function signUp(event) {
  event.preventDefault(); // Prevents the default form submission behavior
  // Extract the form input values
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
 // Create a user object with the extracted values
  const user = {
    name,
    email,
    password
  };
// Reset the form fields
  document.forms[0].reset(); 
// Send a POST request to the backend API using Axios
  axios.post("http://localhost:9100/user/add-signUp", user)
    .then((response) => {
      if(response.status===201){  
        alert(response.data.message)
    }
      })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
       alert("user already exists");
        
      } else {
        console.log(JSON.stringify(error))
            document.body.innerHTML+=`<div style="color:red;">${error.message}</div>`
      }
    });
}

  