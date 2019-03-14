#!/usr/bin/env node

module.exports = {
    os: process.platform,
    home: require('os').homedir(),
    delim: process.platform === 'win32' ? '\\' : '/',
    ignore: ['config.json', 'README.md', '.gitignore', '.git', 'node_modules']
}