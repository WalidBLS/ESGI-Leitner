const { getAllCards, createCard, getCardsByDate, updateCardAnswer } = require('../../modules/card/actions');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('Tests on getAllCards', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should fetch cards successfully', async () => {
    const mockCards = [{ id: 1, question: 'Test?', answer: 'Yes' }];
    fetch.mockResponseOnce(JSON.stringify(mockCards));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await getAllCards(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCards);
  });

  it('should handle fetch error', async () => {
    fetch.mockReject(new Error('Failed to fetch'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await getAllCards(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch cards' });
  });
});


describe('Tests on createCard', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('should create a card successfully', async () => {
        const mockResponse = { id: 1, question: 'Test?', answer: 'Yes', tag: 'test', category: 'FIRST' };
        fetch.mockResponseOnce(JSON.stringify(mockResponse));

        const req = {
        body: {
            question: 'Test?',
            answer: 'Yes',
            tag: 'test'
        }
        };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };

        await createCard(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should return 400 if question or answer is missing', async () => {
        const req = { body: {} };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };

        await createCard(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'A question and an answer are required' });
    });
});

describe('Tests on getCardsByDate', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('fetches and filters cards by a specific date', async () => {
        const mockCards = [
        { id: 1, updatedAt: '2024-02-19', category: 'FIRST' },
        { id: 2, updatedAt: '2024-02-20', category: 'FIRST' }
        ];
        fetch.mockResponseOnce(JSON.stringify(mockCards));

        const req = {
        query: { date: '2024-02-20' }
        };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };

        await getCardsByDate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
    });

    it('fetches and filters cards using today\'s date when no date is provided', async () => {
        const mockCards = [
            { id: 1, updatedAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'FIRST' },
            { id: 2, updatedAt: '2024-02-20', category: 'FIRST' }
        ];
        fetch.mockResponseOnce(JSON.stringify(mockCards));

        const req = { query: {} };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };

        await getCardsByDate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
    });

    it('handles fetch errors gracefully', async () => {
        fetch.mockReject(new Error('Failed to fetch'));

        const req = { query: {} };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };

        await getCardsByDate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to filter cards by date' });
    });
});
  
