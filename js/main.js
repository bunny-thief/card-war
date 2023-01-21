// document.getElementById('shuffleDeck').addEventListener('click')
let deck_id = ''

if (!localStorage.getItem('deck_id')) {

    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(result => {
            deck_id = result.deck_id
            localStorage.setItem('deck_id', deck_id)
            console.log(deck_id)
        })
}

console.log(deck_id)
console.log(deck_id)