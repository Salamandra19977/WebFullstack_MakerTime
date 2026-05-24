import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setTracks } from "./store/store";

import TrackGrid from "./components/TrackGrid";
import PlayerBar from "./components/PlayerBar";

import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
    const dispatch = useDispatch();

    const tracks = useSelector(
        (state) => state.tracks.items
    );

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/tracks")
            .then((res) => {
                dispatch(setTracks(res.data));
            });
    }, []);

    return (
        <div style={{ paddingBottom: 100, margin: 20 }}>

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/upload"
                    element={<Upload />}
                />
            </Routes>
            <PlayerBar />
        </div>
    );
}

export default App;