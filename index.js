'use strict';

const sanitize = require('sanitize-filename');
const archiver = require('archiver-promise');
const packlist = require('npm-packlist');
const fs = require('fs-extra');
const path = require('path');

function zipFiles(packageName, target, source, files, layer, verbose) {
    const archive = archiver(target);
    if (verbose) {
        console.log(`Creating zip: ${target}`);
    }
    files.forEach(file => {
        let prefix = '';
        if (layer) {
            prefix = 'nodejs/';
            if (!file.startsWith("node_modules")) {
                prefix += `node_modules/${packageName}/`;
            }
        }
        if (verbose)
            console.log(`${prefix}${file}`);
        archive.file(path.join(source, file), {name: file, prefix});
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
    return getPackageInfo(packageFile).then(packageInfo => packageInfo.name);
}

function pack(source, destination, layer, verbose) {
    return packlist({path: source})
        .then(files => {
            return getPackageName(source)
                .then(packageName => {
                    const target = path.join(destination, `${sanitize(packageName)}.zip`);
                    const zip = zipFiles(packageName, target, source, files, layer, verbose);
                    console.log(`Wrote zip to ${source}${target}`)
                    return zip;
                });
        });
}

module.exports = {
    pack
}
