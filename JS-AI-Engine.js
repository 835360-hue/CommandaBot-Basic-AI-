// tokenizer code


console.log("1. Script has started running...");


const fs = require('fs');
const { askCommandaBot } = require('./knowledge.js');
const { generateText } = require('./Markov-Chain.js');

class JSAIEngine {
    constructor(dictFilePath) {
        this.vocab = {};
        this.inverseVocab = {};


        console.log("2. Loading dictionary file, please wait...");


        this.loadDictionary(dictFilePath);
        this.addPunctuationTokens();
        this.padId = this.vocab['<pad>'] !== undefined ? this.vocab['<pad>'] : 0;
        this.unkId = this.vocab['<unk>'] !== undefined ? this.vocab['<unk>'] : 1;
    }

    loadDictionary(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.split(/\r?\n/);

            lines.forEach((word, index) => {
                const cleanWord = word.trim();

                if (cleanWord.length > 0) {
                    this.vocab[cleanWord] = index;
                    this.inverseVocab[index] = cleanWord;
                }
            });


            console.log(`3. Successfully loaded ${Object.keys(this.vocab).length} tokens into memory!`);


        } catch (error) {


            console.error("ERROR loading dictionary file:", error.message);


        }
    }


    addPunctuationTokens() {
        const punctuationMarks = [',', '.', ':', ';', '-'];
        let nextId = Object.keys(this.vocab).length;

        punctuationMarks.forEach(mark => {
            if (this.vocab[mark] === undefined) {
                this.vocab[mark] = nextId;
                this.inverseVocab[nextId] = mark;
                nextId++;
            }
        });
    }


    encode(text) {
        const lowerText = text.toLowerCase().trim();
        const words = lowerText.match(/[a-z0-9<>]+|[,.:;\-]/g) || [];

        return words.map(word => {
            return this.vocab[word] !== undefined ? this.vocab[word] : this.unkId;
        });
    }

    decode(tokenIds) {
        const punctuationMarks = [',', '.', ':', ';', '-'];
        let result = '';

        tokenIds.forEach((id, index) => {
            const token = this.inverseVocab[id] !== undefined ? this.inverseVocab[id] : '<unk>';

            if (punctuationMarks.indexOf(token) !== -1) {
                result += token;
            } else if (index === 0) {
                result += token;
            } else {
                result += ' ' + token;
            }
        });

        return result;

    }

}










// execution test 


console.log("4. Initializing engine...");


const engine = new JSAIEngine('./words.txt');

const testInput = "<pad> <unk> The quick brown fox";
const encoded = engine.encode(testInput);
const decoded = engine.decode(encoded);


console.log("-----------------------------------------");
console.log("Original Text:", testInput);
console.log("Token IDs:", encoded);
console.log("Decoded Text:", decoded);
console.log("-----------------------------------------");
console.log("");
console.log("Hi, I'm CommandaBot! I am a command agent AI, that is also Generative! Would you like to generate a piece of text, or play a game with me?");










// continuation of the code giving the user different interaction options with CommandaBot, such a generating text, playing a game, or asking questions.

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function detectMode(text) {
    const gameKeywords = ['game', 'play', 'fight', 'battle', 'attack', 'defend', 'counter', 'command', 'gamemode'];
    const generateKeywords = ['generate', 'write', 'text', 'story', 'paragraph', 'sentence', 'create', 'make'];

    const lowerWords = text.toLowerCase().match(/[a-z]+/g) || [];

    let gameScore = 0;
    let generateScore = 0;

    lowerWords.forEach(word => {
        if (gameKeywords.indexOf(word) !== -1) {
            gameScore++;
        }
        if (generateKeywords.indexOf(word) !== -1) {
            generateScore++;
        }
    });

    if (gameScore === 0 && generateScore === 0) {
        return 'unclear';
    } else if (gameScore > generateScore) {
        return 'game';
        
    } else if (generateScore > gameScore) {
        return 'generate';

    } else {
        return 'tie';
    }
}










// commandabot gameode

class CommandaBotBrain {

