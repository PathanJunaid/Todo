
# Todolist App

A simple Todo List application built with Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Routes](#routes)
- [License](#license)
- [Author](#author)

## Features

- User authentication with JWT
- Add, edit, and delete Todo items
- ...

## Installation

1. Clone the repository:

```bash
git clone https://github.com/PathanJunaid/Todo.git
```

2. Install dependencies:

```bash
cd Todo
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following:

```
DB_URI=YOUR_MONGODB_URI
SECRET_KEY=YOUR_SECRET_KEY
port = 3000
```

## Usage

To start the server, run:

```bash
npm start
```

The app will be available at `http://localhost:PORT`.

## Dependencies

- bcrypt
- body-parser
- cookie-parser
- cors
- dotenv
- ejs
- express
- jsonwebtoken
- mongodb
- mongoose
- node
- nodemon

## Routes

### User Routes

- `GET /login` - Show login page
- `GET /register` - Show registration page
- `GET /logout` - Logout the user
- `POST /register` - Process registration form
- `POST /login` - Process login form

### Todo Routes

- `GET /` - Show home page
- `GET /todos` - Get all Todos
- `GET /edit/:id` - Show edit page for a specific Todo
- `POST /` - Add a new Todo
- `GET /delete/:id` - Delete a Todo
- `POST /edit/:id` - Update a Todo

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

- [Junaid Khan](https://github.com/PathanJunaid)
```
