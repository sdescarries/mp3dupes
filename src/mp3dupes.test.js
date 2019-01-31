const mp3dupes = require('./mp3dupes');
const fs = require('fs-extra');

console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
process.exit = jest.fn();

describe('mp3dupes', () => {

  beforeAll(() => {

    console.log({
      __dirname,
      __filename,
      argv: process.argv,
    });

    // copy test data in volatile directory for test input
    fs.ensureDirSync('./results/');
    fs.removeSync('./results/mp3dupes');
    fs.copySync('./data', './results/mp3dupes');

  });
  /*
  it('resolves --help', async (done) => {
    process.argv = ['node', 'mp3dupes', '--help'];
    await expect(mp3dupes()).resolves.toBeUndefined();
    done();
  });
*/
  it('resolves test data', async (done) => {
    process.argv = ['node', 'mp3dupes', '--silent', '--rename', './results/mp3dupes'];
    await expect(mp3dupes()).resolves.toBeUndefined();
    done();
  });

});
