// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
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

// Login Button

const login = document.getElementById("login-button");
const register = document.getElementById("register-button");

//---------------------------------------------------------Registration-----------------------------------------------------

register.addEventListener("click", function (event) {
  event.preventDefault();

  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "flex";

  //Input Values

  console.log("User registration started.");

  const username = document.getElementById("registration-username").value;
  const email = document.getElementById("registration-email").value;
  const password = document.getElementById("registration-password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    loadingOverlay.style.display = "none";
    return;
  }

  console.log("Email entered - ", email);

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;
      // Store user details in Firestore
      try {
        // Store user details in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          username: username,
          email: email,
          createdAt: new Date(),
        });

        console.log("User details added to Firestore.");
        alert("Account Created!! Redirecting to your SkillSync Dashboard.");
        loadingOverlay.style.display = "none";
        window.location.href = "./selectrole/index.html";
      } catch (error) {
        console.error("Error writing to Firestore:", error);
        alert("Failed to save user details. Please try again.");
        loadingOverlay.style.display = "none";
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode == "auth/email-already-in-use") {
        alert(
          "Entered Email Address already exist, please login instead of register."
        );
        loadingOverlay.style.display = "none";
      } else {
        alert(errorMessage);
        loadingOverlay.style.display = "none";
      }

      // ..
    });
});

// -----------------------------------------------------------Login-----------------------------------------------------------------------

login.addEventListener("click", function (event) {
  event.preventDefault();

  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "flex";

  //Input Values

  console.log("User Login started.");

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  console.log("Email entered - ", email);

  if (!email){
    alert("Please fill all requred fields.")
    loadingOverlay.style.display = "none";
  } else if (!password){
    alert("Please fill all requred fields.")
    loadingOverlay.style.display = "none";
  }
  

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userRole = userData.role;

        // Check for role first
        if (!userRole) {
          alert("Role not found. Please select your role first.");
          loadingOverlay.style.display = "none";
          window.location.href = "./selectrole/index.html"; // Redirect to selectrole page

          return;
        }

        // If role exists, check for additional details
        const bio = userData.bio;
        const dob = userData.dateOfBirth;
        const gender = userData.gender;
        const interestedFields = userData.interestedFields;
        const interestedSkills = userData.interestedSkills;
        const industryExperience = userData.industryExperience;

        if (
          !bio ||
          !dob ||
          !gender ||
          !interestedFields ||
          interestedFields.length === 0
        ) {
          alert("Additional details are incomplete. Please fill them in.");
          loadingOverlay.style.display = "none";
          window.location.href = "./selectrole/details/details.html"; // Redirect to additional details page
          return;
        }
        
        if (!interestedSkills || interestedSkills === 0 || !industryExperience){
          alert("Additional profile details are incomplete. Please fill them in from next page.");
          loadingOverlay.style.display = "none";
          window.location.href = "./selectrole/details/details2/index.html";
          return;
        }

        

        // Redirect based on role
        if (userRole == "Student") {
          
          window.location.href = "./dashboard/student-dashboard/index.html";
        } else if (userRole === "Recruiter") {
          window.location.href = "./dashboard/recruiter-dashboard/index.html";
        } else {
          loadingOverlay.style.display = "none";
          alert(
            "Role not found. Please select your role first from next page."
          );
          window.location.href = "./selectrole/index.html";
        }
      } else {
        loadingOverlay.style.display = "none";
        alert("User data not found, Please register first to proceed.");
      }

      // // const role = getSelectedRole()
      // alert(
      //   "Account Login Successful! Redirecting to your SkillSync Dashboard."
      // );
      // console.log("Acount Login Successful");
      // window.location.href = "./dashboard/student-dashboard/index.html";
      // // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // alert(errorMessage);
      if (errorCode == "auth/invalid-credential") {
        loadingOverlay.style.display = "none";
        alert("User data not found, Please register first to proceed.");
      }
      // ..
    });
});

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userRole = userDocSnap.data().role;

      // Redirect based on role
      if (userRole === "Student") {
        window.location.href = "./dashboard/student-dashboard/index.html";
      } else if (userRole === "Recruiter") {
        window.location.href = "./dashboard/recruiter-dashboard/index.html";
      }
    }
  }
});
