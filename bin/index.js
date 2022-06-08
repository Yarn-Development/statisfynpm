const utils = require("../src/utils");
const args = process.argv.slice(2, process.argv.length);
opts = ["twt", "npm", "trn", "spt", "ttv"];
if(args[0] == "--help" || args[0] == "-h") {
    console.log(`Statisfy Help
    Usage: npx statisfy -o <option> <flags>
    Options:
    --help/-h       Displays Help Information
    --options/-o    Specify Platform to retrieve Stats From
    Commands:
        Spotify:
            Usage npx statisfy -o spt <flags>
            Flags:
                -t      Type of Method to Call: Top/Playlist
                -p      Port to Open to Authenticate User(Defaults to 8888)

    `)
}
