const URL = "http://localhost:9000/";

let startBtn;
let fieldSet;
let labels;
let cma;
let flipper;
let ls;
let running = false;
let flip = true; // TODO 조절할수 있게

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
  labels.innerHTML = "";
  cam.innerHTML = "";
  labels.style.visibility = "hidden";
};

const start = async () => {
  running = true;
  startBtn.innerHTML = "정지";
  startBtn.removeEventListener("click", start);
  startBtn.addEventListener("click", stop);
  fieldSet.disabled = true;

  const group =
    document.querySelector('input[type="radio"]:checked').value + "/";
  const modelURL = URL + group + "model.json";
  const metadataURL = URL + group + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(550, 550, flip);
  await webcam.setup();
  await webcam.play();
  labels.style.visibility = "visible";

  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);

    const probs = prediction.map((v) => parseFloat(v.probability.toFixed(2)));
    const ranks = rankings(probs);

    ls[0].innerHTML = `${prediction[ranks.indexOf(1)].className}: ${Math.floor(
      probs[ranks.indexOf(1)] * 100
    )}%`;
    ls[1].innerHTML = `${prediction[ranks.indexOf(2)].className}: ${Math.floor(
      probs[ranks.indexOf(2)] * 100
    )}%`;
    ls[2].innerHTML = `${prediction[ranks.indexOf(3)].className}: ${Math.floor(
      probs[ranks.indexOf(3)] * 100
    )}%`;

    // for (let i = 0; i < maxPredictions; i++) {
    //   const classPrediction =
    //     prediction[i].className + ": " + Math.floor(probs[i] * 100) + "%";
    //   labelContainer.childNodes[i].innerHTML = classPrediction;

    //   if (i === max) labelContainer.childNodes[i].classList.add("max");
    //   else labelContainer.childNodes[i].classList.remove("max");
    // }
  };

  const loop = async () => {
    if (flip !== flipper.checked) {
      flip = flipper.checked;
      stop();
      start();
    }
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  };

  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  // for (let i = 0; i < maxPredictions; i++) {
  // labelContainer.appendChild(document.createElement("div"));
  // }
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

startBtn.addEventListener("click", start);
labels.style.visibility = "hidden";
