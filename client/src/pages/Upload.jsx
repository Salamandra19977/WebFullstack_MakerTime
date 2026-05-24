import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
    Box,
    Typography,
    TextField,
    Button,
    Paper
} from "@mui/material";

export default function Upload() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");

    const [audio, setAudio] = useState(null);
    const [cover, setCover] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("genre", genre);
        formData.append("audio", audio);
        formData.append("cover", cover);

        await axios.post("http://localhost:5000/api/tracks", formData);

        alert("Uploaded!");
    };

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#ffffff"
            }}
        >
            <Link 
                to="/"
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    textDecoration: "none"
                }}
            >
                <Button
                    variant="contained"
                    fullWidth
                >
                    Home
                </Button>
            </Link>
            <Paper
                elevation={8}
                sx={{
                    p: 4,
                    width: 420,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Upload Track
                </Typography>

                <TextField
                    label="Title"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                    InputLabelProps={{ style: { color: "#aaa" } }}
                    InputProps={{ style: { color: "#fff" } }}
                />

                <TextField
                    label="Artist"
                    fullWidth
                    onChange={(e) => setArtist(e.target.value)}
                    InputLabelProps={{ style: { color: "#aaa" } }}
                    InputProps={{ style: { color: "#fff" } }}
                />

                <TextField
                    label="Genre"
                    fullWidth
                    onChange={(e) => setGenre(e.target.value)}
                    InputLabelProps={{ style: { color: "#aaa" } }}
                    InputProps={{ style: { color: "#fff" } }}
                />

                <Button
                    variant="outlined"
                    component="label"
                    sx={{ color: "#000000", borderColor: "#444" }}
                >
                    {audio ? audio.name : "Upload Audio"}
                    <input
                        type="file"
                        hidden
                        accept="audio/*"
                        onChange={(e) => setAudio(e.target.files[0])}
                    />
                </Button>

                <Button
                    variant="outlined"
                    component="label"
                    sx={{ color: "#000000", borderColor: "#444" }}
                >
                    {cover ? cover.name : "Upload Cover"}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setCover(e.target.files[0])}
                    />
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        mt: 2,
                        bgcolor: "#1976d2",
                    }}
                    onClick={handleSubmit}
                >
                    Upload
                </Button>
            </Paper>
        </Box>
    );
}