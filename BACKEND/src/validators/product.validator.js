import { validate_category_id } from './category.validator.js'
import { createError } from '../utils/createError.js'

// VERIFIFIER ID
export const validate_product_id = id => {
    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw createError('PRODUCT_ID_INVALID')
    }

    return numericId
}

// VERIFIER LES DONNEES DE PRODUCT
export const validate_product_data = (name, description, category_id) => {
    if (typeof name !== 'string') {
        throw createError('PRODUCT_NAME_REQUIRED')
    }

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

    if (typeof description !== 'string') {
        throw createError('PRODUCT_DESCRIPTION_REQUIRED')
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

    const numericCategoryId = validate_category_id(category_id)

    return {
        name: trimmedName,
        description: trimmedDescription,
        category_id: numericCategoryId,
    }
}
