import React, { useState, useEffect } from 'react';
import {
    createTheme,
    ThemeProvider,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Container,
    Grid,
    Snackbar,
    Alert,
    Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import PaperCard from './PaperCard';

const Home = () => {
    const [query, setQuery] = useState('');
    const [papers, setPapers] = useState([]);
    const [savedPapers, setSavedPapers] = useState(() => {
        const saved = localStorage.getItem('savedPapers');
        return saved ? JSON.parse(saved) : [];
    });
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    // Debounced search function
    const debouncedSearch = debounce(async (searchQuery) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/papers`);
        const allPapers = await response.json();

        if (searchQuery.trim() === '') {
            setPapers(allPapers);
        } else {
            const filteredPapers = allPapers.filter(paper =>
                paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                paper.authors.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setPapers(filteredPapers);
        }
    }, 300);

    const handleSearch = (event) => {
        const searchQuery = event.target.value;
        setQuery(searchQuery);
        debouncedSearch(searchQuery);
    };

    const handleSave = (paper) => {
        if (savedPapers.some(savedPaper => savedPaper.title === paper.title)) {
            setSnackbarMessage(`${paper.title} is already saved!`);
            setSnackbarOpen(true);
            return;
        }

        const updatedSavedPapers = [...savedPapers, paper];
        setSavedPapers(updatedSavedPapers);
        localStorage.setItem('savedPapers', JSON.stringify(updatedSavedPapers));
        setSnackbarMessage(`${paper.title} saved successfully!`);
        setSnackbarOpen(true);
    };

    const handleDelete = (paper) => {
        const updatedSavedPapers = savedPapers.filter(savedPaper => savedPaper.title !== paper.title);
        setSavedPapers(updatedSavedPapers);
        localStorage.setItem('savedPapers', JSON.stringify(updatedSavedPapers));
        setSnackbarMessage(`${paper.title} removed from saved papers!`);
        setSnackbarOpen(true);
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
        const fetchPapers = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/papers`);
            const allPapers = await response.json();
            setPapers(allPapers);
        };

        fetchPapers();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ marginTop: 4 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h6' sx={{ flexGrow: 1 }}>Research Paper Search</Typography>
                        <Switch checked={darkMode} onChange={toggleDarkMode} />
                        <Typography variant='body1'>{darkMode ? 'Light Mode' : 'Dark Mode'}</Typography>
                    </Toolbar>
                </AppBar>
                <TextField
                    variant='outlined'
                    value={query}
                    onChange={handleSearch}
                    placeholder='Search for research papers...'
                    fullWidth
                    sx={{ marginBottom: 2, marginTop: 2 }}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon sx={{ marginRight: 1 }} />
                        ),
                    }}
                />

                <Grid container spacing={2}>
                    {papers.length === 0 ? (
                        <Typography variant="h6" sx={{ marginTop: 2, width: '100%', textAlign: 'center' }}>
                            No results found
                        </Typography>
                    ) : (
                        papers.map((paper, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <PaperCard 
                                    paper={paper} 
                                    onSave={handleSave} 
                                    onDelete={handleDelete}
                                    isSaved={savedPapers.some(savedPaper => savedPaper.title === paper.title)}
                                    showRemoveButton={false} // Show save icon for search results
                                />
                            </Grid>
                        ))
                    )}
                </Grid>

                <Typography variant='h5' sx={{ marginTop: 4, marginBottom: 2 }}>Saved Papers</Typography>
                {savedPapers.length === 0 ? (
                    <Typography variant="h6" sx={{ marginTop: 2, width: '100%', textAlign: 'center' }}>
                        No saved papers
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {savedPapers.map((paper, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <PaperCard 
                                    paper={paper} 
                                    onSave={handleSave} 
                                    onDelete={handleDelete}
                                    isSaved={true} 
                                    showRemoveButton={true} // Show remove button for saved papers
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                    <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default Home;
