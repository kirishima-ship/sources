export interface DeezerTrack {
	id: number;
	title: string;
	isrc: string | null;
	link: string;
	duration: number;
	artist: DeezerArtist;
	album: DeezerAlbum;
}

export interface DeezerAlbum {
	id: number;
	title: string;
	cover_small: string;
}

export interface DeezerArtist {
	id: number;
	name: string;
}
