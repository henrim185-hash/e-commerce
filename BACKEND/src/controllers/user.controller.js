import * as user_services from '../services/user.service.js'

// ==================== CRÉER ====================

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const newUser = await user_services.create_user(name, email, password, role)

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser,
        })
    } catch (err) {
        if (err.message === 'Email already exists') {
            res.status(409).json({
                success: false,
                message: err.message,
            })
        } else if (
            err.message === 'Password must be at least 6 characters' ||
            err.message === 'Name is required' ||
            err.message === 'Valid email is required'
        ) {
            res.status(400).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// ==================== LIRE (READ) ====================

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await user_services.get_all_users()

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users: allUsers,
            count: allUsers.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await user_services.get_user_by_id(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            user: user,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Récupérer un utilisateur par email
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params

        const user = await user_services.get_user_by_email(email)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            user: user,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// Rechercher des utilisateurs par nom
export const searchUsersByName = async (req, res) => {
    try {
        const { searchTerm } = req.query

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required',
            })
        }

        const users = await user_services.search_users_by_name(searchTerm)

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users: users,
            count: users.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

// ==================== METTRE À JOUR (UPDATE) ====================

// Mettre à jour le profil d’un utilisateur
export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email } = req.body

        const updatedUser = await user_services.update_user_profile(id, name, email)

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            user: updatedUser,
        })
    } catch (err) {
        if (err.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else if (err.message === 'Email already in use by another user') {
            res.status(409).json({
                success: false,
                message: err.message,
            })
        } else if (
            err.message === 'Name is required' ||
            err.message === 'Valid email is required'
        ) {
            res.status(400).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// Mettre à jour le mot de passe d’un utilisateur
export const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body

        const updatedUser = await user_services.update_user_password(id, password)

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            user: updatedUser,
        })
    } catch (err) {
        if (err.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else if (err.message === 'Password must be at least 6 characters') {
            res.status(400).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// Mettre à jour le rôle d’un utilisateur
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        const updatedUser = await user_services.update_user_role(id, role)

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user: updatedUser,
        })
    } catch (err) {
        if (err.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else if (err.message === 'Invalid role. Must be customer or admin') {
            res.status(400).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// ==================== SUPPRIMER (DELETE) ====================

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        await user_services.delete_user(id)

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })
    } catch (err) {
        if (err.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}

// Supprimer plusieurs utilisateurs
export const deleteMultipleUsers = async (req, res) => {
    try {
        const { ids } = req.body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid ids array is required',
            })
        }

        const deletedUsers = await user_services.delete_multiple_users(ids)

        res.status(200).json({
            success: true,
            message: `${deletedUsers.length} users deleted successfully`,
            users: deletedUsers,
            count: deletedUsers.length,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}
