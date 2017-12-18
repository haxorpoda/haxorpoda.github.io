#!/usr/bin/env node
const fs = require('fs');
const execSync = require('child_process').execSync;

const config = require('./config');

// const dataSetName = 'BeispielKaefer';
// const dataSetName = 'Insekten_Mittel';
// const dataSetName = 'Insekten_Gross';
const dataSetName = 'Schmetterlinge';
// const dataSetName = 'BunteKaefer';
const baseDir = `../img/bugs-small-marked-bgremoved`;

const fileColor = fs.readdirSync(baseDir).map(file => {
  const resBuffer = execSync(`./average.color.py ${baseDir}/${file}`, 'inherit');
  return {
    file,
    colors: JSON.parse(resBuffer.toString()),
  };
});

// console.log("fileColor", fileColor);

const outFilePath = `${config.dataDir}/colors.one.js`;
fs.writeFileSync(
  outFilePath,
  `export const fileColors = ${JSON.stringify(fileColor, null, 2)}`
);
process.stdout.write(`\nwrote file ${outFilePath}\n`);
