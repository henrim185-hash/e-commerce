import * as product_services from '../services/product.service.js'

// ==================== CRÉER UN PRODUIT ====================
export const createProductController = async (req, res) => {
    try {
        const { name, description, category_id } = req.body
        product_services.verify_product_data(name, category_id)

        const newProduct = await product_services.create_product(name, description, category_id)

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct,
        })
    } catch (err) {
        if (
            err.message === 'Product name is required' ||
            err.message === 'Valid category_id is required'
        ) {
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

// ==================== RÉCUPÉRER TOUS LES PRODUITS ====================
export const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50
        const offset = parseInt(req.query.offset) || 0

        const products = await product_services.get_all_product(limit, offset)
        const total = await product_services.count_products()

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            products: products,
            pagination: {
                limit: limit,
                offset: offset,
                total: total,
            },
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== RÉCUPÉRER UN PRODUIT PAR ID ====================
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await product_services.get_product_by_id(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            product: product,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
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
            product: updatedProduct,
        })
    } catch (err) {
        if (err.message === 'This product does not exist') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else if (
            err.message === 'Product name is required' ||
            err.message === 'Valid category_id is required'
        ) {
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

// ==================== SUPPRIMER UN PRODUIT ====================
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deletedProduct = await product_services.delete_product(id)

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            product: deletedProduct,
        })
    } catch (err) {
        if (err.message === 'Product not found') {
            res.status(404).json({
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

// ==================== SUPPRIMER PLUSIEURS PRODUITS ====================
export const deleteMultipleProducts = async (req, res) => {
    try {
        const { ids } = req.body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid ids array is required',
            })
        }

        const deletedProducts = await product_services.delete_multiple_products(ids)

        res.status(200).json({
            success: true,
            message: `${deletedProducts.length} products deleted successfully`,
            products: deletedProducts,
            count: deletedProducts.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== RECHERCHER DES PRODUITS PAR NOM ====================
export const searchProductsByName = async (req, res) => {
    try {
        const { searchTerm } = req.query

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required',
            })
        }

        const products = await product_services.search_products_by_name(searchTerm)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            products: products,
            count: products.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== FILTRER LES PRODUITS PAR CATÉGORIE ====================
export const getProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params

        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required',
            })
        }

        const products = await product_services.get_products_by_category(category_id)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            products: products,
            count: products.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== COMPTER LES PRODUITS ====================
export const countProducts = async (req, res) => {
    try {
        const count = await product_services.count_products()

        res.status(200).json({
            success: true,
            message: 'Product count retrieved successfully',
            count: count,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}
