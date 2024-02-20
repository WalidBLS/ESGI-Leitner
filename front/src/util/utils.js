function groupCardsByCategory(cards) {
	return cards.reduce((acc, card) => {
		if (!acc[card.category]) {
			acc[card.category] = [];
		}
		acc[card.category].push(card);
		return acc;
	}, {});
}

export { groupCardsByCategory };
