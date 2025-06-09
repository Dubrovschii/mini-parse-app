Добрый день!

Предлагаю вашему вниманию реализацию приложения для парсинга блога компании IS-Systems. Проект включает:

Надёжный HTTP-клиент => axios + cheerio для «лёгковесного» скрапинга без браузера.

Хранение результатов в PostgreSQL через knex с поддержкой миграций.

Express-сервер с GET/POST маршрутом /parse для получения и обновления данных.

Полный набор юнит-тестов (Jest), покрывающих ключевую логику парсинга и дату.

Дополнительно внедрена система переключения тёмной/светлой темы во фронтенде через Pinia и TailwindCSS

Для развертывания проекта :
1)Склонируй репозиторий командой (SSH-адрес):
git clone git@github.com:Dubrovschii/mini-parse-app.git
2)Перейди в папку проекта:
cd mini-parse-app
3)Отображение кода :
code . 
4)Установи зависимости для каждой части:
# для backend
cd backend
npm install

# затем для frontend (в новом окне терминала или после cd ../frontend)
cd ../frontend
npm install
5)Создать в папке backend .env
PORT=5003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parseDb
DB_USER=postgres
DB_PASSWORD=parseDb
6)для юнит теста в папке backend:
npm test
7)для запуска сервера :
cd ../backend
node index.js
8) для отображения клиетской части :
cd ../frontend
npm run dev


С уважением,
Дубровский Алексей
