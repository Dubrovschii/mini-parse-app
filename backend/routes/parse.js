const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { parseBlog } = require('../services/parser');

router.get('/', async (req, res) => {
    try {
        const posts = await db('posts').select('link', 'title', 'descr', 'date');
        res.json(posts);
    } catch (err) {
        console.error('Ошибка при получении данных:', err);
        res.status(500).json({ message: 'Ошибка при получении данных' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { searchWord } = req.body;
        if (!searchWord || !searchWord.trim()) {
            return res.status(400).json({ message: 'Необходимо указать искомое слово' });
        }

        const results = await parseBlog(searchWord.trim());

        // console.log(results);

        await db('posts').del();

        if (results.length > 0) {
            await db('posts').insert(
                results.map(({ link, title, descr, date }) => ({
                    link,
                    title,
                    descr,
                    date,
                }))
            );
        } else {
            console.log('Ничего не найдено для сохранения в базе.');
        }

        res.json(results);
    } catch (err) {
        console.error('Ошибка при поиске:', err);
        res.status(500).json({ message: 'Ошибка при поиске' });
    }
});

module.exports = router;
