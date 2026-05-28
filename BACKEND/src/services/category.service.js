import pool from '../db/index.js'

// ==================== UTILITAIRES ====================

// Générer un slug à partir du nom
const generateSlug = name => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// ==================== SERVICES DE VÉRIFICATION (CHECKERS) ====================

// Vérifier si une catégorie existe par ID
export const category_exists_by_id = async id => {
    const result = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    return result.rows.length > 0
}

// Vérifier si une catégorie existe par nom
export const category_exists_by_name = async name => {
    const result = await pool.query('SELECT id FROM categories WHERE name = $1', [name])
    return result.rows.length > 0
}

// Vérifier si une catégorie existe par slug
export const category_exists_by_slug = async slug => {
    const result = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug])
    return result.rows.length > 0
}

// Vérifier si une catégorie a des produits associés
export const category_has_products = async id => {
    const result = await pool.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id])
    return result.rows.length > 0
}

// Vérifier si le nom ou slug existe déjà (pour création)
export const category_name_or_slug_exists = async (name, slug) => {
    const result = await pool.query('SELECT id FROM categories WHERE name = $1 OR slug = $2', [
        name,
        slug,
    ])
    return result.rows.length > 0
}

// Vérifier si le nom ou slug existe déjà pour un autre ID (pour update)
export const category_name_or_slug_exists_for_other = async (id, name, slug) => {
    const result = await pool.query(
        'SELECT id FROM categories WHERE (name = $1 OR slug = $2) AND id != $3',
        [name, slug, id],
    )
    return result.rows.length > 0
}

// Valider les données d'une catégorie (création)
export const verify_category_data = name => {
    if (!name || name.trim() === '') {
        throw new Error('Category name is required')
    }
}

// Valider les données d'une catégorie (update)
export const verify_category_update_data = (id, name) => {
    if (!id || id <= 0) {
        throw new Error('Valid category ID is required')
    }
    if (!name || name.trim() === '') {
        throw new Error('Category name is required')
    }
}

// ==================== SERVICES CRUD ====================

// Créer une catégorie
export const create_category = async name => {
    // Valider les données
    verify_category_data(name)

    // Générer le slug
    let slug = generateSlug(name)

    // Vérifier si le slug existe déjà et gérer les doublons
    let counter = 1
    while (await category_exists_by_slug(slug)) {
        slug = `${generateSlug(name)}-${counter}`
        counter++
    }

    const result = await pool.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
        [name, slug],
    )
    return result.rows[0]
}

// Récupérer toutes les catégories
export const get_all_categories = async () => {
    const result = await pool.query('SELECT * FROM categories ORDER BY name')
    return result.rows
}

// Récupérer une catégorie par ID
export const get_category_by_id = async id => {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id])
    return result.rows[0]
}

// Récupérer une catégorie par slug
export const get_category_by_slug = async slug => {
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug])
    return result.rows[0]
}

// Rechercher une catégorie par nom
export const search_categories_by_name = async (searchTerm) => {
    const result = await pool.query(
        'SELECT * FROM categories WHERE name ILIKE $1 ORDER BY name',
        [`%${searchTerm}%`]
    )
    return result.rows
}

// Mettre à jour une catégorie
export const update_category = async (id, name) => {
    verify_category_update_data(id, name)

    if (!(await category_exists_by_id(id))) {
        throw new Error('Category not found')
    }

    let slug = generateSlug(name)
    let counter = 1

    // Vérifier si le nom existe pour une autre catégorie
    const nameExists = await pool.query('SELECT id FROM categories WHERE name = $1 AND id != $2', [
        name,
        id,
    ])
    if (nameExists.rows.length > 0) {
        throw new Error('Category with this name already exists')
    }

    // Vérifier et gérer les doublons de slug
    while (await category_exists_by_slug(slug)) {
        const slugOwner = await pool.query(
            'SELECT id FROM categories WHERE slug = $1 AND id != $2',
            [slug, id],
        )
        if (slugOwner.rows.length === 0) break
        slug = `${generateSlug(name)}-${counter}`
        counter++
    }

    const result = await pool.query(
        'UPDATE categories SET name = $1, slug = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [name, slug, id],
    )
    return result.rows[0]
}

// Supprimer une catégorie
export const delete_category = async id => {
    // Vérifier si la catégorie existe
    if (!(await category_exists_by_id(id))) {
        throw new Error('Category not found')
    }

    // Vérifier si des produits utilisent cette catégorie
    if (await category_has_products(id)) {
        throw new Error('Cannot delete category with associated products')
    }

    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
}

// Compter les catégories
export const count_categories = async () => {
    const result = await pool.query('SELECT COUNT(*) FROM categories')
    return parseInt(result.rows[0].count)
}
