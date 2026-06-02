import pool from '../config/db.js'
import { createError } from '../utils/createError.js'

// VERIFIER SI CATEGORIES EXISTE
export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

// VALIDATION DE PAGINATION
export const verify_pagination = (page = 1, pageSize = 50) => {
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

    if (!Number.isInteger(numericId) || numericId <= 0) {
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
