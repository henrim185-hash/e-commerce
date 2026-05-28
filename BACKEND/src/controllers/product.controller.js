import * as product_services from '../services/product.service.js'

// Creer un produit
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

// Recuperer tous les produits
export const getAllProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 50
        const offset = Number(req.query.offset) || 0
        const allProducts = await product_services.get_all_product(limit, offset)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            products: allProducts,
            count: allProducts.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Recuperer un produit par son ID
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

// Mettre a jour un produit
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, category_id } = req.body

        product_services.verify_product_data(name, category_id)
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

// Supprimer un produit
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        await product_services.delete_product(id)

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
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
