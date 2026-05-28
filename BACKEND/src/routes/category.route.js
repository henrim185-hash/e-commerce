import express from 'express'
import * as categoryController from '../controllers/category.controller.js'

const router = express.Router()


router.post('/categories', categoryController.createCategory)

router.get('/categories', categoryController.getAllCategories)
router.get('/categories/:id', categoryController.getCategoryById)
router.get('/categories/search', categoryController.searchCategories) 
router.get('/categories/slug/:slug', categoryController.getCategoryBySlug)

router.put('/categories/:id', categoryController.updateCategory)


router.delete('/categories/:id', categoryController.deleteCategory)

export default router
