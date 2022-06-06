const Database = require("../database")

module.exports = {

    getTransaction: async (id) => {
        const client = await Database.getClient();
        const data = await client.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return data.rows[0];
    },

    insertTransaction: async ({ clientId, side, amount }) => {
        const client = await Database.getClient();
        const data = await client.query("INSERT INTO transactions (client_id, side, amount, status) " +
            "VALUES ($1, $2, $3, 'IN_QUEUE') RETURNING *", [clientId, side, amount]);
        return data.rows[0];
    },

    updateTransactionStatus: async ({ id, status }) => {
        const client = await Database.getClient();
        const data = await client.query("UPDATE transactions SET status=$1 WHERE id=$2", [status, id]);
        return data;
    }

}