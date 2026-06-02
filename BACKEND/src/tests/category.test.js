const BASE_URL = 'http://localhost:5000/api/categories'

// GET ALL
async function getAllData(page = 1) {
    const response = await fetch(`${BASE_URL}?page=${page}`)
    console.log(await response.json())
}

// GET BY ID
async function getDataById(id) {
    const response = await fetch(`${BASE_URL}/${id}`)
    console.log(await response.json())
}

// CREATE
async function postData() {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Pantalon Bleu',
            description: 'Vêtements tendance',
        }),
    })

    console.log(await response.json())
}

// UPDATE
async function updateData(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Chemise Manche long',
            description: 'Nouvelle description',
        }),
    })

    console.log(await response.json())
}

// DELETE ONE
async function deleteData(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    })

    console.log(await response.json())
}

// DELETE MULTIPLE
async function deleteMultipleData() {
    const response = await fetch(BASE_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ids: [1, 2, 3],
        }),
    })

    console.log(await response.json())
}

// COUNT
async function countData() {
    const response = await fetch(`${BASE_URL}/count`)
    console.log(await response.json())
}

// SEARCH
async function searchData(searchTerm) {
    const response = await fetch(`${BASE_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}`)

    console.log(await response.json())
}

// UTILISATION

getAllData()
// getAllData(2)

// getDataById()

// postData()

// updateData(10)

// deleteData(10)

// deleteMultipleData()

// countData()

// searchData('shirt')
