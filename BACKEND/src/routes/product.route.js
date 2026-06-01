import express from 'express'
import * as productController from '../controllers/product.controller.js'

const router = express.Router()

// CREATE
router.post('/products', productController.createProductController)

// READ
router.get('/products/count', productController.countProducts)
router.get('/products/search', productController.searchProductsByName)
router.get('/products/category/:category_id', productController.getProductsByCategory)
router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getProductById)

// UPDATE
router.put('/products/:id', productController.updateProduct)

// DELETE
router.delete('/products', productController.deleteMultipleProducts)
router.delete('/products/:id', productController.deleteProduct)

export default router
