const URL = "http://localhost:9000/";

const start = async () => {
  const group =
    document.querySelector('input[type="radio"]:checked').value + "/";
  const modelURL = URL + group + "model.json";
  const metadataURL = URL + group + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true; // TODO 조절할수 있게
  webcam = new tmImage.Webcam(512, 512, flip);
  await webcam.setup();
  await webcam.play();

  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
    }
  };

  const loop = async () => {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  };

  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
};

document.querySelector("button#start").addEventListener("click", start);
