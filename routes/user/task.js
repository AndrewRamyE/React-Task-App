var express = require('express');
const auth = require('../../middeleware/auth');
var router = express.Router();
const Task = require('../../models/task');


  router.get('/',auth,async (req,res)=>{
    Task.find({ owner: req.user._id }).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
  });
  router.post('/create',auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    task.save().then(() => {
        res.send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
  });
  router.get('/update/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
  });
  router.patch('/edit/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);

    const allowedUpdates = ['description', 'title','priority','status','startDate','endDate'];
    const isVallid = updates.every(updates => {
        return allowedUpdates.includes(update => {
            if (!isVallid) {
                return res.status(400).send({ error: 'invalid updates' })
            }
        })
    })
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
  });
  router.delete('/delete/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
  })

module.exports = router;