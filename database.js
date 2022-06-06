const { Pool } = require('pg')

const pg_host = process.env.PGHOST;
const pg_user = process.env.PGUSER;
const pg_password = process.env.PGPASSWORD;
const pg_database = process.env.PGDATABASE;
const pg_port = process.env.PGPORT;

const pool = new Pool({
    host: pg_host,
    port: pg_port,
    user: pg_user,
    password: pg_password,
    database: pg_database
});

class Database {

    static async getClient() {
        if(!Database.#client) {
            Database.#client = await pool.connect();
        }
        return Database.#client;
    }

    static #client = null;

}

module.exports = Database;