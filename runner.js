const fs = require('fs');
const path = require('path');

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      const beforeEaches = [];
      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      global.it = (desc, fn) => {
        beforeEaches.forEach(func => func());
        try {
         fn();
         console.log(`OK - ${desc}`);
        } catch (err) {
          console.log(`X - ${desc}`);
          console.log('\t',err.message);
        }
      };
      // 'global' is similar to the window variable in the browser. It is available in every file and is shared between all the files
      // when we execute a file from another project we need the 'it' functiion to be available. Thats why we write this line before we execute the file. When we call the it function Node will look to see if its been defined in that file. If it hasnt it will then look at the global scope/object.
      try {
        require(file.name);
      } catch (err) {
        console.log('\t',err);
      }
    }
  }

  async collectFiles(targetPath) {
// targetPath === /users/jasdeepsingh/Documents/Code/TME
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filepath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes('test.js')) {
        this.testFiles.push({ name: filepath });
      } else if (stats.isDirectory()) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map(f => path.join(file, f)));
      }
    }
  }
};

module.exports = Runner;
