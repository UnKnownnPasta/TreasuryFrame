export const WARFRMAE_CLASS_ID = 9898;

export function getWarframeGame() {
	return new Promise((resolve) => {
		overwolf.games.getRunningGameInfo((result) => {
			resolve(
				result && result.classId === WARFRMAE_CLASS_ID ? result : null
			);
		});
	});
}

export function getGameInfo() {
	return new Promise((resolve, reject) => {
		overwolf.games.events.getInfo((info) => {
			if (info.success) {
				resolve(info.res);
			} else {
				reject(info);
			}
		});
	});
}
