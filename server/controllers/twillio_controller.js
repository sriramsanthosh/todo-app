const Task = require('../models/task');
const cron = require("node-cron");
const shell = require("shelljs");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);



module.exports.make_a_call = async (req, res) => {
    try {

        let callData = [];

        let today = new Date();
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        let formattedYesterday = yesterday.toISOString().split('T')[0];
        const TaskDataArray = await Task.find({ status: { $ne: "DONE" }, due_date: formattedYesterday }).populate("user_id");

        res.status(200).json({
            TaskDataArray: TaskDataArray
        });

        for (let i = 0; i < TaskDataArray.length; i++) {
            const currTask = TaskDataArray[i];
            console.log(currTask);
            let message = `Greetings from Sriram's Todo App!! 
                            We remind you that your task with title ${currTask.title} provided description as ${currTask.description} is going to be due yesterday! 
                            If the task was over, please update the same in your dashboard! 
                            Feel free to update your task's deadlines! 
                            Thank you!`

            await client.calls.create({
                twiml: `<Response><Say>${message}</Say></Response>`,
                to: `+91${currTask.user_id.phone}`,
                from: process.env.MY_TWILIO_PHONE_NUMBER
            }).then(call => console.log(call.sid));
        }





    }
    catch (err) {
        console.error(`Error ${err} in calling by twilio`);
    }
}