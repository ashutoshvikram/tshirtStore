const app=require("./app");
const connectWithDb = require("./config/db");
const cloudinary = require("cloudinary").v2;

connectWithDb()
cloudinary.config({ 
    cloud_name: 'dyy5lwaql', 
    api_key: '134597454384275', 
    api_secret: 'VBtzVzZwRuLB03MDCDlzGP31Lq8'
  })

app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is running at PORT: ${process.env.PORT}`);
})
