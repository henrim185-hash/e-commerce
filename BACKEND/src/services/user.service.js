import pool from '../config/db.js'
import { createError } from '../utils/createError.js'
import { hash_password } from '../utils/hash.js'
import { validate_pagination } from '../validators/validate_pagination.js'
import {
    validate_user_data,
    validate_password,
    validate_role,
    validate_email,
    validate_name,
    validate_user_id,
    validate_user_ids,
    validate_search_term,
} from '../validators/user.validator.js'

export const user_exists = async id => {
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [id])
    return result.rows.length > 0
}

export const email_exists = async email => {
    const validatedEmail = validate_email(email)

    const result = await pool.query('SELECT id FROM users WHERE email = $1', [validatedEmail])

    return result.rows.length > 0
}

export const email_exists_for_other_user = async (email, currentUserId) => {
    const validatedEmail = validate_email(email)

    const result = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [
        validatedEmail,
        currentUserId,
    ])

    return result.rows.length > 0
}

export const create_user = async (name, email, password, role = 'customer') => {
    const validated = validate_user_data(name, email, password)

    const validatedRole = validate_role(role)

    if (await email_exists(validated.email)) {
        throw createError('EMAIL_ALREADY_EXISTS')
    }

    const hashedPassword = await hash_password(validated.password)

    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [validated.name, validated.email, hashedPassword, validatedRole],
    )

    return result.rows[0]
}

export const get_all_users = async (page_param = 1) => {
    const { page, limit, offset } = validate_pagination(page_param)

    const result = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         ORDER BY id
         LIMIT $1 OFFSET $2`,
        [limit, offset],
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM users')

    const total = Number(countResult.rows[0].count)

    return {
        data: result.rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
}

export const get_user_by_id = async id => {
    const numericId = validate_user_id(id)

    const result = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [numericId],
    )

    if (result.rows.length === 0) {
        throw createError('USER_NOT_FOUND')
    }

    return result.rows[0]
}
export const get_user_by_email = async email => {
    const validatedEmail = validate_email(email)
    const result = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE email = $1',
        [validatedEmail],
    )

    if (result.rows.length === 0) {
        throw createError('USER_NOT_FOUND')
    }
    return result.rows[0]
}
export const update_user_profile = async (id, name, email) => {
    const numericId = validate_user_id(id)

    if (!(await user_exists(numericId))) {
        throw createError('USER_NOT_FOUND')
    }

    const validatedName = validate_name(name)
    const validatedEmail = validate_email(email)

    if (await email_exists_for_other_user(validatedEmail, numericId)) {
        throw createError('EMAIL_ALREADY_IN_USE')
    }

    const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING id, name, email, role, updated_at`,
        [validatedName, validatedEmail, numericId],
    )
    return result.rows[0]
}

export const update_user_password = async (id, newPassword) => {
    const numericId = validate_user_id(id)

    if (!(await user_exists(numericId))) {
        throw createError('USER_NOT_FOUND')
    }

    const hashedPassword = await hash_password(validate_password(newPassword))

    const result = await pool.query(
        `UPDATE users
     SET password = $1,
     updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, role, updated_at`,
        [hashedPassword, numericId],
    )
    return result.rows[0]
}
export const update_user_role = async (id, role) => {
    const numericId = validate_user_id(id)

    const validatedRole = validate_role(role)

    if (!(await user_exists(numericId))) {
        throw createError('USER_NOT_FOUND')
    }

    const result = await pool.query(
        `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role, updated_at`,
        [validatedRole, numericId],
    )
    return result.rows[0]
}
export const delete_user = async id => {
    const numericId = validate_user_id(id)

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email', [
        numericId,
    ])

    if (result.rows.length === 0) {
        throw createError('USER_NOT_FOUND')
    }

    return result.rows[0]
}

export const delete_multiple_users = async ids => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw createError('USER_IDS_REQUIRED')
    }

    const numericIds = ids.map(Number)

    if (numericIds.some(id => Number.isNaN(id) || id <= 0 || !Number.isInteger(id))) {
        throw createError('INVALID_USER_ID')
    }

    const existingUsers = await pool.query(
        `SELECT id
         FROM users
         WHERE id = ANY($1)`,
        [numericIds],
    )

    const existingIds = existingUsers.rows.map(row => row.id)

    const missingIds = numericIds.filter(id => !existingIds.includes(id))

    const result = await pool.query(
        'DELETE FROM users WHERE id = ANY($1) RETURNING id, name, email',
        [numericIds],
    )

    return {
        deleted: result.rows,
        missing: missingIds,
        deletedCount: result.rows.length,
        missingCount: missingIds.length,
    }
}

export const search_users_by_name = async (searchTerm, page_param = 1) => {
    const validated_term = validate_search_term(searchTerm)
    const { page, limit, offset } = validate_pagination(page_param)

    const result = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE name ILIKE $1
         ORDER BY name
         LIMIT $2 OFFSET $3`,
        [`%${validated_term}%`, limit, offset],
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM users WHERE name ILIKE $1', [
        `%${validated_term}%`,
    ])

    const total = Number(countResult.rows[0].count)

    return {
        data: result.rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
}
