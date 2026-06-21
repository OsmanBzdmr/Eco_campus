const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: isTest ? 0 : (parseInt(process.env.RATE_LIMIT_MAX) || 100),
  message: { message: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: isTest ? 0 : (parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10),
  message: { message: 'Çok fazla giriş denemesi yaptınız, lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

module.exports = { generalLimiter, authLimiter };
