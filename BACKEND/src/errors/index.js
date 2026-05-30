import { categoryErrorMap } from './category.errors.js'
import { productErrorMap } from './product.errors.js'

export const businessErrorMap = {
    ...categoryErrorMap,
    ...productErrorMap,
}
