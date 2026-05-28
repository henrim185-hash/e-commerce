import * as category_services from '../services/category.service.js'

// ==================== CRÉER UNE CATÉGORIE ====================
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
        if (err.message === 'Category name is required') {
            res.status(400).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// ==================== RÉCUPÉRER TOUTES LES CATÉGORIES ====================
export const getAllCategories = async (req, res) => {
    try {
        const categories = await category_services.get_all_categories()

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            categories: categories,
            count: categories.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== RÉCUPÉRER UNE CATÉGORIE PAR ID ====================
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid category ID is required',
            })
        }

        const category = await category_services.get_category_by_id(id)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            category: category,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== RÉCUPÉRER UNE CATÉGORIE PAR SLUG ====================
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const category = await category_services.get_category_by_slug(slug)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            category: category,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== METTRE À JOUR UNE CATÉGORIE ====================
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        const category = await category_services.update_category(id, name)

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: category,
        })
    } catch (err) {
        if (
            err.message === 'Valid category ID is required' ||
            err.message === 'Category name is required'
        ) {
            res.status(400).json({
                success: false,
                message: err.message,
            })
        } else if (err.message === 'Category not found') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else if (err.message === 'Category with this name already exists') {
            res.status(409).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// ==================== SUPPRIMER UNE CATÉGORIE ====================
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid category ID is required',
            })
        }

        const category = await category_services.delete_category(id)

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            category: category,
        })
    } catch (err) {
        if (err.message === 'Category not found') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else if (err.message === 'Cannot delete category with associated products') {
            res.status(409).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// ==================== RECHERCHER DES CATÉGORIES ====================
export const searchCategories = async (req, res) => {
    try {
        const { searchTerm } = req.query
        
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required'
            })
        }
        
        const categories = await category_services.search_categories_by_name(searchTerm)
        
        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            categories: categories,
            count: categories.length
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}