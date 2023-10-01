import mongoose from 'mongoose';
const { Schema } = mongoose;

const notesSchema = new Schema({
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

const notes = mongoose.model('notes', userSchema);
module.exports = notes;