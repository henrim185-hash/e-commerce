async function getAllProducts(page = 1) {
    const fetcher = await fetch(`http://localhost:5000/api/products?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const response = await fetcher.json()
    console.log(response)
}

async function getProductById(id) {
    const fetcher = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const response = await fetcher.json()
    console.log(response)
}

async function createProduct() {
    const fetcher = await fetch(`http://localhost:5000/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'T-shirt Oversize',
            description: 'T-shirt oversize de très bonne qualité',
            category_id: 1,
        }),
    })

    const response = await fetcher.json()
    console.log(response)
}

async function updateProduct(id) {
    const fetcher = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Pull Oversize',
            description: 'Pull oversize mis à jour avec succès',
            category_id: 1,
        }),
    })

    const response = await fetcher.json()
    console.log(response)
}

async function deleteProduct(id) {
    const fetcher = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const response = await fetcher.json()
    console.log(response)
}

async function deleteMultipleProducts() {
    const fetcher = await fetch(`http://localhost:5000/api/products`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ids: [4, 14, 3],
        }),
    })

    const response = await fetcher.json()
    console.log(response)
}

async function searchProducts(searchTerm) {
    const fetcher = await fetch(
        `http://localhost:5000/api/products/search?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )

    const response = await fetcher.json()
    console.log(response)
}

async function getProductsByCategory(category_id) {
    const fetcher = await fetch(`http://localhost:5000/api/products/category/${category_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const response = await fetcher.json()
    console.log(response)
}

async function countProducts() {
    const fetcher = await fetch(`http://localhost:5000/api/products/count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const response = await fetcher.json()
    console.log(response)
}

// ==================== TESTS ====================

// getAllProducts()

// getProductById(11)

// createProduct()

// updateProduct(11)

// deleteProduct()

// deleteMultipleProducts()

// searchProducts('shirt')

// getProductsByCategory(1)

// countProducts()
