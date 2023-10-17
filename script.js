const db = firebase.firestore();
const topics = {};

function addTopic() {
  const topicInput = document.getElementById("topic");
  const topic = topicInput.value;
  const revisionDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Add the topic to Firestore
  db.collection('your-collection').add({
    topic: topic,
    revisionDate: revisionDate,
  })
  .then(function(docRef) {
    console.log('Document written with ID: ', docRef.id);
    topicInput.value = ''; // Clear the input field
  })
  .catch(function(error) {
    console.error('Error adding document: ', error);
  });
}

// Function to revise topics
function reviseTopics() {
  const today = new Date();
  const topicsList = document.getElementById('topicsList');
  topicsList.innerHTML = ''; // Clear previous results

  db.collection('your-collection').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const topicData = doc.data();
        const lastRevisionDate = new Date(topicData.revisionDate);
        const daysSinceLastRevision = Math.floor((today - lastRevisionDate) / (1000 * 60 * 60 * 24)); // Calculate days
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
  allTopicsList.innerHTML = ''; // Clear previous results

  db.collection('your-collection').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const topicData = doc.data();
        const listItem = document.createElement('li');
        listItem.textContent = `'${topicData.topic}' (Last revised: ${new Date(topicData.revisionDate).toDateString()})`;
        allTopicsList.appendChild(listItem);
      });
    });
}

// Function to update the revision date of a topic
function modifyDate() {
  const modifyTopicDropdown = document.getElementById('modifyTopic');
  const selectedTopic = modifyTopicDropdown.value;
  const newDateInput = document.getElementById('newDate');
  const newDate = newDateInput.value;

  if (selectedTopic in topics) {
    // Update the topic's revision date in Firestore
    db.collection('your-collection').doc(topics[selectedTopic]).update({
      revisionDate: newDate,
    })
    .then(function() {
      console.log(`Updated revision date for '${selectedTopic}'`);
      newDateInput.value = ''; // Clear the input field
    })
    .catch(function(error) {
      console.error('Error updating document: ', error);
    });
  }
}

// Function to update the dropdown with topics
function updateModifyTopicDropdown() {
  const modifyTopicDropdown = document.getElementById('modifyTopic');
  modifyTopicDropdown.innerHTML = '';

  db.collection('your-collection').get()
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

// Initialize the modify topic dropdown
updateModifyTopicDropdown();
