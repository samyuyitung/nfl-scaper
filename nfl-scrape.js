#!/usr/bin/env node

const rp = require('request-promise');
const $ = require('cheerio');


const getDraftRound = (leagueId, round) => new Promise((resolve, reject) => {
	const url = `https://fantasy.nfl.com/league/${leagueId}/draftresults?draftResultsDetail=${round}&draftResultsTab=round&draftResultsType=results`;
	rp(url).then(html => {
		const round = $('.wrap > h4', html).text()
		const players = []
		$('.playerName', html).contents().each((i, e) => players.push(e.data))
		const teams = []
		$('.teamName', html).contents().each((i, e) => teams.push(e.data))

		var roundRes = players.map((player, i) => `${round},${player},${teams[i]}`)
		resolve(roundRes)
	}).catch(err => reject(err));
})

const getGameCenter = (leagueId, teamId, week) => new Promise((resolve, reject) => {
	const url = `https://fantasy.nfl.com/league/${leagueId}/team/${teamId}/gamecenter?trackType=sbs&week=${week}`

	rp(url).then(html => {
		const activePlayers = []
		const table = $('#tableWrap-1 tr[class^=player]', html)
		table.each(row => {
			activePlayers.push({
				position: row.children[0].children[0].children[0].data,
				name: row.children[1].children[0].children[1].children[0].data,
				score: row.children[6].children[0].children[0].data
			})
		})
		const benchPlayers = []
		// const table = $('#tableWrapBN-1 tr[class^=player]', html)
		// table.forEach(row => {
		// 	activePlayers.push({
		// 		benchPlayers: row.children[0].children[0].children[0].data,
		// 		name: row.children[1].children[0].children[1].children[0].data,
		// 		score: row.children[6].children[0].children[0].data
		// 	})
		// })
		
		resolve({activePlayers, benchPlayers})
	})
	.catch(err => reject(err));
})


getGameCenter('1745803', '7', '1')