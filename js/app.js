/**

      Followed this tutorial for implementing DynamoDB:
      https://medium.com/@KerrySheldon/dynamodb-exercise-3-1-get-add-items-to-dynamodb-tables-11e5f369509d

      Modified to suit our application's needs


**/
// The Animal Information
const flashCardTable = 'flashcards';
// The Animal Category
const topicTable = 'topics';

// Pool ID taken from Cognito
const IdentityPoolId = 'us-west-2:36f91fa7-b312-43d7-b60e-ba1cac4a23ff';
const credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId })
// Region registered with AWS
const region = 'us-west-2';
AWS.config.update({
  region,
  credentials
});

// Connect with DynamoDB
const ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
});

// Create Flashcard with information from 'topic', 'front', 'back'
function addCard() {
  const topic = document.getElementById("topic-input").value
  const front = document.getElementById("front-input").value
  const back = document.getElementById("back-input").value
  const params = {
    "RequestItems": {
      "topics": [ // Input for Topic/Category
        {
          "PutRequest": {
            "Item": {
              "name": {
                "S": topic
              }
            }
          }
        }
      ],
      "flashcards": [ // Inputs for Flashcard
        {
          "PutRequest": {
            "Item": {
              'topic': {"S": topic},
              'front': {"S": front},
              'back': {"S": back},
              'createdAt': {"N": Date.now().toString()}
            }
          }
        }
      ]
    }
  }

  // Write to dynamoDB and reset flash card
  ddb.batchWriteItem(params, function(err, data) {
    if (err) {
      return alert('Error: ' + err.message);
    } else {
      document.getElementById('card-form').reset()
      listTopics()
    }
  })
}

// Show flashcard that is associated with a category
function showCards(event) {
  // Get the topic/category name from the event
  const topic = event.target.dataset.topic
  const params = {
   "TableName": flashCardTable, // Table you are going to query
   "ExpressionAttributeValues": {
    ":topic" : {"S": topic} // The field and value that you want to query by (including its data type "S" - string)
   },
   "ExpressionAttributeNames": {
     "#B": "back" // Because back is a reserve word, you need to alias it
   },
   "KeyConditionExpression": "topic = :topic",
   "ProjectionExpression": "front, #B" // The attributes you want returned
  };

  // Querying the Dyanamo Database
  ddb.query(params, function(err, data) {
    if (err) {
      return alert('Error: ' + err.message);
    } else {
      clearFlashCards()
      // Number of flashcards for that category
      const numCards = data.Count
      const cards = data.Items
      const flashCardHtml = cards.map(function(card) {
        const front = card.front.S
        const back = card.back.S
        return getFlashCardHtml(front, back)
      }).join('')
      const topicTitle = `<h4>Animals looking for a forever home: ${topic} (${numCards} results)</h4>`
      flashCardContainer().innerHTML = topicTitle + flashCardHtml
    }
  })
}

// Show categories
function listTopics() {
  clearFlashCards()
  clearTopicList()
  const params = {
   "TableName": topicTable
  };


  // Comment made by AWS Team
  // Performs a scan operation to get all items from the topics table
  // because you are not searching based on a primary key value,
  // this uses a less-performant scan operation rather than a query
  ddb.scan(params, function(err, data) {
    if (err) {
      return alert('Error: ' + err.message);
    } else {
      const topicHtml = data.Items.map(function(item) {
        const topic = item.name.S
        return getTopicHtml(topic)
      }).join('')
     topicContainer().innerHTML = topicHtml
    }
  });
}

// Get the topic/category
function getTopicHtml(topic) {
  return `<p>
    <button class="btn btn-info btn-xs" data-topic="${topic}"
    onClick="showCards(event)">Show</button>
    ${topic}</p>`
}

// Misc helper functions
function topicContainer() {
  return document.getElementById('topic-content')
}
function flashCardContainer() {
  return document.getElementById('flashcard-content')
}
function clearFlashCards() {
  flashCardContainer().innerHTML = ""
}
function clearTopicList() {
  topicContainer().innerHTML = ""
}
function toggleFlipped(event) {
  const flashCardElement = event.target.closest('.flashcard')
  flashCardElement.classList.toggle('flipped')
}
function getFlashCardHtml(front, back) {
  return `<div class="flashcard-container">
    <div class="flashcard" onClick="toggleFlipped(event)">
      <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>
      <div class="front">
        <p>${front}</p>
      </div>
      <div class="back">
        <p>${back}</p>
      </div>
    </div>
  </div>`
}
