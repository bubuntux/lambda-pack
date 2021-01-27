#!/usr/bin/env node
'use strict';

const console = require('console');
const {pack} = require('../index');

const argv = require('yargs')
    .usage('Usage: $0 --src [source] --dst [destination] --layer true')
    .option('source', {alias: 'src', default: ''})
    .option('destination', {alias: 'dst', default: ''})
    .option('layer', {alias: 'l', default: false})
    .option('info', {alias: 'i', default: false})
    .option('verbose', {alias: 'v', default: false})
    .argv;

pack(argv.source, argv.destination, argv.layer, argv.info, argv.verbose)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
