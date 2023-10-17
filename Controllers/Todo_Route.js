import Jwt from "jsonwebtoken";
import { login, msg } from "../Modals/Schema.js";


// Tododata showing urls
export const TodoData = async (req, res) => {
    // getting Token from cookies 
    const { token } = req.cookies;
    // getting user's Data base _id 
    const { _id } = Jwt.verify(token, process.env.SecretToken)
    // Getting User details 
    const user_detail = await login.findById({ _id })
    // Getting all the todos Added by user using his/her Email 
    const data = await msg.find({ Email: user_detail.Email });
    // rendering Todos Page 
    res.render('todos.ejs', { data: data });
}

// Update page url 
export const Update_page = async (req, res) => {
    // getting id from url params 
    const id = req.params.id;

    try {
        // getting todo to be updated 
        const entry = await msg.findById(id);
        if (!entry) {
            return res.status(404).send('Entry not found');
        }
        res.render('update.ejs', { entry: entry });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// Deleting Todo 
export const Delete_Data = async (req, res) => {
    // getting id from url params 
    const id = req.params.id;
    // deleting todo from Database 
    await msg.findByIdAndDelete(id);
    // Redirecting to Todos page 
    res.redirect('/todos')
}
export const Post_Data = async (req, res) => {
    // saving Todo using user Email 
    const { token } = req.cookies;
    // Getting id from cookies 
    const { _id } = await Jwt.verify(token, process.env.SecretToken);
    // Getting user details from id 
    const user_detail = await login.findById({ _id })

    // Adding data to Database 
    await msg.create({
        Heading: req.body.Topic,
        About: req.body.about,
        Email: user_detail.Email
    })
    // redirecting to Home page 
    res.render('Home.ejs',{Todo_added : "Todo Added Successfully!"});
}
// Updated data 
export const Update_Data = async (req, res) => {
    // Getting Input values 
    const { Topic, about } = req.body;
    // Getting id from url 
    const id = req.params.id;
    try {
        // Updating values in databse 
        await msg.findByIdAndUpdate(id, { Heading: Topic, About: about });
        // rediecting to Todos page 
        res.redirect('/todos');
    } catch (error) {
        // error handeling 
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}