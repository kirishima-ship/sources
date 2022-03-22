import type { KirishimaNode, KirishimaTrack, LoadTrackResponse } from '@kirishima/core';

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

export type KirishimaLoadTracks = (
	options: string | { source?: string | undefined; query: string },
	node?: KirishimaNode
) => Promise<LoadTrackResponse<KirishimaTrack>>;
