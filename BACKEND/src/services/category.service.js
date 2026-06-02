import pool from '../config/db.js'
import { createError } from '../utils/createError.js'
import { generateSlug } from '../utils/createSlug.js'
import {
    validate_category_data,
    validate_category_id,
} from '../validators/category.validator.js'

// VERIFICATIONS

export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

export const category_has_products = async id => {
    const result = await pool.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id])
    return result.rows.length > 0
}

// ==================== SERVICES CRUD ====================

export const create_category = async name => {
    const validatedName = validate_category_data(name)

    const slug = generateSlug(validatedName)

    const result = await pool.query(
        `INSERT INTO categories (name, slug)
             VALUES ($1, $2)
             RETURNING *`,
        [validatedName, slug],
    )

    return result.rows[0]
}


// A revoir
export const get_all_categories = async (limit = 100, offset = 0) => {
    const maxLimit = Math.min(limit, 500)
    const validOffset = Math.max(0, offset)

    const result = await pool.query(
        `SELECT * FROM categories
         ORDER BY name
         LIMIT $1 OFFSET $2`,
        [maxLimit, validOffset],
    )
    return result.rows
}

export const get_category_by_id = async id => {
    const numericId = validate_category_id(id)

    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [numericId])

    if (result.rows.length === 0) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}


// A revoir
export const search_categories_by_name = async searchTerm => {
    if (!searchTerm || searchTerm.trim() === '') {
        return []
    }

    const sanitized = searchTerm.trim().replace(/[%_]/g, '\\$&').substring(0, 100)

    const result = await pool.query(
        `SELECT * FROM categories
         WHERE name ILIKE $1
         ORDER BY name
         LIMIT 50`,
        [`%${sanitized}%`],
    )

    return result.rows
}

export const update_category = async (id, name) => {
    const numericId = validate_category_id(id)
    const validatedName = validate_category_data(name)

    const slug = generateSlug(validatedName)

    const result = await pool.query(
        `UPDATE categories
         SET name = $1,
             slug = $2
         WHERE id = $3
         RETURNING *`,
        [validatedName, slug, numericId],
    )

    if (result.rows.length === 0) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}

export const delete_category = async id => {
    const numericId = validate_category_id(id)

    if (!(await category_exists_by_id(numericId))) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    if (await category_has_products(numericId)) {
        throw createError('CATEGORY_HAS_PRODUCTS')
    }

    const result = await pool.query(
        `DELETE FROM categories
         WHERE id = $1
         RETURNING *`,
        [numericId],
    )

    if (result.rows.length === 0) {
        throw createError('CATEGORY_DELETION_FAILED')
    }

    return result.rows[0]
}
