// utils/handleError.js

import { businessErrorMap } from '../errors/index.js'

const dbErrorMap = {
    23505: {
        status: 409,
        message: 'Duplicate entry',
    },

    23503: {
        status: 400,
        message: 'Foreign key violation',
    },

    23502: {
        status: 400,
        message: 'Missing required field',
    },

    '22P02': {
        status: 400,
        message: 'Invalid input syntax',
    },
}

export const handleError = (err, res) => {
    let errorData

    // ===== ERREURS POSTGRESQL =====
    if (err.code && dbErrorMap[err.code]) {
        errorData = dbErrorMap[err.code]
    }

    // ===== ERREURS MÉTIER =====
    else if (err.code && businessErrorMap[err.code]) {
        errorData = businessErrorMap[err.code]
    }

    // ===== ERREUR INCONNUE =====
    else {
        errorData = {
            status: 500,
            message: 'Internal server error',
        }
        console.error(err)
    }

    return res.status(errorData.status).json({
        success: false,
        message: errorData.message,
    })
}
