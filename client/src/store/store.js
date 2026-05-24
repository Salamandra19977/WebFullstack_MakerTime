import { configureStore, createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
    name: "player",
    initialState: {
        currentTrack: null,
        isPlaying: false,
        queue: [],
        volume: 1,
        currentTime: 0
    },
    reducers: {
        setTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
        play: (state) => {
            state.isPlaying = true;
        },
        pause: (state) => {
            state.isPlaying = false;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        setTime: (state, action) => {
            state.currentTime = action.payload;
        }
    }
});

const tracksSlice = createSlice({
    name: "tracks",
    initialState: {
        items: [],
        loading: false,
        search: "",
        genre: "all"
    },
    reducers: {
        setTracks: (state, action) => {
            state.items = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setGenre: (state, action) => {
            state.genre = action.payload;
        }
    }
});

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        color: "#1976d2",
        darkMode: false
    },
    reducers: {
        setColor: (state, action) => {
            state.color = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        }
    }
});

export const store = configureStore({
    reducer: {
        player: playerSlice.reducer,
        tracks: tracksSlice.reducer,
        theme: themeSlice.reducer
    }
});

export const {
    setTrack,
    play,
    pause,
    setVolume,
    setTime
} = playerSlice.actions;

export const {
    setTracks,
    setLoading,
    setSearch,
    setGenre
} = tracksSlice.actions;

export const {
    setColor,
    toggleDarkMode
} = themeSlice.actions;