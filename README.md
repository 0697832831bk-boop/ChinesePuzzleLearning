# ChinesePuzzleLearning

ChinesePuzzleLearning is a web-based jigsaw puzzle platform for Chinese character learning. The project was developed as a Software Engineering bachelor's thesis prototype at Nanjing University of Science and Technology (NJUST). It combines Hanzi recognition with interactive puzzle reconstruction by letting learners select an HSK level, load Chinese character content from MongoDB, and rebuild each character through a browser-based 3 x 3 jigsaw activity supported by pronunciation, hints, and score-based feedback.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Browser APIs: HTML5 Drag and Drop API, Web Speech API

## Features

- User registration and login
- HSK level selection for HSK 1 to HSK 4
- Character loading from MongoDB
- Jigsaw puzzle generation on a fixed 3 x 3 grid
- Native drag-and-drop puzzle interaction
- Immediate placement feedback
- Hint overlay for difficult fragments
- Pronunciation support through the Web Speech API
- Score system:
  - `+10` for a correct placement
  - `-1` for an incorrect placement
  - `+20` completion bonus for a finished puzzle
- Optional background music during gameplay

## Prerequisites

Before running the project, make sure you have:

- Node.js
- npm
- MongoDB
  - either a local MongoDB instance
  - or a MongoDB connection string such as MongoDB Atlas

## Installation and Run

1. Clone the repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file from the example:

   ```bash
   copy .env.example .env
   ```

   Then edit `.env` with your own MongoDB connection string and secret.

4. Seed the character dataset:

   ```bash
   node backend/seed/seedCharacters.js
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   Or start it without nodemon:

   ```bash
   npm start
   ```

6. Open the application in your browser after the server starts.

## Environment Variables

The project expects a local `.env` file with the following values:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

## Project Structure

```text
ChinesePuzzleLearning/
|-- backend/
|   |-- middleware/
|   |-- models/
|   |   |-- Character.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- auth.js
|   |   `-- characters.js
|   |-- seed/
|   |   `-- seedCharacters.js
|   `-- server.js
|-- public/
|   |-- audio/
|   |-- css/
|   |-- js/
|   |-- assets/
|   |-- game.html
|   |-- jigsaw.html
|   |-- login.html
|   `-- register.html
|-- .env.example
|-- package.json
`-- README.md
```

## Main Workflow

1. Register a new account or log in with an existing one.
2. Choose an HSK level from HSK 1 to HSK 4.
3. Load the corresponding character set from MongoDB.
4. Open the puzzle page and reconstruct the active Hanzi.
5. Use pronunciation, hints, and score feedback while progressing through the character list.

## Known Limitations

- Persistent learner progress is not stored yet.
- Adaptive difficulty is not implemented.
- The current prototype was mainly tested in Google Chrome.
- Full JWT-based frontend request protection is not fully integrated into the current client flow.

## Repository Notes

- `node_modules/` is not part of the repository and should be installed locally with `npm install`.
- `.env` should stay local and must not be committed.
- The seed script is located at `backend/seed/seedCharacters.js`.

## License

This repository is provided as the final project codebase for the bachelor's thesis submission.
