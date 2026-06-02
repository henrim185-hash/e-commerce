import { createError } from '../utils/createError.js'
import pool from '../config/db.js'

// ==================== CHECKERS ====================

export const user_exists = async id => {
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [id])
    return result.rows.length > 0
}

export const email_exists = async email => {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    return result.rows.length > 0
}

export const email_exists_for_other_user = async (email, currentUserId) => {
    const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, currentUserId],
    )
    return result.rows.length > 0
}

// ==================== VALIDATION ====================

export const validate_user_data = (name, email, password) => {}

export const validate_password = password => {
    if (!password || password.length < 6) {
        throw createError('INVALID_PASSWORD', 'Password must be at least 6 characters')
    }
}

export const validate_role = role => {
    const validRoles = ['customer', 'admin']

    if (!validRoles.includes(role)) {
        throw createError('INVALID_ROLE', 'Role must be customer or admin')
    }
}

export const validate_email = email => {
    if (!email || !email.includes('@')) {
        throw createError('INVALID_EMAIL', 'Valid email is required')
    }
}

export const validate_name = name => {
    if (!name || name.trim() === '') {
        throw createError('INVALID_NAME', 'Name is required')
    }
}

export const validate_user_data = (name, email, password) => {}