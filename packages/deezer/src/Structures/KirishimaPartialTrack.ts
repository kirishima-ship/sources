import { PartialLavalinkTrack, Structure } from '@kirishima/core';

export class KirishimaPartialTrack extends Structure.get('KirishimaPartialTrack') {
	public isrc: string | null = null;
	public artworkurl: string | null = null;

	public constructor(raw: PartialLavalinkTrack) {
		super(raw);
		this.isrc = raw.isrc ?? null;
		this.artworkurl = raw.artworkUrl ?? null;
	}

	public thumbnailURL() {
		return this.artworkurl;
	}
}

declare module '@kirishima/core' {
	export interface PartialLavalinkTrack {
		isrc?: string | null;
		artworkUrl?: string | null;
	}

	export interface KirishimaPartialTrack {
		isrc: string | null;
		artworkurl: string | null;
	}
}
