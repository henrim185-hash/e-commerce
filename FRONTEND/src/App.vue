<template>
    <h1>Hello World</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quia nihil neque doloribus praesentium! Soluta unde harum culpa iure, rem repellat vel aliquid illo natus odit atque est quos iste.</p>
</template>

<script setup>
async function testing() {
    const fetcher = await fetch('http://localhost:5000/api/products')
    const response = await fetcher.json()

    console.log(response)
}

testing()

</script>