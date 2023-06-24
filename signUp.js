function signUp(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    const user = {
      name,
      email,
      password
    };
    document.forms[0].reset();
    axios.post("http://localhost:9100/user/add-signUp", user)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          console.log("User already exists");
        } else {
          console.log(error);
        }
      });
  }
  