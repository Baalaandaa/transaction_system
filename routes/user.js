const express = require("express");
const { getUser } = require("../models/user")
const router = express.Router();

router.get("/:id/", async (req, res) => {
    const id = Number.parseInt(req.params.id);
    if(isNaN(id) || !id) {
        return res.status(400).json({
            error: "Invalid id provided"
        });
    }
    const user = await getUser(id);
    if(!user) {
        return res.status(404).json({
            error: "Not found"
        });
    }
    res.status(200).json(user);
})

module.exports = router;