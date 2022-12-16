const URL = "http://localhost:9000/";

const start = () => {
  console.log(document.querySelector('input[type="radio"]:checked').value);
};

document.querySelector("button#start").addEventListener("click", start);
