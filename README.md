[<p align=center><img width="700" src="https://i.imgur.com/AexZWB6.png"></p>](https://i.imgur.com/AexZWB6.png)
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
# 📖 Classes & Functions
## Spotify
### How to get Required Parameters:
Head over to https://developers.spotify.com/dashboard, login with your Spotify account and create an app.

Within this app you should find a Client ID and a Client Secret. If you would only like the getPlaylist function, this is sufficient. 

However, if you would like to use the top function, and any other function that requires authentication via browser, navigate to the "Edit Settings" button, and add http://localhost:8888 as a redirect uri. 

For remote servers and people who have port 8888 in use, you can use the Oauth function yourselves, with your specified uri.
### Functions
- top
- getPlaylist
- oauth (If you would prefer to use your access token yourself)
- More functions to be released in near future
### CommonJS Usage
```js
const { Spotify } = require("statisfy");
const spotify = new Spotify({
  client_id:"xxxxxx", // your client id here
  client_secret:"xxxxxxx" // your client secret here
});
async function spot(){
  console.log(await spotify.getPlaylist("57AoCP0MBsk5kjtTRCprKP")); // id of playlist - open.spotify.com/playlist/x
  console.log(await spotify.top({
    time:"medium_term", // short_term (4 weeks), medium_term (6 months), or long_term (Lifetime)
    type:"artists", // artists or tracks
    limit:"1"// amount of artists to show 
  }));
};
spot()
```
### Example Response
```js
// Top
[
  {
    external_urls: {
      spotify: 'https://open.spotify.com/artist/2zAshenjqDlcL4pudfySBY'
    },
    followers: { href: null, total: 38297 },
    genres: [ 'alternative r&b', 'chill r&b', 'indie r&b' ],
    href: 'https://api.spotify.com/v1/artists/2zAshenjqDlcL4pudfySBY',
    id: '2zAshenjqDlcL4pudfySBY',
    images: [ [Object], [Object], [Object] ],
    name: 'emawk',
    popularity: 53,
    type: 'artist',
    uri: 'spotify:artist:2zAshenjqDlcL4pudfySBY'
  }
]
// Playlist
{
  collaborative: false,
  description: '',
  external_urls: {
    spotify: 'https://open.spotify.com/playlist/4XpJdPT0WpzN5qx0oEjX2u'
  },
  followers: { href: null, total: 0 },
  href: 'https://api.spotify.com/v1/playlists/4XpJdPT0WpzN5qx0oEjX2u',
  id: '4XpJdPT0WpzN5qx0oEjX2u',
  images: [
    {
      height: 640,
      url: 'https://mosaic.scdn.co/640/ab67616d0000b27303f6fbd3817030884ba916d6ab67616d0000b2734c79d5ec52a6d0302f3add25ab67616d0000b2735bafd20f6f6572adaa76d187ab67616d0000b273b85eeb572ae2073ab4cb8db6',
      width: 640
    },
    {
      height: 300,
      url: 'https://mosaic.scdn.co/300/ab67616d0000b27303f6fbd3817030884ba916d6ab67616d0000b2734c79d5ec52a6d0302f3add25ab67616d0000b2735bafd20f6f6572adaa76d187ab67616d0000b273b85eeb572ae2073ab4cb8db6',
      width: 300
    },
    {
      height: 60,
      url: 'https://mosaic.scdn.co/60/ab67616d0000b27303f6fbd3817030884ba916d6ab67616d0000b2734c79d5ec52a6d0302f3add25ab67616d0000b2735bafd20f6f6572adaa76d187ab67616d0000b273b85eeb572ae2073ab4cb8db6',
      width: 60
    }
  ],
  name: 'science',
  owner: {
    display_name: 'marcus',
    external_urls: { spotify: 'https://open.spotify.com/user/singerloud' },
    href: 'https://api.spotify.com/v1/users/singerloud',
    id: 'singerloud',
    type: 'user',
    uri: 'spotify:user:singerloud'
  },
  primary_color: null,
  public: true,
  snapshot_id: 'OSw3N2JiNGIxYjNjNDBiZjhiYzc1MDE0YjEwNGE1N2JlMGI2NTc2MzVj',
  tracks: {
    href: 'https://api.spotify.com/v1/playlists/4XpJdPT0WpzN5qx0oEjX2u/tracks?offset=0&limit=100',
    items: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 6
  },
  type: 'playlist',
  uri: 'spotify:playlist:4XpJdPT0WpzN5qx0oEjX2u'
}
```
## NPM
### Functions

- npm

### CommonJS Usage
```js
    const { npm } = require("statisfy");
    async function getNPM(pkg) => {
    const result = await npm(pkg); 
    console.log(result);
    }
    getNPM("statisfy") // your package here
```
&nbsp;
### ES6 Usage
```js
    import { npm } from "statisfy";
     async function getNPM(pkg) => {
    const result = await npm(pkg); 
    console.log(result);
    }
    getNPM("statisfy") // your package here
```
&nbsp;
### Result
```js
{
  name: 'statisfy',
  scope: 'unscoped',
  version: '1.1.5',
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
&nbsp;
## TRN (ALPHA)
&nbsp;
### Functions
- Fortnite
- Apex Legends
&nbsp;
### CommonJS Example Usage
```js
const { TRN } = require("statisfy");
const trn = new TRN({
  key:"ABC1234" // Tracker Network API Key
});
async function apextest() {
    const result = await trn.ApexLegends({
        username:'xAspekts',
        platform: "xbl"
    });
    console.log(result)
}
apextest() 
async function fntest(){
    const result = await trn.Fortnite({
        username:'Ninja',
        platform:'kbm'
    })
    console.log(result)
}
fntest()
```
&nbsp;
### Results - Apex Legends
&nbsp;
```js
{
  platformInfo: {
    platformSlug: 'xbl',
    platformUserId: 'xAspekts',
    platformUserHandle: 'xAspekts',
    platformUserIdentifier: 'xAspekts',
    avatarUrl: 'https://images-eds-ssl.xboxlive.com/image?url=wHwbXKif8cus8csoZ03RW8ke8ralOdP9BGd4wzwl0MJ9z6QzuGwZjtvbE7sSsMVW3GtqdB8tr2M604Js_A5hRb4ej1NAlLgfikoRUkt8XGoBbs9TId_M9.NIOpyumXn9la5RYDGV9y_fYQlPsMeH74.dFI.YBGHTHVD6_tFiUCo-',
    additionalParameters: null
  },
  userInfo: {
    userId: 4668724,
    isPremium: false,
    isVerified: false,
    isInfluencer: false,
    isPartner: false,
    countryCode: 'GB',
    customAvatarUrl: null,
    customHeroUrl: null,
    socialAccounts: [],
    pageviews: 6,
    isSuspicious: null
  },
  metadata: {
    currentSeason: 2,
    activeLegend: 'legend_13',
    activeLegendName: 'Loba',
    activeLegendStats: [ 'Season 8 Wins', 'Kills' ]
  },
  segments: [
    {
      type: 'overview',
      attributes: {},
      metadata: [Object],
      expiryDate: '2022-01-29T14:29:21.2766514+00:00',
      stats: [Object]
    },
    {
      type: 'legend',
      attributes: [Object],
      metadata: [Object],
      expiryDate: '2022-01-29T14:29:21.2766514+00:00',
      stats: [Object]
    },
    {
      type: 'legend',
      attributes: [Object],
      metadata: [Object],
      expiryDate: '2022-01-29T14:29:21.2766514+00:00',
      stats: [Object]
    }
  ],
  availableSegments: [ { type: 'legend', attributes: {}, metadata: {} } ],
  expiryDate: '2022-01-29T14:29:21.2766514+00:00'
}
```

## Problems or issues?

If you encounter any problems, bugs or other issues with the package, please create an [issue in the GitHub repo](https://github.com/aspekts/statisfynpm/issues). 

&nbsp;
## Contact
If you have any questions or just want to reach me, you can get in touch with me on my [Discord server](https://discord.gg/GxGTHBC).