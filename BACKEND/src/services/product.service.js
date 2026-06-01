import pool from '../db/index.js'
import { createError } from '../utils/createError.js'

// VERIFIER SI CATEGORIES EXISTE
export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

// VALIDATION DE PAGINATION
export const verify_pagination = (page, pageSize = 50) => {
    const safePage = Number(page)
    const safePageSize = Number(pageSize)

    if (!Number.isInteger(safePage) || safePage < 1) {
        throw createError('PAGINATION_PAGE_INVALID')
    }

    if (!Number.isInteger(safePageSize) || safePageSize < 1 || safePageSize > 100) {
        throw createError('PAGINATION_LIMIT_INVALID')
    }

    return {
        page: safePage,
        pageSize: safePageSize,
        offset: (safePage - 1) * safePageSize,
    }
}

// VERIFIFIER ID
export const verify_product_id = id => {
    const numericId = Number(id)

    if (!Number.isInteger(id) || id <= 0) {
        throw createError('PRODUCT_ID_INVALID')
    }

    return numericId
}

// VERIFIER LES DONNEES DE PRODUCT
export const verify_product_data = (name, description, category_id) => {
    if (!name || name.trim() === '') {
        throw createError('PRODUCT_NAME_REQUIRED')
    }

    const trimmedName = name.trim()

    if (trimmedName.length < 2) {
        throw createError('PRODUCT_NAME_TOO_SHORT')
    }

    if (trimmedName.length > 100) {
        throw createError('PRODUCT_NAME_TOO_LONG')
    }

    if (!description || description.trim() === '') {
        throw createError('PRODUCT_DESCRIPTION_REQUIRED')
    }

    const trimmedDescription = description.trim()

    if (trimmedDescription.length < 10) {
        throw createError('PRODUCT_DESCRIPTION_TOO_SHORT')
    }

    if (trimmedDescription.length > 5000) {
        throw createError('PRODUCT_DESCRIPTION_TOO_LONG')
    }

    if (!category_id) {
        throw createError('PRODUCT_CATEGORY_INVALID')
    }

    const numericCategoryId = Number(category_id)

    if (Number.isNaN(numericCategoryId) || numericCategoryId <= 0) {
        throw createError('PRODUCT_CATEGORY_INVALID')
    }

    return {
        name: trimmedName,
        description: trimmedDescription,
        category_id: numericCategoryId,
    }
}

// CREER UN PRODUIT
export const create_product = async (name, description, category_id) => {
    const validated = verify_product_data(name, description, category_id)

    const categoryExists = await category_exists_by_id(validated.category_id)

    if (!categoryExists) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    const result = await pool.query(
        `INSERT INTO products (name, description, category_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [validated.name, validated.description, validated.category_id],
    )

    return result.rows[0]
}

// RECUPERER TOUS LES PRODUITS
export const get_all_product = async (page = 1) => {
    const { page: safePage, pageSize, offset } = verify_pagination(page)

    const result = await pool.query(
        `SELECT *
         FROM products
         ORDER BY id
         LIMIT $1 OFFSET $2`,
        [pageSize, offset],
    )

    const countResult = await pool.query(`SELECT COUNT(*) FROM products`)
    const total = Number(countResult.rows[0].count)

    return {
        data: result.rows,
        page: safePage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
    }
}

// RECUPERER UN PRODUIT PAR SON ID
export const get_product_by_id = async id => {
    const numericId = verify_product_id(id)

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [numericId])

    if (result.rows.length === 0) {
        throw createError('PRODUCT_NOT_FOUND')
    }

    return result.rows[0]
}

// METTRE A JOUR UN PRODUIT
export const update_product = async (id, name, description, category_id) => {
    const validated = verify_product_data(name, description, category_id)

    const categoryExists = await category_exists_by_id(validated.category_id)

    if (!categoryExists) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    const numericId = verify_product_id(id)

    const result = await pool.query(
        `UPDATE products
         SET name = $1,
             description = $2,
             category_id = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [validated.name, validated.description, validated.category_id, numericId],
    )

    if (result.rows.length === 0) {
        throw createError('PRODUCT_NOT_FOUND')
    }

    return result.rows[0]
}

// SUPPRIMER UN PRODUIT
export const delete_product = async id => {
    const numericId = verify_product_id(id)

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [numericId])

    if (result.rows.length === 0) {
        throw createError('PRODUCT_NOT_FOUND')
    }

    return result.rows[0]
}

// SUPPRIMER PLUSIEURS PRODUITS
export const delete_multiple_products = async ids => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw createError('PRODUCT_IDS_REQUIRED')
    }

    const numericIds = ids.map(Number)

    if (numericIds.some(id => Number.isNaN(id) || id <= 0)) {
        throw createError('PRODUCT_ID_INVALID')
    }

    // Vérifie les IDs existants
    const existingProducts = await pool.query(
        `SELECT id
         FROM products
         WHERE id = ANY($1)`,
        [numericIds],
    )

    const existingIds = existingProducts.rows.map(row => row.id)

    const missingIds = numericIds.filter(id => !existingIds.includes(id))

    // Supprime les produits existants
    const result = await pool.query(
        `DELETE FROM products
         WHERE id = ANY($1)
         RETURNING *`,
        [numericIds],
    )

    return {
        deleted: result.rows,
        missing: missingIds,
        deletedCount: result.rows.length,
        missingCount: missingIds.length,
    }
}

// RECHERCHER UN PRODUIT PAR LE NOM
export const search_products_by_name = async searchTerm => {
    const SEARCH_LIMIT = 50

    if (!searchTerm || searchTerm.trim() === '') {
        throw createError('PRODUCT_SEARCH_TERM_REQUIRED')
    }

    const sanitizedTerm = searchTerm
        .trim()
        .replace(/[%_\\]/g, '\\$&')
        .substring(0, 100)

    const result = await pool.query(
        `SELECT *
         FROM products
         WHERE name ILIKE $1
         ORDER BY name
         LIMIT $2`,
        [`%${sanitizedTerm}%`, SEARCH_LIMIT],
    )

    return result.rows
}

// PRODUITS PAR CATEGORY
export const get_products_by_category = async category_id => {
    const numericCategoryId = Number(category_id)

    if (Number.isNaN(numericCategoryId) || numericCategoryId <= 0) {
        throw createError('PRODUCT_CATEGORY_INVALID')
    }

    const result = await pool.query(
        `SELECT *
         FROM products
         WHERE category_id = $1
         ORDER BY name`,
        [numericCategoryId],
    )

    return result.rows
}

export const count_products = async () => {
    const result = await pool.query('SELECT COUNT(*) FROM products')
    return Number(result.rows[0].count)
}
