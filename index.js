class commanderDeck {
    constructor (commander){
        this.commander = commander;
    };

};


class Card{
    constructor(name){
        this.name = name;
    };
};


$('#addCommander').on('click',() => {
    DOMBuilder.createDeck($('#newCommander').val());
    $('#newCommander').val('');
});


class DeckService {
    static url = 'https://659e21df47ae28b0bd3537b7.mockapi.io/api/ppg1/CommanderDecks';

    static getAllDecks () {
        return $.get(this.url);
    };

    static getDeck(id) {
        $.get(`${this.url}/${id}`);
    };

    static createDeck(commanderDeck) {
        return $.post(this.url, commanderDeck)
    };

    static updateDeckWIN (commanderDeck,result,count){
        return $.ajax({
            url: `${this.url}/${commanderDeck.id}`,
            dataType: 'json',
            type: 'PUT',
            data: {
                "wincount": count,
                "lastresult": result,
              }
        });

    };


    static updateDeckLOST (commanderDeck,result){
        return $.ajax({
            url: `${this.url}/${commanderDeck.id}`,
            dataType: 'json',
            type: 'PUT',
            data: {
                "lastresult": result,
              }
        });
    };

    static deleteDeck(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: 'DELETE'
        });
    };

};



class DOMBuilder {
    static commanderDecks;


    static getAllDecks() {
        DeckService.getAllDecks()
        .then(commanderDecks => this.renderDecks(commanderDecks));
    };


    static renderDecks(commanderDecks) {
        this.commanderDecks = commanderDecks;
        $('#deckBody').empty();

        for (let deck of commanderDecks) {
            $('#deckBody').prepend(
               `<div id="${deck.id}" class="card">
                    <div class="card-header">
                        <h2>${deck.commander}</h2>
                        <button class="btn btn-danger" onclick="DOMBuilder.deleteDeck('${deck.id}')">Delete Deck</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="input-group-text">
                                <form>
                                    <h4>Select the Result of the last Game:</h4>
                                    <input type="radio" id="${deck.id}-win" name="decide" value="true">
                                    <label for="${deck.id}-win">Victory</label><br>
                                    <input type="radio" id="${deck.id}-lost" name="decide" value="false">
                                    <label for="${deck.id}-lost">Defeat</label><br>
                                </form>
                                </div>
                                <button id="${deck.id}-result" onclick="DOMBuilder.updateResults('${deck.id}')" class="btn btn-dark">Update Deck</button>
                            </div>
                        </div>
                        <div class="card-bottom">
                            <div class="col-sm card-bottom">
                                <h4 class="card-bottom">Number of Wins:</h4>
                                <div id="${deck.id}-wincount" class="col-sm card-bottom"></div>
                            </div>
                            <div class="col-sm card-bottom">
                                <h4 class="card-bottom">Last Result:</h4>
                            <div id="${deck.id}-Lastresult" class="col-sm card-bottom">-</div>
                        </div>
                    </div>
                </div>
                <br>`
                
            );
            let count = deck.wincount;
            let result = deck.lastresult;

            let wincount = document.getElementById(`${deck.id}-wincount`);
            let status = document.getElementById(`${deck.id}-Lastresult`);
            wincount.innerText =`${count}`;

            if (result === 'true'){
                status.innerText =`✨Victory✨`;
            } else {
                status.innerText = `☠Defeat☠`;
            };
        };
    };


    static deleteDeck(id) {
        DeckService.deleteDeck(id)
            .then(() => {
                return DeckService.getAllDecks();
            })
            .then((commanderDecks) => this.renderDecks(commanderDecks));
    };


    static createDeck(commander){
        DeckService.createDeck(new commanderDeck(commander))
        .then(() => {
            return DeckService.getAllDecks();
        })
        .then((commanderDecks) => this.renderDecks(commanderDecks));
    };


    static updateResults(id) {
        for (let deck of this.commanderDecks) {
            if (deck.id == id) {
                let count = deck.wincount;
                let result = deck.lastresult;

                if(document.getElementById(`${deck.id}-win`).checked == true) {
                    result = 'true';
                    count ++;
                    DeckService.updateDeckWIN(deck,result,count)
                        .then(() => {
                            return DeckService.getAllDecks();
                        })
                        .then((commanderDecks) => this.renderDecks(commanderDecks))
                } else {
                    result = 'false';
                    DeckService.updateDeckLOST(deck,result)
                        .then(() => {
                            return DeckService.getAllDecks();
                        })
                        .then((commanderDecks) => this.renderDecks(commanderDecks))
                };
            };
        };
    };


    static deleteCard(deckID, cardID) {
        for (let deck of this.commanderDecks) {
            if (deck.id == deckID) {
                for (let card of deck.cards) {
                    if (card.id == cardID) {
                        deck.cards.splice(deck.cards.indexof(card),1);
                        DeckService.updateDeck(deck)
                        .then(() => {
                            return DeckService.getAllDecks();
                        })
                        .then((commanderDecks) => this.renderDecks(commanderDecks));
                    };
                };
            };
        };
    };
};

DOMBuilder.getAllDecks();



