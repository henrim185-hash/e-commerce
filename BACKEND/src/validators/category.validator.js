import { createError } from '../utils/createError.js'

export const validate_category_data = name => {
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
export const validate_category_id = id => {
    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw createError('CATEGORY_ID_INVALID')
    }

    return numericId
}

