// select word search form
var wordSearchFormEl = document.querySelector("#word-search-form");
// select form input
var wordInputEl = document.querySelector("#word-input");


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
                console.log(definitions);
            })
        }
    })
}

// add submit event listener
wordSearchFormEl.addEventListener("submit", wordSearch);