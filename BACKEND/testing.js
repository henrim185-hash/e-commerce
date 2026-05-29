async function postData() {
    const fetcher = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'pantalon cargo',
        }),
    })
    const response = await fetcher.json()
    console.log(response)
}

async function getById(id) {
    const response = await fetch(`http://localhost:5000/api/categories/${id}`)
    const data = await response.json()
    console.log(data)
}

async function deleteSome(id) {
    const fetcher = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function getAll() {
    const fetcher = await fetch(`http://localhost:5000/api/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

// postData()
// getById(3)

// deleteSome(3)

// getAll()
