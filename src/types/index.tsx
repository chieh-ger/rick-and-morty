export type TEndpoint = {
    url: string;
}

export interface ICharacterInfo {
    characterInfo: ICharacterList;
    episodeList: IEpisode[] | [];
    open: boolean;
    onModalClose: () => void;
    children?: (...args: any) => any;
}

export interface ICharacterList {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: IOrigin;
    location: ILocation;
    image: string;
    episode: string[];
    url: string;
    created: string;
}

export interface IResponseInfo {
    count: number;
    pages: number;
    next: string;
    prev: string;
}

export interface IGetCharacterResponse {
    name?: string;
    info: IResponseInfo;
    results: ICharacterList[];
}

export interface IEpisode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
}

export interface IGetEpisodeResponse {
    info: IResponseInfo;
    results: IEpisode[];
}

interface ILocation {
    name: string;
    url: string;
}

interface IOrigin {
    name: string;
    url: string;
}