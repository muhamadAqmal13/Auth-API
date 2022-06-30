const express = require('express');
const router = express.Router();
const {
    Login,
    Registration,
    dataUser,
    Logout
} = require('../controllers/user');
const refreshToken = require('../controllers/refreshToken');
const verifyToken = require('../middleware/auth');

// Login
router.post('/user/login', Login);

// Add User
router.post('/user', Registration);

// Read all data User
router.get('/user', verifyToken, dataUser);

// Refresh Token
router.get('/token', refreshToken);

// Logout
router.delete('/logout', Logout);

module.exports = router;
