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
