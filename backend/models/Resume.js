const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  rawText:{
    type:String,
    required:true
  },
  normalizedText : {
    type:String,
    required:true
  },
  uploadedAt:{
    type:Date,
    default:date.now
  }
})

module.exports = mongoose.model('Resume',ResumeSchema);