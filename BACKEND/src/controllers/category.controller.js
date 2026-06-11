import * as category_services from '../services/category.service.js'
import { handleError } from '../utils/handleError.js'

// CREATE
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body

        const newCategory = await category_services.create_category(name)

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// GET ALL
export const getAllCategories = async (req, res) => {
    try {
        const page_query = req.query.page

        const result = await category_services.get_all_categories(page_query)

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}

// GET BY ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const category = await category_services.get_category_by_id(id)

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// UPDATE
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        const category = await category_services.update_category(id, name)

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// DELETE
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const category = await category_services.delete_category(id)

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: category,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// DELETE MULTIPLE
export const deleteMultipleCategories = async (req, res) => {
    try {
        const { ids } = req.body

        const result = await category_services.delete_multiple_categories(ids)

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} categories deleted successfully`,
            data: {
                deleted: result.deleted,
                missing: result.missing,
                deletedCount: result.deletedCount,
                missingCount: result.missingCount,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}

// SEARCH
export const searchCategories = async (req, res) => {
    try {
        const { searchTerm } = req.query

        const categories = await category_services.search_categories_by_name(searchTerm)

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories,
            count: categories.length,
        })
    } catch (err) {
        handleError(err, res)
    }
}
