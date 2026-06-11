export const userErrorMap = {
    INVALID_NAME: {
        status: 400,
        message: 'Name is required',
    },
    USER_NAME_TOO_LONG: {
        status: 400,
        message: 'Name too long',
    },
    INVALID_EMAIL: {
        status: 400,
        message: 'Valid email is required',
    },
    INVALID_PASSWORD: {
        status: 400,
        message: 'Password must be at least 6 characters',
    },
    INVALID_ROLE: {
        status: 400,
        message: 'Role is invalid',
    },
    EMAIL_ALREADY_EXISTS: {
        status: 409,
        message: 'Email already registered',
    },
    USER_NOT_FOUND: {
        status: 404,
        message: 'User not found',
    },
    USER_ID_INVALID: { status: 400, message: 'Invalid user ID' },
    INVALID_USER_IDS: {
        status: 400,
        message: 'IDs must be an array',
    },
    INVALID_USER_ID: {
        status: 400,
        message: 'One or more IDs are invalid',
    },
    INVALID_SEARCH_TERM: {
        status: 400,
        message: 'Search term is required',
    },
    EMAIL_ALREADY_IN_USE: {
        status: 400,
        message: 'Email is already used by another user',
    },
    USER_IDS_REQUIRED: { status: 400, message: 'user ids are required' },
}

