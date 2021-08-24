const fetch = require("node-fetch");
const chalk = require("chalk");
module.exports = require('../dist')
exports.npm = async function(pkg) {
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
  }

class Twitch {
    constructor ({client_id,token}){
       this.client = client_id;
       this.token = token;
   }
   async req(url) {
       if(this.client == null) {
           throw new Error(chalk.bold.red("[Statisfy] ERROR: Twitch Client ID not provided."))
       }
       else if (this.token == null){
           throw new Error(chalk.bold.red("[Statisfy] ERROR: Twitch Token not provided."))
       }
       let res = await fetch(url,{
           method:'GET',
           headers:{
           "Authorization": `Bearer ${this.token}`,
           "Client-Id": `${this.client}`         
           }
       });
       let body = await res.json();
       if(res.ok){
           return body.data;
       }
       else {
           throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
       }
   }
    async getUserByName(username) {
        if(username == null) {
            throw new Error(chalk.bold.red("[Statisfy] ERROR: Username not provided."))
        }
           let info = await this.req(`https://api.twitch.tv/helix/users?login=${username}`);
           return info[0];
        }
   async getUserByID(id) {
       let info = await this.req(`https://api.twitch.tv/helix/users?id=${id}`);
       return info[0];
   }
   async getChannelInfo(id) {
       let info = await this.req(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`);
       return info[0];
   }
   async searchChannels(username) {
       let info = await this.req(`https://api.twitch.tv/helix/search/channels?query=${username}`)
   } 
}



module.exports = {Twitch};
