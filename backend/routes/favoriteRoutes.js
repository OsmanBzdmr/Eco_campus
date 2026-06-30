const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');
const { favoriteProductIdParamValidation } = require('../middleware/validationMiddleware');

router.get('/', authMiddleware, favoriteController.getMyFavorites);
router.post('/:productId', authMiddleware, favoriteProductIdParamValidation, favoriteController.toggleFavorite);

module.exports = router;
