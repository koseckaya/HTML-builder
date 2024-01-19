const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

fs.mkdir(
  path.join(__dirname, 'project-dist', 'assets'),
  { recursive: true },
  (err) => {
    if (err) throw err;
    copy(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets'),
    );
    createStyleBundle();
    createHTML();
  },
);

function copy(from, to) {
  fsPromises
    .readdir(from, {
      withFileTypes: true,
    })
    .then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(from, file.name);
          fs.copyFile(filePath, path.join(to, file.name), (err) => {
            if (err) throw err;
          });
        } else {
          createDir(to, file.name, () => {
            copy(path.join(from, file.name), path.join(to, file.name));
          });
        }
      });
    });
}
function createDir(srcPath, dirName, afterCreate) {
  fs.mkdir(path.join(srcPath, dirName), { recursive: true }, (err) => {
    if (err) throw err;
    afterCreate();
  });
}

function createStyleBundle() {
  const styleStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );
  fsPromises.readdir(path.join(__dirname, 'styles')).then((files) => {
    files.forEach((file) => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'styles', file),
        'utf-8',
      );
      readStream.on('data', (data) => {
        styleStream.write(data);
      });
    });
  });
}

function createHTML() {
  let compArr = [];
  const inStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  const outStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
  );

  fsPromises
    .readdir(path.join(__dirname, 'components'), { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        const fileName = path.basename(file.name);
        const fileExt = path.extname(file.name);
        compArr.push(fileName.replace(fileExt, ''));
      });
    });

  inStream.on('data', async (data) => {
    let resHTML = data.toString();
    for await (const component of compArr) {
      let tempTag = `{{${component}}}`;
      if (resHTML.search(new RegExp(tempTag, 'g')) !== -1) {
        let tmpHtml = await getFileContent(`${component}.html`);
        resHTML = resHTML.replaceAll(tempTag, tmpHtml);
      }
    }
    outStream.write(resHTML);
  });
}

async function getFileContent(fileName) {
  const readStream = fs.createReadStream(
    path.join(__dirname, 'components', fileName),
    'utf-8',
  );
  let resultStr = '';
  for await (const chunk of readStream) {
    resultStr = chunk;
  }
  return resultStr;
}
