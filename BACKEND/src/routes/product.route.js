import express from 'express'
import * as productController from '../controllers/product.controller.js'

const router = express.Router()

router.post('/products', productController.createProductController)
router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getProductById)
router.put('/products/:id', productController.updateProduct)
router.delete('/products/:id', productController.deleteProduct)

export default router
