import Express from "express";
import { authentication } from "../Middlewares/user_modules.js";
import Jwt from "jsonwebtoken";
import { login, msg } from "../Modals/Schema.js";
import { Delete_Data, Post_Data, TodoData, Update_Data, Update_page } from "../Controllers/Todo_Route.js";

const Todos_Routes = Express.Router();

Todos_Routes.get('/', authentication, (req, res) => {
    res.render('Home');
})

// Tododata showing url
Todos_Routes.get('/todos', authentication, TodoData);
// Update page url 
Todos_Routes.get('/edit/:id', Update_page);

// Adding Todo Data to database 
Todos_Routes.post('/', Post_Data);

// Deleting Todo DATA 
Todos_Routes.get('/delete/:id', Delete_Data)

// Updating Values in databse
Todos_Routes.post('/edit/:id', Update_Data);


export default Todos_Routes;