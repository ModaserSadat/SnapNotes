const express = require('express')
// Creates an instance of an Express router.
const router = express.Router()
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator');

//Route 1: Fetch All Notes for Logged-in User (GET /api/notes/fetchallnotes): Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured;")
  }

})

//Route 2: Add a Note to the DB Using: Post /api/notes/addnote --> Log in required
router.post('/addnote', fetchuser,
  [
    body('title').isLength({ min: 2 }).withMessage('Title should be at least 2 chars'),
    body('description').isLength({ min: 3 }).withMessage('Description should be at least 3 characters'),
  ],
  async (req, res) => {
    const result = validationResult(req);

    //if there are errors return bad request and errors
    if (!result.isEmpty()) {
      return res.status(400).res.json({ errors: result.array() });
    }

    // If request body is valid, save the note to the database
    try {
      const { title, description, tag } = req.body;
      // Creating a new instance of the Note model. Returns the newly created note object
      const note = new Note({ title, description, tag, user: req.user.id })
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured;")
    }
  })

//Route 3: Update an existing note Using: PUT "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  // Create a newNote object
  const newNote = {};
  if (title) { newNote.title = title };
  if (description) { newNote.description = description };
  if (tag) { newNote.tag = tag };
  try {
    //Find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Found")
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Authorized")
    }
    // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

//Route 4: Delete an existing note Using: DELETE "/api/notes/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {

    //Find the note to be deleted
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Found")
    }

    //Allow deletion only if user this owns this Note
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Authorized")
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted" })
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }



})

module.exports = router