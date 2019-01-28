const mp3dupes = require('./mp3dupes');

describe('mp3dupes', () => {

  it('resolves with no error', async () => {
    await expect(mp3dupes()).resolves.toBeUndefined();
  });
});