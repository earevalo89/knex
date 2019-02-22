/* jshint esversion:6 */
// Update with your config settings.

module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'knex-crud',
            user: 'postgres',
            password: 'Imix2019*'
        }
    },
    test: {
        client: 'pg',
        connection: {
            database: 'test-knex-crud',
            user: 'postgres',
            password: 'Imix2019*'
        }
    },
    production: {
        client: 'pg',
        connection: {
            database: 'prod-knex-crud',
            user: 'postgres',
            password: 'Imix2019*'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};