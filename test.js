const axios = require("axios");
const fs = require("fs");

axios
  .get(
    "https://ton.twitter.com/1.1/ton/data/dm/1672881891639427076/1672881888686637056/wZZmh42u.jpg",
    {
      headers: {
        authority: "ton.twitter.com",
        cookie: "auth_token=1990b17c89acfa1692f0baa22602be0fce63e38e; ",
        referer: "https://twitter.com/",
      },
      responseType: "stream", // tell Axios to get the response as a stream
    }
  )
  .then(function (response) {
    const writer = fs.createWriteStream("./image.jpg"); // replace with your path

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
