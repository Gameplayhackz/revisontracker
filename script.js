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

// Initialize Firestore after Firebase
var db = firebase.firestore();
const topics = {};

// Initialize Firebase Authentication
const auth = firebase.auth();

// Function to add a topic
function addTopic() {
  const topicInput = document.getElementById("topic");
  const topic = topicInput.value.trim(); // Trim removes leading/trailing spaces

  // Check if the topic is not empty
  if (topic) {
    const revisionDate = new Date().toISOString();

    // Add the topic to Firestore
    db.collection('topics').add({
      topic: topic,
      revisionDate: revisionDate,
    })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id);
      topicInput.value = ''; // Clear the input field
      updateModifyTopicDropdown();
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
    });
  } else {
    // Display an error message or handle it as needed
    alert("Topic cannot be empty.");
  }
}

// Function to revise topics
function reviseTopics() {
  const today = new Date();
  const topicsList = document.getElementById('topicsList');
  topicsList.innerHTML = '';

  db.collection('topics').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const topicData = doc.data();
      const lastRevisionDate = new Date(topicData.revisionDate);
      const daysSinceLastRevision = Math.floor((today - lastRevisionDate) / (1000 * 60 * 60 * 24));
      const revisionIntervals = [1, 3, 10];

      if (revisionIntervals.includes(daysSinceLastRevision)) {
        const listItem = document.createElement('li');
        listItem.textContent = `Revise '${topicData.topic}' (Last revised: ${lastRevisionDate.toDateString()})`;
        topicsList.appendChild(listItem);
      }
    });
  });
}

// Function to show all topics
function showAllTopics() {
  const allTopicsList = document.getElementById('allTopicsList');
  allTopicsList.innerHTML = '';

  db.collection('topics').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const topicData = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `'${topicData.topic}' (Last revised: ${new Date(topicData.revisionDate).toDateString()})`;
      allTopicsList.appendChild(listItem);
    });
  });
}

// Function to modify a topic's revision date
function modifyDate() {
  const modifyTopicDropdown = document.getElementById('modifyTopic');
  const selectedTopic = modifyTopicDropdown.value;
  const newDateInput = document.getElementById('newDate');
  const newDate = newDateInput.value;

  if (selectedTopic in topics) {
    db.collection('topics').doc(topics[selectedTopic]).update({
      revisionDate: newDate,
    })
    .then(function() {
      console.log(`Updated revision date for '${selectedTopic}'`);
      newDateInput.value = '';
    })
    .catch(function(error) {
      console.error('Error updating document: ', error);
    });
  }
}

// Function to update the modification dropdown with topic names
function updateModifyTopicDropdown() {
  const modifyTopicDropdown = document.getElementById('modifyTopic');
  modifyTopicDropdown.innerHTML = '';

  db.collection('topics').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const topicData = doc.data();
      const option = document.createElement('option');
      option.value = topicData.topic;
      option.textContent = topicData.topic;
      modifyTopicDropdown.appendChild(option);
      topics[topicData.topic] = doc.id;
    });
  });
}

updateModifyTopicDropdown();

// Function to toggle the "How It Works" section
function toggleHowItWorks() {
  var howItWorksSection = document.getElementById('how-it-works');
  if (howItWorksSection.classList.contains('hidden')) {
    howItWorksSection.classList.remove('hidden');
  } else {
    howItWorksSection.classList.add('hidden');
  }
}

// Sign-Up Function
function signUpUser() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      // Sign-up successful
      window.location.href = "dashboard.html"; // Redirect to the dashboard page after signing up
    })
    .catch(function(error) {
      // Handle sign-up errors (e.g., display error message)
      const errorText = document.getElementById("errorText");
      errorText.textContent = error.message;
      errorText.classList.remove("hidden");
    });

  // Prevent the form from submitting (this is done automatically by Firebase)
  return false;
}

// Sign-In Function
function signInUser() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(function(user) {
      // Sign-in successful
      window.location.href = "dashboard.html"; // Redirect to the dashboard page after signing in
    })
    .catch(function(error) {
      // Handle sign-in errors (e.g., display error message)
      const errorText = document.getElementById("errorText");
      errorText.textContent = error.message;
      errorText.classList.remove("hidden");
    });

  // Prevent the form from submitting (this is done automatically by Firebase)
  return false;
}

// Logout Function
function logout() {
  auth.signOut().then(function() {
    // Sign-out successful
    window.location.href = "signin.html"; // Redirect to the Sign-In page after logging out
  }).catch(function(error) {
    // An error occurred during sign-out
    console.error(error);
  }
}
