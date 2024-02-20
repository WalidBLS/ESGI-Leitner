const { CATEGORIES } = require('./constants');
const { findCategoryByName, getNextCategory, daysDifference, formatDate } = require('./utils');

// Get all cards
async function getAllCards(req, res) {
    try {
        const response = await fetch(`${process.env.DATABASE_URL}/cards`);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cards' });
    }
}

// Create a new card
async function createCard(req, res) {
    try {
        const { question, answer, tag } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ message: 'A question and an answer are required' });
        }

        const newCard = {
            question,
            answer,
            tag,
            category: CATEGORIES[0].name,
            updatedAt: formatDate(),
        };

        const response = await fetch(`${process.env.DATABASE_URL}/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCard),
        });
        const data = await response.json();

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create card' });
    }
}

// Get cards by date
async function getCardsByDate(req, res) {
    const dateFilter = req.query.date ? formatDate(new Date(req.query.date)) : formatDate();
    try {
        const response = await fetch(`${process.env.DATABASE_URL}/cards`);
        const data = await response.json();
        const cards = data.filter(card => {
            const diff = daysDifference({ startDate: new Date(card.updatedAt), endDate: new Date(dateFilter) });
            const category = findCategoryByName(card.category);
            return diff > 0 && category && diff % category.frequency === 0;
        });
        res.status(200).json(cards);
    } catch (error) {
		console.log(error.message)
        res.status(500).json({ message: 'Failed to filter cards by date' });
    }
}

// Answer a card
async function updateCardAnswer(req, res) {
    try {
        const { cardId } = req.params;
        const { isValid } = req.body;

        if (isValid === undefined) {
            return res.status(400).json({ message: 'isValid is required' });
        }

        const response = await fetch(`${process.env.DATABASE_URL}/cards/${cardId}`);
        const card = await response.json();

        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        if (card.category === 'DONE') {
            return res.status(400).json({ message: 'Card already done' });
        }

        const today = new Date().toISOString().split('T')[0];
        const diff = daysDifference({
            startDate: new Date(card.updatedAt),
            endDate: new Date(today),
        });
        const category = findCategoryByName(card.category);

        if (diff <= 0 || (category.frequency !== null && diff % category.frequency !== 0)) {
            return res.status(400).json({ message: "Card can't be updated yet" });
        }

        const newCategoryName = isValid ? getNextCategory(card.category) : CATEGORIES[0].name;

        const updatedCardResponse = await fetch(`${process.env.DATABASE_URL}/cards/${cardId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newCategoryName, updatedAt: today }),
        });
        const updatedCard = await updatedCardResponse.json();

        res.status(200).json({ card: updatedCard });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update card' });
    }
}

module.exports = {
    getAllCards,
    createCard,
    getCardsByDate,
    updateCardAnswer,
};
