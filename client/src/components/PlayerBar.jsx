import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import { Box, Typography, Avatar, Paper } from "@mui/material";

export default function PlayerBar() {
    const track = useSelector(
        (state) => state.player.currentTrack
    );

    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;

        const player = new Plyr(audioRef.current, {
            controls: [
                "play",
                "progress",
                "current-time",
                "duration",
                "mute",
                "volume"
            ]
        });

        return () => player.destroy();
    }, []);

    useEffect(() => {
        if (!track || !audioRef.current) return;

        audioRef.current.src =
            `http://localhost:5000/api/stream/${track.audio_path}`;

        audioRef.current.play();

    }, [track]);

    if (!track) return null;

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#ffffff",
                color: "#fff",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderTop: "1px solid #222"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: 50 }}>
                <Avatar
                    variant="rounded"
                    src={`http://localhost:5000/uploads/covers/${track.cover_path}`}
                    sx={{ width: 50, height: 50 }}
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <audio ref={audioRef} controls style={{ width: "100%" }} />
            </Box>
        </Paper>
    );
}