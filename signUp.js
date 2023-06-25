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
      console.log(response);
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        const parentElement = document.getElementById("error-message");
        const childElement=document.createElement('li')
        childElement.textContent = "Email already exists";
        parentElement.append(childElement)
      } else {
        console.log("An error occurred:", error);
      }
    });
}

  