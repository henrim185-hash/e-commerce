import pool from '../config/db.js'
import { createError } from '../utils/createError.js'
import { validate_pagination } from '../validators/validate_pagination.js'
import { validate_search_term } from '../validators/validate_search_term.js'
import { validate_product_id, validate_product_data } from '../validators/product.validator.js'

export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

// CREATE
export const create_product = async (name, description, category_id) => {
    const validated = validate_product_data(name, description, category_id)

    const categoryExists = await category_exists_by_id(validated.category_id)

    if (!categoryExists) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    const result = await pool.query(
        `INSERT INTO products (name, description, category_id)
         VALUES ($1, $2, $3)
         RETURNING name, description, category_id`,
        [validated.name, validated.description, validated.category_id],
    )

    return result.rows[0]
}

// GET ALL
export const get_all_products = async (page_param = 1) => {
    const { page, limit, offset } = validate_pagination(page_param)

    const result = await pool.query(
        `SELECT id, name, description, category_id, created_at, updated_at
         FROM products
         ORDER BY id
         LIMIT $1 OFFSET $2`,
        [limit, offset],
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM products')

    const total = Number(countResult.rows[0].count)

    return {
        data: result.rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
}

// GET BY ID
export const get_product_by_id = async id => {
    const numericId = validate_product_id(id)

    const result = await pool.query(
        'SELECT id, name, description, category_id, created_at, updated_at FROM products WHERE id = $1',
        [numericId],
    )

    if (result.rows.length === 0) {
        throw createError('PRODUCT_NOT_FOUND')
    }

    return result.rows[0]
}

// UPDATE
export const update_product = async (id, name, description, category_id) => {
    const validated = validate_product_data(name, description, category_id)
    const numericId = validate_product_id(id)

    const categoryExists = await category_exists_by_id(validated.category_id)

    if (!categoryExists) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    const result = await pool.query(
        `UPDATE products
         SET name = $1,
             description = $2,
             category_id = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING name, description, category_id, updated_at`,
        [validated.name, validated.description, validated.category_id, numericId],
    )

    if (result.rows.length === 0) {
        throw createError('PRODUCT_NOT_FOUND')
    }

    return result.rows[0]
}

// DELETE
export const delete_product = async id => {
    const numericId = validate_product_id(id)

    const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING name, description, category_id',
        [numericId],
    )

    if (result.rows.length === 0) {
        throw createError('PRODUCT_NOT_FOUND')
    }

    return result.rows[0]
}

// DELETE MULTIPLE
export const delete_multiple_products = async ids => {
    const MAX_BULK_DELETE = 100

    if (!Array.isArray(ids) || ids.length === 0) {
        throw createError('PRODUCT_IDS_REQUIRED')
    }

    if (ids.length > MAX_BULK_DELETE) {
        throw createError('TOO_MANY_PRODUCT_IDS')
    }

    const numericIds = [...new Set(ids.map(Number))]

    if (numericIds.some(id => Number.isNaN(id) || id <= 0 || !Number.isInteger(id))) {
        throw createError('INVALID_PRODUCT_ID')
    }

    const existingProducts = await pool.query(
        `SELECT id
         FROM products
         WHERE id = ANY($1)`,
        [numericIds],
    )

    const existingIds = existingProducts.rows.map(row => row.id)

    const missingIds = numericIds.filter(id => !existingIds.includes(id))

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

// SEARCH
export const search_products_by_name = async searchTerm => {
    const SEARCH_LIMIT = Number(process.env.SEARCH_LIMIT) || 50

    const validated_term = validate_search_term(searchTerm)

    const result = await pool.query(
        `SELECT id, name, description, category_id, created_at, updated_at
         FROM products
         WHERE name ILIKE $1
         ORDER BY name
         LIMIT $2`,
        [`%${validated_term}%`, SEARCH_LIMIT],
    )

    return result.rows
}

// GET BY CATEGORY
export const get_products_by_category = async (category_id, page_param = 1) => {
    const numericCategoryId = validate_product_id(category_id)

    const { page, limit, offset } = validate_pagination(page_param)

    const result = await pool.query(
        `SELECT id, name, description, category_id, created_at, updated_at
         FROM products
         WHERE category_id = $1
         ORDER BY name
         LIMIT $2 OFFSET $3`,
        [numericCategoryId, limit, offset],
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM products WHERE category_id = $1', [
        numericCategoryId,
    ])

    const total = Number(countResult.rows[0].count)

    return {
        data: result.rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
}

// COUNT
export const count_products = async () => {
    const result = await pool.query('SELECT COUNT(*) FROM products')
    return Number(result.rows[0].count)
}
