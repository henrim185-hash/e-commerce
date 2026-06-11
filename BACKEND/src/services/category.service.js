import pool from '../config/db.js'
import { createError } from '../utils/createError.js'
import { generateSlug } from '../utils/createSlug.js'
import { validate_category_data, validate_category_id } from '../validators/category.validator.js'
import { validate_pagination } from '../validators/validate_pagination.js'
import { validate_search_term } from '../validators/validate_search_term.js'

// VERIFICATIONS

export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

export const category_has_products = async id => {
    const result = await pool.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id])
    return result.rows.length > 0
}

// CREATE
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

// GET ALL
export const get_all_categories = async (page_param = 1) => {
    const { page, limit, offset } = validate_pagination(page_param)

    const result = await pool.query(
        `SELECT id, name, slug
         FROM categories
         ORDER BY name
         LIMIT $1 OFFSET $2`,
        [limit, offset],
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM categories')

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
export const get_category_by_id = async id => {
    const numericId = validate_category_id(id)

    const result = await pool.query('SELECT id, name, slug FROM categories WHERE id = $1', [
        numericId,
    ])

    if (result.rows.length === 0) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}

// UPDATE
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

// DELETE
export const delete_category = async id => {
    const numericId = validate_category_id(id)

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
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}

// DELETE MULTIPLE (A revoir)
export const delete_multiple_categories = async ids => {
    const MAX_BULK_DELETE = 100

    if (!Array.isArray(ids) || ids.length === 0) {
        throw createError('CATEGORY_IDS_REQUIRED')
    }

    if (ids.length > MAX_BULK_DELETE) {
        throw createError('TOO_MANY_CATEGORY_IDS')
    }

    const numericIds = [...new Set(ids.map(Number))]

    if (numericIds.some(id => Number.isNaN(id) || id <= 0 || !Number.isInteger(id))) {
        throw createError('INVALID_CATEGORY_ID')
    }

    const existingCategory = await pool.query(
        `SELECT id
         FROM categories
         WHERE id = ANY($1)`,
        [numericIds],
    )

    const existingIds = existingCategory.rows.map(row => row.id)

    const missingIds = numericIds.filter(id => !existingIds.includes(id))

    const result = await pool.query(
        `DELETE FROM categories
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
export const search_categories_by_name = async searchTerm => {
    const validated_term = validate_search_term(searchTerm)

    const result = await pool.query(
        `SELECT * FROM categories
         WHERE name ILIKE $1
         ORDER BY name
         LIMIT 50`,
        [`%${validated_term}%`],
    )

    return result.rows
}
