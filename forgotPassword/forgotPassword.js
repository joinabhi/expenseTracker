function forgotPassword(event) {
    event.preventDefault()
    const email = event.target.email.value;
    const user = {
        email
    }
    document.forms[0].reset();
    axios.post('http://localhost:9100/password/forgotpassword', user)
        .then(response => {
            if (response.status === 202) {
                document.body.innerHTML +=
                    '<div style="color:green;">Mail Successfully sent</div>'
            } else {
                throw new Error('something went wrong!!!')
            }
        }).catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err}</div>`
        })
}