class Deck {
    constructor(deckId) {
        this._deckId = deckId
        // this._remainingCards
    }

    get deckId() {
        return this._deckId
    }

    // get remainingCards() {
    //     return this._remainingCards
    // }

    // set adjustRemainingCards(numberOfCardsToDeduct) {
    //     return this._remainingCards - numberOfCardsToDeduct
    // }

    createDeck() {
        // get a new deck id if a deck id doesn't exist or if has a value of 'null'
        if (!localStorage.getItem('deck_id') || localStorage.getItem('deck_id') == 'null') {
            fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
                .then(res => res.json())
                .then(result => {
                    localStorage.setItem('deck_id', result.deck_id)
                    this._deckId = localStorage.getItem('deck_id')
                    // this._remainingCards = 52
                    console.log(`New deck added to localStorage: ${this._deckId}`)
                })
        } else {
            // get a deck id from localstorage
            this._deckId = localStorage.getItem('deck_id')
            console.log(`Deck loaded from localStorage: ${this._deckId}`)
        }
    }

    distributeCards(numberOfCards) {
        fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${numberOfCards}`)
            .then(res => res.json())
            .then(result => {
                console.log(`distributing cards...`)

                // holds card objects drawn
                let cardsDrawn = result.cards

                // will hold array of card codes
                let cardsForPlayerOnePile = []
                let cardsForPlayerTwoPile = []


                // 'cardsDrawn' will sometimes be undefined because its assignment doesn't always
                // occur before it is accessed in the for loop below

                // insert card codes into array
                for (let i = 0; i < cardsDrawn.length - 1; i += 2) {
                    cardsForPlayerOnePile.push(cardsDrawn[i].code)
                    cardsForPlayerTwoPile.push(cardsDrawn[i + 1].code)
                }

                // creates string of card codes separated by commas
                let cardsToMovePlayerOne = cardsForPlayerOnePile.join(",")
                let cardsToMovePlayerTwo = cardsForPlayerTwoPile.join(",")

                playerOne.addCardsToPile(playerOne.mainPile, cardsToMovePlayerOne)
                playerTwo.addCardsToPile(playerTwo.mainPile, cardsToMovePlayerTwo)

                // console.log(`${playerOne.playerName} ${playerOne.mainPile}: ${cardsToMovePlayerOne}`)
                // console.log(`${playerTwo.playerName} ${playerTwo.mainPile}: ${cardsToMovePlayerTwo}`)

                // deck.adjustRemainingCards(numberOfCards)
            })
            .catch(err => console.log(`error: ${err}: ${err.lineNumber}`))
    }
}

class Player {
    constructor(playerName, mainPile, secondPile) {
        this._playerName = playerName
        this._mainPile = mainPile
        this._secondPile = secondPile
        this.createEmptyPile(this._mainPile)
        this.createEmptyPile(this._secondPile)
    }

    get playerName() {
        return this._playerName
    }

    get mainPile() {
        return this._mainPile
    }

    get secondPile() {
        return this._secondPile
    }

    createEmptyPile(pileName) {
        fetch(`https://deckofcardsapi.com/api/deck/${deck.deckId}/pile/${pileName}/add/?cards=""`)
            .then(res => res.json())
            .then(result => {
                console.log(`${result} created`)
            })
            .catch(err => console.log(`error: ${err}`))
    }

    addCardsToPile(pileName, cards) {
        fetch(`https://deckofcardsapi.com/api/deck/${deck.deckId}/pile/${pileName}/add/?cards=${cards}`)
            .then(res => res.json())
            .then(result => {
                console.log(`Cards added to ${pileName}: ${cards}`)
            })
            .catch(err => console.log(`error: ${err}`))
    }
}

// start of game
let deck = new Deck()
let playerOne = new Player('p1', 'p1MainPile', 'p1SecondPile')
let playerTwo = new Player('p2', 'p2MainPile', 'p2SecondPile')

deck.createDeck()

// distrubute cards to players' mainPiles
deck.distributeCards(52)


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