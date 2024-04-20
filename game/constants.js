//Khoi tao gia tri mac dinh ten cua la bai
const CardNames = {
    DUKE: "duke",
    ASSASIN: "assassin",
    CAPTAIN: "captain",
    CONTESSA: "contessa",
    AMBASSADOR: "ambassador",
    values: function () {
        return [this.DUKE, this.ASSASIN, this.CAPTAIN, this.CONTESSA, this.AMBASSADOR]
    }
};


//Action gom cac thuoc tinh co ban: 
// name(ten tieng viet)
// influences(nguoi su dung duoc hanh dong nay)
// blockableBy (bi chan boi)
// isChallengable(co the bi thu thach) 
// moneyDelta(tien cua hanh dong)
const Actions = {
    income: {
        name: "Thu Thập",
        influence: "all",
        blockableBy: [],
        isChallengable: false,
        moneyDelta: 1
    },

    foreign_aid: {
        name: "Viện Trợ",
        influence: "all",
        blockableBy: [CardNames.DUKE],
        isChallengable: false,
        moneyDelta: 2
    },

    coup: {
        name: "Coup",
        influence: "all",
        blockableBy: [],
        isChallengable: false,
        moneyDelta: -7
    },

    tax: {
        name: "Thu Thuế",
        influence: CardNames.DUKE,
        blockableBy: [],
        isChallengable: true,
        moneyDelta: 3
    },

    assassinate: {
        name: "Ám Sát",
        influence: CardNames.ASSASIN,
        blockableBy: [CardNames.CONTESSA],
        isChallengable: true,
        moneyDelta: -3
    },

    steal: {
        name: "Cướp",
        influence: CardNames.CAPTAIN,
        blockableBy: [CardNames.CAPTAIN, CardNames.AMBASSADOR],
        isChallengable: true,
        moneyDelta: 2
    },

    exchange: {
        name: "Giả Danh",
        influence: CardNames.AMBASSADOR,
        blockableBy: [],
        isChallengable: true,
        moneyDelta: 0
    }
};

const CounterActions = {
    block_forein_aid: {
        influence: [CardNames.DUKE]
    },
    block_assassinate: {
        influence: [CardNames.CONTESSA]
    },
    block_steal: {
        influence: [CardNames.CAPTAIN, CardNames.AMBASSADOR]
    }
}

module.exports = {
    CardNames: CardNames,
    Actions: Actions,
    CounterActions: CounterActions
}