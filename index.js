const URL = "http://localhost:9000/";

let startBtn;
let fieldSet;
let labels;
let cma;
let flipper;
let ls;
let loading;
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

  loading.style.display = "block";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(550, 550, flip);
  await webcam.setup();
  await webcam.play();
  loading.style.display = "none";
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
  };

  const loop = async () => {
    try {
      if (flip !== flipper.checked) {
        flip = flipper.checked;
        stop();
        start();
      }
      webcam.update();
      await predict();
      window.requestAnimationFrame(loop);
    } catch (e) {
      alert(
        "에러가 발생했습니다.\n카메라를 허용하지 않아서 일 수 있습니다\n\n" +
          e.toString()
      );
      stop();
    }
  };

  try {
    window.requestAnimationFrame(loop);
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
  } catch (e) {
    alert(
      "에러가 발생했습니다.\n카메라를 허용하지 않아서 일 수 있습니다\n\n" +
        e.toString()
    );
    stop();
  }
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

startBtn.addEventListener("click", () => {
  try {
    start();
  } catch (e) {
    alert(
      "에러가 발생했습니다.\n카메라를 허용하지 않아서 일 수 있습니다\n\n" +
        e.toString()
    );
    stop();
  }
});
labels.style.visibility = "hidden";
loading.style.display = "none";
