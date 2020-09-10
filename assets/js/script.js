// select word search form
var wordSearchFormEl = document.querySelector("#word-search-form");
// select form input
var wordInputEl = document.querySelector("#word-input");
// select definition div
var definitionContainerEl = document.querySelector("#definitions-container")

// function to handle word search
var wordSearch = function(event){
    event.preventDefault();
    // get word from input
    var word = wordInputEl.value;
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
                // retrieve the array of definitions for the word
                var definitions = data.results;
                // clear out the text content in the definitions container
                definitionContainerEl.innerHTML = "";
                // for each definition
                for (var i = 0; i < definitions.length; i++){
                    // create a heading for the definition and append to div
                    createDefinitionEl(definitions[i].definition);
                }
            })
        }
    })
}

// function to create an element for a definition
var createDefinitionEl = function(definition){
    // create an h3
    var defHeadingEl = document.createElement("h3");
    // give it the subtitle class
    defHeadingEl.classList = "subtitle";
    // set its text content to the definition
    defHeadingEl.textContent = definition;
    // append the definition to the definition div
    definitionContainerEl.appendChild(defHeadingEl);
}

// add submit event listener
wordSearchFormEl.addEventListener("submit", wordSearch);