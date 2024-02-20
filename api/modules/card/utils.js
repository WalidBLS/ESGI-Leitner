const { CATEGORIES } = require("./constants");

// Utility functions
const findCategoryByName = (name) => CATEGORIES.find(c => c.name === name);

const getNextCategory = (currentCategoryName) => {
    const currentIndex = CATEGORIES.findIndex(c => c.name === currentCategoryName);
    return currentIndex < CATEGORIES.length - 1 ? CATEGORIES[currentIndex + 1].name : null;
};

const daysDifference = ({ startDate, endDate }) => endDate.getDate() - startDate.getDate();

const formatDate = (date = new Date()) => date.toISOString().split('T')[0];

module.exports = { findCategoryByName, getNextCategory, daysDifference, formatDate };