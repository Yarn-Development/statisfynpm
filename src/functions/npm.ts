import fetch from "node-fetch";
import { exit } from "../utils.js";
/**
 * @function
 * @async
 * @param {String} pkg Package to return data from
 * @returns Statistics & Info of package
*/
export const npm = async function npm(pkg:string) {
	try {
		if(!pkg) return exit("[Statisfy] ERROR: Package not provided.", "red");
		const response = await fetch("https://api.npms.io/v2/package/" + pkg).then(
			(res) => res.json(),
		);
		if(!response) return console.log("[Statisfy] ERROR: Failed to find package from npm. ");
		return response;
	}
	catch(err) {
		console.log(`[Statisfy] ERROR: ${err}`);
	}
};