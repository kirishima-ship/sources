import { PartialLavalinkTrack, Structure } from '@kirishima/core';

export class KirishimaPartialTrack extends Structure.get('KirishimaPartialTrack') {
	public isrc: string | null = null;

	public constructor(raw: PartialLavalinkTrack) {
		super(raw);
		this.isrc = raw.isrc ?? null;
	}
}

declare module '@kirishima/core' {
	export interface PartialLavalinkTrack {
		isrc?: string | null;
	}

	export interface KirishimaPartialTrack {
		isrc: string | null;
	}
}
