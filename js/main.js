document.getElementById('drawTwoCards').addEventListener('click', drawTwoCards)

let deck_id = ''

if (!localStorage.getItem('deck_id')) {

    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(result => {
            localStorage.setItem('deck_id', deck_id)
            console.log(deck_id)
        })
}

deck_id = localStorage.getItem('deck_id')

function drawTwoCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
        .then(res => res.json())
        .then(result => {
            document.getElementById('playerOneCard').src = result.cards[0].image
            document.getElementById('playerTwoCard').src = result.cards[1].image
            console.log(result.remaining)
        })
}
