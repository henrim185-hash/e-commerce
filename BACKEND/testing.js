async function getAlldata() {
    const fetcher = await fetch(`http://localhost:5000/api/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function getDataById(id) {
    const fetcher = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function PostData() {
    const fetcher = await fetch(`http://localhost:5000/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'pull oversized',
            description: 'Bonjour les gens comment allez vous',
            category_id: 2,
        }),
    })
    const response = await fetcher.json()
    console.log(response)
}

async function deleteData(id) {
    const fetcher = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function updateData(productId) {
    const fetcher = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Update de pull over',
            description: 'Bonjour les gens comment allez vous',
            category_id: 2,
            // id n'est PAS envoyé dans le body
        }),
    })

    const response = await fetcher.json()
    console.log(response)
}


async function deleteMultipleData() {
    const fetcher = await fetch(`http://localhost:5000/api/products`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify ({
            ids: [2, 3]
        })
    })
    const response = await fetcher.json()
    console.log(response)
}

// Utilisation :
// const productId = 5 
// updateData(productId)

// PostData()
// upDateData()
// deleteData('5')
// deleteMultipleData()
// getDataById('4')
// getAlldata()
