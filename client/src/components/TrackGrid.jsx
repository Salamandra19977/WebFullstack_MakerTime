import { Grid } from "@mui/material";
import TrackCard from "./TrackCard";

export default function TrackGrid({ tracks }) {
    return (
        <Grid container spacing={2} padding={2}>
            {tracks.map((track) => (
                <Grid item xs={12} sm={6} md={3} key={track.id}>
                    <TrackCard track={track} />
                </Grid>
            ))}
        </Grid>
    );
}