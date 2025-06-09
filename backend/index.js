require('dotenv').config();
const express = require('express');
const cors = require('cors');
const parseRouter = require('./routes/parse');
const db = require('./db/connection');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/parse', parseRouter);

db.raw('SELECT 1')
    .then(() => {
        console.log('Подключение к базе данных успешно');
    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
