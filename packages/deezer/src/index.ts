import { Kirishima, KirishimaNode, KirishimaPlugin, LoadTrackResponse, KirishimaTrack } from '@kirishima/core';
import { fetch, FetchResultTypes } from '@kirishima/fetch';
import { LoadTypeEnum } from 'lavalink-api-types';
import { KirishimaPartialTrack } from './Structures/KirishimaPartialTrack';
import type { DeezerTrack } from './typings';

export class KirishimaDeezer extends KirishimaPlugin {
	private resolvers = {
		track: this.loadTrack.bind(this)
	};

	private baseURL = 'https://api.deezer.com/';
	private regex = /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(?<type>track|album|playlist)\/(?<id>\d+)/;
	private _resolveTracks!: (
		options: string | { source?: string | undefined; query: string },
		node?: KirishimaNode
	) => Promise<LoadTrackResponse<KirishimaPartialTrack | KirishimaTrack>>;

	public constructor() {
		super({
			name: 'deezer'
		});
	}

	public load(kirishima: Kirishima) {
		this._resolveTracks = kirishima.resolveTracks.bind(kirishima);
		kirishima.resolveTracks = this.resolveTracks.bind(this);
	}

	public resolveTracks(
		options: string | { source?: string | undefined; query: string },
		node?: KirishimaNode
	): Promise<LoadTrackResponse<KirishimaPartialTrack | KirishimaTrack>> {
		const query = typeof options === 'string' ? options : options.query;
		const [, type, id] = query.match(this.regex) ?? [];

		if (type in this.resolvers) {
			const resolver = this.resolvers[type as keyof typeof this.resolvers];
			if (resolver) {
				return resolver(id) as unknown as Promise<LoadTrackResponse<KirishimaPartialTrack | KirishimaTrack>>;
			}
		}

		return this._resolveTracks(options, node);
	}

	public async loadTrack(identifier: string) {
		const deezer_track = await fetch<DeezerTrack>(`${this.baseURL}/track/${identifier}`, undefined, FetchResultTypes.JSON);
		const track = new KirishimaPartialTrack({
			info: {
				title: deezer_track.title,
				uri: deezer_track.link,
				author: deezer_track.artist.name,
				length: deezer_track.duration * 1000,
				sourceName: 'deezer',
				position: 0,
				isSeekable: true,
				isStream: false
			},
			isrc: deezer_track.isrc ?? null
		});
		return {
			loadType: LoadTypeEnum.TRACK_LOADED,
			tracks: [track]
		};
	}
}
