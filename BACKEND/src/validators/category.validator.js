import pool from '../config/db.js'
import { createError } from '../utils/createError.js'

export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

export const category_has_products = async id => {
    const result = await pool.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id])
    return result.rows.length > 0
}

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

// VERIFIFIER ID
export const verify_category_id = id => {
    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw createError('CATEGORY_ID_INVALID')
    }

    return numericId
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
