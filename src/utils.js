export const yellow = (msg) =>
	"\u001B[" + 33 + "m" + msg + "\u001B[" + 39 + "m";

export const red = (msg) =>
	"\u001B[" + 31 + "m" + msg + "\u001B[" + 39 + "m";

export function exit(message, color) {
	if (color === "red") {
		console.error(red(message));
	}
	else {
		console.info(yellow(message));
	}

	process.exit(1);
}