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

// function to handle word search
var wordSearch = function(event){
    event.preventDefault();
    // get word from input
    var word = wordInputEl.value;
    // fetch the definition
    defintionFetch(word);
    // fetch the synonyms
    fetchSynonyms(word);
    // fetch the type of
    fetchTypeOf(word);
}

// function to perform word defintion fetch
var defintionFetch = function(word){
    // use the word to fetch from the api
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "e2952ee466msh43fbf0a24fab1ddp1c8f69jsnfb29dc16feca"
        }
    }).then(function(response){
        // check that the fetch was successful
        if (response.ok){
            // convert response to json
            response.json().then(function(data){
                // clear out the text content in the definitions container
                definitionContainerEl.innerHTML = "";
                // for each definition
                for (var i = 0; i < data.results.length; i++){
                    // create a heading for the definition and append to div
                    createHeadingEl(data.results[i].definition, definitionContainerEl);
                }
            })
        }
    })
}

// function to fetch synonyms
var fetchSynonyms = function(word){
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/synonyms`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "e2952ee466msh43fbf0a24fab1ddp1c8f69jsnfb29dc16feca"
        }
    }).then(function(response){
        // check that the fetch was successful
        if (response.ok){
            // clear inner html of synonym container
            synonymContainerEl.innerHTML = "";
            // convert response to json
            response.json().then(function(data){
                // for each synonym
                for (var i = 0; i < data.synonyms.length; i++){
                    // create a heading for each synonym
                    createHeadingEl(data.synonyms[i], synonymContainerEl);
                }
            })
        }
    })
}

// function to fetch type of information
var fetchTypeOf = function(word){
    // use the word to fetch
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/typeOf`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "e2952ee466msh43fbf0a24fab1ddp1c8f69jsnfb29dc16feca"
        }
    }).then(function(response){
        // check that fetch was successful
        if (response.ok){
            // clear typeof container
            typeOfContainerEl.innerHTML = "";
            // convert response to json
            response.json().then(function(data){
                console.log(data);
                // for each type of
                for (var i = 0; i < data.typeOf.length; i++){
                    // create a heading for each type of
                    createHeadingEl(data.typeOf[i], typeOfContainerEl);
                }
            })
        }
    })
}

// function to create an element for a heading/subtitle item
var createHeadingEl = function(headItem, parentEl){
    // create an h3
    var headingEl = document.createElement("h3");
    // give it the subtitle class
    headingEl.classList = "subtitle";
    // set its text content to the definition
    headingEl.textContent = headItem;
    // append the definition to the definition div
    parentEl.appendChild(headingEl);
}

// add submit event listener
wordSearchFormEl.addEventListener("submit", wordSearch);