export const categoryErrorMap = {
    CATEGORY_ALREADY_EXISTS: { status: 409, message: 'Category already exists' },
    CATEGORY_NOT_FOUND: { status: 404, message: 'Category not found' },
    CATEGORY_CREATION_FAILED: { status: 500, message: 'Failed to create category' },
    CATEGORY_UPDATE_FAILED: { status: 500, message: 'Failed to update category' },
    CATEGORY_DELETION_FAILED: { status: 500, message: 'Failed to delete category' },

    CATEGORY_NAME_REQUIRED: { status: 400, message: 'Category name is required' },
    SEARCH_TERM_REQUIRED: { status: 400, message: 'Search term is required' },
    CATEGORY_SLUG_REQUIRED: { status: 400, message: 'Category slug is required' },
    CATEGORY_NAME_TOO_SHORT: {
        status: 400,
        message: 'Category name must be at least 2 characters',
    },
    CATEGORY_NAME_TOO_LONG: {
        status: 400,
        message: 'Category name must not exceed 100 characters',
    },
    CATEGORY_NAME_INVALID_FORMAT: {
        status: 400,
        message: 'Category name contains invalid characters',
    },
    CATEGORY_NAME_INVALID: { status: 400, message: 'Invalid category name' },
    CATEGORY_ID_INVALID: { status: 400, message: 'Invalid category ID' },

    CATEGORY_HAS_PRODUCTS: {
        status: 400,
        message: 'Cannot delete category with associated products',
    },

    CATEGORY_SEARCH_FAILED: { status: 500, message: 'Failed to search categories' },

    CATEGORY_ID_REQUIRED: { status: 400, message: 'Category ID is required' },
    SEARCH_TERM_TOO_SHORT: {
        status: 400,
        message: 'Search term must be at least 2 characters',
    },

    SEARCH_TERM_TOO_LONG: {
        status: 400,
        message: 'Search term must not exceed 50 characters',
    },

    SEARCH_TERM_INVALID_FORMAT: {
        status: 400,
        message: 'Search term contains invalid characters',
    },

    PAGE_INVALID: {
        status: 400,
        message: 'Page number must be a positive integer',
    },

    LIMIT_INVALID: {
        status: 400,
        message: 'Limit must be between 1 and 100',
    },
    TOO_MANY_CATEGORY_IDS: {
        status: 400,
        message: 'Too many category IDs provided. Maximum limit exceeded.',
    },
    CATEGORY_IDS_REQUIRED: { status: 400, message: 'Category ids are required' },
    INVALID_CATEGORY_ID: {
        status: 400,
        message: 'One or more IDs are invalid',
    },
}
