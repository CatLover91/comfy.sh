#!/usr/bin/env node

const program = require('commander')
const toolkit = require('./lib/toolkit')

program
    .version('0.0.1', '-v, --version')

program
    .command('copy [dir]')
    .description('copies over files and overwrites old files')
    .action((dir) => {
        console.log('Copying...')
        toolkit.loadDir(dir ? dir : '.', toolkit.copy)
    })

program
    .command('clean [dir]')
    .description('deletes destination files that are already covered by comfy')
    .action((dir) => {
        console.log('Cleaning...')
        toolkit.loadDir(dir ? dir : '.', toolkit.clean)
    })

program.parse(process.argv)
