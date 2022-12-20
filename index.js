const URL = "http://localhost:9000/";

let startBtn;
let fieldSet;
let labels;
let cma;
let flipper;
let ls;
let loading;
let stat;
let running = false;
let flip = true;

const rankings = (array) => {
  return array
    .map((v, i) => [v, i])
    .sort((a, b) => b[0] - a[0])
    .map((a, i) => [...a, i + 1])
    .sort((a, b) => a[1] - b[1])
    .map((a) => a[2]);
};

const stop = () => {
  running = false;
  startBtn.innerHTML = "시작";
  startBtn.removeEventListener("click", stop);
  startBtn.addEventListener("click", start);
  fieldSet.disabled = false;
  flipper.disabled = true;
  cam.innerHTML = "";
  labels.style.visibility = "hidden";
  loading.style.display = "none";
};

const start = async () => {
  running = true;
  startBtn.innerHTML = "정지";
  startBtn.removeEventListener("click", start);
  startBtn.addEventListener("click", stop);
  fieldSet.disabled = true;
  flipper.disabled = false;

  const group =
    document.querySelector('input[type="radio"]:checked').value + "/";
  const modelURL = URL + group + "model.json";
  const metadataURL = URL + group + "metadata.json";

  loading.style.display = "block";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(550, 550, flip);
  await webcam?.setup();
  await webcam?.play();
  loading.style.display = "none";
  labels.style.visibility = "visible";
  console.log("visible");

  const predict = async () => {
    if (!webcam.canvas) {
      console.log("return calls");
      return;
    }
    const prediction = await model.predict(webcam.canvas);

    const probs = prediction.map((v) => parseFloat(v.probability.toFixed(2)));
    const ranks = rankings(probs);

    ls[0].innerText = `${prediction[ranks.indexOf(1)].className}: ${Math.floor(
      probs[ranks.indexOf(1)] * 100
    )}%`;
    ls[1].innerText = `${prediction[ranks.indexOf(2)].className}: ${Math.floor(
      probs[ranks.indexOf(2)] * 100
    )}%`;
    ls[2].innerText = `${prediction[ranks.indexOf(3)].className}: ${Math.floor(
      probs[ranks.indexOf(3)] * 100
    )}%`;
  };

  const loop = async () => {
    if (flip !== flipper.checked && running) {
      flip = flipper.checked;
      stop();
      start();
    }
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  };
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  window.requestAnimationFrame(loop);
};

startBtn = document.querySelector("button#start");
fieldSet = document.querySelector("fieldset");
labels = document.querySelector("#label-container");
cam = document.querySelector("#webcam-container");
flipper = document.querySelector("#flip");
ls = [
  document.querySelector("#l1"),
  document.querySelector("#l2"),
  document.querySelector("#l3"),
];
loading = document.querySelector("#loading");
stat = document.querySelector("#status");

startBtn.addEventListener("click", start);
labels.style.visibility = "hidden";
loading.style.display = "none";
flipper.disabled = true;

fetch(URL)
  .then((res) => {
    if (res.ok) stat.innerText = "서버에 연결되었습니다.";
    else stat.innerText = "서버에 연결하지 못했습니다.";
  })
  .catch((e) => {
    stat.classList.add("error");
    stat.innerText = "서버에 연결하지 못했습니다.\n" + e;
  });
