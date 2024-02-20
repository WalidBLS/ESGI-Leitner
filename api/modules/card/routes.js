const express = require('express');
const { getAllCards, createCard, getCardsByDate, updateCardAnswer } = require('./actions');

// Router initialization
const router = express.Router();

// Card routes
router.route('/')
    .get(getAllCards)  // Retrieve all cards
    .post(createCard); // Create a new card

router.get('/quizz', getCardsByDate); // Get cards by date for a quizz

router.patch('/:cardId/answer', updateCardAnswer); // Answer a card

module.exports = router;