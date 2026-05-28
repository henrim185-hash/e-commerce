import express from 'express'
import * as productController from '../controllers/product.controller.js'

const router = express.Router()

router.post('/products', productController.createProductController)
router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getProductById)
router.put('/products/:id', productController.updateProduct)
router.delete('/products/:id', productController.deleteProduct)

router.delete('/products', productController.deleteMultipleProducts)
router.get('/products/search', productController.searchProductsByName)
router.get('/products/category/:category_id', productController.getProductsByCategory)
router.get('/products/count', productController.countProducts)

export default router
