require('dotenv').config();
require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const routesV1 = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        credentials: true,
        origin: process.env.HOST
    })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/todolist', routesV1);

app.listen(port, () => {
    console.log(`Sever running on port ${port}`);
});
