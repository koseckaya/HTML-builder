const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(filePath);
stdout.write('Write text\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Bye');
    exit();
  }
  stream.write(data);
});
process.on('SIGINT', () => {
  stdout.write('Bye');
  exit();
});
