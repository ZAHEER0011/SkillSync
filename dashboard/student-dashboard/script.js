// Updated script.js for SkillSync Student Dashboard
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPWr-6clbipRfvCkty0GF9vj7GhbJhut8",
  authDomain: "skillsync-a6e61.firebaseapp.com",
  projectId: "skillsync-a6e61",
  storageBucket: "skillsync-a6e61.firebasestorage.app",
  messagingSenderId: "213330406465",
  appId: "1:213330406465:web:65bb9762130f9d5c68eac0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");

  // Add the 'show' class to trigger the animation
  setTimeout(() => {
    body.classList.add("show");
  }, 200); // Delay to make the animation smooth

  const logoutButton = document.querySelector(".logout-button");

  // Logout button logic
  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      signOut(auth)
        .then(() => {
          console.log("User successfully logged out.");
          window.location.href = "../../index.html"; // Redirect to landing page
        })
        .catch((error) => {
          console.error("Error during logout:", error);
          alert("Error during logout. Please try again.");
        });
    });
  }

  // Monitor Authentication State
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Render assessment cards
          if (userData.interestedSkills) {
            await renderAssessmentCards(userData.interestedSkills);
          }
        } else {
          console.error("No user document found.");
          alert("No user details found. Please complete your profile.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Error fetching user details. Please try again.");
      }
    } else {
      console.log("No user is logged in.");
      alert("Please log in to view your details.");
    }
  });
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderAssessmentCards(interestedSkills) {
  const container = document.getElementById("assessment-cards-container");
  if (!container) {
    console.error("Assessment cards container not found.");
    return;
  }

  // Add placeholder cards
  addPlaceholderCards(container, 4);

  const quizPromises = [];
  const quizData = [];

  // Fetch quizzes for each skill
  for (const skill of Object.keys(interestedSkills)) {
    quizPromises.push(
      fetchQuizzes(skill).then((quizzes) => {
        if (quizzes) {
          quizData.push({ skill, quizzes });
        }
      })
    );
  }

  // Wait for all fetches to complete
  await Promise.all(quizPromises);

  // Clear placeholders and render the actual cards
  container.innerHTML = "";
  quizData.forEach(({ skill, quizzes }) => {
    const card = document.createElement("div");
    card.className = "card quiz-card";
    card.innerHTML = `<div class="quiz-box">
                        <h1>${skill}</h1>
                        <p>40 Questions</p>
                        <p class="quiz-description">Test your knowledge of ${skill} with 40 engaging questions.</p>
                        <button class="button-35" role="button">Start Assessment</button>
                      </div>`;
    container.appendChild(card);
  });

  // Show a fallback message if no quizzes are found
  if (quizData.length === 0) {
    container.innerHTML = `<p class="no-quizzes-message">No quizzes are currently available for your selected skills.</p>`;
  }
}

// Fetch quizzes for a skill
async function fetchQuizzes(skill) {
  const apiUrl = `https://skillsync-backend-1-s85m.onrender.com/api/questions/${skill.toLowerCase()}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 40); // Return the first 40 questions
    } else {
      console.error(`No quizzes found for ${skill}:`, data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return null;
  }
}

// Add placeholder cards
function addPlaceholderCards(container, count) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const placeholder = document.createElement("div");
    placeholder.className = "card placeholder-card";
    placeholder.innerHTML = `<div class="quiz-box">
                               <div class="placeholder-title"></div>
                               <div class="placeholder-questions"></div>
                               <div class="placeholder-button"></div>
                             </div>`;
    container.appendChild(placeholder);
  }
}

// Handle "Start Assessment" button clicks
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("button-35")) {
    const skill = event.target
      .closest(".quiz-box")
      .querySelector("h1").innerText;
    startAssessment(skill);
  }
});

// Redirect to quiz page
function startAssessment(skill) {
  fetchQuizzes(skill).then((quizzes) => {
    if (quizzes && quizzes.length > 0) {
      localStorage.setItem("currentQuiz", JSON.stringify(quizzes));
      window.location.href = `quiz.html?skill=${encodeURIComponent(skill)}`;
    } else {
      alert("No quizzes available for the selected skill.");
    }
  });
}
