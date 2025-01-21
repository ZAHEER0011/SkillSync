import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
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

document.addEventListener("DOMContentLoaded", () => {
  // Monitor Authentication State
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Reference the user document
        const userDocRef = doc(db, "Users", user.uid);

        // Fetch the user document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Extract user data
          const userData = userDoc.data();

          // Dynamically update the HTML with user details
          document.querySelector(".fullname-section p:nth-child(2)").innerText =
            userData.username || "N/A";
          document.querySelector(".bio-section p:nth-child(2)").innerText =
            userData.bio || "N/A";
          document.querySelector(".email-section p:nth-child(2)").innerText =
            user.email || "N/A"; // auth.currentUser.email
          document.querySelector(".role-section p:nth-child(2)").innerText =
            userData.role || "N/A";
          document.querySelector(".age-section p:nth-child(2)").innerText =
            userData.age || "N/A";
          document.querySelector(".dob-section p:nth-child(2)").innerText =
            userData.dateOfBirth || "N/A";
          document.querySelector(".gender-section p:nth-child(2)").innerText =
            userData.gender || "N/A";
          document.querySelector(
            ".experience-section p:nth-child(2)"
          ).innerText = userData.industryExperience || "N/A";
          document.querySelector(
            ".portfolio-section p:nth-child(2)"
          ).innerText = userData.portfolio || "N/A";
          document.querySelector(
            ".interested-fields-section p:nth-child(2)"
          ).innerText = Array.isArray(userData.interestedFields)
            ? `[${userData.interestedFields.join(", ")}]` // Join array elements with a comma
            : userData.interestedFields || "N/A";

          document.querySelector(
            ".interested-skills-section p:nth-child(2)"
          ).innerText = userData.interestedSkills
            ? `[${Object.keys(userData.interestedSkills).join(", ")}]`
            : "N/A";
          // Update username in the top-left corner
          document.querySelector(".username-section p").innerText =
            userData.username || "User";
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
