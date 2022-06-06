require("dotenv").config()
const Database = require("./database");

(async () => {
    const client = await Database.getClient();

    console.log("Creating clients table");
    await client.query("CREATE TABLE IF NOT EXISTS clients (id SERIAL PRIMARY KEY, name text NOT NULL," +
        "balance integer CHECK (balance >= 0));" +
        "CREATE UNIQUE INDEX IF NOT EXISTS clients_prkey ON clients(id int4_ops);");
    console.log("Creating enums");
    await client.query("DROP TYPE IF EXISTS transaction_side; CREATE TYPE transaction_side AS ENUM ('WITHDRAW', 'DEPOSIT')");
    await client.query("DROP TYPE IF EXISTS transaction_status; CREATE TYPE transaction_status AS ENUM ('IN_QUEUE', 'BLOCKED', 'DONE')");
    console.log("Creating transactions table");
    await client.query("CREATE TABLE IF NOT EXISTS transactions ( id SERIAL PRIMARY KEY," +
        "    client_id integer REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE," +
        "    side transaction_side NOT NULL," +
        "    amount integer NOT NULL," +
        "    status transaction_status NOT NULL" +
        ");" +
        "CREATE UNIQUE INDEX transactions_prkey ON transactions(id int4_ops)");
    console.log("Inserting dumb values");
    await client.query('INSERT INTO "clients"("name", "balance") VALUES(\'Test1\', 23)');
    await client.query('INSERT INTO "transactions"("client_id", "side", "amount", "status")' +
        'VALUES (1, \'WITHDRAW\', 100, \'BLOCKED\')');
    await client.query('INSERT INTO "transactions"("client_id", "side", "amount", "status")' +
        'VALUES (1, \'DEPOSIT\', 200, \'IN_QUEUE\')');
    await client.query('INSERT INTO "transactions"("client_id", "side", "amount", "status")' +
        'VALUES (1, \'WITHDRAW\', 100, \'DONE\')');
    console.log("Migration done");
    process.exit(0);
})();

