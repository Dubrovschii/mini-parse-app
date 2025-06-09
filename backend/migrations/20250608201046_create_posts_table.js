/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('posts', (table) => {
        table.increments('id').primary();
        table.string('link').notNullable();
        table.string('title').notNullable();
        table.text('descr').notNullable();
        table.timestamp('date').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('posts');
};
