const Promise = require("bluebird");

const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.8,ru;q=0.6",
    "Cache-Control": "max-age=0",
    "Host": "music.yandex.ru",
    "Cookie": "_ym_uid=1495051687693808274; yandexuid=9959223481495051702; yp=1810411702.yrts.1495051702; _ym_isad=2; _ym_visorc_10630330=w; spravka=dD0xNDk1MDUxNzE3O2k9NDYuMTY0LjIyMS4zNDt1PTE0OTUwNTE3MTcwODUzNDQ4NDg7aD1iNGVhY2Q1MTg3NTg0NjU4Zjk1YzZjZmI3MDg0YjUxNg==",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
};

function grabYandex(config, artistsRegistry, requestPool) {
    return Promise.all(config.sources.map(source => {
        return processSource(source, artistsRegistry, requestPool);
    }));
}

function processSource(source, artistsRegistry, requestPool) {
    const promises = [];
    for (var p = 0; p < source.pages; p++) {
        const uri = `https://music.yandex.ru/handlers/genre.jsx?genre=${source.genre}&filter=artists&lang=ru&page=${p}`;
        const requestOpts = { uri, headers };
        const promise = requestPool.request(requestOpts).then(result => {
            const data = JSON.parse(result);
            source.channels.forEach(channelId => {
                data.artists.forEach(artist => {
                    artistsRegistry.add(channelId, artist.name)
                });
            });
        });
        promises.push(promise);
    }
    return Promise.all(promises).then(() => {
        console.log(`Yandex Music: ${source.genre} --- FINISHED`);
    });
}

module.exports = grabYandex;
