import { Kirishima, KirishimaNode, KirishimaPlugin, LoadTrackResponse, Structure } from '@kirishima/core';
import { fetch, FetchResultTypes } from '@kirishima/fetch';
import { LoadTypeEnum } from 'lavalink-api-types';
import { KirishimaPartialTrack } from './Structures/KirishimaPartialTrack';
import { KirishimaPlayer } from './Structures/KirisihimaPlayer';
import type { DeezerAlbum, DeezerPlaylist, DeezerTrack } from './typings';

export class KirishimaDeezer extends KirishimaPlugin {
	private resolvers = {
		track: this.loadTrack.bind(this),
		album: this.loadAlbum.bind(this),
		playlist: this.loadPlaylist.bind(this)
	};

	private baseURL = 'https://api.deezer.com/';
	private regex = /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(?<type>track|album|playlist)\/(?<id>\d+)/;
	private _resolveTracks!: (options: string | { source?: string | undefined; query: string }, node?: KirishimaNode) => Promise<LoadTrackResponse>;

	public constructor() {
		super({
			name: 'deezer'
		});
	}

	public load(kirishima: Kirishima) {
		Structure.extend('KirishimaPlayer', () => KirishimaPlayer);
		this._resolveTracks = kirishima.resolveTracks.bind(kirishima);
		kirishima.resolveTracks = this.resolveTracks.bind(this);
	}

	public resolveTracks(options: string | { source?: string | undefined; query: string }, node?: KirishimaNode): Promise<LoadTrackResponse> {
		const query = typeof options === 'string' ? options : options.query;
		const source = typeof options === 'string' ? undefined : options.source;
		if (source === 'deezer') {
			return this.searchTracks(query) as unknown as Promise<LoadTrackResponse>;
		}

		const [, type, id] = query.match(this.regex) ?? [];

		if (type in this.resolvers) {
			const resolver = this.resolvers[type as keyof typeof this.resolvers];
			if (resolver) {
				return resolver(id) as unknown as Promise<LoadTrackResponse>;
			}
		}

		return this._resolveTracks(options, node);
	}

	public async loadPlaylist(identifier: string) {
		try {
			const deezer_playlist = await fetch<DeezerPlaylist>(`${this.baseURL}/playlist/${identifier}`, undefined, FetchResultTypes.JSON);
			if (deezer_playlist.tracks.data.length === 0) {
				return {
					loadType: LoadTypeEnum.NO_MATCHES,
					tracks: []
				};
			}

			return {
				loadType: LoadTypeEnum.PLAYLIST_LOADED,
				playlistInfo: {
					name: deezer_playlist.title
				},
				tracks: deezer_playlist.tracks.data.map((track) => {
					return new KirishimaPartialTrack({
						artworkUrl: track.album.cover_small,
						isrc: track.isrc ?? null,
						info: {
							title: track.title,
							uri: track.link,
							author: track.artist.name,
							length: track.duration * 1000,
							sourceName: 'deezer',
							position: 0,
							isSeekable: true,
							isStream: false
						}
					});
				})
			};
		} catch (e) {
			return {
				loadType: LoadTypeEnum.NO_MATCHES,
				tracks: []
			};
		}
	}

	public async loadAlbum(identifier: string) {
		try {
			const deezer_album = await fetch<DeezerAlbum>(`${this.baseURL}/album/${identifier}`, undefined, FetchResultTypes.JSON);
			if (deezer_album.tracks.data.length === 0) {
				return {
					loadType: LoadTypeEnum.NO_MATCHES,
					tracks: []
				};
			}

			return {
				loadType: LoadTypeEnum.PLAYLIST_LOADED,
				playlistInfo: {
					name: deezer_album.title
				},
				tracks: deezer_album.tracks.data.map((track) => {
					return new KirishimaPartialTrack({
						artworkUrl: deezer_album.cover_small,
						isrc: track.isrc ?? null,
						info: {
							title: track.title,
							uri: track.link,
							author: track.artist.name,
							length: track.duration * 1000,
							sourceName: 'deezer',
							position: 0,
							isSeekable: true,
							isStream: false
						}
					});
				})
			};
		} catch (e) {
			return {
				loadType: LoadTypeEnum.NO_MATCHES,
				tracks: []
			};
		}
	}

	public async searchTracks(query: string) {
		try {
			const deezer_search = await fetch<{ data: DeezerTrack[] }>(
				`${this.baseURL}search?q=${encodeURIComponent(query)}`,
				undefined,
				FetchResultTypes.JSON
			);
			if (deezer_search.data.length === 0) {
				return {
					loadType: LoadTypeEnum.NO_MATCHES,
					tracks: []
				};
			}

			return {
				loadType: LoadTypeEnum.SEARCH_RESULT,
				tracks: deezer_search.data.map((track) => {
					return new KirishimaPartialTrack({
						artworkUrl: track.album.cover_small,
						isrc: track.isrc ?? null,
						info: {
							title: track.title,
							uri: track.link,
							author: track.artist.name,
							length: track.duration * 1000,
							sourceName: 'deezer',
							position: 0,
							isSeekable: true,
							isStream: false
						}
					});
				})
			};
		} catch (e) {
			return {
				loadType: LoadTypeEnum.NO_MATCHES,
				tracks: []
			};
		}
	}

	public async loadTrack(identifier: string) {
		try {
			const deezer_track = await fetch<DeezerTrack>(`${this.baseURL}/track/${identifier}`, undefined, FetchResultTypes.JSON);
			const track = new KirishimaPartialTrack({
				artworkUrl: deezer_track.album.cover_small,
				isrc: deezer_track.isrc ?? null,
				info: {
					title: deezer_track.title,
					uri: deezer_track.link,
					author: deezer_track.artist.name,
					length: deezer_track.duration * 1000,
					sourceName: 'deezer',
					position: 0,
					isSeekable: true,
					isStream: false
				}
			});
			return {
				loadType: LoadTypeEnum.TRACK_LOADED,
				tracks: [track]
			};
		} catch (e) {
			return {
				loadType: LoadTypeEnum.NO_MATCHES,
				tracks: []
			};
		}
	}
}
