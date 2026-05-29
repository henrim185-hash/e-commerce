// db/index.js
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Configuration différente selon l'environnement
const getPoolConfig = () => {
    const baseConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    }

    if (process.env.NODE_ENV === 'production') {

        return {
            ...baseConfig,
            statement_timeout: 5000,
            query_timeout: 3000,
            connectionTimeoutMillis: 3000, 
            idleTimeoutMillis: 10000, 
            max: 20, 
            ssl: { rejectUnauthorized: true },
        }
    } else if (process.env.NODE_ENV === 'test') {
      
        return {
            ...baseConfig,
            statement_timeout: 30000, 
            query_timeout: 20000,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 60000,
            max: 10,
        }
    } else {
        return {
            ...baseConfig,
            statement_timeout: 30000,
            query_timeout: 20000,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 60000,
            max: 10,

        }
    }
}

const pool = new pg.Pool(getPoolConfig())

pool.on('error', (err, client) => {
    if (err.code === '57014') {

        console.error('Query timeout:', err.message)
    } else {
        console.error('Unexpected error on idle client', err)
    }
})

export default pool
