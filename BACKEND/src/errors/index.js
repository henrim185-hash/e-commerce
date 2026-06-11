import { categoryErrorMap } from './category.errors.js'
import { productErrorMap } from './product.errors.js'
import { userErrorMap } from './user.errors.js'
import { commonErrorMap } from './common.erros.js'

export const businessErrorMap = {
    ...commonErrorMap,
    ...categoryErrorMap,
    ...productErrorMap,
    ...userErrorMap,
}
