/**

      Followed this tutorial for implementing DynamoDB:
      https://medium.com/@KerrySheldon/dynamodb-exercise-3-1-get-add-items-to-dynamodb-tables-11e5f369509d

      Modified to suit our application's needs


**/

const flashCardTable = 'flashcards';
const topicTable = 'topics';
//insert pool id of your congito pool
const IdentityPoolId = 'us-west-2:36f91fa7-b312-43d7-b60e-ba1cac4a23ff';
const credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId })
//insert your region
const region = 'us-west-2';
AWS.config.update({
  region,
  credentials
});
const ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
});
function addCard() {
  const topic = document.getElementById("topic-input").value
  const front = document.getElementById("front-input").value
  const back = document.getElementById("back-input").value
  const params = {
    "RequestItems": {
      "topics": [ //params for the topics item
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
      "flashcards": [ //params for the flashcards item
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
  ddb.batchWriteItem(params, function(err, data) {
    if (err) {
      return alert('Error: ' + err.message);
    } else {
      document.getElementById('card-form').reset()
      listTopics()
    }
  })
}
function showCards(event) {
  //get the topic name from the event
  const topic = event.target.dataset.topic
  const params = {
   "TableName": flashCardTable, //table you are going to query
   "ExpressionAttributeValues": {
    ":topic" : {"S": topic} //the field and value that you want to query by (including its data type "S" - string)
   },
   "ExpressionAttributeNames": {
     "#B": "back" //because back is a reserve word, you need to alias it
   },
   "KeyConditionExpression": "topic = :topic",
   "ProjectionExpression": "front, #B" //the attributes you want returned
  };

  ddb.query(params, function(err, data) {
    if (err) {
      return alert('Error: ' + err.message);
    } else {
      clearFlashCards()
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
function listTopics() {
  clearFlashCards()
  clearTopicList()
  const params = {
   "TableName": topicTable
  };

  //performs a scan operation to get all items from the topics table
  //because you are not searching based on a primary key value, this uses a less-performant scan operation rather than a query
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
function getTopicHtml(topic) {
  return `<p>
    <button class="btn btn-info btn-xs" data-topic="${topic}"
    onClick="showCards(event)">Show</button>
    ${topic}</p>`
}
//misc helper functions
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
