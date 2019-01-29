const mp3dupes = require('./mp3dupes');

console.log = jest.fn();
console.error = jest.fn();
process.exit = jest.fn();

describe('mp3dupes', () => {

  it('resolves with no error', async () => {
    process.argv = ['node', 'mp3dupes'];
    await expect(mp3dupes()).resolves.toBeUndefined();
  });
});