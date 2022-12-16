const URL = "http://localhost:9000/";

const start = async () => {
  const group =
    document.querySelector('input[type="radio"]:checked').value + "/";
  const modelURL = URL + group + "model.json";
  const metadataURL = URL + group + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true; // TODO 조절할수 있게
  webcam = new tmImage.Webcam(768, 768, flip);
  await webcam.setup();
  await webcam.play();

  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);

    const probs = prediction.map((v) => parseFloat(v.probability.toFixed(2)));
    const max = probs.indexOf(Math.max(...probs));

    console.log(probs);

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + probs[i] * 100 + "%";
      labelContainer.childNodes[i].innerHTML = classPrediction;

      if (i === max) labelContainer.childNodes[i].classList.add("max");
      else labelContainer.childNodes[i].classList.remove("max");
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
