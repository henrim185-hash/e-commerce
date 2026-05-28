import express from 'express'
import cors from 'cors'

// import des routes
import productRoutes from './routes/product.route.js'
import userRoutes from './routes/user.route.js'
import categoryRoutes from './routes/category.route.js'

// app
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        endpoints: {
            products: '/api/products',
            users: '/api/users'
        }
    });
});

// routes produits
app.use('/api', productRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)




export default app
