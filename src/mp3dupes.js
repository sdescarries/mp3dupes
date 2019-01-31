const { version, description } = require('../package.json');
const program = require('commander');
const fs = require('fs-extra');
const URI = require('urijs');
const NodeID3 = require('node-id3');
const ProgressBar = require('progress');
const readline = require('readline');
const chalk = require('chalk');
const diacritics = require('diacritics').remove;
const mm = require('music-metadata');

function help() {
  console.log(`
${description}

Examples:

  > mp3dupes [options] <search directory>
  > mp3dupes --help

`);
}

function numsort(a, b) {
  try {
    const na = parseInt(a.name.match(/^\d+/m)[0], 10);
    const nb = parseInt(b.name.match(/^\d+/m)[0], 10);
    return (na - nb);
  } catch (error) {
    return a.name.localeCompare(b.name);
  }
}

async function getInput(message) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    const rl = readline.createInterface({
      input: stdin,
      output: stdout
    });
    rl.question(chalk.bold('⇨  ' + message), (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

async function getConfirm(message) {
  const answer = await getInput(message);
  if (answer === 'n' || answer === 'N') {
    throw new Error ('not confirmed');
  }
}

async function mp3dupes(argv = process.argv) {

  function getPath(args) {
    try {
      const path = args.pop();
      path && (program.path = path);
    } catch (e) {}
  }

  program
    .version(version)
    .on('--help', help)
    .on('command:*', getPath)
    .option('--verbose', 'Enable verbose logging')
    .option('--silent', 'Disable progress bar and remove duplicate files without confirmation')
    .option('--rename', 'Automatically rename files to be portable')
    .parse(argv);

  const {
    verbose = false,
    silent = false,
    rename = false,
    path,
  } = program;

  if (path == null) {
    program.help();
    return;
  }

  const dirents = fs
    .readdirSync(path, { withFileTypes: true })
    .sort(numsort);

  let length = dirents.length;

  console.log(`Found ${length} files in ${path}`);
  if (verbose) {
    for (const { name } of dirents) {
      console.log(name);
    }
  }

  const db = {
    'undefined': 1,
  };

  let bar;

  if (!silent && !verbose) {
    bar = new ProgressBar(
      '  parsing [:bar] :percent :rate/sec :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: length,
      });
  }

  let idx = 0;
  const dupes = [];
  for (const dirent of dirents) {
    try {

      bar && bar.tick();

      const uri = new URI().directory(path).filename(dirent.name);

      if (!dirent.isFile()) {
        continue;
      }

      if (uri.suffix().toLocaleLowerCase() !== 'mp3') {
        continue;
      }

      const file = uri.normalize().readable();
      const { common = {} } = await mm.parseFile(file, { native: true });
      const { title = 'undefined' } = common;
      let count = db[title] || 0;

      if (count > 0) {
        dupes.push(file);
      } else if (rename) {
        idx++;
        const num = idx.toString().padStart(3, '0');
        const clr = diacritics(title)
          .replace(/[^\w\d-_ ]/igm, '')
          .replace(/(feat|ft|remix|original mix)/igm, '')
          .replace(/ +/gm, ' ')
          .replace(/ +$/gm, '');
        const out = `${num} ${clr}.mp3`;
        fs.move(file, new URI().directory(path).filename(out).normalize().readable());
      }

      count++;
      db[title] = count;

    } catch ({ stack }) {
      console.log(stack);
    }
  }

  length = dupes.length;

  console.log(`\nFound ${length} duplicates out of ${idx} MP3 files\n`);
  if (length > 0) {

    if (verbose) {

      for (const dupe of dupes) {
        console.log(`  ${chalk.bold.white(dupe)}`);
      }
    }

    if (!silent) {
      bar = new ProgressBar(
        '  deleting [:bar] :percent :rate/sec :etas', {
          complete: '=',
          incomplete: ' ',
          width: 40,
          total: length,
        });

      await getConfirm('Okay to delete them directly? [Y/n]');
    }

    for (const dupe of dupes) {
      try {
        fs.unlinkSync(dupe);
        bar && bar.tick();
      } catch ({ stack }) {
        console.log(stack);
      }
    }
  }
}

module.exports = mp3dupes;
