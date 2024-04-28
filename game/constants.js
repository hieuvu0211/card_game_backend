
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
        isChallengeable: false,
        moneyDelta: 1
    },

    foreign_aid: {
        name: "Viện Trợ",
        influence: "all",
        blockableBy: [CardNames.DUKE],
        isChallengeable: false,
        moneyDelta: 2
    },

    coup: {
        name: "Coup",
        influence: "all",
        blockableBy: [],
        isChallengeable: false,
        moneyDelta: -7
    },

    tax: {
        name: "Thu Thuế",
        influence: CardNames.DUKE,
        blockableBy: [],
        isChallengeable: true,
        moneyDelta: 3
    },

    assassinate: {
        name: "Ám Sát",
        influence: CardNames.ASSASIN,
        blockableBy: [CardNames.CONTESSA],
        isChallengeable: true,
        moneyDelta: -3
    },

    steal: {
        name: "Cướp",
        influence: CardNames.CAPTAIN,
        blockableBy: [CardNames.CAPTAIN, CardNames.AMBASSADOR],
        isChallengeable: true,
        moneyDelta: 2
    },

    exchange: {
        name: "Giả Danh",
        influence: CardNames.AMBASSADOR,
        blockableBy: [],
        isChallengeable: true,
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
export { CardNames, Actions, CounterActions }
// module.exports = {
//     CardNames: CardNames,
//     Actions: Actions,
//     CounterActions: CounterActions
// }