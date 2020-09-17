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
// select the movie container div
var movieContainerEl = document.querySelector("#movie-container");
// select the word container
var searchedWordContainerEl = document.querySelector("#searched-word-container");
// select the stats container
var statsContainerEl = document.querySelector("#stats-container");

// search history container  
var searchHistoryEl = document.querySelector("#history-button-container")

// create list to store searched words 
var words = [];

//modal container variable
var modal = document.getElementById("page-modal");
//modal close variable 
var modalCloseEl = document.getElementById("modal-close"); 

// function to handle word search
var wordSearch = function (event) {
    event.preventDefault();
    // get word from input
    var word = wordInputEl.value;
    // fetch the definition
    defintionFetch(word);
}

var additionalWordFetches = function(word){
    // fetch the synonyms
    fetchSynonyms(word);
    // fetch the type of
    fetchTypeOf(word);
    // use the word to search the book api
    fetchBooks(word);
    // use the word to search the movie api
    fetchMovies(word);
    // use the word to search the 
    //fetchSongs(word);
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
            // set the word in the searched word container
            searchedWordContainerEl.innerHTML = `<h1 class="has-text-white has-text-shadow is-size-1 is-capitalized" type="a">${word}</h1>`;
            // fetch all necessary information
            additionalWordFetches(word);
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
                // clear out text in stats container
                statsContainerEl.innerHTML = "";
                // list number of definitions in the stats container
                createHeadingEl(`Number of definitions: ${data.results.length}`, statsContainerEl);
                // for each definition
                // changed data.results.length to 5 to limit number of results
                var length = data.results.length;
                if (length > 5){
                    length = 5;
                }
                for (var i = 0; i < length /*data.results.length*/ ; i++) {
                    // create a heading for the definition and append to div
                    createHeadingEl(data.results[i].definition, definitionContainerEl);
                }
            })
        }
        else{
            // make modal appear by changing class to is-active
            modal.className = "modal is-active"
        }
    })
}

//function to make modal disappear by changing class to just modal
var closeModal = function() {
    modal.className = "modal"
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
                // list number of synonyms in the stats container
                createHeadingEl(`Number of synonyms: ${data.synonyms.length}`, statsContainerEl);
                // for each synonym
                // changed data.synonyms.length to 5 to limit number of results
                var length = data.synonyms.length;
                if (length > 5){
                    length = 5;
                }
                // check if there are no synonyms
                if (length === 0){
                    createHeadingEl("There are no synonyms for this word.", synonymContainerEl)
                }
                for (var i = 0; i < length /*data.synonyms.length*/ ; i++) {
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
                // list number of type os in the stats container
                createHeadingEl(`Number of type of classifications: ${data.typeOf.length}`, statsContainerEl);
                //console.log(data);
                // for each type of
                // changed data.typeOf.length to 5 to limit number of results
                var length = data.typeOf.length;
                if (length > 5){
                    length = 5;
                }
                // check if there are no synonyms
                if (length === 0){
                    createHeadingEl("There is no type of information for this word.", typeOfContainerEl)
                }
                for (var i = 0; i < length /*data.typeOf.length*/ ; i++) {
                    // create a heading for each type of
                    createHeadingEl(data.typeOf[i], typeOfContainerEl);
                }
            })
        }
    })
}

