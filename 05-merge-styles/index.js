const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(bundlePath);

fsPromises
  .readdir(srcDir, {
    withFileTypes: true,
  })
  .then((files) => {
    const cssFilesList = [];

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        cssFilesList.push(file.name);
      }
    });

    cssFilesList.forEach((fileName) => {
      const readStream = fs.createReadStream(
        path.join(srcDir, fileName),
        'utf-8',
      );
      readStream.on('data', (data) => {
        writeStream.write(`/* ${fileName} */\n`);
        writeStream.write(data);
      });
    });
  });
