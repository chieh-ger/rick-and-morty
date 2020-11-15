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
    Button
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
            await getCharacterWithFilter(pageToQuery, characterFilterName)
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
            setIsLoading(true);
            await getAllEpisodes()
                .then((response) => {
                    setEpisodeList(response);
                    setIsLoading(false);
                }).catch(err => {
                    setIsLoading(false);
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
            {!isShowingAll &&
                <Grid item xs={12}>
                    <Button onClick={showAllCharacters} variant="contained" color="primary">Show All Characters</Button>
                </Grid>
            }
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