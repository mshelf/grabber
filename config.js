module.exports = {
    databaseDir: "./data/dist",

    grabbers: [
        {
            type: "local",
            name: "Local Parser",
            files: "data/local/*.json",
        },

        {
            type: "yandex",
            name: "Yandex Parser",
            sources: [
                {
                    genre: "alternative",
                    channels: ["Genres\\Rock\\Alternative Rock"],
                    pages: 10
                },
                {
                    genre: "rusrock",
                    channels: ["Genres\\Rock\\Russian Rock"],
                    pages: 2
                },
                {
                    genre: "post-rock",
                    channels: ["Genres\\Rock\\Post Rock"],
                    pages: 10
                },
                {
                    genre: "pop",
                    channels: ["Genres\\Pop"],
                    pages: 20
                },
                {
                    genre: "prog-rock",
                    channels: ["Genres\\Rock\\Progressive Rock"],
                    pages: 20
                },
                {
                    genre: "folkmetal",
                    channels: ["Genres\\Metal\\Folk Metal"],
                    pages: 1
                },
                {
                    genre: "Numetal",
                    channels: ["Genres\\Metal\\Nu Metal"],
                    pages: 5
                },
                {
                    genre: "punk",
                    channels: ["Genres\\Rock\\Punk Rock"],
                    pages: 10
                },
                {
                    genre: "ska",
                    channels: ["Genres\\Ska"],
                    pages: 5
                },
                {
                    genre: "classicmetal",
                    channels: ["Genres\\Metal\\Heavy Metal"],
                    pages: 5
                },
                {
                    genre: "progmetal",
                    channels: ["Genres\\Metal\\Progressive Metal"],
                    pages: 3
                },
            ]
        }
    ],
};
