const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { createProductValidation, updateProductValidation, listProductsValidation } = require('../middleware/validationMiddleware');

router.get('/', listProductsValidation, productController.getProducts);
router.post('/', authMiddleware, createProductValidation, productController.createProduct);
router.put('/:id', authMiddleware, updateProductValidation, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
