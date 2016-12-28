log = function(toLog) {
    console.log(toLog);
};

checkCount = function(toCheck, toRun) {
    if (toCheck.count() == 1) {
        (function(){
            toRun;
        });
    } else {
        log("error: unexpected count to update.")
    };
}

//CODE GRAVEYARD
// currentFC = $('#clock').fullCalendar('getDate').stripTime();
//
// const currentFCDate = $('#clock').fullCalendar('getDate').stripTime();
//
// const dbRecordsSettings = Records.find({settings: {$exists:true}});
// // log("db records with Settings: "+dbRecordsSettings.count());
// let settings = {currentDate:[]};
// dbRecordsSettings.forEach(function(dbRecord) {
//     settings = dbRecord.settings;
// });
// if(currentFCDate.format() !== settings.currentDate){
//     Records.update("7T8CYnHwEmJBzChvK", {
//         settings: {currentDate: currentFCDate.format(), currentYear: currentFCDate.year(), currentMonth: currentFCDate.month(), currentWeek: currentFCDate.week(), currentDay: currentFCDate.day()},
//     });
// }
//
// //!! THIS NEEDS TO BE FIXED. IT IS FIRING EVEN IF THERE IS ONE MONTHLY RECORD WITH THE CURRENT DATE
// let currentMonthlyRecord = Records.find({type: 'monthly-record', date: currentFCDate.format('MM YYYY')});
// if(!currentMonthlyRecord.count()){
//     log("inserting monthly record");
//     Records.insert({type:'monthly-record', date: currentFCDate.format('MM YYYY'), categories: {}})
// }

// let currentMonthRecord = Records.find({date:currentFC.format("MM YYYY")});
// let updatedCategories = { $set: {} };
// updatedCategories.$set[effectingName] += cardAmount;
// checkCount(currentMonthRecord,
//     currentMonthRecord.forEach(function(month) {
//         Records.update(month._id, updatedCategories);
//     })
// );