    constructor() {
        this.playerResponse = [];

        this.responseProbabilities = {
            "Insert Command: Attack!": 100 / 3,
            "Insert Command: Defend!": 100 / 3,
            "Insert Command: Counter!": 100 / 3
        };

        this.aiCurrentChoice = "";

        this.commandabotattackSelection = false;
        this.commandabotdefendSelection = false;
        this.commandabotcounterSelection = false;
    }




    recordPlayerMove(move) {
        this.playerResponse.push(move);

        let totalMoves = this.playerResponse.length;

        let attackCount = 0;
        let defendCount = 0;
        let counterCount = 0;

        for (let i = 0; i < totalMoves; i++) {
            let moveCount = this.playerResponse[i];

            if (moveCount == "Insert Command: Attack!") {
                attackCount++;

            } else if (moveCount == "Insert Command: Defend!") {
                defendCount++;

            } else if (moveCount == "Insert Command: Counter!") {
                counterCount++;
            }

            if (totalMoves > 0) {
                this.responseProbabilities["Insert Command: Attack!"] = (attackCount / totalMoves) * 100;
                this.responseProbabilities["Insert Command: Defend!"] = (defendCount / totalMoves) * 100;
                this.responseProbabilities["Insert Command: Counter!"] = (counterCount / totalMoves) * 100;
            }

        }

    }




    aiSelectsRandomeMove() {
        this.commandabotattackSelection = false;
        this.commandabotdefendSelection = false;
        this.commandabotcounterSelection = false;

        let roll = Math.floor(Math.random() * 101);

        let attackLimit = this.responseProbabilities["Insert Command: Attack!"];
        let defendLimit = attackLimit + this.responseProbabilities["Insert Command: Defend!"];

        if (roll < attackLimit) {
            this.aiCurrentChoice = "Insert Command: Attack!";

            this.commandabotattackSelection = true;


            console.log("I have made my move, make yours!");


        }


        else if (roll >= attackLimit && roll < defendLimit) {
            this.aiCurrentChoice = "Insert Command: Defend!";

            this.commandabotdefendSelection = true;


            console.log("I have made my move, make yours!");


        }


        else {
            this.aiCurrentChoice = "Insert Command: Counter!";

            this.commandabotcounterSelection = true;


            console.log("I have made my move, make yours!");


        }

    }




    playTurn(playerChoice) {
        let playerCurrentChoice = playerChoice;


        console.log("You chose: " + playerCurrentChoice);


        let aiMove = this.aiCurrentChoice;


        console.log("CommandaBot reveals its move: " + aiMove);


        if (playerCurrentChoice == aiMove) {


            console.log("It's a tie! No one gains or loses.");


        }


        else if (playerCurrentChoice == "Insert Command: Attack!" && aiMove == "Insert Command: Defend!") {


            console.log("Player wins! Attack > Defend");


        }


        else if (playerCurrentChoice == "Insert Command: Attack!" && aiMove == "Insert Command: Counter!") {


            console.log("AI wins! Attack < Counter");


        }


        else if (playerCurrentChoice == "Insert Command: Defend!" && aiMove == "Insert Command: Counter!") {


            console.log("Player wins! Defend > Counter");


        }


        else if (playerCurrentChoice == "Insert Command: Defend!" && aiMove == "Insert Command: Attack!") {


            console.log("AI wins! Defend < Attack");


        }


        else if (playerCurrentChoice == "Insert Command: Counter!" && aiMove == "Insert Command: Attack!") {


            console.log("Player wins! Counter > Attack");


        }


        else if (playerCurrentChoice == "Insert Command: Counter!" && aiMove == "Insert Command: Defend!") {


            console.log("AI wins! Counter < Defend");


        }

    }

}




function detectNextAction(text) {
    const rematchKeywords = ['rematch', 'again', 'replay', 'more', 'continue', 'game', 'play'];
    const generateKeywords = ['generate', 'write', 'text', 'story', 'paragraph', 'sentence', 'create', 'make'];

    const lowerWords = text.toLowerCase().match(/[a-z]+/g) || [];

    let rematchScore = 0;
    let generateScore = 0;

    lowerWords.forEach(word => {
        if (rematchKeywords.indexOf(word) !== -1) {
            rematchScore++;
        }

        if (generateKeywords.indexOf(word) !== -1) {
            generateScore++;
        }

    });


    if (rematchScore === 0 && generateScore === 0) {
        return 'unclear';

    } else if (rematchScore > generateScore) {
        return 'rematch';

    } else if (generateScore > rematchScore) {
        return 'generate';

    } else {
        return 'tie';
    }
}




