// Defining elements for DOM Traversal and referencing 
// Query Selector also helps us create an array to use 
var timerDisplay = $("#timer");
var timeDisplay = $("#time");
var answerBankDisplay = $("#answerBank");
var questionDisplay = $("#questionField");
var submitOpt = $("#submit");
var playerNameIn = $("#playerName");
var startOpt = $("#start");
var answerResult = $("#ciScreen");
var finishedDisplay = $("#endQuiz");
var scoreDisplay = $("#finalScore");
var startQuizView = $("#questionStart");
var highScoreList = $("#highscorelist");
var initialTime = 180 * bankJS.length;
var time = initialTime;
var timeI;
var questionNumber = 0;

function initiateQuiz() {
    startQuizView.addClass("hide");
    questionDisplay.removeClass("hide");
    timerDisplay.removeClass("hide");
    timeI = setInterval(clock, 1000);
    timeDisplay.text(time);
    nextQuestion();
}

function nextQuestion() {
    var displayQuestion = bankJS[questionNumber];

    var readQ = $("#questionTitle");
    readQ.text(displayQuestion.title);

    answerBankDisplay.empty();

    displayQuestion.choices.forEach(function (choice, i) {
        var bankBranch = $(document.createElement("li"));
        bankBranch.addClass("choice");
        bankBranch.text(choice);
        // arrow function function for calling displayQuestion
        bankBranch.on("click", () => {
            questionProgress(choice, displayQuestion.answer);
        });
        answerBankDisplay.append(bankBranch);
    });
}

function questionProgress(choice, answer) {
    if (choice !== answer) {
        time -= 20;

        if (time < 0) {
            time = 0;
        }

        timeDisplay.text(time);
        answerResult.text("Wrong");
        // object creation syntax
        answerResult.css({ color: "red" });
    } else {
        answerResult.text("Correct");
        answerResult.css({ color: "green" });
    }

    answerResult.fadeIn(0, () => {
        setTimeout(() => {
            answerResult.hide();

            questionNumber++;
            if (questionNumber === bankJS.length) {
                finished();
            } else {
                nextQuestion();
            }
        }, 1000);
    });
}

function finished() {
    clearInterval(timeI);

    finishedDisplay.removeClass("hide");

    scoreDisplay.text(time);

    questionDisplay.addClass("hide");

    timerDisplay.addClass("hide");

}

function clock() {
    time--;
    timeDisplay.text(time);

    if (time <= 0) {
        finished();
    }
}


function getHighscores() {
    var highscores = localStorage.getItem("highscores");

    if (!highscores) {
        highscores = "[]";
    }
    highscores = JSON.parse(highscores);

    return highscores;
}


function submitScore() {
    var highscores = getHighscores();
    highscores.push({
        score: initialTime - time,
        playername: playerNameIn.val()
    });
    highscores.sort((score1, score2) => {
        if (score1.score < score2.score) {
            return -1;
        } else if (score1.score > score2.score) {
            return 1;
        }
        return 0;
    });
    localStorage.setItem("highscores", JSON.stringify(highscores));

    playerNameIn.val("");

    showHighscores();
}

function showHighscores() {
    var highscores = getHighscores();
    finishedDisplay.hide();
    startQuizView.hide();
    highScoreList.show();

    var listView = $("#playerList");

    listView.empty();

    highscores.forEach((highscore) => {
        var item = $(document.createElement("li"));
        item.text(highscore.score + ": " + highscore.playername);
        listView.append(item);
    })
}


$(startOpt).on("click", initiateQuiz);

$("#submit").on("click", submitScore);

$("#previousScores a").on("click", showHighscores);

playerNameIn.on("keypress", function (e) {
    if (e.keyCode == 13) {
        $("#submit").trigger("click");
    }
});










