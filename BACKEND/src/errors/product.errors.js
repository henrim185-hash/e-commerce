export const productErrorMap = {
    PRODUCT_NOT_FOUND: {
        status: 404,
        message: 'Product not found',
    },

    PRODUCT_NAME_REQUIRED: {
        status: 400,
        message: 'Product name is required',
    },

    PRODUCT_NAME_TOO_SHORT: {
        status: 400,
        message: 'Product name is too short',
    },

    PRODUCT_NAME_TOO_LONG: {
        status: 400,
        message: 'Product name is too long',
    },

    PRODUCT_DESCRIPTION_REQUIRED: {
        status: 400,
        message: 'Product description is required',
    },

    PRODUCT_DESCRIPTION_TOO_SHORT: {
        status: 400,
        message: 'Product description is too short',
    },

    PRODUCT_DESCRIPTION_TOO_LONG: {
        status: 400,
        message: 'Product description is too long',
    },

    PRODUCT_CATEGORY_REQUIRED: {
        status: 400,
        message: 'Category is required',
    },

    PRODUCT_CATEGORY_INVALID: {
        status: 400,
        message: 'Invalid category id',
    },

    PRODUCT_ALREADY_EXISTS: {
        status: 409,
        message: 'Product already exists',
    },
    NO_PRODUCTS_FOUND: {
        status: 404,
        message: 'No products found',
    },
    INVALID_PRODUCT_ID: {
        status: 400,
        message: 'One or more IDs are invalid',
    },
    PRODUCT_ID_INVALID: { status: 400, message: 'Invalid product id' },
    PRODUCT_IDS_REQUIRED: { status: 400, message: 'Product ids are required' },
    PAGINATION_PAGE_INVALID: { status: 400, message: 'Invalid page parameter' },
    PAGINATION_LIMIT_INVALID: { status: 400, message: 'Invalid pagination limit' },
    TOO_MANY_PRODUCT_IDS: {
        status: 400,
        message: 'Too many product IDs provided. Maximum limit exceeded.',
    },
}
