const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "lib");
if(fs.existsSync(dir)) {
	fs.rmSync(dir, { recursive: true, force: true });
	console.info("[Statisfy] Lib folder cleared successfully, tsc can now run.");
}
else {
	console.info("[Statisfy] Lib folder is already empty, tsc can now run.");
}