const fetch = require("node-fetch")

 async function insta({username,client_id}) {

  let info = await fetch(`https://instagram.com/${username}/?__a=1`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)"
    }
  });
  let account = info.data;
  let details = account.graphql.user;
  console.log(details)

}
async function blah() {
await insta({
    username: "xaspekts",
    client_id:"809843639712233"
})
}
blah()