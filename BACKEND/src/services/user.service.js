import pool from '../config/db.js'

// ==================== SERVICES DE VÉRIFICATION (CHECKERS) ====================

// Vérifier que les données utilisateur sont valides
export const verify_user_data = (name, email, password) => {
    if (!name || name.trim() === '') {
        throw new Error('Name is required')
    }
    if (!email || !email.includes('@')) {
        throw new Error('Valid email is required')
    }
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters')
    }
}

export const verify_password = password => {
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters')
    }
}

// Vérifier si l'utilisateur existe
export const user_exists = async id => {
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [id])
    return result.rows.length > 0
}

// Vérifier si un email existe déjà dans la base
export const email_exists = async email => {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    return result.rows.length > 0
}

// Vérifier si l'email est utilisé par un autre utilisateur (pour update)
export const email_exists_for_other_user = async (email, currentUserId) => {
    const result = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [
        email,
        currentUserId,
    ])
    return result.rows.length > 0
}

// ==================== SERVICES CRUD ====================

// Créer un utilisateur
export const create_user = async (name, email, password, role = 'customer') => {
    // Vérifier si l'email existe déjà
    if (await email_exists(email)) {
        throw new Error('Email already exists')
    }

    // Valider les données
    verify_user_data(name, email, password)

    const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password, role],
    )
    return result.rows[0]
}

// Récupérer tous les utilisateurs
export const get_all_users = async () => {
    const result = await pool.query('SELECT * FROM users')
    return result.rows
}

// Récupérer un utilisateur par son id
export const get_user_by_id = async id => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0]
}

// Récupérer un utilisateur par email
export const get_user_by_email = async email => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0]
}

// Mettre à jour le profil (nom, email)
export const update_user_profile = async (id, name, email) => {
    // Vérifier que l'utilisateur existe
    if (!(await user_exists(id))) {
        throw new Error('User not found')
    }

    // Valider les données
    if (!name || name.trim() === '') {
        throw new Error('Name is required')
    }
    if (!email || !email.includes('@')) {
        throw new Error('Valid email is required')
    }

    // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
    if (await email_exists_for_other_user(email, id)) {
        throw new Error('Email already in use by another user')
    }

    const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
        [name, email, id],
    )
    return result.rows[0]
}

// Changer le mot de passe
export const update_user_password = async (id, newPassword) => {
    // Vérifier que l'utilisateur existe
    if (!(await user_exists(id))) {
        throw new Error('User not found')
    }

    // Valider le nouveau mot de passe
    verify_password(newPassword)

    const result = await pool.query(
        `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [newPassword, id],
    )
    return result.rows[0]
}

// Changer le rôle (admin seulement)
export const update_user_role = async (id, role) => {
    // Vérifier que l'utilisateur existe
    if (!(await user_exists(id))) {
        throw new Error('User not found')
    }

    // Vérifier que le rôle est valide
    const validRoles = ['customer', 'admin']
    if (!validRoles.includes(role)) {
        throw new Error('Invalid role. Must be customer or admin')
    }

    const result = await pool.query(
        `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [role, id],
    )
    return result.rows[0]
}

// Supprimer un utilisateur
export const delete_user = async id => {
    // Vérifier que l'utilisateur existe
    if (!(await user_exists(id))) {
        throw new Error('User not found')
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
}

// Supprimer plusieurs utilisateurs
export const delete_multiple_users = async ids => {
    const result = await pool.query('DELETE FROM users WHERE id = ANY($1) RETURNING *', [ids])
    return result.rows
}

// Rechercher des utilisateurs par nom
export const search_users_by_name = async searchTerm => {
    const result = await pool.query('SELECT * FROM users WHERE name ILIKE $1', [`%${searchTerm}%`])
    return result.rows
}
