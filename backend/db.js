const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/notesync";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected Successfully to the MongoDB");
    } catch (error) {
        console.log("Error connecting to the Database", error);
    }
};

module.exports = connectToDatabase;
