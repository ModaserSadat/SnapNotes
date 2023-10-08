const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
    user: {
        //This is like foreign key to the User Document. this property stores the id of the user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    tag:{
        type: String,
        default: 'General'
    },
  date: { 
    type: Date, 
    default: Date.now 
}
});

const notes = mongoose.model('notes', notesSchema);
module.exports = notes;