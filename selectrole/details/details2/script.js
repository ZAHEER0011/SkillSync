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
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

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
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".card");

  // Add the 'show' class to trigger the animation
  setTimeout(() => {
    card.classList.add("show");
  }, 200); // Delay to make the animation smooth
});

const realFileBtn = document.getElementById("resume-file");
const customBtn = document.getElementById("resume-upload-button");
const customTxt = document.getElementById("resume-file-text");
const submitBtn = document.getElementById("submit-button");

customBtn.addEventListener("click", function () {
  realFileBtn.click();
});

realFileBtn.addEventListener("change", function () {
  if (realFileBtn.value) {
    customTxt.innerHTML = realFileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
});

// function getSelectedSkills() {
//   const checkedItems = document.querySelectorAll(".item.selected"); // Get all selected items
//   const selectedSkills = Array.from(checkedItems).map((item) => {
//     return item.querySelector(".item-text").innerText.trim(); // Extract the text of each selected item
//   });
//   return selectedSkills; // Return the array of selected skills
// }

// const selectBtn = document.querySelector(".select-btn"),
//   items = document.querySelectorAll(".item");
// selectBtn.addEventListener("click", () => {
//   selectBtn.classList.toggle("open");
// });
// items.forEach((item) => {
//   item.addEventListener("click", () => {
//     item.classList.toggle("checked");
//     let checked = document.querySelectorAll(".checked"),
//       btnText = document.querySelector(".btn-text");
//     if (checked && checked.length > 0) {
//       btnText.innerText = `${checked.length} Selected`;
//     } else {
//       btnText.innerText = "Select skills...";
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", async () => {
  const skillsMapping = {
    "Web Development": [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js",
      "Angular",
      "Vue.js",
      "Node.js",
      "Express.js",
      "PHP",
      "Django",
      "Flask",
      "Responsive Design",
      "Bootstrap",
      "Tailwind CSS",
      "APIs: RESTful APIs, GraphQL",
      "Web Performance Optimization",
      "Browser Compatibility and Debugging",
      "SEO (Search Engine Optimization)",
      "Progressive Web Apps (PWAs)"
    ],
    "Software Development": [
      "Software Development Life Cycle (SDLC)",
      "Version Control: Git, GitHub, GitLab",
      "Unit Testing",
      "Automation Testing",
      "DevOps",
      "CI/CD Pipelines",
      "GitHub Actions",
      "Agile Methodologies",
      "System Design and Architecture",
      "Containerization: Docker, Kubernetes",
      "APIs and SDKs",
      "Code Review and Refactoring"
    ],
    "Mobile App Development": [
      "Android",
      "iOS",
      "Flutter",
      "React Native",
      "Xamarin",
      "Ionic",
      "Kotlin",
      "Swift",
      "Java",
      "Dart",
      "Android Studio",
      "Xcode",
      "Mobile UI/UX Design",
      "Mobile Testing and Debugging",
      "Push Notifications",
      "App Store Optimization (ASO)"
    ],
    "Cloud Computing and Networking": [
      "AWS",
      "Azure",
      "Google Cloud",
      "VMware",
      "VirtualBox",
      "IaaS",
      "PaaS",
      "SaaS",
      "Docker",
      "Kubernetes",
      "AWS Lambda",
      "Azure Functions",
      "TCP/IP",
      "DNS",
      "HTTP/HTTPS",
      "Firewalls and VPNs",
      "Load Balancers and Proxies",
      "Cloud Security: IAM, Encryption, DDoS Mitigation",
    ],
    "Design and User Experience": [
      "UI/UX Design Principles",
      "Figma",
      "Adobe XD",
      "Sketch",
      "Photoshop",
      "Graphic Design",
      "Motion Graphics",
      "After Effects",
      "Cinema 4D",
      "User Research and Testing",
      "Wireframing and Prototyping",
      "Interaction Design",
      "Accessibility Standards",
      "3D Modeling",
      "Blender",
      "Maya"
    ],
    "Artificial Intelligence and Machine Learning": [
      "Machine Learning Algorithms",
      "Regression",
      "Classification",
      "Clustering",
      "Deep Learning",
      "CNNs",
      "RNNs",
      "GANs",
      "AI Frameworks",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Natural Language Processing",
      "Sentiment Analysis",
      "Text Summarization",
      "Computer Vision",
      "OpenCV",
      "Reinforcement Learning",
      "Data Preprocessing and Feature Engineering",
      "AI Ethics and Bias Mitigation",
      "Model Deployment",
      "Flask",
      "FastAPI",
      "TensorFlow Serving"
    ],
    "Blockchain and Cryptography": [
      "Blockchain Architecture",
      "Smart Contracts (Solidity)",
      "Ethereum & Other Blockchains",
      "Tokenomics & Cryptocurrencies",
      "DeFi & dApps Development",
      "Blockchain Security",
      "APIs & Integration",
      "Cryptographic Algorithms (AES, RSA)",
      "Asymmetric & Symmetric Encryption",
      "Digital Signatures",
      "Hash Functions",
      "Key Management",
      "Cryptographic Protocols",
      "Security Audits & Vulnerability Testing"
    ],
    "Hardware and Electronics": [
      "Embedded Systems",
      "RTOS",
      "ARM Development",
      "IoT",
      "Sensors",
      "Actuators",
      "MQTT",
      "Circuit Design",
      "PCB Design",
      "SPICE Simulations",
      "Robotics",
      "Arduino",
      "Raspberry Pi",
      "Autonomous Navigation",
      "FPGA Development",
      "VHDL",
      "Verilog",
      "Microcontrollers",
      "AVR",
      "STM32",
      "Hardware Prototyping",
      "Wireless Communication",
      "Zigbee",
      "LoRa",
      "Power Electronics"
    ],
    "Cybersecurity": [
      "Ethical Hacking",
      "Penetration Testing",
      "Metasploit",
      "Burp Suite",
      "Network Security",
      "Firewalls",
      "IDS/IPS",
      "Web Application Security",
      "OWASP Top 10",
      "Cryptography",
      "RSA",
      "AES",
      "ECC",
      "Secure Coding Practices",
      "Security Auditing and Compliance",
      "Threat Analysis and Risk Management",
      "Incident Response and Forensics"
      
    ],
    "Game and Interactive Media": [
      "Game Engines",
      "Unity",
      "Unreal Engine",
      "Godot",
      "Game Scripting",
      "C#",
      "C++",
      "Python",
      "Game Physics and Mechanics",
      "3D Asset Creation",
      "Blender",
      "Maya",
      "Animation and Rigging",
      "Sound Design and Audio Integration",
      "Multiplayer Networking",
      "AR/VR Development",
      "Oculus SDK",
      "ARKit",
      "ARCore",
      "Game Monetization Strategies",

    ],
    "Emerging Technologies": [
      "Blockchain",
      "Smart Contracts",
      "Solidity",
      "dApps",
      "Quantum Computing",
      "Qiskit",
      "IBM Quantum",
      "Augmented Reality (AR)",
      "ARKit",
      "Vuforia",
      "Virtual Reality (VR)",
      "Unity VR",
      "Oculus SDK",
      "5G Technologies",
      "Edge Computing",
      "Autonomous Systems",
      "Self-Driving Cars",
      "Drones",
      "Digital Twins",
      "Biometric Authentication"
    ],
    "Industry-Specific Fields": [
      "Healthcare Tech",
      "Telemedicine",
      "Electronic Health Records (EHR)",
      "FinTech",
      "Payment Gateways",
      "Cryptocurrency Platforms",
      "EduTech",
      "Learning Management Systems (LMS)",
      "Virtual Classrooms",
      "AgriTech",
      "Precision Farming",
      "Drone Monitoring",
      "E-commerce",
      "Inventory Management",
      "Payment Integration",
      "Media and Entertainment",
      "Streaming Platforms",
      "Content Recommendation",
      "Smart Cities",
      "IoT",
      "Traffic Management",
      "Logistics",
      "Route Optimization",
      "Automotive",
      "Autonomous Vehicles",
      "Telematics"
    ],
    "Programming Languages": [
      "Python",
      "Java",
      "C++",
      "C#",
      "JavaScript",
      "TypeScript",
      "PHP",
      "Ruby",
      "Kotlin",
      "Swift",
      "Dart",
      "Lua",
      "R",
      "Julia",
      "Haskell",
      "Scala",
      "Erlang",
      "Shell Scripting",
      "Perl",
      "VHDL",
      "Verilog",
      "Go",
      "Rust",
      "MATLAB",
      "Others"
    ],
    "Database Management": ["SQL", "NoSQL Databases", "Database Design ", "Database Administration", "Cloud Databases", "ETL Tools", "Data Warehousing"],
    "Data Analytics": [
      "Data Cleaning and Preprocessing",
      "Data Visualization",
      "Statistical Analysis",
      "Programming for Analytics",
      "Predictive Analytics",
      "Data Tools",
      "Business Intelligence"
    ],
    "Others": [
      "Soft Skills: Communication, Team Collaboration",
      "Technical Writing: Documentation, API Writing",
      "Project Management: Jira, Trello",
      "Productivity Tools: Notion, Slack",
      "IT Support and Troubleshooting",
      "Version Control: Git, GitHub",
      "Database Management: SQL, NoSQL",
      "Freelancing Platforms: Upwork, Fiverr",
      "Career Development: Interview Preparation, Resume Building"
    ]
  };

  const selectBtn = document.querySelector(".select-btn");
  const btnText = document.querySelector(".btn-text");
  const listItemsContainer = document.querySelector(".list-items");

  // Populate the dropdown with skills based on interested fields
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("No user is logged in. Please log in first.");
      return;
    }

    try {
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("User data not found.");
        return;
      }

      const { interestedFields = [] } = userDoc.data();
      console.log("Interested Fields:", interestedFields);

      // Clear any previous items
      listItemsContainer.innerHTML = "";

      let uniqueSkills = new Set();
      interestedFields.forEach((field) => {
        const normalizedField = field.trim();
        if (skillsMapping[normalizedField]) {
          skillsMapping[normalizedField].forEach((skill) =>
            uniqueSkills.add(skill)
          );
        }
      });

      uniqueSkills.forEach((skill) => {
        const skillItem = document.createElement("li");
        skillItem.classList.add("item");

        skillItem.innerHTML = `
          <span class="checkbox">
            <i class="fa-solid fa-check check-icon"></i>
          </span>
          <span class="item-text">${skill}</span>
        `;

        listItemsContainer.appendChild(skillItem);
      });
    } catch (error) {
      console.error("Error loading skills:", error);
      alert("Error loading skills. Please try again.");
    }
  });

  // Toggle dropdown open/close
  selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
  });

  // Event delegation to handle clicks on dynamically created items
  listItemsContainer.addEventListener("click", (e) => {
    const item = e.target.closest(".item");
    if (item) {
      item.classList.toggle("checked");

      // Update the text inside the dropdown button
      const checkedItems = listItemsContainer.querySelectorAll(".item.checked");
      if (checkedItems.length > 0) {
        btnText.innerText = `${checkedItems.length} Selected`;
      } else {
        btnText.innerText = "Choose skills...";
      }
    }
  });
});

