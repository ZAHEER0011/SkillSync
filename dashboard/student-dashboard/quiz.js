document.addEventListener("DOMContentLoaded", function () {
  const quizTimerElement = document.querySelector(".quiz-timer");
  const questionsContainer = document.getElementById("questions-container");
  const prevButton = document.getElementById("prev-question");
  const nextButton = document.getElementById("next-question");
  const submitButton = document.getElementById("submit-quiz");
  const quizTitle = document.getElementById("quiz-title");

  let currentQuestionIndex = 0;
  let timer;
  let timeLeft = 30 * 60; // 30 minutes in seconds
  let questions = []; // Store fetched questions

  // Fetch query parameters (skill and difficulty)
  const urlParams = new URLSearchParams(window.location.search);
  const skill = urlParams.get("skill");
  const difficulty = urlParams.get("difficulty");

  // Set quiz title
  quizTitle.textContent = `${skill} - ${difficulty} Level Quiz`;

  // Fetch questions from your local backend
  async function fetchQuestions() {
    const apiUrl = `http://localhost:3000/api/questions/${skill}`;

    console.log("Fetching questions from:", apiUrl); // Debug: Log the API URL

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("API Response:", data); // Debug: Log the API response

      if (Array.isArray(data) && data.length > 0) {
        // Filter questions by difficulty (if needed)
        const filteredQuestions = data.filter(question => question.difficulty === difficulty.toLowerCase());
        return filteredQuestions; // Return filtered questions
      } else {
        console.error("No questions found or API error:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  }

  // Render a single question
  function renderQuestion(question, index) {
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    questionElement.innerHTML = `
        <h3>Question ${index + 1}: ${question.question}</h3>
        <ul>
          ${question.options
            .map(
              (option) => `
            <li>
              <label>
                <input type="radio" name="question${index}" value="${option}">
                ${option}
              </label>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    return questionElement;
  }

  // Render all questions
  async function renderQuiz() {
    questions = await fetchQuestions();
    if (questions.length === 0) {
      questionsContainer.innerHTML = "<p>No questions found.</p>";
      return;
    }

    questions.forEach((question, index) => {
      const questionElement = renderQuestion(question, index);
      questionsContainer.appendChild(questionElement);
    });

    showQuestion(currentQuestionIndex);
  }

  // Show a specific question
  function showQuestion(index) {
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, i) => {
      question.style.display = i === index ? "block" : "none";
    });
  }

  // Timer functionality
  function startTimer() {
    timer = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      quizTimerElement.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        submitQuiz();
      } else {
        timeLeft--;
      }
    }, 1000);
  }

  // Calculate score
  function calculateScore() {
    let score = 0;
    questions.forEach((question, index) => {
      const selectedAnswer = document.querySelector(
        `input[name="question${index}"]:checked`
      );
      if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
        score++;
      }
    });
    return score;
  }

  // Submit quiz
  async function submitQuiz() {
    clearInterval(timer);

    const score = calculateScore();
    alert(`Your score: ${score}/${questions.length}`);

    // Redirect to dashboard or show results
    window.location.href = "dashboard.html";
  }

  // Event listeners
  prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    }
  });

  submitButton.addEventListener("click", submitQuiz);

  // Initialize quiz
  renderQuiz();
  startTimer();
});