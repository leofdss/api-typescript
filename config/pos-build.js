const fs = require('fs-extra');

try {
    const fileProd = fs.readFileSync('./dist/environments/environment.prod.js', 'utf8');
    fs.writeFileSync('./dist/environments/environment.js', fileProd);
    fs.removeSync('./dist/environments/environment.prod.js');
} catch (err) {
    console.log(err);
}
