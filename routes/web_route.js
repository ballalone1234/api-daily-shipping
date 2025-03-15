const express = require("express");
const router = express.Router();

require("dotenv").config({ path: ".env." + process.env.NODE_ENV ? process.env.NODE_ENV : 'production'});

router.get("/", async (req, res) => {
    res.render("index" , { title: 'Template API Starter Page' });
    
});


module.exports = router;