function getSelectedSkills() {
  // Query all items marked as 'checked'
  const checkedItems = document.querySelectorAll(".item.checked");
  console.log("Checked Items:", checkedItems);
  const selectedSkills = Array.from(checkedItems).map((item) => {
    return item.querySelector(".item-text").innerText.trim(); // Retrieve the skill's text
  });
  console.log("Selected Skills Array:", selectedSkills);
  return selectedSkills;
}
submitBtn.addEventListener("click", async () => {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "flex";

  const portfolioLink = document.getElementById("portfolio").value.trim();
  const linkedinLink = document.getElementById("linkedin").value.trim();
  const socialsLink = document.getElementById("socials").value.trim();
  const experienceLevel = document.getElementById("experience").value; // Retrieve industry experience
  const selectedSkills = getSelectedSkills(); // Retrieve selected skills

  console.log("Portfolio Link:", portfolioLink);
  console.log("LinkedIn Link:", linkedinLink);
  console.log("Socials Link:", socialsLink);
  console.log("Experience Level:", experienceLevel);
  console.log("Selected Skills:", selectedSkills);

  const skillsData = {};
  selectedSkills.forEach((skill) => {
    skillsData[skill] = {
      assessmentAttempted: false, // Initial state
      assessmentScore: null, // No score initially
      lastAttemptTime: null, // No attempts yet
    };
  });

  if (!experienceLevel || selectedSkills.length === 0) {
    alert(
      "Please fill in all required fields (Industry Experience and Interested Skills)."
    );
    loadingOverlay.style.display = "none";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("No user is logged in. Please log in first.");
    loadingOverlay.style.display = "none";
    return;
  }

  try {
    const userDocRef = doc(db, "Users", user.uid);
    const resumeFile = realFileBtn.files[0];


    let resumeURL = "";

    if (resumeFile) {
      // Ensure the file is valid
      if (
        !resumeFile.type.match(
          /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/
        )
      ) {
        alert("Please upload a valid resume file (PDF or Word Document).");
        loadingOverlay.style.display = "none";
        return;
      }

      // Upload resume file to Firebase Storage
      const storageRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
      console.log("Uploading resume file to storage...");
      const uploadResult = await uploadBytes(storageRef, resumeFile);
      console.log("Resume uploaded successfully.");

      // Get download URL of the uploaded resume
      resumeURL = await getDownloadURL(uploadResult.ref);
      console.log("Resume Download URL:", resumeURL);
    }

    // Update Firestore document with user profile information
    const updatedData = {
      portfolio: portfolioLink || null,
      linkedin: linkedinLink || null,
      socials: socialsLink || null,
      industryExperience: experienceLevel,
      // interestedSkills: selectedSkills,
      "interestedSkills": skillsData,
    };

    // Add resume download URL if available
    if (resumeURL) {
      updatedData.resume = resumeURL;
    }

    // Update user document in Firestore
    await updateDoc(userDocRef, updatedData);
    alert("Profile updated successfully!");
    loadingOverlay.style.display = "none";
    window.location.href = "../../../dashboard/student-dashboard/index.html";
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile. Please try again.");
  } finally {
    // Hide the loading indicator after the process is complete
    loadingOverlay.style.display = "none";
  }
});
