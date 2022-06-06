const express = require("express");
const { updateBalance, getUser } = require("../models/user")
const { getTransaction, insertTransaction, updateTransactionStatus} = require("../models/transaction")
const router = express.Router();

router.get("/:id/", async (req, res) => {
    const id = Number.parseInt(req.params.id);
    if(isNaN(id) || !id) {
        return res.status(400).json({
            error: "Invalid id provided"
        });
    }
    const transaction = await getTransaction(id);
    if(!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }
    return res.status(200).json(transaction);
})

router.post("/", async (req, res) => {
    const { client_id, side, amount } = req.body;
    const clientId = Number.parseInt(client_id);
    if(isNaN(clientId) || !clientId) {
        return res.status(400).json({
            error: "Invalid client_id provided"
        });
    }
    if(side !== "WITHDRAW" && side !== "DEPOSIT") {
        return res.status(400).json({
            error: "Invalid side provided"
        });
    }
    const amountNum = Number.parseInt(amount);
    if(isNaN(amountNum) || !amountNum) {
        return res.status(400).json({
            error: "Invalid amount provided"
        });
    }
    const transaction = await insertTransaction({
        clientId,
        side,
        amount: amountNum
    });
    if(!transaction) {
        return res.status(500).json({
            error: "Something went wrong when insertion"
        });
    }
    res.status(200).json({
        ...transaction
    });
})

router.post('/process/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id);
    if(isNaN(id) || !id) {
        return res.status(400).json({
            error: "Invalid id provided"
        });
    }
    const transaction = await getTransaction(id);
    if(!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }
    const user = await getUser(transaction.client_id);
    if(!user) {
        return res.status(404).json({
            error: "Client not found"
        });
    }
    if(transaction.side === "WITHDRAW" && transaction.amount > user.balance) {
        await updateTransactionStatus({
            id,
            status: "BLOCKED"
        });
        transaction.status = "BLOCKED";
        return res.status(200).json({
            user,
            transaction
        });
    } else {
        const delta = (transaction.side === "WITHDRAW" ? -1 : 1) * transaction.amount;
        await updateBalance({
            id: transaction.client_id,
            delta
        });
        await updateTransactionStatus({
            id,
            status: "DONE"
        });
        user.balance += delta;
        transaction.status = "DONE";
        return res.status(200).json({
            user,
            transaction
        });
    }
})

module.exports = router;