const process = require("process");
const rimraf = require("rimraf");
const fs = require("fs");
const Promise = require("bluebird");

const config = require("./config");
const ArtistsRegistry = require("./artists-registry");
const grabLocal = require("./grab-local");

const params = parseArgv();

// prepare env
if (params.resetAll && fs.existsSync(config.databaseDir)) {
    rimraf.sync(config.databaseDir);
}
fs.mkdirSync(config.databaseDir);

// run grabbers
console.log("Run grabbers");
const artistsRegistry = new ArtistsRegistry(config.databaseDir);
const grabbersPromises = config.grabbers.map(grabberConfig => {
    return runGrabber(grabberConfig);
});
Promise.all(grabbersPromises)
    .then(
        () => {
            console.log("Flush data");
            artistsRegistry.flush();
        },
        err => {
            console.error(err);
        }
    );



function runGrabber(grabberConfig) {
    switch (grabberConfig.type) {
        case "local":
            return grabLocal(grabberConfig, artistsRegistry);
            break;
        default:
            return Promise.rejected("Unknown grabber type: " + grabberConfig.type);
            break;
    }
}


function parseArgv() {
    const data = {};
    for (var i = 1; i < process.argv.length; i++) {
        const param = process.argv[i];
        switch (param) {
            case "--reset-all":
                data.resetAll = true;
                break;
        }
    }
    return data;
}