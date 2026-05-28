async function testing() {
    const fetcher = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            name: 'Michel henri kouassi',
            email: 'henrim185@gmail.com',
            password: 'Michel@123',
            role: 'customer'
        })
    })
    const response = await fetcher.json()
    console.log(response)
}

async function getUserById(id) {
    const response = await fetch(`http://localhost:5000/api/users/${id}`)
    const data = await response.json()
    console.log(data.success)
}



// testing()
// getUserById(1)