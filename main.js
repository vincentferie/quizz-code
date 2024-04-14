import './style.css';
import { Questions } from './questions.js';

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");

const TIMEOUT = 4000;

startButton.addEventListener("click", startQuiz);

function startQuiz(event) {
  event.stopPropagation();
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
  }

  function displayQuestion(index) {

    clean();
    const question = Questions[index];

    if (!question) {
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);

    app.appendChild(submitButton); 
  }

  function displayFinishMessage(){
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! tu as terminé le quizz.";
    app.appendChild(h1);
    const p = document.createElement("p");
    p.innerText= `Tu as eu ${score} sur ${Questions.length} point ! `;
    app.appendChild(p);
  }

  function submit(){
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');

    disableAllAnswers();
    
    const value = selectedAnswer.value;

    const question = Questions[currentQuestion];

    const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    displayNextQuestionButton(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    });
      
    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);
  }

  function createAnswers(answers){
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }

    return answersDiv;
  }

}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatID(text){
  return text.replaceAll(" ", "-" ).replaceAll('"', "'").toLowerCase();
} 

function getAnswerElement(text){
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatID(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function getSubmitButton(){
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  app.appendChild(submitButton);

  return submitButton
}

function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatID(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatID(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");

}

function getFeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect ? "Bravo ! Tu as eu la bonne réponse" : `Désolé... mais la bonne réponse était ${correct}`;

  return paragraph;
}

function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  app.appendChild(progress);
  return progress;
}

function displayNextQuestionButton(callback) {

  let remainingTimeout = TIMEOUT;

  app.querySelector("button").remove();

  const getButtonText = () => `Next (${remainingTimeout  / 1000}s)`;

  const nextButton = document.createElement("button");

  nextButton.innerText = getButtonText();
  app.appendChild(nextButton);

  const interval = setInterval(() => {
    remainingTimeout  -= 1000;
    nextButton.innerText = getButtonText();
  }, 1000);

  const timeout = setTimeout(() => {
    handleNextQuestion();
  }, TIMEOUT);

  const handleNextQuestion = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    callback();
  }

  nextButton.addEventListener("click", () => {
    handleNextQuestion();
  });
}

function disableAllAnswers () {
  const radioInputs = document.querySelectorAll('input[type="radio"]');

  for (const radio of radioInputs) {
    radio.disabled = true;
    
  }
}
