import { createInterface } from "readline";

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = (questionText: string) =>
	new Promise<string>(resolve => rl.question(questionText, resolve))
		.finally(() => rl.close());

export default question;