const term = require('terminal-kit').terminal;
const {
  exec,
} = require('child_process');

function exit() {
  term.clear();
  process.exit(0);
}

function getFileName(string) {
  return string.replace(/^\w+\s/, '');
}

exec('git status --porcelain=v1', (err, stdout, stderr) => {
  if (err) {
    return;
  }

  const filesList = stdout
    .trim()
    .split('\n')
    .map(i => i.trim())
    // filter out empty lines
    .filter(i => !!i)
    // filter out deleted files
    .filter(i => !i.startsWith('D '));

  if (!filesList.length) {
    term('No changes in the repo\n');
    process.exit(0);
  }

  term.on('key', function(key) {
    if (['CTRL_C', 'ESCAPE', 'q'].includes(key)) {
      exit();
    } else if (key === 'c') {
      // copy
      const file = getFileName(menu.getState().selectedText);
      exec(`printf ${file} | pbcopy`);
      exit();
    }
  });

  term.clear();
  const menu = term.singleColumnMenu(filesList, {
    keyBindings: {
      ENTER: 'submit',
      KP_ENTER: 'submit',
      UP: 'cyclePrevious',
      k: 'cyclePrevious',
      DOWN: 'cycleNext',
      j: 'cycleNext',
      TAB: 'cycleNext',
      SHIFT_TAB: 'cyclePrevious',
      HOME: 'first',
      END: 'last',
      g: 'first',
      G: 'last',
      BACKSPACE: 'cancel',
      DELETE: 'cancel',
    }
  }, function(err, response) {
    const file = getFileName(response.selectedText);
    exec(`subl ${file}`);
    exit();
  });
});
