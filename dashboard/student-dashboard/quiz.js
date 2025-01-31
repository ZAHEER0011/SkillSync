import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  updateDoc,
  setDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPWr-6clbipRfvCkty0GF9vj7GhbJhut8",
  authDomain: "skillsync-a6e61.firebaseapp.com",
  projectId: "skillsync-a6e61",
  storageBucket: "skillsync-a6e61.firebasestorage.app",
  messagingSenderId: "213330406465",
  appId: "1:213330406465:web:65bb9762130f9d5c68eac0",
};

//Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


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

  // Fetch query parameters (skill)
  const urlParams = new URLSearchParams(window.location.search);
  const skill = urlParams.get("skill");

  // Set quiz title
  quizTitle.textContent = `${skill} Quiz`;

  // Function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

// Clean question text to remove "Q${number}." prefix
function cleanQuestionText(question) {
  return question.replace(/^Q\d+\.\s*/, "").trim(); // Removes "Q1. ", "Q2. ", etc.
}

// Fetch and process questions
async function fetchQuestions() {
  const apiUrl = `https://skillsync-backend-1-s85m.onrender.com/api/questions/${skill.toLowerCase()}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Shuffle, slice to get 40 questions, and clean question text
      return shuffleArray(data)
        .slice(0, 40)
        .map((q) => ({
          ...q,
          question: cleanQuestionText(q.question), // Clean the question text
        }));
    } else {
      console.error("No questions found or API error:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
function renderQuestion(question, index) {
  const questionElement = document.createElement("div");
  questionElement.className = "question";

  let htmlContent = `
    <h3>Question ${index + 1}:</h3>
    <div class="question-text">${escapeHtml(question.question)}</div>
  `;

  // Render question options with embedded content
  htmlContent += `<ul class="question-options">`;

  question.options.forEach((option, i) => {
    const embeddedContent = question.embeddedContent && question.embeddedContent[i]
      ? formatEmbeddedContent(question.embeddedContent[i])
      : "";


    htmlContent += `
      <li class="option-item">
        ${embeddedContent} 
        <label>
          <input type="radio" name="question${index}" value="${escapeHtml(option)}">
          ${escapeHtml(option)}
        </label>
      </li>
    `;
  });

  htmlContent += `</ul>`;

  questionElement.innerHTML = htmlContent;
  return questionElement;
}

function escapeHtml(text) {
  // Escape special characters except underscores
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Function to format bold text
function formatTextContent(text) {
  // Replace `**bold**` with HTML bold tags `<strong>`
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// Helper function to format embedded content correctly
function formatEmbeddedContent(content) {
  if (!content) return "";
  return `<pre class="embedded-content">${escapeHtml(content)}</pre>`;
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

    // Handle navigation button visibility
    prevButton.style.display = index === 0 ? "none" : "inline-block";
    nextButton.style.display = index === questions.length - 1 ? "none" : "inline-block";
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

  async function initializeSkillSubcategories(userId, skill) {
    const skillDocRef = doc(db, "Users", userId);
    try {
      const docSnap = await getDoc(skillDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.interestedSkills && data.interestedSkills[skill]) {
          // Update the skill with new subcategories if they don't exist
          const updateData = {};
          
          if (!("timeSpent" in data.interestedSkills[skill])) {
            updateData[`interestedSkills.${skill}.timeSpent`] = 0;
          }
          if (!("bestScore" in data.interestedSkills[skill])) {
            updateData[`interestedSkills.${skill}.bestScore`] = 0;
          }
          if (!("assessmentCompletionRate" in data.interestedSkills[skill])) {
            updateData[`interestedSkills.${skill}.assessmentCompletionRate`] = 0;
          }
          
          if (Object.keys(updateData).length > 0) {
            await updateDoc(skillDocRef, updateData);
            console.log(`New subcategories added for ${skill}`);
          }
        } else {
          console.error("Skill not found for the user.");
        }
      } else {
        console.error("User document does not exist.");
      }
    } catch (error) {
      console.error("Error initializing skill subcategories:", error);
    }
  }
  
  async function updateAssessmentProgress(userId, skill, score, timeSpent) {
    const skillDocRef = doc(db, "Users", userId);
    
    try {
      await updateDoc(skillDocRef, {
        [`interestedSkills.${skill}.assessmentAttempted`]: true,
        [`interestedSkills.${skill}.assessmentScore`]: score,
        [`interestedSkills.${skill}.lastAttemptTime`]: new Date(),
        [`interestedSkills.${skill}.timeSpent`]: timeSpent,
        [`interestedSkills.${skill}.bestScore`]: Math.max(score, (await getBestScore(userId, skill))),
      });
      console.log(`Assessment progress updated for ${skill}`);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }
  
  async function getBestScore(userId, skill) {
    const skillDocRef = doc(db, "Users", userId);
    const docSnap = await getDoc(skillDocRef);
  
    if (docSnap.exists()) {
      return docSnap.data()?.interestedSkills[skill]?.bestScore || 0;
    }
    return 0;
  }

  function validateAnswers() {
    for (let i = 0; i < questions.length; i++) {
      const selectedAnswer = document.querySelector(`input[name="question${i}"]:checked`);
      if (!selectedAnswer) {
        alert(`Please answer question ${i + 1}`);
        return false;
      }
    }
    return true;
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

  async function submitQuiz() {
    clearInterval(timer);
  
    const score = calculateScore();
    alert(`Your score: ${score}/${questions.length}`);
  
    const timeSpent = 30 * 60 - timeLeft;
  
    try {
      const userId = auth.currentUser.uid; 
      if (userId) {
        await updateAssessmentProgress(userId, skill, score, timeSpent);
        console.log("Quiz progress saved successfully.");
      }
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  
    // Redirect to dashboard or show results
    window.location.href = "../student-dashboard/index.html";
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
