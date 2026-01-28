const mongoose = require('mongoose');



const connectDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDb Connected :, ${conn.connection.host}`);
        console.log(`Database name :, ${conn.connection.name}`);
        
    }catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDb;