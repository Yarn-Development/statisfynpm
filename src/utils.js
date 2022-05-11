/**
 * It takes a string as an argument, and returns the same string wrapped in ANSI escape codes that make
 * the string yellow
 * @private
 * @param msg - The message to be printed.
 */

export const yellow = (msg) =>
	"\u001B[" + 33 + "m" + msg + "\u001B[" + 39 + "m";

/**
 * It takes a string and returns a string with the ANSI escape code for red text
 * @private
 * @param msg - The message to be printed.
 */
export const red = (msg) =>
	"\u001B[" + 31 + "m" + msg + "\u001B[" + 39 + "m";

/**
 * It prints a message to the console and then exits the process
 * @function exit
 * @param message - The message to display.
 * @param color - The color of the message.
 */
export function exit(message, color) {
	if (color === "red") {
		console.error(red(message));
	}
	else {
		console.info(yellow(message));
	}

	process.exit(1);
}