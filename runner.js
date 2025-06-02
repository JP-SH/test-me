const fs = require('fs');
const path = require('path');
const c = require('ansi-colors');
const render = require('./render');

const forbiddenDirs = ['node_modules'];
// this is for the directories we dont want to visit/test

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(c.gray(`---- ${file.shortName}`));
      const beforeEaches = [];
      global.render = render;
      global.beforeEach = fn => {
        beforeEaches.push(fn);
      };
      global.it = async (desc, fn) => {
        beforeEaches.forEach(func => func());
        try {
          await fn();
          console.log(c.green(`\tOK - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, '\n\t\t');
          console.log(c.red(`\tX - ${desc}`));
          console.log(c.red('\t', message));
        }
      };
      // 'global' is similar to the window variable in the browser. It is available in every file and is shared between all the files
      // when we execute a file from another project we need the 'it' functiion to be available. Thats why we write this line before we execute the file. When we call the it function Node will look to see if its been defined in that file. If it hasnt it will then look at the global scope/object.

      try {
        require(file.name);
      } catch (err) {
        console.log(c.red(err));
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filepath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ name: filepath, shortName: file });
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map(f => path.join(file, f)));
      }
    }
  }
}

module.exports = Runner;
