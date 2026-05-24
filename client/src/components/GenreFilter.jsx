import { Button } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTracks } from "../store/store";
import { Link } from "react-router-dom";

const genres = ["all", "rock", "pop", "hip-hop"];

export default function GenreFilter() {
    const dispatch = useDispatch();

    const filter = async (genre) => {
        if (genre === "all") {
            const res = await axios.get(
                "http://localhost:5000/api/tracks"
            );
            dispatch(setTracks(res.data));
            return;
        }

        const res = await axios.get(
            `http://localhost:5000/api/genre/${genre}`
        );

        dispatch(setTracks(res.data));
    };

    return (
        <div style={{ display: "flex", gap: 10, padding: 10 }}>
            {genres.map((g) => (
                <Button key={g} onClick={() => filter(g)}>
                    {g}
                </Button>
            ))}
            <Link to="/upload">
                <Button
                    variant="contained"
                    fullWidth
                >
                    Upload
                </Button>
            </Link>
        </div>
    );
}