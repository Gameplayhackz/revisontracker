const db = firebase.firestore();
const topics = {};

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
  }
  else {
    // Display an error message or handle it as needed
    alert("Topic cannot be empty.");
  }
}

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
