#!/usr/bin/env node

const fs = require('fs-extra')
const Handlebars = require('handlebars')
const defaultConfig = require('./defaultConfig')

exports.clean = function (unused, path) {
    fs.remove(path);
    console.log('removed file: ', path)
}

exports.copy = function (source, output) {
    fs.copy(source, output).then(() => {
        console.log('copied file: ' + source)
    }).catch((err) => console.error(err))
}

function handleFile(dir, name, config, action) {
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
    action(__dirname + defaultConfig.delim + dir + defaultConfig.delim + name, path)
}

exports.loadDir = function (dir, action) { 

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
                        exports.loadDir(file, action)
                    else
                        handleFile(dir, items[i], curConfig, action)
                }
            }
        }
    });
} 