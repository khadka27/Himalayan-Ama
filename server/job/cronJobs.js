const User = require("../model/Users.js");
const jwt = require("jsonwebtoken")
const Attendance = require("../model/Attendances.js");
const LeaveRequest = require("../model/LeaveRequests");

const { clockReminderMail, autoClockOutMail, autoRemoteEntries } = require("../util/mailTemplate.js")

const moment = require("moment-timezone");
const cron = require("node-cron");

const { sendAdminMessage, sendBroadcastMessage } = require("../util/googleChat.js");
const { dateFormatter } = require("../util/time");
const LeaveRequests = require("../model/LeaveRequests");

const FRONTEND = process.env.NODE_ENV === "production" ? process.env.FRONT_END_HOSTED : process.env.FRONT_END_LOCAL;
// DONE: Time doesn't align, as cron job uses sever time not nepal time

// DONE: Auto register as absent at 4 pm each day
cron.schedule('01 16 * * 0,1,2,3,4,5', async () => {
    try {
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date });
        const users = await User.find();

        if (attendances.length == 0) {
            // Holiday
            return;
        }

        const attendedUserIds = attendances.map(a => a.user.toString());

        for (const user of users) {
            // If user._id is not in attendedUsers
            if (!attendedUserIds.includes(user._id.toString())) {
                // Mark as absent
                await Attendance.create({
                    user: user._id,
                    date,
                    status: "Absent",
                });
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
})

// DONE: Send automated mail for clock in reminder
cron.schedule('55 10 * * 0,1,2,3,4,5', async () => {
    try {
        return;
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date });
        const users = await User.find();

        if (attendances.length == 0) {
            // Holiday
            return;
        }

        const attendedUserIds = attendances.map(a => a.user.toString());

        for (const user of users) {
            // If user._id is not in attendedUsers
            if (!attendedUserIds.includes(user._id.toString())) {
                // Send mail for remainder
                await clockReminderMail("clockIn", user.email, user.name);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});

// DONE: Send automated mail for clock out reminder
// DONE: Test
cron.schedule('40 17 * * 0,1,2,3,4,5', async () => {
    try {
        return;
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date }).populate("user", "email name");

        if (attendances.length == 0) {
            // Holiday
            return;
        }

        for (const attendance of attendances) {
            if (attendance.clockInTime && !attendance.clockOutTime) {
                // Send mail for remainder
                await clockReminderMail("clockOut", attendance.user.email, attendance.user.name);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
},
    {
        timezone: "Asia/Kathmandu"
    });

// DONE: Automate clock out at 9 pm if user forgets to clock out
// DONE: Test
cron.schedule('01 21 * * 0,1,2,3,4,5', async () => {
    try {
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date }).populate("user", "email name");

        if (attendances.length == 0) {
            // Holiday
            return;
        }

        for (const attendance of attendances) {
            if (attendance.clockInTime && !attendance.clockOutTime) {
                const clockInStr = `${moment(attendance.date).format("YYYY-MM-DD")} ${attendance.clockInTime}`;
                const clockIn = moment.tz(clockInStr, "YYYY-MM-DD HH:mm:ss", "Asia/Kathmandu");

                if (!clockIn.isValid()) {
                    console.error("Invalid clockIn:", clockInStr);
                    continue;
                }

                const autoClockOut = clockIn.clone().hour(17).minute(0).second(0).millisecond(0);
                const diffInMinutes = autoClockOut.diff(clockIn, "minutes");
                const hoursWorked = Math.round((diffInMinutes / 60) * 100) / 100;

                attendance.hoursWorked = hoursWorked;
                attendance.clockOutTime = autoClockOut.format("HH:mm:ss");
                await attendance.save();
                await autoClockOutMail(attendance.user.email, attendance.user.name);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});

// DONE: Automate for carry over of balance point
// DONE: Test this
cron.schedule('01 01 * * *', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (tomorrow.getDate() !== 1) return;

    try {
        const users = await User.find();
        for (const user of users) {
            user.leaveBalance.casual += 1;
            user.leaveBalance.sick += 1;
            user.leaveBalance.period = 1;
            await user.save();
        }
    } catch (err) {
        console.log(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});

// DONE: Automate to udpate working hours every 10 min
cron.schedule('*/5 11-18 * * 0,1,2,3,4,5', async () => {
    try {
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date }).populate("user", "email name");

        if (attendances.length == 0) {
            // Holiday
            return;
        }

        for (const attendance of attendances) {
            if (attendance.clockInTime && !attendance.clockOutTime) {
                const clockInStr = `${moment(attendance.date).format("YYYY-MM-DD")} ${attendance.clockInTime}`;
                const clockIn = moment.tz(clockInStr, "YYYY-MM-DD HH:mm:ss", "Asia/Kathmandu");

                if (!clockIn.isValid()) {
                    console.error("Invalid clockIn:", clockInStr);
                    continue;
                }

                const diffInMinutes = now.diff(clockIn, "minutes");
                const hoursWorked = Math.round((diffInMinutes / 60) * 100) / 100;

                attendance.hoursWorked = hoursWorked;
                await attendance.save();
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});

// DONE: Update cron to send clock in mail to work from home users.
// DONE: Test this
cron.schedule('01 10 * * 0,1,2,3,4,5', async () => {
    try {
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date, status: "Remote", isRemoteAccepted: true }).populate("user", "_id email name");

        if (attendances.length == 0) {
            // Holiday
            return;
        }

        for (const attendance of attendances) {
            if (!attendance.clockInTime && !attendance.clockOutTime) {
                // create jwt for the user which expires in 4 hours for security reasons
                const token = jwt.sign(
                    {
                        id: attendance.user._id,
                    },
                    process.env.JWT_SECRET_REMOTE,
                    {
                        expiresIn: "4h",
                    }
                );
                const link = `${FRONTEND}/remote?user=${token}`
                // send mail for remote clock in
                await autoRemoteEntries(attendance.user.email, attendance.user.name, link, "clockIn");
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});

// DONE: Update cron to send clock out mail to work from home users.
// DONE: Test this
cron.schedule('01 17 * * 0,1,2,3,4,5', async () => {
    try {
        const now = moment().tz("Asia/Kathmandu");
        const date = now.format("YYYY-MM-DD");

        const attendances = await Attendance.find({ date, status: "Remote", isRemoteAccepted: true }).populate("user", "_id email name");
        if (attendances.length == 0) {
            // Holiday
            return;
        }

        for (const attendance of attendances) {
            if (attendance.clockInTime && !attendance.clockOutTime) {
                const token = jwt.sign(
                    {
                        id: attendance.user._id,
                    },
                    process.env.JWT_SECRET_REMOTE,
                    {
                        expiresIn: "4h",
                    }
                );
                const link = `${FRONTEND}/remote?user=${token}`
                // send mail for remote clock out
                await autoRemoteEntries(attendance.user.email, attendance.user.name, link, "clockOut");
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});


// DONE: Auomate rejecting remote access that has passsed the 10 AM for the day
cron.schedule('01 10 * * 0,1,2,3,4,5', async () => {
    try {
        const attendances = await Attendance.find({ status: "Remote", isRemoteAccepted: false }).populate("user", "name");

        for (const attendance of attendances) {
            await Attendance.findByIdAndDelete(attendance._id);
            // TODO: Mail if needed
            await sendBroadcastMessage(`Auto rejected remote access for ${attendance.user.name}. This is an automated message.`);
        }

    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});

// TEST: Auomate rejecting leave that has passsed the date
cron.schedule('* 13 * * 0,1,2,3,4,5', async () => {
    try {
        const todayStart = moment()
            .tz("Asia/Kathmandu")
            .startOf("day")
            .toDate();

        const leaveRequests = await LeaveRequests.find({
            toDate: { $lt: todayStart },
            status: "Pending"
        });

        for (const leaveRequest of leaveRequests) {
            // finding the leave requestor
            const leaveRequester = await User.findById(leaveRequest.user);
            if (!leaveRequester) return;

            leaveRequest.status = "Rejected";

            // return leave points
            const returnedPoint = !leaveRequest.isHalfDay ? leaveRequest.daysRequested : 0.5;
            leaveRequester.leaveBalance[leaveRequest.leaveType.toLowerCase()] += returnedPoint;

            await leaveRequest.save();
            await leaveRequester.save();
            // TODO: Send mail if needed
            await sendBroadcastMessage(`Auto rejected leave for ${leaveRequester.name} for ${dateFormatter(leaveRequest.fromDate)}. This is an automated message.`);
        }
    } catch (err) {
        console.error(err.message);
    }
}, {
    timezone: "Asia/Kathmandu"
});


// Random requirement, to be run only once
// cron.schedule('* 10 * * *', async () => {
//     try {
//         const todayStart = moment()
//             .tz("Asia/Kathmandu")
//             .startOf("day")
//             .toDate();

//         const user = await User.findById("6932bcc5e379f3b7d9786cbf");

//         user.leaveBalance.casual = 4.5;
//         await user.save();

//         console.log("Task done");

//     } catch (err) {
//         console.error(err.message);
//     }
// }, {
//     timezone: "Asia/Kathmandu"
// });