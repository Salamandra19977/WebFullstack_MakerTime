import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import axios from "axios";

import { setTracks, setLoading } from "../store/store";

import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import TrackGrid from "../components/TrackGrid";

export default function Home() {
    const dispatch = useDispatch();

    const tracks = useSelector(
        (state) => state.tracks.items
    );

    const loading = useSelector(
        (state) => state.tracks.loading
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(setLoading(true));

                const res = await axios.get(
                    "http://localhost:5000/api/tracks"
                );

                dispatch(setTracks(res.data));

            } catch (err) {
                console.log(err);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <SearchBar />
            <GenreFilter />
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh',
                        width: '100%',
                    }}
                >
                    <CircularProgress aria-label="Loading…" />
                </Box>
            ) : (
                <TrackGrid tracks={tracks} />
            )}
        </div>
    );
}