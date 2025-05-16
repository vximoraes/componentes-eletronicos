import asyncWrapper from '../../../middlewares/asyncWrapper';

describe('asyncWrapper', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {};
        next = jest.fn();
    });

    it('should call the handler function', async () => {
        const handler = jest.fn().mockResolvedValue('success');
        const wrappedHandler = asyncWrapper(handler);

        await wrappedHandler(req, res, next);

        expect(handler).toHaveBeenCalledWith(req, res, next);
    });

    it('should call next with error if handler throws', async () => {
        const error = new Error('Test error');
        const handler = jest.fn().mockRejectedValue(error);
        const wrappedHandler = asyncWrapper(handler);

        await wrappedHandler(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('should not call next if handler resolves', async () => {
        const handler = jest.fn().mockResolvedValue('success');
        const wrappedHandler = asyncWrapper(handler);

        await wrappedHandler(req, res, next);

        expect(next).not.toHaveBeenCalled();
    });
});