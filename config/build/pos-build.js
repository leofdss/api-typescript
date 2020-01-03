const fsExtra = require('fs-extra');
const fs = require('fs');
const pathConverter = require('path');

function genetatePath(path) {
    if (!path) path = [];
    try {
        return pathConverter.join(__dirname + path.join('/'));
    } catch (error) {
        console.log(error);
        return '';
    }
}

async function loading(path) {
    if (!path) path = [];
    try {
        if (fs.existsSync(genetatePath(path))) {
            const files = fs.readdirSync(genetatePath(path));
            for (const file of files) {
                const stat = fs.statSync(genetatePath(path.concat([file])));
                if (stat.isDirectory()) {
                    await loading(path.concat([file]));
                } else {
                    if (String(file).endsWith('.js')) {
                        await replaceFile(path, file);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function replaceFile(path, file) {
    let fileJS = fs.readFileSync(genetatePath(path.concat([file])), 'utf8').split('require');
    const regex = /require\("(.*)"\)/
    for (let i = 1; i < fileJS.length; i++) {
        stringImport = regex.exec("require" + fileJS[i]);
        if (stringImport) {
            const newPath = String(`("${replacePath(genetatePath(path.concat([file])), stringImport[1])}")`);
            const oldPath = String(`("${stringImport[1]}")`);

            fileJS[i] = fileJS[i].replace(oldPath, newPath);
        }
    }
    fs.writeFileSync(genetatePath(path.concat([file])), fileJS.join('require'));
}

function replacePath(filePath, importPath) {
    if (String(importPath).startsWith('src')) {
        let split = importPath.split('/');
        if (split.length > 1) {
            let [lixo, ...file] = filePath.replace(genetatePath(['../../../dist']), '').split('/');
            let [lixo2, ...importP] = importPath.split('/');
            let i = 0;
            while (true) {
                if (file[i] !== importP[i] || i === importP.length) {
                    break;
                }
                importP.splice(i, 1);
                file.splice(i, 1);
                i++;
            }
            const n = file.length - 1;
            for (let i = 0; i < n; i++) {
                importP = ['..', ...importP];
            }
            if (importP[0] !== '..') {
                importP = ['.', ...importP];
            }
            return importP.join('/');
        }
    }
    return importPath;
}

loading(['../../../dist']);

try {
    fsExtra.copy('./src/assets', './dist/assets', function (error, results) {
        if (error) {
            console.log(error);
        } else {
            console.log('Compilação terminou')
        }
    });
} catch (err) {
    console.log(err);
}
