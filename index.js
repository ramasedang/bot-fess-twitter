const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const path = require("path");
const axios = require("axios");

async function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function tweet(pptr, path_queue_msg) {
  const page2 = await pptr.newPage();
  await page2.goto("https://twitter.com/home");
  //open new tab
  let msg = [];
  if (fs.existsSync(path_queue_msg)) {
    msg = fs.readFileSync(path_queue_msg, "utf8");
    if (msg !== "") {
      msg = JSON.parse(msg);
    }
  }

  let urlPattern = /http[s]?:\/\/[^ ]+/g;

  // Removing the URLs
  msg.forEach((item) => {
    item.text = item.text.replace(urlPattern, "");
  });

  console.log(msg);

  for (let i = 0; i < msg.length; i++) {
    if (msg[i].done === false) {
      await delay(5000);
      if (msg[i].images_path.length > 0) {
        await page2.waitForSelector(
          "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t"
        );
        const textPost = await page2.$x(
          '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div[2]/div[1]/div/div/div/div[2]/div[1]'
        );
        await textPost[0].click();
        await textPost[0].type(`${msg[i].text}`, this.defaultType);
        const [fileChooser] = await Promise.all([
          page2.waitForFileChooser(),
          page2.click(
            "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-kemksi.r-jumn1c.r-xd6kpl.r-gtdqiz.r-ipm5af.r-184en5c > div:nth-child(2) > div > div > div:nth-child(1) > div.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-5vhgbc.r-mvpalk.r-htfu76.r-2yi16.r-1qi8awa.r-1ny4l3l.r-o7ynqc.r-6416eg.r-lrvibr > div > svg > g > path"
          ),
          // some button that triggers file selection
        ]);
        await fileChooser.accept([`${msg[i].images_path}`]);
        await delay(1000);

        await page2.click(
          "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-kemksi.r-jumn1c.r-xd6kpl.r-gtdqiz.r-ipm5af.r-184en5c > div:nth-child(2) > div > div > div:nth-child(2) > div.css-18t94o4.css-1dbjc4n.r-l5o3uw.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-19u6a5r.r-2yi16.r-1qi8awa.r-1ny4l3l.r-ymttw5.r-o7ynqc.r-6416eg.r-lrvibr > div"
        );
        msg[i].done = true;
        await delay(5000);
      } else {
        await page2.waitForSelector(
          "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t"
        );
        const textPost = await page2.$x(
          '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div[2]/div[1]/div/div/div/div[2]/div[1]'
        );
        await textPost[0].click();
        await textPost[0].type(`${msg[i].text}`, this.defaultType);
        await delay(1000);

        await page2.click(
          "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-kemksi.r-184en5c > div > div.css-1dbjc4n.r-kemksi.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t > div.css-1dbjc4n.r-kemksi.r-jumn1c.r-xd6kpl.r-gtdqiz.r-ipm5af.r-184en5c > div:nth-child(2) > div > div > div:nth-child(2) > div.css-18t94o4.css-1dbjc4n.r-l5o3uw.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-19u6a5r.r-2yi16.r-1qi8awa.r-1ny4l3l.r-ymttw5.r-o7ynqc.r-6416eg.r-lrvibr > div"
        );
        msg[i].done = true;
        await delay(5000);
      }
    }
  }

  console.log(JSON.stringify(msg, null, 2));
  fs.writeFileSync(path_queue_msg, JSON.stringify(msg, null, 2));
  //close tab
  await page2.close();
}

async function addmsgTolist(id, text, images_path, time) {
  if (!fs.existsSync("messages")) {
    fs.mkdirSync("messages");
  }
  let msg = [];
  if (fs.existsSync("./messages/messages.json")) {
    let data = fs.readFileSync("./messages/messages.json", "utf8");
    if (data !== "") {
      msg = JSON.parse(data);
    }
  }

  // Check if the id already exists in the messages array
  const idExists = msg.some((message) => message.id === id);

  if (!idExists) {
    msg.push({
      id: id,
      text: text,
      images_path: images_path,
      time: time,
      done: false,
    });

    fs.writeFileSync("./messages/messages.json", JSON.stringify(msg, null, 2));
  }
}

