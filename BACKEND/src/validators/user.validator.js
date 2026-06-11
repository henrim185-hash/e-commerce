import { createError } from '../utils/createError.js'

export const validate_user_data = (name, email, password) => {
    const cleanName = validate_name(name)
    const cleanEmail = validate_email(email)
    const cleanPassword = validate_password(password)

    return {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
    }
}

export const validate_password = password => {
    if (!password || typeof password !== 'string') {
        throw createError('INVALID_PASSWORD')
    }

    if (password.length < 6) {
        throw createError('INVALID_PASSWORD')
    }

    return password
}

export const validate_role = role => {
    if (!role || typeof role !== 'string') {
        throw createError('INVALID_ROLE')
    }

    const normalized = role.trim().toLowerCase()

    const validRoles = ['customer', 'admin']

    if (!validRoles.includes(normalized)) {
        throw createError('INVALID_ROLE')
    }

    return normalized
}

export const validate_email = email => {
    if (!email || typeof email !== 'string') {
        throw createError('INVALID_EMAIL')
    }

    const normalized = email.trim().toLowerCase()

    if (!normalized.includes('@')) {
        throw createError('INVALID_EMAIL')
    }

    return normalized
}

export const validate_name = name => {
    if (!name || typeof name !== 'string') {
        throw createError('INVALID_NAME')
    }

    const trimmed = name.trim()

    if (trimmed === '') {
        throw createError('INVALID_NAME')
    }

    if (trimmed.length > 100) {
        throw createError('USER_NAME_TOO_LONG')
    }

    return trimmed
}

export const validate_user_id = id => {
    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0 || Number.isNaN(numericId)) {
        throw createError('USER_ID_INVALID')
    }

    return numericId
}

export const validate_user_ids = ids => {
    if (!Array.isArray(ids)) {
        throw createError('INVALID_USER_IDS')
    }

    if (ids.length === 0) {
        throw createError('INVALID_USER_IDS')
    }

    const numericIds = ids.map(id => Number(id))

    const hasInvalid = numericIds.some(id => !Number.isInteger(id) || id <= 0)

    if (hasInvalid) {
        throw createError('INVALID_USER_ID')
    }

    return numericIds
}

export const validate_search_term = term => {
    if (!term || typeof term !== 'string') {
        throw createError('INVALID_SEARCH_TERM')
    }

    const trimmed = term.trim()

    if (trimmed.length === 0) {
        throw createError('INVALID_SEARCH_TERM')
    }

    if (trimmed.length > 100) {
        throw createError('INVALID_SEARCH_TERM')
    }

    return trimmed
}
