const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];
    if (authToken == null) {
        return res.status(401).send({ error: 1, msg: 'Token tidak valid' });
    }
    jwt.verify(authToken, process.env.ACCESS_TOKEN, (err, decode) => {
        if (err) return res.status(401).send({ error: 1, msg: err });
        req.email = decode.email;
        next();
    });

    // res.status(200).send({ error: 0, msg: 'Berhasil mendapatkan data' });
};

module.exports = verifyToken;
