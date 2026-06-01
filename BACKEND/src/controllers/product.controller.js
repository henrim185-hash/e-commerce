import * as product_services from '../services/product.service.js'
import { handleError } from '../utils/handleError.js'

// ==================== CRÉER UN PRODUIT ====================
export const createProductController = async (req, res) => {
    try {
        const { name, description, category_id } = req.body

        const newProduct = await product_services.create_product(name, description, category_id)

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== RÉCUPÉRER TOUS LES PRODUITS ====================
export const getAllProducts = async (req, res) => {
    try {
        const page = req.query.page

        const result = await product_services.get_all_product(page)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: result.data,
            pagination: {
                page: result.page,
                pageSize: result.pageSize,
                total: result.total,
                totalPages: result.totalPages,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== RÉCUPÉRER UN PRODUIT PAR ID ====================
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await product_services.get_product_by_id(id)

        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== METTRE À JOUR UN PRODUIT ====================
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, category_id } = req.body

        const updatedProduct = await product_services.update_product(
            id,
            name,
            description,
            category_id,
        )

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== SUPPRIMER UN PRODUIT ====================
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deletedProduct = await product_services.delete_product(id)

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: deletedProduct,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== SUPPRIMER PLUSIEURS PRODUITS ====================
export const deleteMultipleProducts = async (req, res) => {
    try {
        const { ids } = req.body

        const result = await product_services.delete_multiple_products(ids)

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} products deleted successfully`,
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

// ==================== RECHERCHER DES PRODUITS PAR NOM ====================
export const searchProductsByName = async (req, res) => {
    try {
        const { searchTerm } = req.query

        const products = await product_services.search_products_by_name(searchTerm)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            count: products.length,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== FILTRER LES PRODUITS PAR CATÉGORIE ====================
export const getProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params

        const products = await product_services.get_products_by_category(category_id)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            count: products.length,
        })
    } catch (err) {
        handleError(err, res)
    }
}

// ==================== COMPTER LES PRODUITS ====================
export const countProducts = async (req, res) => {
    try {
        const count = await product_services.count_products()

        res.status(200).json({
            success: true,
            message: 'Product count retrieved successfully',
            data: {
                count,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}
