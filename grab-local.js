const fs = require("fs");
const Promise = require("bluebird");
const readFile = Promise.promisify(fs.readFile);
const glob = Promise.promisify(require("glob"));

function grabLocal(config, artistsRegistry) {
    return glob(config.files).then(
        matches => {
            return Promise.all(matches.map(function (fileName) {
                return processFile(fileName, artistsRegistry);
            }));
        },
        err => {
            console.error("Error getting files list in Local Parser");
        }
    );
}

function processFile(fileName, artistsRegistry) {
    console.log(fileName);
    return readFile(fileName)
        .then(function (str) {
            const data = JSON.parse(str);
            data.channels.forEach(channelId => {
                data.artists.forEach(artist => { artistsRegistry.add(channelId, artist); })
            });
        });
}

module.exports = grabLocal;
