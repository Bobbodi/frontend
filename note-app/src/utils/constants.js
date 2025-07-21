import { BiWater } from "react-icons/bi"

export const BASE_URL = 'http://localhost:8000'

export const EMOJIS = { //need to update the mood to use .name 
    '🥰': {name: 'lovey-dovey', score: 2}, //mood score based on how likely it will boost productivity. Closer to 10 = more productive
    '😏': {name: 'smirk', score: 2}, 
    '🤣': {name: 'LOL', score: 3},
    '🤬': {name: "F***", score: 4}, 
    //'🤪': {name: 'crazy', score: 3},
    '🤓': {name: 'SMURF', score: 1},
    '🖕': {name: 'Not this again', score: 4},
    '😒': {name: "I'm too good for this", score: 4},
    '🤮': {name: "BLERGH", score: 4},
    '😭': {name: "WHY SAD", score: 4},
    //'👽': {name: "Elite", score: 1},
    '💀': {name: "Ded", score: 3},
    //'😖': {name: "Cutie", score: 4},
    '😋': {name: "Hungry", score: 2},
    '🍜': {name: "FOOOOOD", score: 2},
}

export const ROOM_DESC = { 
    1: {
        name: "ONCE IN A BLUE MOON",
        hp: 50,
        speciality: "Long time no see you studying"
    }, 
    2: {
        name: "TOO LIGHT TO SEE",
        hp: 30,
        speciality: "This is you studying in heaven"
    },
    3: {
        name: "IS THIS DEJA VU?",
        hp: 100,
        speciality: "Wow, I'm finally remembering things"
    }, 
    4: {
        name: "HEY, IT'S ME AGAIN",
        hp: 80,
        speciality: "I've seen this question before"
    }, 
    5: {
        name: "HORIZONTAL GIFTED",
        hp: 30,
        speciality: "I need to eat to study. Really."
    },
    6: {
        name: "HOLIDAY TO JAPAN",
        hp: 70,
        speciality: "Think about all the fun times we will have"
    },
    7: {
        name: "WHO BLOCKED ME?",
        hp: 60,
        speciality: "I'm really going to focus this time"
    },

}

export const AVATAR_DESC = { 
    1: {
        name: "BEE BEE",
        hp: 25,
        speciality: "Swollen heads make you smarter"
    }, 
    2:  { 
        name: "GLASS OF WATER", 
        hp: 35,
        speciality: "Unlimited toilet breaks to squat or..."
    }, 
    3: { 
        name: "HALF FURRY",
        hp: 50, 
        speciality: "Comfort zone? The world is your oyster"
    }, 
    4: { 
        name: "YEEHAW", 
        hp: 40, 
        speciality: "Fresh, free milk. Good for your heart."
    }, 
    5: { 
        name: "STEVE WHO?", 
        hp: 50,
        speciality: "Me and you and you and your friend Steve"
    }, 
    6: { 
        name: "LOOK AWAY",
        hp: 100, 
        speciality: "Sky's the limit when I am you"
    }, 
    7: { 
        name: "PIGGY SAURUS", 
        hp: 50,
        speciality: "Stability on flat airplane runways"
    }, 
    8: { 
        name: "GORGEOUS", 
        hp: 100, 
        speciality: "Beautiful people are always busy"
    }, 
    9: { 
        name: "JAWS 4", 
        hp: 40, 
        speciality: "What's there not to like for a big jaw?"
    }, 
    10: { 
        name: "I'M NOT CREEPY", 
        hp: 60, 
        speciality: "Secret hobbies? Who's up to try them?"
    }
}