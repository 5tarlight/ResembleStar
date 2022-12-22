const URL = "http://localhost:9000/";

let startBtn;
let fieldSet;
let labels;
let cma;
let flipper;
let ls;
let loading;
let stat;
let memberImg;
let targetImg;
let running = false;
let flip = true;
let loopId = 1;

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
  memberImg.style.display = "block";
  targetImg.style.display = "none";
  clearInterval(loopId);
};

const start = async () => {
  running = true;
  startBtn.innerHTML = "정지";
  startBtn.removeEventListener("click", start);
  startBtn.addEventListener("click", stop);
  fieldSet.disabled = true;
  flipper.disabled = false;
  memberImg.style.display = "none";

  const group =
    document.querySelector('input[type="radio"]:checked').value + "/";
  const modelURL = URL + group + "model.json";
  const metadataURL = URL + group + "metadata.json";

  loading.style.display = "block";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(450, 450, flip);
  await webcam?.setup();
  await webcam?.play();
  loading.style.display = "none";
  targetImg.style.display = "block";
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

    targetImg.src =
      URL +
      document.querySelector('input[type="radio"]:checked').value +
      "/" +
      prediction[ranks.indexOf(1)].className +
      ".jpg";
  };

  const loop = async () => {
    if (flip !== flipper.checked && running) {
      flip = flipper.checked;
      stop();
      start();
    }
    webcam.update();

    window.requestAnimationFrame(loop);
  };
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  window.requestAnimationFrame(loop);
  predict();
  loopId = setInterval(() => predict(), 500);
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
memberImg = document.querySelector("#members");
targetImg = document.querySelector(".target-image");

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

fieldSet.onchange = (e) => {
  const group =
    document.querySelector('input[type="radio"]:checked').value + "/";
  memberImg.src = URL + group + "img.jpg";
};

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 400,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#fff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
    },
    "opacity": {
      "value": 1,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 10,
      "random": true,
      "anim": {
        "enable": false,
      }
    },
    "line_linked": {
      "enable": false,
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "bottom",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 0.5
        }
      },
      "bubble": {
        "distance": 100,
        "size": 4,
        "duration": 0.3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 100,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});
