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

document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");

  // Add the 'show' class to trigger the animation
  setTimeout(() => {
    body.classList.add("show");
  }, 200); // Delay to make the animation smooth
});

// Get elements
const modal = document.getElementById("userDetailsModal");
const usernameTrigger = document.getElementById("usernameTrigger");
const profileTrigger = document.getElementById("profileTrigger");
const closeIcon = document.querySelector(".cross-image img");
const overlay = document.querySelector(".overlay");
// Function to open the modal
function openModal() {
  modal.classList.add("active");
  overlay.classList.add("overlayactive");
  overlay.style.display = "block"
}

// Function to close the modal
function closeModal() {
  modal.classList.remove("active");
  overlay.classList.remove("overlayactive");
}

// Open modal when clicking on username or profile icon
usernameTrigger.addEventListener("click", openModal);
profileTrigger.addEventListener("click", openModal);

// Close modal when clicking on the close icon
closeIcon.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let isLoggingOut = false; // Flag to track logout state

  // Logout button logic
  const logoutButton = document.querySelector(".logout-button");
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior
    isLoggingOut = true; // Set flag to true during logout

    signOut(auth)
      .then(() => {
        console.log("User successfully logged out.");
        // Redirect to the landing page or login page
        window.location.href = "../../index.html"; // Replace with the actual landing page URL
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Error during logout. Please try again.");
      })
      .finally(() => {
        isLoggingOut = false; // Reset flag after logout process
      });
  });
  // Monitor Authentication State
  onAuthStateChanged(auth, async (user) => {
    if (isLoggingOut) {
      // Skip this check if the user is logging out
      return;
    }
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
