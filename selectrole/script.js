import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  updateDoc,
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

document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".card");

  // Add the 'show' class to trigger the animation
  setTimeout(() => {
    card.classList.add("show");
  }, 200); // Delay to make the animation smooth
});

document.addEventListener("DOMContentLoaded", () => {
  const studentCard = document.querySelector(".left");
  const recruiterCard = document.querySelector(".right");

  // Add click event listeners for each card
  studentCard.addEventListener("click", () => {
    // Highlight the student card
    const studentImage = document.getElementById("student-img");
    const recruiterImage = document.getElementById("recruiter-img");
    studentCard.classList.toggle("selected");
    if (studentCard.classList.contains("selected")) {
      studentImage.style.border = "4px solid rgb(176,0,83)";
      console.log("Student Role Selected");
    } else {
      // Remove border if deselected
      studentImage.style.border = "none";
    }
    //   else{
    //     studentImage.style.border = "none";
    //   }
    // Ensure recruiter is deselected
    recruiterCard.classList.remove("selected");
    recruiterImage.style.border = "none";
  });

  recruiterCard.addEventListener("click", () => {
    // Highlight the recruiter card
    const recruiterImage = document.getElementById("recruiter-img");
    const studentImage = document.getElementById("student-img");
    recruiterCard.classList.toggle("selected");
    if (recruiterCard.classList.contains("selected")) {
      recruiterImage.style.border = "4px solid rgb(176,0,83)";
      console.log("Recruiter Role Selected");
    } else {
      // Remove border if deselected
      recruiterImage.style.border = "none";
    }
    studentCard.classList.remove("selected");
    studentImage.style.border = "none"; // Reset student image border
  });
});

const nextButton = document.getElementById("next-button");

nextButton.addEventListener("click", async () => {
  // Check which role is selected
  const studentCard = document.querySelector(".left");
  const recruiterCard = document.querySelector(".right");

  let role = ""; // Initialize role

  if (studentCard.classList.contains("selected")) {
    role = "Student";
  } else if (recruiterCard.classList.contains("selected")) {
    role = "Recruiter";
  } else {
    alert("Please select a role before proceeding.");
    return;
  }

  try {
    // Get the current user's UID
    const user = auth.currentUser;
    if (!user) {
      alert("No user is logged in. Please log in first.");
      return;
    }

    const userDocRef = doc(db, "Users", user.uid);

    // Update Firestore with the selected role
    await updateDoc(userDocRef, { role });

    alert("Role saved successfully! Redirecting...");
    console.log("Role saved:", role);

    // Redirect to the appropriate dashboard
    if (role === "Student") {
      window.location.href = "../dashboard/student-dashboard/index.html";
    } else if (role === "Recruiter") {
      window.location.href = "../dashboard/recruiter-dashboard/index.html";
    }
  } catch (error) {
    console.error("Error saving role:", error);
    alert("An error occurred while saving your role. Please try again.");
  }
});

export const getSelectedRole = () => {
    if (document.querySelector(".left").classList.contains("selected")) return "Student";
    if (document.querySelector(".right").classList.contains("selected")) return "Recruiter";
    return null;
};
