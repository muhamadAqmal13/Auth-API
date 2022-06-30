const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dataUser = async (req, res) => {
    const findData = await User.find({}, [
        'email',
        'name',
        'username',
        'createdAt'
    ]);
    res.send(findData);
};

const Login = async (req, res) => {
    const checkEmail = await User.findOne({ email: req.body.email });
    try {
        if (checkEmail == null) {
            return res.status(404).send({
                error: 1,
                message: "Email or Password isn't valid"
            });
        }
        const matchPas = await bcrypt.compare(
            req.body.password,
            checkEmail.password
        );
        if (!matchPas) {
            return res.status(404).send({
                error: 1,
                message: "Email or Password isn't valid"
            });
        }
        const dataUser = await User.findOne({ email: req.body.email }, [
            'email',
            'username',
            'name'
        ]);
        const accessToken = jwt.sign(
            dataUser.toJSON(),
            process.env.ACCESS_TOKEN,
            {
                expiresIn: '15s'
            }
        );
        const refreshToken = jwt.sign(
            dataUser.toJSON(),
            process.env.REFRESH_TOKEN,
            {
                expiresIn: '1d'
            }
        );
        await User.updateMany(
            { _id: dataUser._id },
            { refresh_token: refreshToken }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        });
        res.send({ error: 0, message: 'Berhasil Login', accessToken });
    } catch (err) {
        res.status(500).send({ error: 1, message: err.message });
    }
};

const Registration = async (req, res) => {
    const checkUser = await User.findOne({
        email: req.body.email,
        username: req.body.username
    });
    if (checkUser) {
        return res.status(400).json({
            error: 1,
            message: 'Email or username has been registered'
        });
    }
    try {
        const addUser = new User(req.body);
        const saveUser = await addUser.save();
        const getData = await User.findOne({ username: req.body.username }, [
            'email',
            'username',
            'name',
            'createdAt'
        ]);
        res.status(201).send({
            error: 0,
            message: 'Username success added',
            data: getData
        });
    } catch (err) {
        res.status(400).send({ error: 1, message: err.message });
    }
};

const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.send(204);
    const user = await User.find({ refresh_token: refreshToken });
    if (!user) return res.send(204);
    await User.updateOne({ _id: user.id }, { refresh_token: null });
    res.clearCookie('refreshToken');
    return res.send(200);
};
module.exports = { Login, Registration, dataUser, Logout };
