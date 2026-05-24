const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "static/uploads"))
);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (file.fieldname === "audio") {
            cb(null, "static/uploads/audio");
        } else {
            cb(null, "static/uploads/covers");
        }
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const fileFilter = (req, file, cb) => {

    if (
        file.fieldname === "audio" &&
        file.mimetype === "audio/mpeg"
    ) {
        cb(null, true);
    }

    else if (
        file.fieldname === "cover" &&
        file.mimetype.startsWith("image/")
    ) {
        cb(null, true);
    }

    else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

app.get("/api/tracks", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM tracks ORDER BY created_at DESC"
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.get("/api/tracks/:id", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM tracks WHERE id=?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                message: "Track not found"
            });
        }

        res.json(rows[0]);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.get("/api/search", async (req, res) => {

    try {

        const q = req.query.q || "";

        const [rows] = await db.query(
            `
            SELECT *
            FROM tracks
            WHERE title LIKE ?
            OR artist LIKE ?
            `,
            [`%${q}%`, `%${q}%`]
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.get("/api/genre/:genre", async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT *
            FROM tracks
            WHERE genre=?
            `,
            [req.params.genre]
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.post(
    "/api/tracks",
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "cover", maxCount: 1 }
    ]),
    async (req, res) => {

        try {

            const {
                title,
                artist,
                genre
            } = req.body;

            const audio =
                req.files.audio[0].filename;

            const cover =
                req.files.cover[0].filename;

            const [result] = await db.query(
                `
                INSERT INTO tracks
                (title, artist, genre, audio_path, cover_path)
                VALUES (?,?,?,?,?)
                `,
                [
                    title,
                    artist,
                    genre,
                    audio,
                    cover
                ]
            );

            res.status(201).json({
                id: result.insertId
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }
    }
);

app.put("/api/tracks/:id", async (req, res) => {

    try {

        const {
            title,
            artist,
            genre
        } = req.body;

        await db.query(
            `
            UPDATE tracks
            SET title=?, artist=?, genre=?
            WHERE id=?
            `,
            [
                title,
                artist,
                genre,
                req.params.id
            ]
        );

        res.json({
            message: "Updated"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.delete("/api/tracks/:id", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM tracks WHERE id=?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                message: "Track not found"
            });
        }

        const track = rows[0];

        const audioPath = path.join(
            __dirname,
            "static/uploads/audio",
            track.audio_path
        );

        const coverPath = path.join(
            __dirname,
            "static/uploads/covers",
            track.cover_path
        );

        if (fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
        }

        if (fs.existsSync(coverPath)) {
            fs.unlinkSync(coverPath);
        }

        await db.query(
            "DELETE FROM tracks WHERE id=?",
            [req.params.id]
        );

        res.json({
            message: "Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.get("/api/stream/:filename", (req, res) => {

    const filePath = path.join(
        __dirname,
        "static/uploads/audio",
        req.params.filename
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "File not found"
        });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (range) {

        const parts =
            range.replace(/bytes=/, "")
                .split("-");

        const start = parseInt(parts[0], 10);

        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;

        const chunkSize = end - start + 1;

        const stream = fs.createReadStream(filePath, {
            start,
            end
        });

        res.writeHead(206, {
            "Content-Range":
                `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges":
                "bytes",
            "Content-Length":
                chunkSize,
            "Content-Type":
                "audio/mpeg"
        });

        stream.pipe(res);

    } else {

        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "audio/mpeg"
        });

        fs.createReadStream(filePath)
            .pipe(res);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});