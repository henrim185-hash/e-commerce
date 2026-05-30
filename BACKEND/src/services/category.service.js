import pool from '../db/index.js'
import { createError } from '../utils/createError.js'

const generateSlug = name => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// ==================== VÉRIFICATIONS ====================

export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

export const category_has_products = async id => {
    const result = await pool.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id])
    return result.rows.length > 0
}

// ==================== VALIDATIONS ====================

export const verify_category_data = name => {
    if (!name || name.trim() === '') {
        throw createError('CATEGORY_NAME_REQUIRED')
    }

    const trimmedName = name.trim()

    if (trimmedName.length < 2) {
        throw createError('CATEGORY_NAME_TOO_SHORT')
    }

    if (trimmedName.length > 100) {
        throw createError('CATEGORY_NAME_TOO_LONG')
    }

    if (!/^[a-zA-Z0-9\s\u00C0-\u00FF-]+$/.test(trimmedName)) {
        throw createError('CATEGORY_NAME_INVALID_FORMAT')
    }

    const blacklisted = ['admin', 'system', 'null', 'undefined', 'drop', 'delete']

    if (blacklisted.includes(trimmedName.toLowerCase())) {
        throw createError('CATEGORY_NAME_INVALID')
    }

    return trimmedName
}

export const verify_category_update_data = (id, name) => {
    if (!id) {
        throw createError('CATEGORY_ID_REQUIRED')
    }

    const numericId = Number(id)

    if (Number.isNaN(numericId) || numericId <= 0) {
        throw createError('CATEGORY_ID_INVALID')
    }

    return verify_category_data(name)
}

export const update_category = async (id, name) => {
    const validatedName = verify_category_update_data(id, name)

    const slug = generateSlug(validatedName)

    const result = await pool.query(
        `UPDATE categories
             SET name = $1,
                 slug = $2
             WHERE id = $3
             RETURNING *`,
        [validatedName, slug, id],
    )

    if (result.rows.length === 0) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}

// ==================== SERVICES CRUD ====================

export const create_category = async name => {
    const validatedName = verify_category_data(name)

    const slug = generateSlug(validatedName)

    const result = await pool.query(
        `INSERT INTO categories (name, slug)
             VALUES ($1, $2)
             RETURNING *`,
        [validatedName, slug],
    )

    return result.rows[0]
}

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
    const numericId = Number(id)

    if (Number.isNaN(numericId) || numericId <= 0) {
        throw createError('CATEGORY_ID_INVALID')
    }

    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [numericId])

    if (result.rows.length === 0) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}

export const get_category_by_slug = async slug => {
    if (!slug || slug.trim() === '') {
        throw createError('CATEGORY_SLUG_REQUIRED')
    }

    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug])

    if (result.rows.length === 0) {
        throw createError('CATEGORY_NOT_FOUND')
    }

    return result.rows[0]
}

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

export const delete_category = async id => {
    if (!id) {
        throw createError('CATEGORY_ID_REQUIRED')
    }

    const numericId = Number(id)
    if (Number.isNaN(numericId) || numericId <= 0) {
        throw createError('CATEGORY_ID_INVALID')
    }

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