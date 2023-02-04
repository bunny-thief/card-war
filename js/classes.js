export class Deck {
    constructor(deckId) {
        this._deckId = deckId
        this.players = []
    }

    get deckId() {
        return this._deckId
    }

    async createDeck() {
        try {
            // get a new deck id if a deck id doesn't exist or if has a value of 'null'
            if (!localStorage.getItem('deck_id') || localStorage.getItem('deck_id') == 'null') {
                const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`)
                }
                const result = await response.json()

                localStorage.setItem('deck_id', result.deck_id)
                this._deckId = localStorage.getItem('deck_id')

            } else {
                // get a deck id from localstorage
                this._deckId = localStorage.getItem('deck_id')
                console.log(`Deck loaded from localStorage: ${this._deckId}`)
            }
        }
        catch (error) {
            console.log(`Could not create new deck: ${error}`)
        }
    }

    async distributeCards(numberOfCards, p1PileName, p2PileName) {
        try {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${numberOfCards}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`)
            }

            const result = await response.json()

            console.log(`distributing cards...`)

            // holds card objects drawn
            const cardsDrawn = result.cards

            // will hold array of card codes
            const cardsForPlayerOnePile = []
            const cardsForPlayerTwoPile = []

            // insert card codes into arrays
            for (let i = 0; i < cardsDrawn.length - 1; i += 2) {
                cardsForPlayerOnePile.push(cardsDrawn[i].code)
                cardsForPlayerTwoPile.push(cardsDrawn[i + 1].code)
            }

            // creates string of card codes separated by commas
            let cardsToMovePlayerOne = cardsForPlayerOnePile.join(",")
            let cardsToMovePlayerTwo = cardsForPlayerTwoPile.join(",")

            this.players[0].addCardsToPile(p1PileName, cardsToMovePlayerOne)
            this.players[1].addCardsToPile(p2PileName, cardsToMovePlayerTwo)
        }

        catch (error) {
            console.log(`Could not distribute cards: ${error}`)
        }
    }

}


export class Player {
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
        fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deck_id')}/pile/${pileName}/add/?cards=""`)
            .then(res => res.json())
            .then(result => {
                console.log(`${result} created`)
            })
            .catch(err => console.log(`error: ${err}`))
    }

    addCardsToPile(pileName, cards) {
        fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deck_id')}/pile/${pileName}/add/?cards=${cards}`)
            .then(res => res.json())
            .then(result => {
                console.log(`Cards added to ${pileName}: ${cards}`)
            })
            .catch(err => console.log(`error: ${err}`))
    }
}