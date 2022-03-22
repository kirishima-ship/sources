import { Structure } from '@kirishima/core';
import type { KirishimaPartialTrack } from './KirishimaPartialTrack';

export class KirishimaPlayer extends Structure.get('KirishimaPlayer') {
	public resolvePartialTrack(track: KirishimaPartialTrack) {
		if (track.isrc) {
			return this.kirishima.resolveTracks(track.isrc);
		}

		return this.kirishima.resolveTracks(`${track.info.title} - ${track.info.author ? track.info.author : ''}`);
	}
}
