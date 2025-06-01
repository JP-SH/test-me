const fs = require('fs');

class Runner {
  constructor() {
    this.files = [];
  }

  async collectFiles(targetPath) {
// targetPath === /users/jasdeepsingh/Documents/Code/TME
    const files = await fs.promises.readdir(targetPath);

    return files;
  }
};

module.exports = Runner;
