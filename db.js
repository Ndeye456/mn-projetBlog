const sqlite3 = require("sqlite3").verbose()

const dbFile = "db.sqlite";

//Se connecter a la base de données
let db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log("Connexion a la base sqlite3...");
        const sql = `CREATE TABLE article(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
           resume text,
           contents text,
            author  text,
            creationDate date,
            lastUpdate date
        )`;
        db.run(sql, (err) => {
            if (err) {
                console.log("table deja cree");
            }
        });
    }
});

module.exports = db;