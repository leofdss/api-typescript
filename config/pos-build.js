const fs = require('fs-extra');

try {
    const fileProd = fs.readFileSync('./dist/environments/environment.prod.js', 'utf8');
    fs.writeFileSync('./dist/environments/environment.js', fileProd);
    fs.removeSync('./dist/environments/environment.prod.js');
    fs.copy('./src/assets', './dist/assets', function (error, results) {
        if (error) {
           console.log(error);
        } else {
            console.log('Compilação terminou')
        }
    });
} catch (err) {
    console.log(err);
}
