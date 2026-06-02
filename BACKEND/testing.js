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
            name: 'T-shirt',
            description: 'Bon',
            category_id: 'abc',
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
        },
    })
    const response = await fetcher.json()
    console.log(response)
}

async function updateData(productId) {
    const fetcher = await fetch(`http://localhost:5000/api/categories/${productId}`, {
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
    const fetcher = await fetch(`http://localhost:5000/api/categories`, {
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
// deleteData('16')
// deleteMultipleData()
// getDataById('4')
// getAlldata()
