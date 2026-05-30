async function getAlldata() {
    const fetcher = await fetch(`http://localhost:5000/api/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function getDataById(id) {
    const fetcher = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function PostData() {
    const fetcher = await fetch(`http://localhost:5000/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'pull oversized',
        }),
    })
    const response = await fetcher.json()
    console.log(response)
}

async function upDateData(id) {
    const fetcher = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'test update',
        }),
    })
    const response = await fetcher.json()
    console.log(response)
}

async function deleteData(id) {
    const fetcher = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const response = await fetcher.json()
    console.log(response)
}

// PostData()
// upDateData()
// deleteData('id')
// getDataById('bonjour')
// getAlldata()
