import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    Grid,
    Card,
    CardHeader,
    CardMedia,
    Typography,
    CardContent,
    CircularProgress,
    Snackbar,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider
} from '@material-ui/core';
import { ICharacterList, IGetCharacterResponse, IEpisode } from '../../types';
import { getCharacterWithFilter, getAllEpisodes, getCharacter } from '../../services';
import InfoModalComponent from '../../components/Info';
import { Pagination } from '@material-ui/lab';
import '../../styling/result.css';

const ResultsComponent: React.FC<RouteComponentProps<{}, any, IGetCharacterResponse>> = ({ location }) => {
    const [characterInfo, setCharacterInfo] = useState<ICharacterList>();
    const [characterFilterName, setCharacterFilterName] = useState('');
    const [episodeList, setEpisodeList] = useState<IEpisode[]>([]);
    const [open, setOpen] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [rows, setRows] = useState(location?.state.results.slice(0, 5));
    const [isLoading, setIsLoading] = useState(false);
    const [isShowingAll, setIsShowingAll] = useState(false);
    const [searchResult, setSearchResult] = useState<any>();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const genderFilter = ['Male', 'Female', 'Genderless', 'Unknown'];
    const statusFilter = ['Dead', 'Alive', 'Unknown'];
    const speciesFilter = ['Human', 'Alien'];
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');
    const [species, setSpecies] = useState('');
    const [viewIndex, setViewIndex] = useState(0);
    const [pageQueried, setPageQueried] = useState(1);
    useEffect(() => {
        setSearchResult(location?.state.results);
        setTotalResults(location?.state.info.count);
        setCharacterFilterName(location?.state?.name ? location?.state?.name : '');
    }, []);

    const handleChange = async (event: any, value: number) => {
        // Index to determine where the view from the response result would start from
        let index = value - 1;
        // Determine which page to query based on position of index
        let pageToQuery = Math.floor((index * 5) / 20) + 1;
        // Setting start view location
        setViewIndex((index * 5) % 20);
        if (pageQueried !== pageToQuery) {
            setIsLoading(true);
            await getCharacterWithFilter({ page: pageToQuery, name: characterFilterName, status, species, gender })
                .then((response) => {
                    // Set the current page being queried by API
                    setPageQueried(pageToQuery);
                    // Set new batch of data to use in the view
                    setSearchResult(response.results);
                    setIsLoading(false);
                }).catch(err => {
                    setIsLoading(false);
                    setHasError(true);
                    setErrorMessage(err.message);
                })
        }
    }

    // Retrieve all characters
    const showAllCharacters = async () => {
        setIsLoading(true);
        setCharacterFilterName('');
        await getCharacter('')
            .then((response) => {
                // Resetting filters
                setGender('');
                setStatus('');
                setSpecies('');
                setSearchResult(response.results);
                setTotalResults(response.info.count);
                setIsLoading(false);
                setIsShowingAll(true);
            }).catch(err => {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(err.message);
            })
    }

    // Retrieve all episodes. This would only run the first time a character card is clicked and the data will be stored so 
    // the call won't have to be run again.
    const handleModalOpen = async (characterInfo: ICharacterList) => {
        if (episodeList.length === 0) {
            await getAllEpisodes()
                .then((response) => {
                    setEpisodeList(response);
                    setIsLoading(false);
                }).catch(err => {
                    setHasError(true);
                    setErrorMessage('Unable to retrieve episode list details');
                })
        }
        setCharacterInfo(characterInfo);
        setOpen(true);
    }

    const onModalClose = () => {
        setOpen(false);
    }

    // Autoclosing of snackbar
    const handleErrorMessageClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setHasError(false);
    };

    // Handle filter
    useEffect(() => {
        if(gender || status || species) {
            (async() => {
                await getCharacterWithFilter({ page: 1, name: characterFilterName, status, species, gender })
                .then((response) => {
                    setIsShowingAll(false);
                    // Set the current page being queried by API
                    setPageQueried(1);
                    // Set new batch of data to use in the view
                    setTotalResults(response.info.count);
                    setSearchResult(response.results);
                    setIsLoading(false);
                }).catch(err => {
                    setTotalResults(0);
                    setSearchResult([]);
                    setPageQueried(1);
                    setIsLoading(false);
                    setHasError(true);
                    setErrorMessage(err.message.indexOf('404') > -1 ? `Cannot find entries matching the filter` : err.message);
                })
            })();
        }
    }, [gender, status, species])

    useEffect(() => {
        if (searchResult?.length > 0) {
            setRows(searchResult?.slice(viewIndex, viewIndex + 5));
        }
    }, [viewIndex, searchResult])

    return (
        <>
            {isLoading && (
                <CircularProgress color="primary" />
            )}
            <Grid item xs={12}>
                <FormControl variant="filled" style={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={gender}
                        onChange={(e) => setGender((e.target as HTMLInputElement).value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {genderFilter.map((gender) => (
                            <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" style={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={status}
                        onChange={(e) => setStatus((e.target as HTMLInputElement).value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {statusFilter.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" style={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Species</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={species}
                        onChange={(e) => setSpecies((e.target as HTMLInputElement).value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {speciesFilter.map((specie) => (
                            <MenuItem key={specie} value={specie}>{specie}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <hr />
            {!isShowingAll && <Button onClick={showAllCharacters} variant="contained" color="primary">Clear all filters</Button>}
            <hr />
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>
                    {!isLoading && rows.map((item: ICharacterList) => (
                        <Card key={item.id} className="card" raised={true} onClick={() => handleModalOpen(item)}>
                            <CardHeader
                                className="test-style"
                                titleTypographyProps={{ variant: 'body2' }}
                                title={item.name}
                                subheader={item.location.name}
                            />
                            <CardMedia
                                className="card-media"
                                image={item.image}
                                title={item.name}
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Number of appearances(ep): {item.episode.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Grid>
            <hr />
            <Grid item xs={12}>
                <Grid
                    container
                    justify="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Pagination count={Math.ceil(totalResults / 5)} variant="outlined" shape="rounded" onChange={handleChange} />
                    </Grid>
                </Grid>
            </Grid>
            {open && <InfoModalComponent characterInfo={characterInfo!} episodeList={episodeList} open={open} onModalClose={onModalClose} />}
            <Snackbar
                open={hasError}
                autoHideDuration={3000}
                onClose={handleErrorMessageClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div className="error">
                    {errorMessage}
                </div>
            </Snackbar>
        </>
    )
}

export default ResultsComponent;
