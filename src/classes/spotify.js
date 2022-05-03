
import fetch from "node-fetch";
import chalk from "chalk";
import http from "http";
export const Spotify = class Spotify{
  constructor({client_id,client_secret}){
    this.id = client_id;
    this.secret = client_secret;
  };

  /**
   * It takes the client id and secret, encodes them into base64, and sends them to the Spotify API to
   * get an access token.
   * </code>
   * @returns The access token is being returned.
   */
  async access_token(){
    const params = new URLSearchParams()
    params.append("grant_type","client_credentials")
    const message = (Buffer.from(`${this.id}:${this.secret}`).toString('base64'));
    let res = await fetch("https://accounts.spotify.com/api/token", {
      method:"POST",
      body: params,
      headers:{
        "Authorization":`Basic ${message}`
      }
    });
      let body = await res.json();
        if(res.ok){
            return body.access_token;
        }
        else {
          console.log(body)
            throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
        }
  }
  async oauth({scopes,uri}) {
    /**
     * It creates a server on the given port, and returns a promise that resolves to the url that the
     * server receives a request on.
     * @param port - The port number to listen on.
     * @returns A promise that resolves to a string.
     */
    const getLocalhostUrl = async function (port){
      return new Promise((resolve, reject) => {
        const server = http
          .createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('You can now close this window');
            res.once('finish', () => {
              server.close();
              if (req.url) {
                resolve(req.url.slice(1));
              }
              reject("Couldn't get code or state");
            });
          })
          .listen(port);
      });
    }
    /* Getting the access token. */
    let state = Math.random().toString(36).slice(2);
    const spotifyUrl =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        show_dialog: 'true',
        state,
        client_id: this.id,
        redirect_uri: uri,
        scope: scopes,
      }).toString();
      console.info('Please click the link to login to Spotify in the browser\n');
      console.info(spotifyUrl + '\n');
      const authUrl = await getLocalhostUrl((new URL(uri).port)|| 3000);
      const params = new URLSearchParams(authUrl);
      const receivedCode = params.get('code');
      const receivedState = params.get('state');
  
    if (receivedState !== state) {
      exit('Received and original state do not match');
    }

    if (!receivedCode) {
      exit('No code received');
    }

    console.info('Login successful! Cleaning up...\n');
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: receivedCode,
      redirect_uri: uri,
    });
    let res = await fetch("https://accounts.spotify.com/api/token",{
      method:"POST",
      headers:{
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization':
        'Basic ' +
        Buffer.from(this.id + ':' + this.secret).toString(
          'base64'
        ),
      },
      body:tokenRequestBody.toString()
    });
    let body = await res.json()
    return body.access_token;
  }
  /**
   * It takes a url, gets an access token, and then makes a request to the url with the access token.
   * You can use <code>async/await</code> to make it easier to read.
   * @param url - The url you want to request.
   * @returns The response body.
   */
  async req(url){
    let token = await this.access_token();
    let res = await fetch(url,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    });
        let body = await res.json();
        if(res.ok){
            return body;
        }
        else {
            throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
        }
  }
/**
 * It gets the top tracks/artists from the user's account
 * @returns An array of objects.
 */
  async top({time,type,limit}){
    let token = await this.oauth({scopes:"user-top-read",uri:"http://localhost:8888"});
    let res = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time}&limit=${limit}&offset=0`,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    });
        let body = await res.json();
        if(res.ok){
            return body.items;
        }
        else {
            throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
        }
  }
 /**
  * It takes a playlist ID and returns the playlist's data.
  * @param playlist - The Spotify ID of the playlist you want to get.
  * @returns The data from the request.
  */
  async getPlaylist(playlist){
  let data = await this.req(`https://api.spotify.com/v1/playlists/${playlist}`);
    return data;
  }
}