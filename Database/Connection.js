import mongoose from "mongoose";

export const isdatabase_connected =async ()=>{
    await mongoose.connect(process.env.DataBase
    , {
  dbName: "TodoData",
}).then(c => {
  console.log("Connection Made")
}).catch(e => {
  console.log("Connection failed" + e)
})
}