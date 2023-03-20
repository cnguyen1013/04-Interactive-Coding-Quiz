// Selecting DOM elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const option_list = document.querySelector(".option_list")
const timeCount = quiz_box.querySelector(".timer .timer_sec");

// Display the information box when start button is clicked
start_btn.onclick = function() {
    info_box.classList.add("activeInfo");
}

// Hide the information box when exit button is clicked
exit_btn.onclick = function() {
    info_box.classList.remove("activeInfo");
}

// Hide the information box and show the quiz box when continue button is clicked
// Also, show the first question and start the timer
continue_btn.onclick = function() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    startTimer(timeValue);
}

// Initialize variables
let question_count = 0;
let counter;
let timeValue = 30;
let userScore = 0;
let userPoints = 0;

// Select DOM elements for result box and restart/quit buttons
const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box")
const restart_quiz = result_box.querySelector(".buttons .restart")
const quit_quiz = result_box.querySelector(".buttons .quit")

// Reset variables, show the first question and start the timer when restart button is clicked
restart_quiz.onclick = function() {
    question_count = 0;
    timeValue = 30;
    userScore = 0;
    userPoints = 0;
    showQuestions(question_count);
    clearInterval(counter);
    startTimer(timeValue);
    next_btn.style.display = "none";
    timeCount.textContent = timeValue;
    result_box.classList.remove("activeResult");
    quiz_box.classList.add("activeQuiz");
}

// Reload the page when quit button is clicked
quit_quiz.onclick = function() {
    window.location.reload();
}

// Show the next question or show the result box if all questions have been answered
next_btn.onclick = function() {

    if (question_count < questions.length - 1) {
        question_count++;
        showQuestions(question_count);
        next_btn.style.display = "none";
    } else {
        clearInterval(counter);
        showResultBox();
    }
}

// Display the question and answer options for the given index
function showQuestions(index) {
    const question_text = document.querySelector(".que_text");
    let question_tag = '<span>' + questions[index].num + ". " + questions[index].question + '</span>'
    let option_tag = '<div class="option">' + questions[index].options[0] + '<span></span></div>' 
                     + '<div class="option">' + questions[index].options[1] + '<span></span></div>'
                     + '<div class="option">' + questions[index].options[2] + '<span></span></div>'
                     + '<div class="option">' + questions[index].options[3] + '<span></span></div>';
    question_text.innerHTML = question_tag;
    option_list.innerHTML = option_tag

    // Add onclick function for each answer option
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

// HTML strings for the tick and cross icons
let tickIcon = '<div class="icon tick"><i class="fa fa-check"></i> </div>';
let crossIcon = '<div class="icon cross"><i class="fa fa-times"></i> </div>';


function optionSelected(answer) {
    // Get the text of the option that the user clicked on
    let user_answer = answer.textContent;
    // Get the correct answer for the current question
    let correct_answer = questions[question_count].answer;
    // Get the total number of answer options
    let allOptions = option_list.children.length
    
    // If the user's answer is correct
    if (user_answer === correct_answer) {
        // Add points to the user's score based on how much time is left
        userPoints = userPoints + timeValue;
        console.log(userPoints);
        // Increase the user's score by 1
        userScore +=1;
        // Mark the answer as correct
        answer.classList.add("correct");
        // Add a tick icon next to the answer
        answer.insertAdjacentHTML("beforeend", tickIcon)
    } else {
        // If the user's answer is incorrect, deduct points and stop the timer
        let timeLost = 10;
        timeValue -= timeLost;
        clearInterval(counter);
        startTimer(timeValue);
        // Mark the answer as incorrect
        answer.classList.add("incorrect");
        // Add a cross icon next to the answer
        answer.insertAdjacentHTML("beforeend", crossIcon)

        // Find the correct answer and mark it as correct
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correct_answer) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }

    // Disable all answer options
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }
    
    // Display the "Next" button
    next_btn.style.display = "block";
}

function startTimer(time) {
    // Start a timer that counts down from the given time
    counter = setInterval(timer, 1000);
    function timer() {
        time--;
        timeCount.textContent = time;
        timeValue--;
        // Add a leading zero to the timer display if the time is less than 10 seconds
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }

        // If time runs out, stop the timer and display the correct answer
        if (time < 0) {
            clearInterval(counter);
            timeCount.textContent = "00";

            let correct_answer = questions[question_count].answer;
            let allOptions = option_list.children.length

            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correct_answer) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }

            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            
            // Display the "Next" button and show the result box
            next_btn.style.display = "block";
            showResultBox()
        }
    }
}

/**
 * This function shows the result box with the user's score and high scores.
 * It also prompts the user to enter their initials to save their score to local storage.
 */
function showResultBox() {
    // Remove active classes from info and quiz boxes and add active class to result box
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
  
    // Set the user's score in the score text element
    const scoreText = result_box.querySelector(".score_text");
    let scoreTag = '<span>and Congrats! You scored <p>' + userPoints + '</p> points</span>';
    scoreText.innerHTML = scoreTag;
  
    // Prompt the user for their initials and create a score object with the user's points and initials
    let initials = prompt("Please enter your initials:");
    let scoreObj = {score: userPoints, initials: initials};
  
    // Get the high scores from local storage or create an empty array if there are none
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  
    // Add the user's score to the high scores array, sort the array in descending order, and keep only the top 5 scores
    highScores.push(scoreObj);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
  
    // Save the updated high scores to local storage
    localStorage.setItem("highScores", JSON.stringify(highScores));
  
    // Set the high scores in the high scores text element as an ordered list
    const highScoresText = result_box.querySelector(".high_scores_text");
    let highScoresTag = '<ul>';
    for (let i = 0; i < highScores.length; i++) {
      highScoresTag += '<li>' + highScores[i].initials + ': ' + highScores[i].score + '</li>';
    }
    highScoresTag += '</ul>';
    highScoresText.innerHTML = highScoresTag;
}

  


