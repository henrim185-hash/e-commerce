export const createError = code => {
    const error = new Error()

    error.code = code

    return error
}
