const utils = require('../../modules/card/utils');
const { CATEGORIES } = require('../../modules/card/constants');

describe('findCategoryByName', () => {
  it('returns the correct category when name exists', () => {
    const category = utils.findCategoryByName('FIRST');
    expect(category).toEqual({ name: 'FIRST' , frequency: 1 });
  });

  it('returns undefined when name does not exist', () => {
    const category = utils.findCategoryByName('NonExistingCategory');
    expect(category).toBeUndefined();
  });
});

describe('getNextCategory', () => {
    it('returns the next category when current category is not the last one', () => {
      const nextCategory = utils.getNextCategory('FIRST');
      expect(nextCategory).toBe('SECOND');
    });
  
    it('returns null when current category is the last one', () => {
      const nextCategory = utils.getNextCategory('DONE');
      expect(nextCategory).toBeNull();
    });
});

describe('daysDifference', () => {
    it('returns the difference in days between two dates', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-05');
      const difference = utils.daysDifference({ startDate, endDate });
      expect(difference).toBe(4);
    });
});


describe('formatDate', () => {
    it('formats the date correctly', () => {
    const date = new Date('2024-01-01');
    const formattedDate = utils.formatDate(date);
    expect(formattedDate).toBe('2024-01-01');
    });

    it('uses current date if no date is provided', () => {
    const currentDate = new Date();
    const formattedDate = utils.formatDate();
    expect(formattedDate).toBe(currentDate.toISOString().split('T')[0]);
    });
});