
import { CardNames } from "./constants.js";

const buildDeck = () => {
    //create deck
    let deck = [];
    let cardNames = CardNames.values();
    //add card
    for (let card of cardNames) {
        addToDeck(card, deck)
    }

    //sort card random
    deck = deck
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return deck;
}

function addToDeck(card, deck) {
    if (!card || !deck) {
        console.log("Card or Deck must not be undefined");
        return;
    }
    for (let i = 0; i < 3; i++) {
        deck.push(card)
    }
}

const shuffleArray = (array) => {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

//build 1 dictionary giua ten nguoi choi va socketID
const buildName_Socket_Map = (players) => {
    let map = {}
    players.map((x) => {
        map[x.name] = x.socketID
    })
    return map;
}

//build 1 dictionary giua ten nguoi choi va index cua ho
const buildName_ID_Map = (players) => {
    let map = {}
    players.map((x, index) => {
        map[x.name] = index
    })
    return map;
}

const buildPlayers = (players) => {
    const colors = ["#73C373", "#CF3131", "#31CFC8", "#2B55B6", "#AE2BB6", "#D8DB26"]
    //suffle ngau nhien
    shuffleArray(colors);

    players.forEach(x => {
        x.money = 2; //tien khoi dau
        x.influences = []; //vai tro khoi dau
        x.isDead = false; //trang thai
        x.color = colors.pop();
        delete x.isReady;
    });
    return players;
}

const exportPlayers = (players) => {
    players.forEach(x => {
        delete x.socketID;
    });
    return players;
}

export {
    buildDeck,
    buildName_ID_Map,
    buildName_Socket_Map,
    buildPlayers,
    shuffleArray,
    exportPlayers
}