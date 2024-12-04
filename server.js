const express = require('express');
require('./config');
const userRouter = require('./users');
const doctorsRouter = require('./doctors');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/users', userRouter);
app.use('/doctors',doctorsRouter);

app.listen(5000);