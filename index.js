const TelegramApi = require('node-telegram-bot-api');

const { gameOptions, againOptions } = require('./options.js');

const token = '5347152400:AAH-FPHmejo65ciHq04oP82XZXr43Mg9O_o';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал число от 0 до 9`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадай)`, gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        {
            command: '/info',
            description: 'Получение информации о пользователе',
        },
        { command: '/game', description: 'Игра угадай цифру' },
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        //Отправка рандомного стикера при приветствии
        const randStickers = [
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/1.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/2.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/3.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/4.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/5.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/6.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/7.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/8.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/9.webp',
            'https://tlgrm.ru/_/stickers/0a5/a79/0a5a79ff-8369-4846-b92e-a2e7408522b0/10.webp',
        ];
        const randIndex = Math.floor(Math.random() * randStickers.length);
        const sticker = randStickers[randIndex];
        //Отправка рандомного сообщения при плохом запросе
        const randBadRequest = [
            'Я тебя не понимаю.',
            'Неправильный запрос.',
            'Что ты пишешь? Не понятно',
            'Прости, не понимаю',
            'Повтори? Не понял',
            'Ерунду пишешь',
        ];
        const randBadRequestIndex = Math.floor(
            Math.random() * randBadRequest.length
        );
        const badRequest = randBadRequest[randBadRequestIndex];

        if (text === '/start') {
            await bot.sendSticker(chatId, sticker);
            return bot.sendMessage(
                chatId,
                `Привет, ${msg.from.username}, Добро пожаловать. Я телеграм-бот, созданный одним человеком, который изучает Javacript, исходные данные проекта вы можете найти здесь:\n`
            );
        }
        if (text === '/info') {
            return bot.sendMessage(
                chatId,
                `Тебя зовут ${msg.from.username},\nТвой язык: ${msg.from.language_code}.`
            );
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, badRequest);
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(
                chatId,
                `Я загадывал цифру ${chats[chatId]}. Поздравляю, ты победил!`,
                againOptions
            );
        } else {
            return bot.sendMessage(
                chatId,
                `Я загадывал цифру ${chats[chatId]}. К сожалению, ты проиграл.`,
                againOptions
            );
        }
    });
};

start();
