document.getElementById('drawTwoCards').addEventListener('click', drawTwoCards)

let deck_id = ''

if (!localStorage.getItem('deck_id') || localStorage.getItem('deck_id') == 'null') {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(result => {
            localStorage.setItem('deck_id', result.deck_id)
            console.log(`New deck added to localStorage: ${result.deck_id}`)
        })
} else {
    deck_id = localStorage.getItem('deck_id')
    console.log(`Deck loaded from localStorage: ${deck_id}`)
}

function drawTwoCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
        .then(res => res.json())
        .then(result => {
            let resultMessage = ''
            document.getElementById('playerOneCard').src = result.cards[0].image
            document.getElementById('playerTwoCard').src = result.cards[1].image

            let playerOneCardValue = computeValue(result.cards[0].value)
            let playerTwoCardValue = computeValue(result.cards[1].value)

            if (playerOneCardValue > playerTwoCardValue) {
                resultMessage = 'Player 1 wins!'
            } else if (playerOneCardValue < playerTwoCardValue) {
                resultMessage = 'Player Two Wins!'
            } else {
                resultMessage = 'I declare a car war!'
            }

            document.getElementById('result').innerText = resultMessage
            console.log(result.remaining)
        })
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