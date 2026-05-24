import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setTrack, play } from "../store/store";

export default function TrackCard({ track }) {
    const dispatch = useDispatch();

    const handlePlay = () => {
        dispatch(setTrack(track));
        dispatch(play());
    };

    return (
        <Card>
            <CardMedia
                component="img"
                height="160"
                image={`http://localhost:5000/uploads/covers/${track.cover_path}`}
            />

            <CardContent>
                <Typography fontWeight="bold">
                    {track.title}
                </Typography>

                <Typography variant="body2">
                    {track.artist}
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handlePlay}
                    sx={{ marginTop: 1 }}
                >
                    Play
                </Button>
            </CardContent>
        </Card>
    );
}