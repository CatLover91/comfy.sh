#!/usr/bin/env node

const fs = require('fs')
const Handlebars = require('handlebars')
const program = require('commander')

const defaultConfig = {
    os: process.platform,
    home: require('os').homedir(),
    delim: process.platform === 'win32' ? '\\' : '/',
    ignore: ['config.json', 'README.md', '.gitignore', '.git', 'node_modules']
}
function clean(path) {
    fs.unlinkSync(path);
}
function copy(source, output) {
    fs.copyFile(source, output, (err) => {
        if (err) throw err;
        console.log('copied file: ' + source)
    })
}
function handleFile(dir, name, config) {
    console.log('LOAD FILE', dir, name, config)

    let path;
    if (config.output) {
        console.log('Output override')
        path = Handlebars.compile(config.output)(defaultConfig) + defaultConfig.delim + name
    } else {
        console.log('Output Home Default')
        path = defaultConfig.home + defaultConfig.delim + dir + defaultConfig.delim + name
    } 
    console.log('path to operate from: ', __dirname + defaultConfig.delim + dir + defaultConfig.delim + name)
    console.log('path to operate on: ', path)
    
}

function loadDir(dir, config) { 

    fs.readdir(dir, function(err, items) {
        let curConfig = defaultConfig
        for (let i=0; i<items.length; i++)
            if(items[i] === 'config.json')
                curConfig = JSON.parse(fs.readFileSync(dir + '/' + items[i], 'utf8'))
        
        
        for (let i=0; i<items.length; i++) {
            if(!curConfig.ignore || curConfig.ignore.filter((ign) => ign === items[i]).length === 0) {
                if(defaultConfig.ignore.filter((ign) => ign === items[i]).length === 0) {
                    let file = dir === '.' ? items[i] : dir + defaultConfig.delim + items[i];
                    let stats = fs.lstatSync(file)
                    //console.log(file, stats)
                    if(stats.isDirectory())
                        loadDir(file, config)
                    else
                        handleFile(dir, items[i], curConfig)
                }
            }
        }
    });
} 

loadDir(process.argv.length <= 2 ? '.' : process.argv[2], defaultConfig)