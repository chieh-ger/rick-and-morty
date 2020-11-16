import axios from 'axios';
import { endpoint } from '../constants';
import { IGetCharacterResponse, IGetEpisodeResponse, IEpisode, ICharacterFilters } from '../types';

// Retrieve characters matching "name" otherwise return all characters
export const getCharacter = async(name: string): Promise<IGetCharacterResponse> => {
    try {
        let getCharacterResponse = await axios.get<IGetCharacterResponse>(`${endpoint.url}/character/?name=${name}`);
        return getCharacterResponse.data;
    } catch(err) {
        console.log('getCharacterResponse error: ', err);
        throw err;
    }
}

// Retrieve characters with additional filters
export const getCharacterWithFilter = async(filter: ICharacterFilters): Promise<IGetCharacterResponse> => {
    try {
        let getCharacterWithFilterResponse = await axios.get<IGetCharacterResponse>(`${endpoint.url}/character/?page=${filter.page}&name=${filter.name}&status=${filter.status}&species=${filter.species}&gender=${filter.gender}`);
        return getCharacterWithFilterResponse.data;
    } catch(err) {
        console.log('getCharacterWithFilter error: ', err);
        throw err;
    }
}

// Retrieve all available episodes with their full details
export const getAllEpisodes = async(): Promise<IEpisode[]> => {
    try {
        let getAllEpisodesResponse = await axios.get<IGetEpisodeResponse>(`${endpoint.url}/episode`);
        let episodeList = getAllEpisodesResponse.data.results;
        if(getAllEpisodesResponse.data.info.next) {
            let nextList = await axios.get<IGetEpisodeResponse>(getAllEpisodesResponse.data.info.next);
            episodeList = [...episodeList, ...nextList.data.results];
        }
        return episodeList;
    } catch(err) {
        console.log('getAllEpisodes error: ', err);
        throw err;
    }
}
