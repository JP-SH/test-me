#!/usr/bin/env node

const Runner = require('./runner');
const runner = new Runner();

const run = async () => {
  await runner.collectFiles(process.cwd());
  // in the line above we want to collect the files from the correct path. Since we are going to be collecting files from the dir we are currently in. We use cwd which stands for 'current working directory'.
  console.log(runner.testFiles);
};

run();
