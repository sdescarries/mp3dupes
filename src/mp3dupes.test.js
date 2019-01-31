const mp3dupes = require('./mp3dupes');
const fs = require('fs-extra');

console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
process.exit = jest.fn();

const inp = './data';
const res = './results';

function its(desc, argv = []) {

  return it(desc, async () => {

    const out = `./${res}/${desc}`;

    expect(() => fs.ensureDirSync(res)).not.toThrow();
    expect(() => fs.removeSync(out)).not.toThrow();
    expect(() => fs.copySync(inp, out)).not.toThrow();

    await expect(mp3dupes([
      'node',
      'mp3dupes',
      ...argv,
      out
    ])).resolves.toBeUndefined();

    expect(fs.readdirSync(out)).toMatchSnapshot();
  });
}

describe('mp3dupes', () => {

  its('resolves help with no change', [ '--help' ]);
  its('renames and removes duplicates', [ '--silent', '--rename' ]);

});
