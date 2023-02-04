import { Deck, Player } from './classes.js';

// start of game
let deck = new Deck()
let playerOne = new Player('p1', 'p1MainPile', 'p1SecondPile')
let playerTwo = new Player('p2', 'p2MainPile', 'p2SecondPile')

deck.createDeck()
deck.players.push(playerOne)
deck.players.push(playerTwo)

// distrubute cards to players' mainPiles
deck.distributeCards(52, playerOne.p1MainPile, playerTwo.p2mainPile)

document.getElementById('drawTwoCards').addEventListener('click', drawTwoCards)


// draws two cards from shuffled deck
function drawTwoCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
        .then(res => res.json())
        .then(result => {
            let resultMessage = ''

            document.getElementById('playerOneCard').src = result.cards[0].image
            document.getElementById('playerTwoCard').src = result.cards[1].image

            let playerOneCardValue = computeValue(result.cards[0].value)
            let playerTwoCardValue = computeValue(result.cards[1].value)

            // holds card objects drawn
            let cardsDrawn = result.cards

            // will hold array of card codes
            let cardsForPile = []

            // inserts card codes into 'cardForPile' array
            for (let card of cardsDrawn) {
                // console.log(card.code)
                cardsForPile.push(card.code)
            }

            console.log(`cardsForPile: ${cardsForPile}`)

            // creates string of card codes from 'cardsForPile' separated by commas
            let cards = cardsForPile.join(",")

            if (playerOneCardValue > playerTwoCardValue) {
                resultMessage = 'Player 1 wins!'
                moveCardsToPile('playerOnePile', cards)

            } else if (playerOneCardValue < playerTwoCardValue) {
                resultMessage = 'Player Two Wins!'
                moveCardsToPile('playerTwoPile', cards)

            } else {
                resultMessage = 'I declare a card war!'
            }

            document.getElementById('result').innerText = resultMessage
            console.log(`Reamining cards: ${result.remaining}`)
        })
}


function moveCardsToPile(pileName, cards) {
    fetch(`https://deckofcardsapi.com/api/deck/${deck.deckId}/pile/${pileName}/add/?cards=${cards}`)
        .then(res => res.json())
        .then(_ => {
            console.log(`${cards} added to ${pileName}`)
        })
        .catch(err => console.log(`error: ${err}`))
}


function computeValue(value) {
    if (value == 'ACE') {
        return 14
    } else if (value == 'KING') {
        return 13
    } else if (value == 'QUEEN') {
        return 12
    } else if (value == 'JACK') {
        return 11
    } else {
        return Number(value)
    }
}