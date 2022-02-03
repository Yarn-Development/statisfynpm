
export const Twitch = class Twitch {
    constructor ({client_id,client_secret}){
       this.client = client_id;
       this.secret = client_secret;
   }
   async getToken() {
        let info = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.client}&client_secret=${this.secret}&grant_type=client_credentials`,{
                method:'POST'
        });
        let body = await info.json();
        if (info.ok) {
            if(body.access_token == null) {
                throw new Error("[Statisfy] Token generation error.")
            }
            else  {
            return body.access_token;
            }
        }
        else {
            throw new Error(`[Statisfy] ${body.status} ERROR: ${body.error}` + ` - ${body.message}`)
        }
       
    }
   async req(url) {
       let token = await this.getToken();
       if (token == null) {
           throw new Error(`[Statisfy] ERROR: Access Token generation failed. Please try again.`)
       }
       if(this.client == null) {
           throw new Error("[Statisfy] ERROR: Twitch Client ID not provided.")
       }
       else if (this.secret == null){
           throw new Error("[Statisfy] ERROR: Twitch Client Secret not provided.")
       }
       let res = await fetch(url,{
           method:'GET',
           headers:{
           "Authorization": `Bearer ${token}`,
           "Client-Id": `${this.client}`         
           }
       });
       let body = await res.json();
       if(res.ok){
           return body.data;
       }
       else {
           throw new Error(`[Statisfy] ${body.status} ERROR: ${body.error}` + ` - ${body.message}`)
       }
   }

    
       async getUserByName(username) {
        if(username == null) {
            throw new Error("[Statisfy] ERROR: Username not provided.")
        }
           let info = await this.req(`https://api.twitch.tv/helix/users?login=${username.toLowerCase()}`);
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