async function getImage(url, path, cookie) {
  axios
    .get(url, {
      headers: {
        authority: "ton.twitter.com",
        cookie: cookie,
        referer: "https://twitter.com/",
      },
      responseType: "stream", // tell Axios to get the response as a stream
    })
    .then(function (response) {
      //make folder
      if (!fs.existsSync("images")) {
        fs.mkdirSync("images");
      }
      const writer = fs.createWriteStream(`./images/${path}.jpg`); // replace with your path

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

puppeteer
  .launch({
    headless: "new",
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--disable-gpu",
      "--no-first-run",
    ],
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send("Network.enable");
    // client.on("Network.requestWillBeSent", (event) => {
    //   fs.appendFile(
    //     "request.txt",
    //     JSON.stringify(event, null, 2),
    //     function (err) {
    //       if (err) throw err;
    //       console.log("Request Saved!");
    //     }
    //   );
    // });

    let responseArr = [];
    client.on("Network.loadingFinished", async (params) => {
      try {
        const response = await client.send("Network.getResponseBody", {
          requestId: params.requestId,
        });
        // check if response contain \"inbox_initial_state\"
        if (
          response.body.includes("inbox_initial_state") &&
          response.body.includes("last_seen_event_id") &&
          !response.body.includes("window")
        ) {
          // check if response is not already saved
          if (!responseArr.includes(response.body)) {
            responseArr.push(response);
            // save responsearray to file
            fs.writeFile(
              "response.json",
              JSON.stringify(responseArr, null, 2),
              function (err) {
                if (err) throw err;
                console.log("Response Saved!");
              }
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    await page.goto("https://twitter.com/i/flow/login?lang=en");
    await delay(15000);
    await page.screenshot({ path: "login.png" });
    let selectorUsername =
      "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-kemksi.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > div > div.css-1dbjc4n.r-mk0yit.r-1f1sjgu.r-13qz1uu > label > div > div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1wzrnnt.r-1udh08x.r-xd6kpl.r-1pn2ns4.r-ttdzmv > div > input";
    await page.waitForSelector(selectorUsername);
    await page.type(selectorUsername, "it_fess04", { delay: 100 });
    await page.keyboard.press("Enter");
    await delay(4000);
    let selectorPassword =
      "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-kemksi.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1dqxon3 > div > div > div.css-1dbjc4n.r-mk0yit.r-13qz1uu > div > label > div > div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1wzrnnt.r-1udh08x.r-xd6kpl.r-1pn2ns4.r-ttdzmv > div.css-901oao.r-1awozwy.r-6koalj.r-1qd0xha.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-13qz1uu.r-qvutc0 > input";

    await page.waitForSelector(selectorPassword);
    await page.type(selectorPassword, "081Sultan", { delay: 100 });
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    async function loopFunc() {
      responseArr = [];
      if (
        fs.existsSync("response.json") ||
        fs.existsSync("sortedEntries.json")
      ) {
        fs.unlinkSync("./response.json");
        fs.unlinkSync("./sortedEntries.json");
      }
      await page.goto("https://twitter.com/messages");
      await page.reload();
      await delay(15000);
      let msg = responseArr;
      msg = msg[0].body;
      let parsedData = JSON.parse(msg);

      let entries = parsedData["inbox_initial_state"]["entries"];
      let sortedEntries = entries.sort((a, b) => {
        return b.message.time - a.message.time;
      });
      fs.writeFile(
        "sortedEntries.json",
        JSON.stringify(sortedEntries, null, 2),
        function (err) {
          if (err) throw err;
          console.log("Sorted Entries Saved!");
        }
      );

      //get cookie
      const cookies = await page.cookies();
      let token = cookies.find((item) => item.name === "auth_token").value;
      let tokenStr = `auth_token=${token};`;
      console.log(tokenStr);

      for (i = 0; i < sortedEntries.length; i++) {
        //cek if prefic test/
        if (sortedEntries[i].message.message_data.text.includes("test/")) {
          if (sortedEntries[i].message.message_data.attachment) {
            await getImage(
              sortedEntries[i].message.message_data.attachment.photo
                .media_url_https,
              sortedEntries[i].message.id,
              tokenStr
            );
            await addmsgTolist(
              sortedEntries[i].message.id,
              sortedEntries[i].message.message_data.text,
              `./images/${sortedEntries[i].message.id}.jpg`,
              sortedEntries[i].message.time
            );
            console.log("image saved");
          } else {
            await addmsgTolist(
              sortedEntries[i].message.id,
              sortedEntries[i].message.message_data.text,
              "",
              sortedEntries[i].message.time
            );
          }
        }
      }

      await tweet(browser, "./messages/messages.json");
      setTimeout(loopFunc, 60000);
    }
    await loopFunc();
  });
