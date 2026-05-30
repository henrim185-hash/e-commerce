// errors/category.errors.js
export const categoryErrorMap = {
    // CRUD
    CATEGORY_ALREADY_EXISTS: { status: 409, message: 'Category already exists' },
    CATEGORY_NOT_FOUND: { status: 404, message: 'Category not found' },
    CATEGORY_CREATION_FAILED: { status: 500, message: 'Failed to create category' },
    CATEGORY_UPDATE_FAILED: { status: 500, message: 'Failed to update category' },
    CATEGORY_DELETION_FAILED: { status: 500, message: 'Failed to delete category' },

    // Validation
    CATEGORY_NAME_REQUIRED: { status: 400, message: 'Category name is required' },
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

    // Relations
    CATEGORY_HAS_PRODUCTS: {
        status: 400,
        message: 'Cannot delete category with associated products',
    },

    // Recherche
    CATEGORY_SEARCH_FAILED: { status: 500, message: 'Failed to search categories' },

    // Nouvelles
    CATEGORY_ID_REQUIRED: { status: 400, message: 'Category ID is required' },
}
