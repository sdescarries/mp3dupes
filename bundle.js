const { execSync } = require('child_process');
const fs = require('fs');

const options = {
  stdio: 'inherit',
};

// main entry point when called directly
if (process.argv[1] === __filename) {
  bundle();
}

function getBins(dir) {

  function reducer (acc, cur) {
    acc.push(`${dir}/${cur}`);
    return acc;
  }

  const dirs = fs.readdirSync(dir);
  return dirs.reduce(reducer, []);
}

function bundle() {

  // Bundle the JS using webpack
  execSync('yarn run webpack', options);

  // Get a dynamic list of outputs in the bin directory
  for (const bin of getBins('./bin')) {

    // Read packed data
    const data = fs.readFileSync(bin, 'utf-8');

    // Prepend the shebang launcher for node
    const bang = `#! /usr/bin/env node\n\n${data}`;
    fs.writeFileSync(bin, bang, 'utf-8');

    // Set executable
    fs.chmodSync(bin, parseInt('755', 8));
  }
}
