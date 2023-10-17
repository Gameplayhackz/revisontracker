// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAm4aDJ-g-UehALCEPvuzqNeLmQfUW4M8Q",
  authDomain: "revisiontracker-dc145.firebaseapp.com",
  projectId: "revisiontracker-dc145",
  storageBucket: "revisiontracker-dc145.appspot.com",
  messagingSenderId: "140685845306",
  appId: "1:140685845306:web:3861b3a78048d253c46603",
  measurementId: "G-3CXTB499EB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
var auth = firebase.auth();

// Function to sign in a user
function signInUser() {
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");

  var email = emailInput.value;
  var password = passwordInput.value;

  // Validate email and password (add more validation as needed)
  if (validateEmail(email) && password) {
    auth.signInWithEmailAndPassword(email, password)
      .then(function() {
        // User sign-in successful
        // Redirect to index.html on successful login
        window.location.href = "index.html";
      })
      .catch(function(error) {
        // Handle sign-in errors (e.g., display error message)
        var errorText = document.getElementById("errorText");
        errorText.textContent = error.message;
        errorText.classList.remove("hidden");
      });
  } else {
    alert("Please enter a valid email and password.");
  }

  // Prevent the form from submitting (this is done automatically by Firebase)
  return false;
}

// Validate email format
function validateEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
