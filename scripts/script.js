const API_URL = "http://jservice.io";
const NB_ANSWERS = 4;

let rightAnswerIndex = -1;
let totalScore = 0;
let Questionvalue = -1;
let answerClicked = false;

let correctAnswer = "";

let intervalStop;

//TD fix duplicates

function newQuestion() {
  axios
    .get(API_URL + "/api/clues")
    .then((response) => {
      console.log(response.data);

      triviaObj = response.data[randomIndex(response.data)];

      correctAnswer = triviaObj.answer;

      console.log(triviaObj);

      scoreValue = document.getElementById("scoreValue");
      questionElem = document.getElementById("question");
      answersList = document.getElementById("answers-container");

      scoreValue.innerHTML = questionValue = triviaObj.value;

      questionElem.innerHTML = triviaObj.question;

      rightAnswerIndex = Math.round(Math.random() * (NB_ANSWERS - 1));

      document.getElementById(`answer${rightAnswerIndex}`).innerHTML =
        triviaObj.answer;

      for (let i = 0; i < NB_ANSWERS; i++) {
        if (i != rightAnswerIndex) {
          let wrongAnswerObj = {};

          randomQuestionIndex = randomIndex(response.data);
          wrongAnswerObj = response.data[randomQuestionIndex];
          
          while (wrongAnswerObj.answer === triviaObj.answer) {
            randomQuestionIndex = randomIndex(response.data);
            wrongAnswerObj = response.data[randomQuestionIndex];
          }
          
          console.log(randomQuestionIndex, wrongAnswerObj);
          document.getElementById(`answer${i}`).innerHTML = wrongAnswerObj.answer;
        }
      }

      document.getElementById("containerNext").style.visibility = "hidden";

      answerValidation.style.visibility = "hidden";
      document.getElementById("nextQuestionCountdown").style.visibility =
        "hidden";

      document.getElementById("answerContainer").style.visibility = "visible";
    })

    .catch((error) => {
      console.log(error);
    });
}

function randomIndex(array) {
  return Math.round(Math.random() * (array.length - 1));
}

//Execute on load
newQuestion();

document
  .getElementById("answers-container")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    let userAnswer = -1;

    radioArray = document.querySelectorAll(".radio-answer");
    answerValidation = document.getElementById("answerValidation");

    console.log(radioArray);

    radioArray.forEach((radio) => {
      if (radio.checked) {
        userAnswer = Number(radio.id.slice(-1));
      }

      //Whatever the result we want the next round to be unselected.
      radio.checked = false;
    });

    if (userAnswer < 0) {
      //user didn't click an answer
      window.alert("Please select a question");
    } else {
      if (userAnswer === rightAnswerIndex) {
        answerValidation.innerHTML = "Correct!";
        totalScore += questionValue;

        document.getElementById("scoreTotal").innerHTML = totalScore;
      } else {
        answerValidation.innerHTML = `Incorrect! The correct answer is ${correctAnswer}`;
      }

      nextQuestionElem = document.getElementById("containerNext");

      document.getElementById("answerContainer").style.visibility = "hidden";
      nextQuestionElem.style.visibility = "visible";

      answerValidation.style.visibility = "visible";

      document.getElementById("nextQuestionCountdown").style.visibility =
        "visible";
      document.getElementById("counter").innerHTML = "5";

      let counter = 6;

      let counterElem = document.getElementById("counter");

      intervalStop = setInterval(() => {
        counter--;
        counterElem.innerHTML = counter;

        console.log(counter);
        if (counter === 0) {
          clearInterval(intervalStop);
          newQuestion();
        }
      }, 1000);
    }
  });

document.getElementById("containerNext").addEventListener("click", (event) => {
  event.preventDefault();

  clearInterval(intervalStop);

  newQuestion();
});

function createElem(tagType, innerText, classes) {
  let createdElem = document.createElement(tagType);

  for (i = 2; i < arguments.length; i++) {
    createdElem.classList.add(arguments[i]);
  }

  if (innerText && innerText.trim() != "") {
    createdElem.innerText = innerText;
  }

  return createdElem;
}

//same as createElem, should be in a shared library.
function appendChildren(target, componentArray) {
  componentArray.forEach((component) => {
    target.appendChild(component);
  });
}
