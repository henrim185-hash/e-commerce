// routes/user.routes.js
import express from 'express'
import * as userController from '../controllers/user.controller.js'

const router = express.Router()

router.post('/users', userController.createUser)

router.get('/users', userController.getAllUsers)

router.get('/users/email/:email', userController.getUserByEmail)

router.get('/users/search', userController.searchUsersByName)

router.get('/users/:id', userController.getUserById)

router.put('/users/:id/profile', userController.updateUserProfile)

router.put('/users/:id/password', userController.updateUserPassword)

router.put('/users/:id/role', userController.updateUserRole)

router.delete('/users/:id', userController.deleteUser)

router.delete('/users', userController.deleteMultipleUsers)

export default router
