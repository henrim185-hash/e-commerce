import express from 'express'
import {corsConfig} from './config/cors.config.js'

// import des routes
import productRoutes from './routes/product.route.js'
import userRoutes from './routes/user.route.js'
import categoryRoutes from './routes/category.route.js'

// app
const app = express()

// middlewares
app.use(express.json())
app.use(corsConfig)

// routes
app.use('/api', productRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)




export default app
