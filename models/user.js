const Database = require("../database")

module.exports = {

    getUser: async (id) => {
        const client = await Database.getClient();
        const data = await client.query("SELECT * FROM clients WHERE id = $1", [id]);
        return data.rows[0];
    },

    updateBalance: async ({ id, delta }) => {
        const client = await Database.getClient();
        const data = await client.query("UPDATE clients SET balance = balance + $1 WHERE id = $2", [delta, id]);
        return data;
    }

}