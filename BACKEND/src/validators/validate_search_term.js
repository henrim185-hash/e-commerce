import { createError } from '../utils/createError.js'

export const validate_search_term = search_term => {
    if (typeof search_term !== 'string' || search_term.trim() === '') {
        throw createError('SEARCH_TERM_REQUIRED')
    }

    const sanitized = search_term
        .trim()
        .replace(/[%_\\]/g, '\\$&')
        .substring(0, 100)
    
    return sanitized
}
