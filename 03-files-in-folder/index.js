const path = require('path');
const fsPromises = require('fs/promises');

fsPromises
  .readdir(path.join(__dirname, 'secret-folder'), {
    withFileTypes: true,
})
  .then((result) => {
  result.forEach((res) => {
    if (res.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', res.name);
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      fsPromises
        .stat(filePath)
        .then(data => {
          console.log(
          console.log(`${fileName.replace(fileExt, '')}`,
            `${fileExt.slice(1)}`,
            `${+ (data.size / 1024).toFixed(3)}kb`);
        });
      } else {
      return;
      }
  });
  });
