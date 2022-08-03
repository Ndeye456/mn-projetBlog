const express = require("express");
const db = require("./db.js");

const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = 3000;

app.get("/", function (req, res) {
    res.json({ message: "L'API marche " });
});

//Lister les artcles
app.get("/api/articles", (req, res) => {
    const sql = "SELECT * FROM article";
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({ Error: err.message });
            return;
        }
        res.json({ message: "Liste des articles", data: rows });
    });
});

//Afficher un article avec son ID
app.get("/api/articles/:id", (req, res) => {
    const { id: articleID } = req.params
    const sql = "SELECT * FROM article WHERE id= ?";
    const params = [articleID]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ Error: err.message });
            return;
        }
        res.json({ message: `Afficher le article ${articleID}`, data: row });
    });
});


//creer un nouveau Article
app.post("/api/articles", (req, res) => {
    const { title, resume, contents, author, creationDate, lastUpdate } = req.body;

    if (!title || !resume || !contents || !author || !creationDate || !lastUpdate) {
        res.status(400).json({ error: "Merci de remplire tous les champs!" });
        return;
    }
    const article = { title, resume, contents, author, creationDate, lastUpdate };
    const sql = 'INSERT INTO article (title, resume, contents, author, creationDate, lastUpdate) VALUES (?, ?, ?, ?, ?, ? )'
    const params = [article.title, article.resume, article.contents, article.author, article.creationDate, article.lastUpdate];
    db.run(sql, params, function (err, reslut) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res
            .status(201)
            .json({ message: "Article crée avec succés", data: article });
    });
});

//modifier un article
app.put("/api/articles/:id", (req, res) => {
    const { id: articleID } = req.params;
    const { title, resume, contents, author, creationDate, lastUpdate } = req.body;

    if (!title || !resume || !contents || !author || !creationDate || !lastUpdate) {
        res.status(400).json({ error: "Merci de remplire tous les champs!" });
        return;
    }
    const article = { title, resume, contents, author, creationDate, lastUpdate };
    const sql = "UPDATE  article SET title = ?, resume = ?, contents = ?, author = ?, creationDate = ?, lastUpdate = ? WHERE id = ?";
    const params = [article.title, article.resume, article.contents, article.author, article.creationDate, article.lastUpdate, articleID];
    db.run(sql, params, function (err, reslut) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res
            .status(201)
            .json({
                message: `Article ${articleID} modifié avec succés`,
                data: article,
            });
    });
});



//Supprimer un article
app.delete("/api/articles/:id", (req, res) => {
    const { id: articleID } = req.params;
    const sql = "DELETE FROM article WHERE id = ?"
    db.run(sql, articleID, function (err, resultat) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: `Article ${articleID} supprimer`,
            data: this.changes,
        });
    });
});


//demarrer le serveur
app.listen(PORT, () => {
    console.log(`L'application est demarré au port ${PORT}`);
});
