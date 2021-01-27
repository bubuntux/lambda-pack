'use strict';

const sanitize = require('sanitize-filename');
const archiver = require('archiver-promise');
const packlist = require('npm-packlist');
const fs = require('fs-extra');
const path = require('path');

function zipFiles(packageName, files, filename, source, destination, layer, info, verbose) {
    const target = path.join(destination, filename);
    if (info)
        console.log(`Archive: ${target}`);

    let archive = archiver(target);
    files.forEach(file => {
        const filePath = path.join(source, file);
        let prefix = '';
        if (layer) {
            prefix = 'nodejs/';
            if (!file.startsWith("node_modules")) {
                prefix += `node_modules/${packageName}/`;
            }
        }
        if (verbose)
            console.log(file);
        archive.file(filePath, {name: file, prefix});
    });
    return archive.finalize();
}

function getPackageInfo(packageFile) {
    return fs.readJson(packageFile, {encoding: 'utf-8'})
        .catch(error => {
            console.error(`Failed to read ${packageFile}`);
            return Promise.reject(error);
        });
}

function getPackageName(cwd) {
    const packageFile = path.join(cwd, 'package.json');
    return getPackageInfo(packageFile).then(packageInfo => packageInfo.name)/*.then(packageInfo => `${sanitize(packageInfo.name)}.zip`)*/;
}

function pack(source, destination, layer, info, verbose) {
    return packlist({path: source})
        .then(files => {
            return getPackageName(source)
                .then(packageName => {
                    const filename = `${sanitize(packageName)}.zip`;
                    return zipFiles(packageName, files, filename, source, destination, layer, info, verbose);
                });
        });
}

module.exports = {
    pack
}
