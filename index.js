#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');

const currentConfig = {
    os: process.platform,
    home: require('os').homedir(),
    delim: process.platform === 'win32' ? '\\' : '/',
    ignore: ['config.json', 'README.md', '.gitignore', '.git']
}

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

function updateConfig(curConf, newConf) {

    if(newConf.ignore)
        curConf.ignore = curConf.ignore.concat(newConf.ignore)

    return curConf
}
function loadFile(dir, config) {
    console.log('LOAD FILE', dir, config)
}

function loadDir(dir, config) { 

    fs.readdir(dir, function(err, items) {
        console.log(items);
        let curConfig = config
        for (var i=0; i<items.length; i++) {
            if(items[i] === 'config.json') {
                curConfig = updateConfig(config, JSON.parse(fs.readFileSync(dir + '/' + items[i], 'utf8')))
            }
        }
        console.log('LOAD FILES', curConfig)
        for (var i=0; i<items.length; i++) {
            if(curConfig.ignore.filter((ign) => ign === items[i]).length === 0) {
                var file = dir + curConfig.delim + items[i];
                let stats = fs.lstatSync(file)
                console.log(file, stats)
                if(stats.isDirectory())
                    loadDir(file, config)
                else
                    loadFile(file, curConfig)
            }
        }
    });
} 

loadDir(process.argv[2], currentConfig)