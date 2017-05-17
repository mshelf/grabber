const fs = require('fs');
const MAX_ARTISTS_PER_FILE = 1000;

class ArtistsRegistry {
    constructor(databaseDir) {
        this.registry = {};
        this.databaseDir = databaseDir;

        this.metadataFileName = databaseDir + "/metadata.json";
        if (fs.existsSync(this.metadataFileName)) {
            this.metadata = JSON.parse(fs.readFileSync(this.metadataFileName));
        } else {
            this.metadata = {};
        }
    }

    add(channelId, artist) {
        if (!this.registry[channelId]) {
            this.registry[channelId] = {};
        }
        this.registry[channelId][artist] = 1;
    };

    flush() {
        for (var channelId in this.registry) {
            const channelRegistry = Object.assign(this._loadChannelArtistsRegistry(channelId), this.registry[channelId]);
            const artists = Object.keys(channelRegistry);
            const filesCount = Math.ceil(artists.length / MAX_ARTISTS_PER_FILE);
            this.metadata[channelId] = filesCount;
            for (var i = 1; i <= filesCount; i++) {
                const fileName = this.databaseDir + "/" + getFileName(channelId, i);
                const start = (i-1) * MAX_ARTISTS_PER_FILE;
                const data = artists.slice(start, start + MAX_ARTISTS_PER_FILE);
                fs.writeFileSync(fileName, JSON.stringify(data));
            }
        }
        fs.writeFileSync(this.metadataFileName, JSON.stringify(this.metadata));
        this.registry = {};
    };

    _loadChannelArtistsRegistry(channelId) {
        if (!this.metadata[channelId]) {
            return {};
        }

        const channelRegistry = {};
        const filesCount = this.metadata[channelId];
        for (var i = 1; i <= filesCount; i++) {
            const fileName = this.databaseDir + "/" + getFileName(channelId, i);
            if (!fs.existsSync(fileName)) {
                continue;
            }
            const artistsList = JSON.parse(fs.readFileSync(fileName));
            artistsList.forEach(function (artist) {
                channelRegistry[artist] = 1;
            })
        }
        return channelRegistry;
    };
}

function getFileName(channelId, num) {
    return channelId.toLowerCase().replace(/[\\,\s]/g, "_") + "_" + num + ".json";
}

module.exports = ArtistsRegistry;
