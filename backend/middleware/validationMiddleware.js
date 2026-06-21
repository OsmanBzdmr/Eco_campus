const { body, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Kullanıcı adı zorunludur')
    .isLength({ min: 2 }).withMessage('Kullanıcı adı en az 2 karakter olmalıdır'),
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .notEmpty().withMessage('Şifre zorunludur')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  handleValidationErrors,
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .notEmpty().withMessage('Şifre zorunludur'),
  handleValidationErrors,
];

const createProductValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Ürün başlığı zorunludur')
    .isLength({ max: 100 }).withMessage('Başlık en fazla 100 karakter olabilir'),
  body('price')
    .notEmpty().withMessage('Fiyat zorunludur')
    .isFloat({ min: 0 }).withMessage('Fiyat 0 veya pozitif bir sayı olmalıdır'),
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Geçerli bir kategori seçiniz'),
  body('description')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .trim(),
  handleValidationErrors,
];

const updateProductValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Ürün başlığı boş olamaz')
    .isLength({ max: 100 }).withMessage('Başlık en fazla 100 karakter olabilir'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Fiyat 0 veya pozitif bir sayı olmalıdır'),
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Geçerli bir kategori seçiniz'),
  body('description')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .trim(),
  handleValidationErrors,
];

const listProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Sayfa numarası pozitif olmalıdır'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit 1-100 arasında olmalıdır'),
  query('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Geçerli bir kategori ID giriniz'),
  query('search')
    .optional()
    .trim(),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  createProductValidation,
  updateProductValidation,
  listProductsValidation,
};
