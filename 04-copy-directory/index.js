const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(destDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(destDir, file), (err) => {
        if (err) throw err;
      });
    });
  });

  fsPromises.readdir(srcDir).then((files) => {
    files.forEach((file) => {
      const filePath = path.join(srcDir, file);
      fs.copyFile(filePath, path.join(destDir, file), (err) => {
        if (err) throw err;
        console.log('File copied ', file);
      });
    });
  });
}
copyDir();
