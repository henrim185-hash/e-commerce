import pool from '../db/index.js'

// Creer un produit
export const create_product = async (name, description, category_id) => {
    const result = await pool.query(
        'INSERT INTO products (name, description, category_id) VALUES ($1, $2, $3) RETURNING *',
        [name, description, category_id],
    )
    return result.rows[0]
}

// Recuperer tous les produits
export const get_all_product = async (limit = 50, offset = 0) => {
    const result = await pool.query('SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2', [
        limit,
        offset,
    ])
    return result.rows
}

// Recuperer un produit par son id
export const get_product_by_id = async id => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id])
    return result.rows[0]
}

// Mettre a jour un produit
export const update_product = async (id, name, description, category_id) => {
    const check_product = await pool.query('SELECT * FROM products WHERE id = $1', [id])

    if (check_product.rows.length === 0) {
        throw new Error('This product does not exist')
    }

    const result = await pool.query(
        `UPDATE products
         SET name = $1, description = $2, category_id = $3, updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [name, description, category_id, id],
    )

    return result.rows[0]
}

// Verifier produit existe
export const product_exists = async id => {
    const result = await pool.query('SELECT id FROM products WHERE id = $1', [id])
    return result.rows.length > 0
}

// Supprimer un produit
export const delete_product = async id => {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])

    if (!result.rows[0]) {
        throw new Error('Product not found')
    }

    return result.rows[0]
}

// Supprimer plusieurs produits
export const delete_multiple_products = async ids => {
    const result = await pool.query('DELETE FROM products WHERE id = ANY($1) RETURNING *', [ids])
    return result.rows
}

// Verifier les donnees du produit
export const verify_product_data = (name, category_id) => {
    if (!name || name.trim() === '') {
        throw new Error('Product name is required')
    }
    if (!category_id || category_id <= 0) {
        throw new Error('Valid category_id is required')
    }
}

// Rechercher par nom
export const search_products_by_name = async searchTerm => {
    const result = await pool.query('SELECT * FROM products WHERE name ILIKE $1', [
        `%${searchTerm}%`,
    ])
    return result.rows
}

// Filtrer par categorie
export const get_products_by_category = async category_id => {
    const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [category_id])
    return result.rows
}

// Compter les produits
export const count_products = async () => {
    const result = await pool.query('SELECT COUNT(*) FROM products')
    return parseInt(result.rows[0].count)
}
