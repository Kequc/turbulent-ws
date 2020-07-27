describe('calculate', function () {
    it('add', async function () {
        let result = 5 + 2;
        await Promise.resolve();
        expect(result).toBe(7);   
    });
});
