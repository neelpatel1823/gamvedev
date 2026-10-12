# Team & Game Management Portal (gamvedev)

A full-stack web application built with **HTML, CSS, JavaScript**, **Node.js (Express)**, and **MySQL** to create, view, edit, and delete teams and games.

---

## Features

### Frontend (`frontend/`)
- **Home Page (`index.html`)**: Overview dashboard with live counts and quick navigation sections for Team Management and Game Management.
- **Teams Directory (`teams.html`)**: View all registered teams, budget allocations, edit team details, or delete a team.
- **Create Team (`create-team.html`)**: Form to create a new team with team name, team budget, and team description.
- **Edit Team (`edit-team.html`)**: Form to update an existing team's name, budget, and description.
- **Games Catalog (`games.html`)**: View all games, prices, genres, platforms, edit game details, or delete a game.
- **Create Game (`create-game.html`)**: Form to create a new game with game name, price, genre, platform, and description.
- **Edit Game (`edit-game.html`)**: Form to update an existing game's details.

### Backend (`backend/`)
- Built with **Node.js**, **Express**, and **mysql2/promise**.
- Automatically initializes the `team_game_db` MySQL database and creates the `teams` and `games` tables on startup.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/teams` | Get all teams |
| `GET` | `/api/teams/:id` | Get a single team by ID |
| `POST` | `/api/teams` | Create a new team |
| `PUT` | `/api/teams/:id` | Edit an existing team |
| `DELETE` | `/api/teams/:id` | Delete a team |
| `GET` | `/api/games` | Get all games |
| `GET` | `/api/games/:id` | Get a single game by ID |
| `POST` | `/api/games` | Create a new game |
| `PUT` | `/api/games/:id` | Edit an existing game |
| `DELETE` | `/api/games/:id` | Delete a game |

---

## Setup & Installation

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MySQL Server** running on `localhost:3306`

### 2. Configure Environment Variables
Copy `backend/.env.example` to `backend/.env` and update your MySQL credentials if needed:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=team_game_db
```

### 3. Install Dependencies & Start Server

```bash
cd backend
npm install
npm start
```

### 4. Open in Browser
Navigate to:
```
http://localhost:5000
```
