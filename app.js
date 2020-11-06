/**
 * Example store structure
 */
const store = {
  // 5 or more questions are required
  questions: [
    {
      question: "Which of the following groups isn't under SM Entertainment?",
      answers: [
        'Red Velvet',
        'NCT',
        'Blackpink',
        'Shinee'
      ],
      correctAnswer: 'Blackpink'
    },
    {
      question: "Who isn't the leader of their group?",
      answers: [
        'Irene (Red Velvet)',
        'Jihyo (Twice)',
        'S.Coups (Seventeen)',
        'Jungkook (BTS)'
      ],
      correctAnswer: 'Jungkook (BTS)'
    },
    {
      question: "Which group was created on season 2 of Produce 101?",
      answers: [
        'Wanna One',
        'I.O.I',
        'X1',
        'IZ*ONE'
      ],
      correctAnswer: 'Wanna One'
    },
    {
      question: "Which group did not get their first music show win with their debut song?",
      answers: [
        'Blackpink',
        'Miss A',
        'BTS',
        'AB6IX'
      ],
      correctAnswer: 'BTS'
    },
    {
      question: "Which group has over 20 members in it?",
      answers: [
        'Girls Generation',
        'NCT',
        'The Boyz',
        'Stray Kids'
      ],
      correctAnswer: 'NCT'
    }
  ],
  quizStarted: false,
  questionNumber: 0,
  score: 0
};

/**
 * 
 * Technical requirements:
 * 
 * Your app should include a render() function, that regenerates the view each time the store is updated. 
 * See your course material and access support for more details.
 *
 * NO additional HTML elements should be added to the index.html file.
 *
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
 *
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
 * 
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/

// These functions return HTML templates
function generateStartPage() {
  return `
    <div class="wrapper">
      <h2>Please press start to start the quiz.</h2>
      <div class="button-holder">
        <button class="start">Start</button>
      </div>
    </div>
  `;
};

function generateAnswers() {
  let currentQ = getQuestion(store.questionNumber);
  const answerArr = currentQ.answers;
  let answerStr = ""
  for (let i = 0; i < answerArr.length; i++) {
    answerStr += `
    <label><input type="radio" name="answers" value="${answerArr[i]}" required>${answerArr[i]}</label>
    `;
  };
  return answerStr;
}

function generateQuestionPage() {
  let currentQ = getQuestion(store.questionNumber);
  return `
    <div class="wrapper">
      <h2>Question ${store.questionNumber}/${store.questions.length}</h2>
      <form class="js-quiz">
        <p>${currentQ.question}</p>
        ${generateAnswers()}
        <div class="button-right">
         <button type="submit" class="js-submit">Submit</button>
        </div>
      </form>
      <p>Score: ${store.score}/${store.questions.length}</p>
    </div>
  `;
}

function generateEndPage() {
  return `
    <div class="wrapper">
      <h2>Your score was ${store.score}/${store.questions.length}</h2>
      <div class="button-holder js-button">
        <button class="js-restart">Restart</button>
      </div>
    </div>
  `;
}

function generateCorrectFeedback(correct) {
  return `
    <div class='wrapper'>
      <p class='feedback'>Correct! ${correct} is the correct answer.</p>
      ${generateNextButton()}
      <p>Score: ${store.score}/${store.questions.length}</p>
    </div>
  `;
}

function generateIncorrectFeedback(correct) {
  return `
    <div class='wrapper'>
      <p class='feedback'>Incorrect! The correct answer is ${correct}.</p>
      ${generateNextButton()}
      <p>Score: ${store.score}/${store.questions.length}</p>
    </div>
  `;
}

function generateNextButton() {
  return `
    <div class="button-holder js-button">
      <button class="js-next">Next</button>
    </div>
  `;
}


/********** RENDER FUNCTION(S) **********/

// This function conditionally replaces the contents of the <main> tag based on the state of the store
function renderQuiz() {
  //renders start page if quiz hasn't started
  if (store.quizStarted === false) { 
    $('main').html(generateStartPage);
  } else if (store.questionNumber <= store.questions.length) {
    //renders question page based on question number
    $('main').html(generateQuestionPage);
  } else {
    //renders end page if quiz is done
    $('main').html(generateEndPage);
  };
}

// Renders feedback page based on whether or not the answer was correct
function renderFeedback(isCorrect, correctAnswer) {
  if(store.quizStarted){
    if (isCorrect) {
      $('main').html(generateCorrectFeedback(correctAnswer));
    } else {
      $('main').html(generateIncorrectFeedback(correctAnswer));
    };
  };
}

/********** EVENT HANDLER FUNCTIONS **********/

// These functions handle events (submit, click, etc)
function getQuestion(questionNumber) {
  return store.questions[questionNumber - 1];
}

function addToScore() {
  store.score += 1;
}


function resetQuiz() {
  store.quizStarted = false;
  store.score = 0;
  store.questionNumber = 0;
}


function startQuiz() {
  store.quizStarted = true;
  store.questionNumber = 1;
}

function nextQuestion() {
  store.questionNumber++;
}

function checkCorrect(userAnswer, answerKey) {
  if (userAnswer === answerKey) {
    addToScore();
    return true;
  } else {
    return false;
  };
}


function handleClickQuizStart() {
  $('main').on('click', '.start', function(event) {
    event.preventDefault();
    startQuiz();
    renderQuiz();
  });
}

function handleClickAnswerSubmit() {
  $('main').on('submit', '.js-quiz', function(event) {
    event.preventDefault();
    let selectedAnswer = $('input[name="answers"]:checked').val();
    let currentQuestion = getQuestion(store.questionNumber);
    console.log(currentQuestion.correctAnswer);
    console.log(selectedAnswer);
    let correct = checkCorrect(selectedAnswer, currentQuestion.correctAnswer);
    renderFeedback(correct, currentQuestion.correctAnswer);
  });
}

function handleClickNext() {
  $('main').on('click', '.js-next', function(event) {
    event.preventDefault();
    nextQuestion();
    renderQuiz();
  });
}

function handleClickQuizRestart() {
  $('main').on('click', '.js-restart', function(event) {
    event.preventDefault();
    resetQuiz();
    renderQuiz();
  });
}


function handleQuiz() {
  renderQuiz();
  renderFeedback();
  handleClickQuizStart();
  handleClickAnswerSubmit();
  handleClickNext();
  handleClickQuizRestart();
}

$(handleQuiz);

