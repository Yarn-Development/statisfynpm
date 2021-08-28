![logo](https://i.imgur.com/AexZWB6.png)
![npm](https://img.shields.io/npm/v/statisfy?label=statisfy&logo=npm) 
![npm bundle size](https://img.shields.io/bundlephobia/min/statisfy?logo=npm)
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/statisfy?logo=npm)
![npms.io (quality)](https://img.shields.io/npms-io/maintenance-score/statisfy?logo=npm)
&nbsp;
### Get statistics from all of your favourite social media sites, games and more!
&nbsp;
## Install 
```
$ npm install statisfy
```
&nbsp;
# 📖 Documentation
&nbsp;
## NPM
### Functions

- npm

&nbsp;

### CommonJS Usage
```js
    const { npm } = require("statisfy");
    async function getNPM(pkg) => {
    const result = await npm(pkg); 
    console.log(pkg);
    }
    getNPM("statisfy") // your package here
```
&nbsp;
### ES6 Usage
```js
    import { npm } from "statisfy";
     async function getNPM(pkg) => {
    const pkg = await npm(pkg); 
    console.log(pkg);
    }
    getNPM("statisfy") // your package here
```
&nbsp;
### Result
```js
{
  name: 'statisfy',
  scope: 'unscoped',
  version: '1.0.2',
  description: 'Get statistics from all of your favourite social media sites, games and more!',
  keywords: [ 'stats', 'statistics', 'social', 'media', 'api' ],
  date: '2021-08-24T20:11:48.377Z',
  links: {
    npm: 'https://www.npmjs.com/package/statisfy',
    homepage: 'https://github.com/aspekts/statisfynpm#readme',
    repository: 'https://github.com/aspekts/statisfynpm',
    bugs: 'https://github.com/aspekts/statisfynpm/issues'
  },
  author: { name: 'Aspekts' },
  publisher: { username: 'aspekts', email: 'aspektsbuisness@gmail.com' },
  maintainers: [ { username: 'aspekts', email: 'aspektsbuisness@gmail.com' } ]
}
```
&nbsp;
&nbsp;
## Twitch
&nbsp;
### Getting Client ID and Client Secret
Head to https://dev.twitch.tv/console and login with your twitch acccount. 

From there you will find you will need to register a new application. 

Inside the application you will see your Client ID.

You can generate a Client Secret by completing the captcha and selecting "New Secret". 

&nbsp;
## Functions
- getUserByName
- getUserByID
- getChannelInfo
- searchChannels
- getToken

&nbsp;
###  CommonJS Example Usage
&nbsp;
```js
const { Twitch } = require("statisfy");
const ttv = new Twitch({
    client_id : "12345abcde", // your client id here
    client_secret: "67890fghij" // your client secret here
});
async function channelInfo() {
    const info = await ttv.getUserByName("Ludwig"); // your channel here
    console.log(info)
}
channelInfo()
```
&nbsp;
### ES6 Example Usage
&nbsp;
```js
import { Twitch } from "statisfy";
const ttv = new Twitch({
    client_id : "12345abcde", // your client id here
    client_secret: "67890fghij" // your client secret here
});
async function channelInfo() {
    const info = await ttv.getUserByName("Ludwig"); // your channel here
    console.log(info)
}
channelInfo()
```
&nbsp;
### Result
```js
{
  id: '201761728',
  login: 'aspekts',
  display_name: 'Aspekts',
  type: '',
  broadcaster_type: '',
  description: "I'm Aspekts. A regular guy who has like no viewers or followers trying to have fun really. Follow if want, it's up to you honestly (PLEASE DO) ",
  profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/2b6fd40a-33c9-4a4b-a0c8-eb8169f836ae-profile_image-300x300.png',
  offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/65dcb42c-a22d-445d-a2bd-01e3e15ca510-channel_offline_image-1920x1080.jpeg',
  view_count: 188,
  created_at: '2018-03-03T18:01:17Z'
}
```
&nbsp;
## Twitter (ALPHA)
&nbsp;

### Functions
- UserLookupByName

### CommonJS Example Usage

```js
const { Twitter } = require("statisfy");
const twt = new Twitter({
  token: "ABCD1234" // your bearer token here
})
async function twttest() {
    const result = await twt.UserLookupByName("POTUS")
    console.log(result)
}
twttest()
```
### Result
```js
{
  created_at: '2021-01-13T00:37:08.000Z',
  public_metrics: {
    followers_count: 13665857,
    following_count: 12,
    tweet_count: 1372,
    listed_count: 13037
  },
  protected: false,
  verified: true,
  url: 'https://t.co/IxLjEB2zlE',
  id: '1349149096909668363',
  description: '46th President of the United States, husband to @FLOTUS, proud dad & pop. Tweets may be archived: https://t.co/IURuMIrzxb',
  username: 'POTUS',
  entities: {
    url: { urls: [Array] },
    description: { urls: [Array], mentions: [Array] }
  },
  profile_image_url: 'https://pbs.twimg.com/profile_images/1380530524779859970/TfwVAbyX_normal.jpg',
  name: 'President Biden'
}
```
## Problems or issues?

If you encounter any problems, bugs or other issues with the package, please create an [issue in the GitHub repo](https://github.com/aspekts/statisfynpm/issues). 

&nbsp;
## Contact
If you have any questions or just want to reach me, you can get in touch with me on my [Discord server](https://discord.gg/GxGTHBC).