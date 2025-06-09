
const axios = require('axios');
const cheerio = require('cheerio');

function parseRussianDate(dateStr) {
    const months = {
        'января': '01',
        'февраля': '02',
        'марта': '03',
        'апреля': '04',
        'мая': '05',
        'июня': '06',
        'июля': '07',
        'августа': '08',
        'сентября': '09',
        'октября': '10',
        'ноября': '11',
        'декабря': '12',
    };

    const regex = /(\d{1,2})\s(\S+)\s(\d{4})/;
    const match = dateStr.match(regex);
    if (!match) return null;

    const day = match[1].padStart(2, '0');
    const month = months[match[2].toLowerCase()];
    const year = match[3];

    const timeMatch = dateStr.match(/(\d{2}:\d{2})/);
    const time = timeMatch ? timeMatch[1] + ':00' : '00:00:00';

    return `${year}-${month}-${day} ${time}`;
}

async function parseBlog(searchWord, maxPages = 5) {
    const baseUrl = 'https://is-systems.org';
    const results = [];

    for (let page = 1; page <= maxPages; page++) {
        const url = page === 1
            ? `${baseUrl}/blog`
            : `${baseUrl}/blog/_list/_all/${page}`;

        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $('article.widg_newsblock_element').each((i, elem) => {
                const titleElem = $(elem).find('h3 a.widg_news_link');
                const title = titleElem.text().trim();
                const relativeLink = titleElem.attr('href');
                const link = baseUrl + relativeLink;

                const descr = $(elem).find('div.widg_news_short_doc').text().trim();
                const dateStr = $(elem).find('div.widg_news_pub_time').text().trim();

                if (
                    title.toLowerCase().includes(searchWord.toLowerCase()) ||
                    descr.toLowerCase().includes(searchWord.toLowerCase())
                ) {
                    const date = parseRussianDate(dateStr);
                    results.push({ link, title, descr, date });
                }
            });
        } catch (error) {
            console.error(`Ошибка при парсинге страницы ${page}:`, error);
            break;
        }
    }

    return results;
}

module.exports = { parseBlog };
