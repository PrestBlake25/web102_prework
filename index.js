/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++){

        // create a new div element, which will become the game card
        let gameCard = document.createElement("div");
        // add the class game-card to the list
        gameCard.classList.add("game-card")
        // set the inner HTML using a template literal to display some info
        gameCard.innerHTML = 
        `   <img src=${games[i].img} class="game-img" />
            <h1>${games[i].name}</h1>
            <p>${games[i].description}</p>
        `;
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gamesContainer.append(gameCard)
        // append the game to the games-container
    }
}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON)
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((accum, game) => { return accum + game.backers;}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString('en-US')}`

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalDonated = (accum, game) => accum + game.pledged
let totalRaised = GAMES_JSON.reduce(totalDonated, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString('en-US')}`


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unFundedGames= GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    })

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unFundedGames)

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
     let fundedGames = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    })

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames)
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)
}

function showSearchedGames(){
    const searchTerm = window.prompt("Enter part of a game title to search for:")
    if (searchTerm === null) {
        return;
    }
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const matchingGames = normalizedSearchTerm? GAMES_JSON.filter((game) =>
         game.name.toLowerCase().includes(normalizedSearchTerm))
        : GAMES_JSON

    deleteChildElements(gamesContainer)
    addGamesToPage(matchingGames)
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const searchBtn = document.getElementById("search-btn")

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly)
fundedBtn.addEventListener('click', filterFundedOnly)
allBtn.addEventListener('click', showAllGames)
searchBtn.addEventListener('click', showSearchedGames)



/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unFundedGamesCount = GAMES_JSON.reduce((accum, game) => {
    return game.pledged < game.goal ? accum + 1 : accum;
}, 0)
console.log(unFundedGamesCount)


// create a string that explains the number of unfunded games using the ternary operator
let singOrPluralGame = unFundedGamesCount == 1 ? "game" : "games"
const display = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} games. Currently, ${unFundedGamesCount} ${singOrPluralGame}
remain unfunded. We need your help to fund theses amazing games!`

// create a new DOM element containing the template string and append it to the description container
const descPara = document.createElement('p')
descPara.innerHTML = display
descriptionContainer.appendChild(descPara)

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topFunded, secondTopFunded, ...rest] = sortedGames
// create a new element to hold the name of the top pledge game, then append it to the correct element
const topFundedCont = document.createElement('p')
topFundedCont.innerHTML = topFunded.name
firstGameContainer.appendChild(topFundedCont)

// do the same for the runner up item
const secondTopFundedCont = document.createElement('p')
secondTopFundedCont.innerHTML = secondTopFunded.name
secondGameContainer.appendChild(secondTopFundedCont)