import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  updateDoc,
  setDoc,
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

const bioInput = document.getElementById("bio");
const bioCounter = document.getElementById("bio-counter");

// Listen for input events on the textarea
bioInput.addEventListener("input", () => {
  const bioLength = bioInput.value.length;

  // Update the character counter
  bioCounter.textContent = `${bioLength}/150`;

  // If max length is reached, trim the input (optional safeguard)
  if (bioLength > 150) {
    bioInput.value = bioInput.value.substring(0, 150);
    bioCounter.textContent = "150/150"; // Ensure it doesn't go over the limit
  }
});

const selectBtn = document.querySelector(".select-btn"),
  items = document.querySelectorAll(".item");
selectBtn.addEventListener("click", () => {
  selectBtn.classList.toggle("open");
});
items.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");
    let checked = document.querySelectorAll(".checked"),
      btnText = document.querySelector(".btn-text");
    if (checked && checked.length > 0) {
      btnText.innerText = `${checked.length} Selected`;
    } else {
      btnText.innerText = "Select Language";
    }
  });
});

function getSelectedFields() {
  const checkedItems = document.querySelectorAll(".item.checked"); // Get all checked items
  const selectedFields = Array.from(checkedItems).map((item) => {
    return item.querySelector(".item-text").innerText.trim(); // Get the text of each checked item
  });
  return selectedFields; // Return the array of selected fields
}

document.getElementById("next-button").addEventListener("click", async (e) => {
  e.preventDefault();

  // Extract values from form fields
  const bio = document.getElementById("bio").value.trim();
  console.log(bio);
  const dob = document.getElementById("dateofbirth").value; // Date of Birth
  console.log(dob);
  const gender = document.querySelector("input[name='gender']:checked").value; // Male/Female
  console.log(gender);
  const interestedFields = getSelectedFields(); // Array of selected interested fields
  console.log(interestedFields);
  // Calculate age
  const dobDate = new Date(dob);
  console.log(dobDate);
  const age = calculateAge(dobDate);
  console.log(age);

  // Validate form data
  if (!bio || !dob || !gender || interestedFields.length === 0) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("No user is logged in. Please log in first.");
      return;
    }
    const userDocRef = doc(db, "Users", user.uid);
    // const userDoc = await getDoc(userDocRef);
    // Document exists, update the fields
    await updateDoc(userDocRef, {
      bio,
      dateOfBirth: dob,
      age,
      gender,
      interestedFields,
    });
    window.location.href = "./details2/index.html";
  } catch (error) {
    console.error("Error saving details:", error);
    alert("Error saving details. Please try again.");
  }
});

function calculateAge(dob) {
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}