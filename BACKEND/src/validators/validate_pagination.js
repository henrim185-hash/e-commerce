import { createError } from '../utils/createError.js'

const PAGINATION_LIMIT = Number(process.env.PAGINATION_LIMIT) || 50

export const validate_pagination = (page = 1) => {
    const page_number = Number(page)

    if (!Number.isInteger(page_number) || page_number < 1) {
        throw createError('PAGINATION_PAGE_INVALID')
    }
    if (!Number.isInteger(PAGINATION_LIMIT) || PAGINATION_LIMIT < 1 || PAGINATION_LIMIT > 100) {
        throw createError('PAGINATION_LIMIT_INVALID')
    }

    return {
        page: page_number,
        limit: PAGINATION_LIMIT,
        offset: (page_number - 1) * PAGINATION_LIMIT,
    }
}
