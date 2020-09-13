// select word search form
var wordSearchFormEl = document.querySelector("#word-search-form");
// select form input
var wordInputEl = document.querySelector("#word-input");
// select definition div
var definitionContainerEl = document.querySelector("#definitions-container")
// select synonym container div
var synonymContainerEl = document.querySelector("#synonyms-container");
// select type of container div
var typeOfContainerEl = document.querySelector("#type-of-container");
// select book container div
var bookContainerEl = document.querySelector("#book-container");

// search history container  
var searchHistoryEl = document.querySelector("#history-button-container")

// create list to store searched words 
var words = [];

// function to handle word search
var wordSearch = function (event) {
    event.preventDefault();
    // get word from input
    var word = wordInputEl.value;
    // fetch the definition
    defintionFetch(word);
    // fetch the synonyms
    fetchSynonyms(word);
    // fetch the type of
    fetchTypeOf(word);
    // use the word to search the book api
    fetchBooks(word);
}

// function to perform word defintion fetch
var defintionFetch = function (word) {
    // use the word to fetch from the api
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "e2952ee466msh43fbf0a24fab1ddp1c8f69jsnfb29dc16feca"
        }
    }).then(function (response) {
        // check that the fetch was successful
        if (response.ok) {
            word = word.toLowerCase().trim();
            //check if word is already in the array 
            if (!words.includes(word)) {
                //adding new searched word to the array
                words.push(word);
                //call add button function 
                addbutton(word, searchHistoryEl);
                // putting user input to local storage
                localStorage.setItem("words", JSON.stringify(words));

            }

            // convert response to json
            response.json().then(function (data) {
                // clear out the text content in the definitions container
                definitionContainerEl.innerHTML = "";
                // for each definition
                // changed data.results.length to 5 to limit number of results
                for (var i = 0; i < 5 /*data.results.length*/ ; i++) {
                    // create a heading for the definition and append to div
                    createHeadingEl(data.results[i].definition, definitionContainerEl);
                }
            })
        }
    })
}

// function to fetch synonyms
var fetchSynonyms = function (word) {
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/synonyms`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "e2952ee466msh43fbf0a24fab1ddp1c8f69jsnfb29dc16feca"
        }
    }).then(function (response) {
        // check that the fetch was successful
        if (response.ok) {
            // clear inner html of synonym container
            synonymContainerEl.innerHTML = "";
            // convert response to json
            response.json().then(function (data) {
                // for each synonym
                // changed data.synonyms.length to 5 to limit number of results
                for (var i = 0; i < 5 /*data.synonyms.length*/ ; i++) {
                    // create a heading for each synonym
                    createHeadingEl(data.synonyms[i], synonymContainerEl);
                }
            })
        }
    })
}

// function to fetch type of information
var fetchTypeOf = function (word) {
    // use the word to fetch
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/typeOf`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "e2952ee466msh43fbf0a24fab1ddp1c8f69jsnfb29dc16feca"
        }
    }).then(function (response) {
        // check that fetch was successful
        if (response.ok) {
            // clear typeof container
            typeOfContainerEl.innerHTML = "";
            // convert response to json
            response.json().then(function (data) {
                //console.log(data);
                // for each type of
                // changed data.typeOf.length to 5 to limit number of results
                for (var i = 0; i < 5 /*data.typeOf.length*/ ; i++) {
                    // create a heading for each type of
                    createHeadingEl(data.typeOf[i], typeOfContainerEl);
                }
            })
        }
    })
}

var fetchBooks = function(word){
    // use the word to fetch books
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${word}`).then(function(response){
        // check that the fetch was successful
        if (response.ok){
            console.log("if");
            // convert to json
            response.json().then(function(data){
                console.log(data);
                // clear book div innter html
                bookContainerEl.innerHTML = "";
                // display number of books with that word in the title
                var bookNumberEl = document.createElement("h1");
                bookNumberEl.classList = "content is-medium";
                bookNumberEl.textContent = `There are ${data.totalItems} books with that word in the title`;
                // append number of books to container
                bookContainerEl.appendChild(bookNumberEl);
                // display list of five books with link to the google page
            })
        }
    })
}

// function to create an element for a list item
var createHeadingEl = function (headItem, parentEl) {
    // create a list item or "li" to go into <ol> "ordered list"
    var headingEl = document.createElement("li");
    // give it the "is-lower-alpha class
    headingEl.classList = "mx-5";
    // set its text content to the definition
    headingEl.textContent = headItem;
    // append the definition to the definition div
    parentEl.appendChild(headingEl);
}

//display previous searches
var loadSearchHistory = function () {
    // set search values to local storage
    words = JSON.parse(localStorage.getItem("words"));
    //check if words is empty
    if(!words)
    {
        //if words is empty set it to an array 
        words = [];
        return;
    }
    for(i=0; i<words.length; i++)
    {
        // call add button function to add searched words and buttons to the page 
        addbutton(words[i], searchHistoryEl);
        

    } 
    
}

var addbutton = function (word, parentContainer) {

    // creating an element for button 
    var wordButton = document.createElement("button"); 
    //adding classes to our created element
    wordButton.classList = "button is-text search-history";
    //adding whatever is in the word variable as text to the wordbutton variable 
    wordButton.textContent = word; 
    //making it show on the page
    parentContainer.appendChild(wordButton);

}
var previousSearchHandler = function (event) {
    //targeting the closest click 
    var word = event.target.closest(".search-history").textContent;

    // fetch the definition
    defintionFetch(word);
    // fetch the synonyms
    fetchSynonyms(word);
    // fetch the type of
    fetchTypeOf(word);
}

 loadSearchHistory(); 

 // add submit event listener
wordSearchFormEl.addEventListener("submit", wordSearch);

//add event listener to the search history element 
searchHistoryEl.addEventListener("click", previousSearchHandler);