function startGameMode(rlInterface) {


    console.log("In this game, you will have 3 commands: 'attack', 'defend', and 'counter'.");
    console.log("The winning person will be decided by who has the superior command.");
    console.log("If both you and I use the same command it is a tie.");
    console.log("Attack > Defend.");
    console.log("Attack < Counter.");
    console.log("Counter < Defend.");
    console.log("Make sure you type your input in all lowercase, for example, if you wanted to do the command 'attack' you would spell it with all lowercase and just the name; this applies to every command.");


    let commandaBot = new CommandaBotBrain();


    function askNextAction() {
        rlInterface.question("Would you like a rematch, or would you like to use my generative mode? ", (typed) => {
            const nextAction = detectNextAction(typed);

            if (nextAction === 'rematch') {


                console.log("Alright, let's go again!");


                playRound();

            } else if (nextAction === 'generate') {


                console.log("Switching to Generative Mode...");


                rlInterface.question("Type a topic to generate a paragraph about (or leave blank to use everything I've learned so far), or ask me a question: ", async (query) => {
                    const lowerQuery = query.toLowerCase();

                    if (lowerQuery.includes('paragraph') || lowerQuery.includes('essay') || lowerQuery.trim() === '') {
                        const topic = lowerQuery.replace(/paragraph|essay|about|generate/g, '').trim();
                        const length = lowerQuery.includes('essay') ? 'essay' : 'paragraph';

                        const generated = await generateText(topic || null, length);
                        console.log("\n" + generated);

                    } else {
                        await askCommandaBot(query);
                    }

                    rlInterface.close();
                });

            } else if (nextAction === 'tie') {


                console.log("I couldn't tell which you meant - try saying 'rematch' or 'generate'.");


                askNextAction();

            } else {


                console.log("I'm not sure what you meant - try saying 'rematch' or 'generate'.");


                askNextAction();
            }

        });

    }




    function playRound() {
        rlInterface.question("Type your command: ", (typed) => {
            let submitted = typed.toLowerCase().trim();
            let playerMove = "";

            if (submitted == "attack") {
                playerMove = "Insert Command: Attack!";

            } else if (submitted == "defend") {
                playerMove = "Insert Command: Defend!";

            } else if (submitted == "counter") {
                playerMove = "Insert Command: Counter!";

            } else {


                console.log("Not a valid command. Type attack, defend, or counter.");


                playRound();
                return;
            }

            commandaBot.aiSelectsRandomeMove();
            commandaBot.playTurn(playerMove);
            commandaBot.recordPlayerMove(playerMove);

            askNextAction();
        });

    }

    playRound();
}




rl.question("> ", (answer) => {
    const mode = detectMode(answer);

    if (mode === 'game') {


        console.log("The user seems to have words similar to one of my modes.");
        console.log("Starting Game Mode...");


        startGameMode(rl);

    } else if (mode === 'generate') {


        console.log("The user seems to have words similar to one of my modes.");
        console.log("Starting Text Generation Mode...");


        rl.question("Type a topic to generate a paragraph about (or leave blank to use everything I've learned so far), or ask me a question: ", async (query) => {
            const lowerQuery = query.toLowerCase();

            if (lowerQuery.includes('paragraph') || lowerQuery.includes('essay') || lowerQuery.trim() === '') {
                const topic = lowerQuery.replace(/paragraph|essay|about|generate/g, '').trim();
                const length = lowerQuery.includes('essay') ? 'essay' : 'paragraph';

                const generated = await generateText(topic || null, length);
                console.log("\n" + generated);

            } else {
                await askCommandaBot(query);
            }

            rl.close();
        });

    } else if (mode === 'tie') {


        console.log("That could go either way for me - can you say a bit more, like 'let's play' or 'write me something'?");


        rl.close()

    } else {


        console.log("I'm not sure which mode you mean. Try mentioning 'game' or 'generate/write'.");


        rl.close()
    }

});