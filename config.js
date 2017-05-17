module.exports = {
    databaseDir: "./data/dist",

    grabbers: [
        {
            type: "local",
            name: "Local Parser",
            files: "data/local/*.json",
        },
    ],
}
