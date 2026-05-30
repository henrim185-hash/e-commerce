import * as category_services from '../services/category.service.js'
import { handleError } from '../utils/handleError.js'

// ==================== CRÉER ====================
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body

        const newCategory = await category_services.create_category(name)

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: newCategory,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const categories = await category_services.get_all_categories()

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            categories,
            count: categories.length,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const category = await category_services.get_category_by_id(id)

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params

        const category = await category_services.get_category_by_slug(slug)

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        const category = await category_services.update_category(id, name)

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const category = await category_services.delete_category(id)

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const searchCategories = async (req, res) => {
    try {
        const { searchTerm } = req.query

        const categories = await category_services.search_categories_by_name(searchTerm)

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            categories,
            count: categories.length,
        })
    } catch (err) {
        handleError(err, res)
    }
}