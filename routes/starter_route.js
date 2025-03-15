const express = require('express');
const router = express.Router();

const StarterRoute = require('./starter_route');

const apiVersion = process.env.API_VERSION;

console.log('API Version in index.js:', apiVersion);

router.use(`/api/${apiVersion}`, StarterRoute);

module.exports = router;