import React, { useState } from 'react';
import {
    CircularProgress,
    TextField,
    Snackbar
} from '@material-ui/core';
import { getCharacter } from '../../services';
import { Redirect } from 'react-router-dom';
import { IGetCharacterResponse } from '../../types';
import '../../styling/search.css';

const SearchComponent: React.FC = () => {
    const [characterList, setCharacterList] = useState<IGetCharacterResponse>({
        info: {
            count: 0,
            pages: 0,
            next: '',
            prev: ''
        },
        results: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Queries the getCharacter service to retrieve first list of results from API to pass onto /search-results component to render
    const handleSearch = async (name: string) => {
        setIsLoading(true);

        await getCharacter(name)
            .then((response) => {
                setIsLoading(false);
                // search criteria to be passed through for pagination call logic
                response.name = name;
                setCharacterList(response);
            }).catch(err => {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(err.message.indexOf('404') > -1 ? `Cannot find "${name}". Please try again` : err.message);
            });
    }

    // Autoclosing of snackbar
    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setHasError(false);
    };

    return (
        <>
            <TextField style={{ background: '#fff' }} label="Search" placeholder="Search Name" variant="filled" onKeyUp={(e) => {
                if (e.keyCode === 13) handleSearch((e.target as HTMLInputElement).value);
            }} />
            {isLoading && (
                <CircularProgress color="primary" />
            )}
            {characterList?.results?.length > 0 &&
                <Redirect to={{
                    pathname: '/search-results',
                    state: characterList
                }} />
            }
            <Snackbar
                open={hasError}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div className="error">
                    {errorMessage}
                </div>
            </Snackbar>
        </>
    )
}

export default SearchComponent;