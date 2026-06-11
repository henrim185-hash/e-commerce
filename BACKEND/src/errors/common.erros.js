export const commonErrorMap = {
    PAGINATION_PAGE_INVALID: {
        status: 400,
        message: 'Page must be a positive integer',
    },

    PAGINATION_LIMIT_INVALID: {
        status: 500,
        message: 'Pagination configuration is invalid',
    },

    UNAUTHORIZED: {
        status: 401,
        message: 'Authentication required',
    },

    FORBIDDEN: {
        status: 403,
        message: 'Access denied',
    },

    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: 'Internal server error',
    },
    SEARCH_TERM_REQUIRED: {
        status: 400,
        message: 'Search term is required',
    },
}
