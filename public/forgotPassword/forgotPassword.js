function forgotPassword(event) {
    event.preventDefault()
    const email = event.target.email.value;
    const user = {
        email
    }
    document.forms[0].reset();
    axios.post('http://13.48.40.12/password/forgotpassword', user)
        .then(response => {
            console.log('10 ka dum', response)
            if (response.status === 200) {
                document.body.innerHTML +=
                    '<div style="color:green;">Mail Successfully sent</div>'
            } else {
                throw new Error('something went wrong!!!')
            }
        }).catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err}</div>`
        })
}