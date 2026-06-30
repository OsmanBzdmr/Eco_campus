const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { optionalAuth } = authMiddleware;
const { createProductValidation, updateProductValidation, listProductsValidation, productIdParamValidation } = require('../middleware/validationMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error('Yalnızca resim dosyaları (jpg, jpeg, png, gif, webp) kabul edilir'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', optionalAuth, listProductsValidation, productController.getProducts);
router.get('/:id', optionalAuth, productIdParamValidation, productController.getProductById);
router.post('/', authMiddleware, upload.single('image'), createProductValidation, productController.createProduct);
router.put('/:id', authMiddleware, productIdParamValidation, upload.single('image'), updateProductValidation, productController.updateProduct);
router.delete('/:id', authMiddleware, productIdParamValidation, productController.deleteProduct);

module.exports = router;
