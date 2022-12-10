import fetch from "node-fetch";
import { exit } from "../utils.js";
/**
 * @function
 * @async
 * @param {String} user Instagram user to return data from
 * @returns Statistics & Info of user
 * @example
 * const {instagram} = require("statisfy");
 * instagram("statisfy").then((res) => console.log(res));
*/

export const instagram = async function instagram(user:string) {
	try {
		if(!user) return exit("[Statisfy] ERROR: User not provided.", "red");
		const response = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${user}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)",
        }
    }).then(
			(res) => res.json(),
		);
		if(!response) return console.log("[Statisfy] ERROR: Failed to find user from instagram. ");
		return response.data.user;
	}
	catch(err) {
		console.log(`[Statisfy] ERROR: ${err}`);
	}
};