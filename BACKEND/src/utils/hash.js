import bcrypt from 'bcrypt'

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10

export const hash_password = async password => {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export const compare_password = async (password, hash) => {
    return bcrypt.compare(password, hash)
}