// function to fetch books
var fetchBooks = function(word){
    // use the word to fetch books
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${word}`).then(function(response){
        // check that the fetch was successful
        if (response.ok){
            // clear book div innter html
            bookContainerEl.innerHTML = "";
            // convert to json
            response.json().then(function(data){
                // list number of books in the stats container
                createHeadingEl(`Number of books: ${data.totalItems}`, statsContainerEl);
                //console.log(data);
                // create div to display number of books with that word in the title
                var bookNumberEl = document.createElement("h1");
                bookNumberEl.classList = "content is-medium";
                bookNumberEl.textContent = `There are ${data.totalItems} books with that word in the title.`;
                // append number of books to container
                bookContainerEl.appendChild(bookNumberEl);
                var length = data.items.length;
                //console.log("length", length, "data", data.items);
                if (length > 5){
                    length = 5;
                }
                // display list of five books with link to the google page
                for (var i = 0; i < 5; i++){
                    var authors = "";
                    var authorArry = data.items[i].volumeInfo.authors;
                    //console.log(authorArry.length);
                    // if the author array is defined, display authors
                    if (authorArry){
                        for (var j = 0; j < data.items[i].volumeInfo.authors.length; j++){
                            // if the last item in the list and the list does not only have one item
                            if (j === (data.items[i].volumeInfo.authors.length - 1) && (data.items[i].volumeInfo.authors.length != 1)){
                                authors += ", and ";
                            } 
                            // if not the first item in the list, add a comma and space
                            else if (j != 0){
                                authors += ", ";
                            }
                            authors += data.items[i].volumeInfo.authors[j];
                        }
                        createHeadingEl(`${data.items[i].volumeInfo.title} by ${authors}`, bookContainerEl);
                    } else {
                        createHeadingEl(`${data.items[i].volumeInfo.title}`, bookContainerEl);
                    }
                    
                }
            })
        }
    })
}

// function to fetch movies
var fetchMovies = function(word){
    // use the word to fetch movies
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=ea14eb13d395f8e6500e26ec4547d879&language=en-US&query=${word}&page=1&include_adult=false`).then(function(response){
        // check that the fetch was successful
        if (response.ok){
            // clear the inner html of the container
            movieContainerEl.innerHTML = "";
            // convert to json
            response.json().then(function(data){
                // list number of movies in the stats container
                createHeadingEl(`Number of movies: ${data.total_results}`, statsContainerEl);
                //console.log(data);
                // create div to display number of movies with that word in the title
                var movieNumberEl = document.createElement("h1");
                movieNumberEl.classList = "content is-medium";
                movieNumberEl.textContent = `There are ${data.total_results} movies returned with that word in the title.`;
                // append number of movies to container
                movieContainerEl.appendChild(movieNumberEl);
                var length = data.results.length;
                if (length > 5){
                    length = 5;
                }
                // display list of five movie 
                for (var i = 0; i < length; i++){
                    createHeadingEl(`${data.results[i].title} from ${data.results[i].release_date}`, movieContainerEl);
                }
            })
        }
    })
}

// function to fetch songs
//var fetchSongs = function(word){
    // fetch(`https://api.spotify.com/v1/search?q=${word}&type=track`, {
    //         method: 'GET', headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + accessToken
    //         }
    //     })
    // musixmatch api key b4d63fd472cf398fa80055160d8b3f36	
    // fetch(`http://api.digitalpodcast.com/v2r/search/?appid=6dbaef127068f010649588b11f577daf&keywords=${word}`, {
    //     mode: 'no-cors'}).then(function(response){
    //     // check that the fetch was successful
    //     if (response.ok){
    //         // convert to json
    //         response.json().then(function(data){
    //             console.log(data);
    //         })
    //     }
    // })
//     fetch(`http://api.musixmatch.com/ws/1.1/track.search?f_has_lyrics=${word}`).then(function(response){
//         if (response.ok){
//             // convert to json
//             response.json().then(function(data){
//                 console.log(data);
//             })
//         }
//     })
// }

// function to create an element for a list item
var createHeadingEl = function (headItem, parentEl) {
    // create an h3
    var headingEl = document.createElement("h3");
    // give it the subtitle class
    headingEl.classList = "subtitle";
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
    wordButton.classList = "button is-light is-rounded mx-1 search-history has-box-shadow";
    //adding whatever is in the word variable as text to the wordbutton variable 
    wordButton.textContent = word; 
    //making it show on the page
    parentContainer.appendChild(wordButton);

}
// making the previous searches clickable 
var previousSearchHandler = function (event) {
    var word = event.target.closest(".search-history").textContent;
    // reset information in the search input
    wordInputEl.value = word;
    // fetch the definition
    defintionFetch(word);
}

 loadSearchHistory(); 

 // add submit event listener
wordSearchFormEl.addEventListener("submit", wordSearch);

//add event listener to the search history element 
searchHistoryEl.addEventListener("click", previousSearchHandler);

