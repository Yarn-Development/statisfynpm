import fetch from "node-fetch";
import chalk from "chalk";
import "core-js/stable";
import "regenerator-runtime/runtime";
export const npm = async function npm(pkg) {
    try {
    if(!pkg) return console.log(chalk.bold.red(`[Statisfy] ERROR: Package not provided.`));
    const response = await fetch('https://api.npms.io/v2/search?q=' + pkg).then(
        (res) => res.json(),
    );
    if(!response) return console.log(`[Statisfy] ERROR: Failed to find package from npm. `)
    return response.results[0].package;
}
catch(err) {
    console.log(`[Statisfy] ERROR: ${err}`)
    }
  };