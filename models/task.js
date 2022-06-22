const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        default: 'Medium',
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'TODO',
        required: true,
        trim: true
    },
    startDate: {
         type: Date, 
         default: Date.now ,
         trim: true
    },
    endDate: {
        type: Date, 
        default: Date.now ,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)


module.exports = Task;