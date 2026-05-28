async function testing() {
    const fetcher = await fetch('http://localhost:5000/api/products')
    const response = await fetcher.json()

    console.log(response)
}

testing()