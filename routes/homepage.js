const express = require('express');
const { Router } = require('express');
const router = Router();


router.use("/", (req, res, next) => {
    console.log("router was used");
});

module.exports = router;