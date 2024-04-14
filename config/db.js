const mongoose=require("mongoose")
const db_url=process.env.DB_URL

const connectWithDb=()=>{
mongoose.connect(db_url,{
    
}).then(console.log("DB Connected")).catch(err=>{
    
    console.log("DB connection failed")
    console.error(err);
})
}

module.exports=connectWithDb