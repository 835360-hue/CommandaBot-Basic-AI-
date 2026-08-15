# CommandaBot

CommandaBot is a small AI-style program built in JavaScript.


It's not real AI - it's a rule-based system, not a trained model.


It uses a tokenizer and Wikipedia's API to look things up.


It can play a simple game, answer questions, and remember what it learns.

---

## ⚠️ Warnings

- Limited abilities - don't expect real conversation or reasoning.


- Only understands game commands and short, topic-style questions.


- Narrow or very specific questions often won't find a match.


- `knowledge.json` permanently saves everything it searches, so it'll grow over time.

---

## What each file does

- **`JS-AI-Engine.js`** - the main file. Run this one to start CommandaBot.


- **`knowledge.js`** - handles memory and searching Wikipedia for answers.


- **`knowledge.json`** - saved data, not code. Created automatically as it learns.


- **`words.txt`** - the word list the tokenizer uses to read text.

---

## Recommended setup to run it

- **Runtime:** Node.js, version 18 or newer (needed for the built-in `fetch`).


- **Editor:** Visual Studio Code, though any text editor and terminal will work.


- Run it by opening a terminal in the project folder and typing:
  ```
  node JS-AI-Engine.js
  ```
