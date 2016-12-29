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

//////////////// CODE GRAVEYARD ////////////////
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
//

/////////////// CODE TIDBITS ////////////////

// input.createdAt.toLocaleDateString('en-US', {month: "2-digit", day: "2-digit", year: "2-digit"}),

// var start = new Date(2010, 11, 1);
// var end = new Date(2010, 11, 30);
//
// db.posts.find({created_on: {$gte: start, $lt: end}});

// db.people.update(
//     { name: "Andy" },
//     {
//         name: "Andy",
//         rating: 1,
//         score: 1
//     },
//     { upsert: true }
// )
// If all update() operations complete the query portion before any client successfully inserts data, and there is no unique index on the name field, then each update operation may result in an insert.
//
//     To prevent MongoDB from inserting the same document more than once, create a unique index on the name field. With a unique index, if multiple applications issue the same update with upsert: true, exactly one update() would successfully insert a new document.
//
//     The remaining operations would either:
//
//     update the newly inserted document, or
// fail when they attempted to insert a duplicate.
//     If the operation fails because of a duplicate index key error, applications may retry the operation which will succeed as an update operation.
