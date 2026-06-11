import * as user_services from '../services/user.service.js'
import { handleError } from '../utils/handleError.js'

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const newUser = await user_services.create_user(name, email, password, role)

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const page_query = req.query.page

        const result = await user_services.get_all_users(page_query)

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await user_services.get_user_by_id(id)

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params

        const user = await user_services.get_user_by_email(email)

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user,
        })
    } catch (err) {
        handleError(err, res)
    }
}
// Corriger ce controller avec pagination, intégrer dans les autres controller aussi. 
export const searchUsersByName = async (req, res) => {
    try {
        const { searchTerm, page } = req.query
        const pageNumber = Number(req.query.page) || 1
        const result = await user_services.search_users_by_name(searchTerm, pageNumber)

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email } = req.body

        const updatedUser = await user_services.update_user_profile(id, name, email)

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            data: updatedUser,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body

        const updatedUser = await user_services.update_user_password(id, password)

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: updatedUser,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        const updatedUser = await user_services.update_user_role(id, role)

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: updatedUser,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const delete_user = await user_services.delete_user(id)

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: delete_user,
        })
    } catch (err) {
        handleError(err, res)
    }
}

export const deleteMultipleUsers = async (req, res) => {
    try {
        const { ids } = req.body

        const result = await user_services.delete_multiple_users(ids)

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} users deleted successfully`,
            data: {
                deleted: result.deleted,
                missing: result.missing,
                deletedCount: result.deletedCount,
                missingCount: result.missingCount,
            },
        })
    } catch (err) {
        handleError(err, res)
    }
}
