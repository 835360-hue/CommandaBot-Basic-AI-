// knowledge.js - CommandaBot's memory (search once, remember forever)

const fs = require('fs');

const knowledgeFilePath = './knowledge.json';


function loadKnowledge() {
    try {
        const data = fs.readFileSync(knowledgeFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}


function saveKnowledge(knowledge) {
    fs.writeFileSync(knowledgeFilePath, JSON.stringify(knowledge, null, 2), 'utf8');
}


function extractTopic(query) {
    let topic = query.toLowerCase().trim();
    topic = topic.replace(/^(what is|what's|what are|who is|who's|tell me about|define|explain)\s+/, '');
    topic = topic.replace(/\?+$/, '');
    topic = topic.trim();
    return topic;
}


async function searchTheWeb(query) {
    const topic = extractTopic(query);
    const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(topic);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'CommandaBot/1.0 (personal project; contact: none)'
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.extract && data.extract.length > 0) {
            return data.extract + "\n(Source: Wikipedia, " + data.content_urls.desktop.page + ")";
        } else {
            return null;
        }

    } catch (error) {
        console.error("Search failed:", error.message);
        return null;
    }
}



async function askCommandaBot(query) {
    const knowledge = loadKnowledge();
    const key = query.toLowerCase().trim();

    if (knowledge[key]) {
        console.log("I remember this!");
        console.log(knowledge[key]);
        return;
    }

    console.log("I don't know that yet - let me look it up...");
    const answer = await searchTheWeb(query);

    if (answer) {
        console.log(answer);

        knowledge[key] = answer;
        saveKnowledge(knowledge);

        console.log("(Learned and saved for next time!)");
    } else {
        console.log("I couldn't find an answer for that.");
    }
}


function buildMarkovChain(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const chain = {};

    for (let i = 0; i < words.length - 1; i++) {
        const current = words[i];
        const next = words[i + 1];

        if (!chain[current]) {
            chain[current] = [];
        }
        chain[current].push(next);
    }

    return { chain: chain, words: words };
}


function generateFromChain(chainData, wordCount) {
    const chain = chainData.chain;
    const words = chainData.words;

    if (words.length === 0) {
        return null;
    }

    let current = words[Math.floor(Math.random() * words.length)];
    let result = [current];

    for (let i = 0; i < wordCount - 1; i++) {
        const options = chain[current];

        if (!options || options.length === 0) {
            current = words[Math.floor(Math.random() * words.length)];
        } else {
            current = options[Math.floor(Math.random() * options.length)];
        }

        result.push(current);
    }

    return result.join(' ');
}


async function generateText(topic) {
    const knowledge = loadKnowledge();
    let corpus = Object.values(knowledge).join(' ');

    if (topic) {
        const fresh = await searchTheWeb(topic);
        if (fresh) {
            corpus += ' ' + fresh;
        }
    }

    if (corpus.trim().length === 0) {
        return "I don't know enough yet to generate text - ask me some questions first so I can learn!";
    }

    const chainData = buildMarkovChain(corpus);
    const generated = generateFromChain(chainData, 40);

    return generated || "I couldn't generate anything from what I know yet.";
}


module.exports = { askCommandaBot };