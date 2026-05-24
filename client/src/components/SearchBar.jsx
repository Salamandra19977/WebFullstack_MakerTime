import { TextField } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTracks } from "../store/store";

export default function SearchBar() {
    const dispatch = useDispatch();

    const handleSearch = async (e) => {
        const value = e.target.value;

        if (!value) {
            const res = await axios.get(
                "http://localhost:5000/api/tracks"
            );
            dispatch(setTracks(res.data));
            return;
        }

        const res = await axios.get(
            `http://localhost:5000/api/search?q=${value}`
        );

        dispatch(setTracks(res.data));
    };

    return (
        <TextField
            fullWidth
            label="Search music..."
            onChange={handleSearch}
        />
    );
}