const fetch = require("node-fetch")
exports.npm = function(package) {
    try {
        if(!package) return console.log(`[Statisfy] ERROR: Package not provided.`);
        const response = await fetch('https://api.npms.io/v2/search?q=' + package).then(
            (res) => res.json(),
        );
        if(!response) return console.log(`[Statisfy] ERROR: Failed to find package from npm. `)
        const pkg = response.results[0].package;
        return pkg;
    }
    catch(err) {
        console.log(`[Statisfy] ERROR: ${err}`)
    }
}