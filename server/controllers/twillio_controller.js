const Task = require('../models/task');

const cron = require("node-cron");
const shell = require("shelljs");

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);


const getCallStatus = async (callSid) => {
    try {
        const call = await client.calls(callSid).fetch();
        console.log("Call Status:", call.status);
        return call.status;
    } catch (error) {
        console.error("Error fetching call status:", error);
        throw error;
    }
};

// Function to continuously monitor call status until completed
const monitorCallStatus = async (callSid) => {
    let status = await getCallStatus(callSid);
    while (status !== 'completed' && status !== 'no-answer' && status!=="busy") {
        // Wait for 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
        status = await getCallStatus(callSid);
    }
    console.log("Call completed!");
};


module.exports.make_a_call = async (req, res) => {
    try {
        let TaskDataArray = [];
        await cron.schedule("59 59 23 * * *", await async function () {

            let today = new Date();
            let yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            let formattedYesterday = yesterday.toISOString().split('T')[0];
            TaskDataArray = await Task.find({ status: { $ne: "DONE" }, due_date: formattedYesterday }).populate("user_id");
            res.status(200).json({
                TaskDataArray: TaskDataArray
            });
            for (let i = 0; i < TaskDataArray.length; i++) {
                const currTask = TaskDataArray[i];
                let message = `Greetings from, Sriram's Todo App!! We remind you that, your task with title, ${currTask.title}, with description as, ${currTask.description}, is due yesterday. If the task was over, please update the same, in your dashboard! Feel free, to update the task deadlines! Thank you! Have a nice day`
                const response = new VoiceResponse();
                response.say(message);
                await client.calls.create({
                    twiml: response.toString(),
                    to: `+91${currTask.user_id.phone}`,
                    from: process.env.MY_TWILIO_PHONE_NUMBER
                }).then(async (call) => {
                    console.log(call.sid);
                    await monitorCallStatus(call.sid);
                });
            }
        });
        
    }
    catch (err) {
        console.error(`Error ${err} in calling by twilio`);
    }
}