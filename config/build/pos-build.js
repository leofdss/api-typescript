const fs = require('fs-extra');
try {
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
