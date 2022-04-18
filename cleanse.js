const fs = require("fs");

fs.readFile("validated.tsv", "utf8", (err, data) => {
  const arr = data.split(/\r?\n/);
  const initial = "wav_filename,wav_filesize,transcript\n";
  let train = initial;
  let dev = initial;
  let test = initial;

  for (let i = 1; i < arr.length; i++) {
    const audio = arr[i].toLowerCase();
    if (audio === "") continue;
    const step = i % 20;
    const audioArr = audio.split("\t");
    const audioName = audioArr[1].replace("mp3", "wav");
    var size = fs.statSync(`clips/${audioName}`).size;
    let transcript = audioArr[2].replace(/[?.…,;!":’]/g, "").trim();
    transcript = transcript.replace(/[-–]/g, " ");
    transcript = transcript.replace(/  /g, " ");
    const info = `${audioName},${size},${transcript}\n`;

    if (step <= 17) {
      train += info;
    } else if (step <= 19) {
      dev += info;
    } else {
      test += info;
    }
  }

  fs.writeFile("train.csv", train, "utf-8", () => console.log("finished"));
  fs.writeFile("dev.csv", dev, "utf-8", () => console.log("finished"));
  fs.writeFile("test.csv", test, "utf-8", () => console.log("finished"));
});
