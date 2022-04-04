import { Kirishima } from '@kirishima/core';
import { LoadTypeEnum } from 'lavalink-api-types';
import crypto from 'node:crypto';
import { KirishimaDeezer } from '..';

const kirishima = new Kirishima({
	send: () => {
		/** Do nothing */
	},
	plugins: [new KirishimaDeezer()],
	nodes: [
		{
			url: 'usui-linku.kadantte.moe:443',
			password: 'Usui#0256'
		}
	]
});

test('Do search tracks', async () => {
	if (!kirishima.options.clientId && !kirishima.nodes.size) await kirishima.initialize(crypto.randomBytes(10).toString('hex'));
	const tracks = await kirishima.resolveTracks({ source: 'deezer', query: 'yoasobi' }, kirishima.nodes.first());
	expect(tracks.loadType).toBe(LoadTypeEnum.SEARCH_RESULT);
	expect(tracks.tracks.length).not.toBe(0);
});

test('Do get single track', async () => {
	if (!kirishima.options.clientId && !kirishima.nodes.size) await kirishima.initialize(crypto.randomBytes(10).toString('hex'));
	const tracks = await kirishima.resolveTracks('https://www.deezer.com/en/track/1053803772', kirishima.nodes.first());
	expect(tracks.loadType).toBe(LoadTypeEnum.TRACK_LOADED);
	expect(tracks.tracks.length).not.toBe(0);
});

test('Do get album tracks', async () => {
	if (!kirishima.options.clientId && !kirishima.nodes.size) await kirishima.initialize(crypto.randomBytes(10).toString('hex'));
	const tracks = await kirishima.resolveTracks('https://www.deezer.com/en/album/257891342', kirishima.nodes.first());
	expect(tracks.loadType).toBe(LoadTypeEnum.PLAYLIST_LOADED);
	expect(tracks.tracks.length).not.toBe(0);
});

test('Do get playlist tracks', async () => {
	if (!kirishima.options.clientId && !kirishima.nodes.size) await kirishima.initialize(crypto.randomBytes(10).toString('hex'));
	const tracks = await kirishima.resolveTracks('https://www.deezer.com/en/playlist/9314027622', kirishima.nodes.first());
	expect(tracks.loadType).toBe(LoadTypeEnum.PLAYLIST_LOADED);
	expect(tracks.tracks.length).not.toBe(0);
});
