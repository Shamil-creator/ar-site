require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем запросы с других доменов (с вашего фронтенда)
app.use(cors());

// Позволяет серверу понимать JSON-данные из запросов
app.use(express.json());

// Маршрут для получения данных из вашей формы
app.post('/api/send-to-telegram', async (req, res) => {
    try {
        const { message, parse_mode = 'Markdown' } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Сообщение не предоставлено' });
        }

        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        // Отправляем запрос к API Telegram
        const response = await axios.post(telegramUrl, {
            chat_id: telegramChatId,
            text: message,
            parse_mode: parse_mode,
            disable_web_page_preview: true
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            error: 'Внутренняя ошибка сервера при отправке сообщения'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
