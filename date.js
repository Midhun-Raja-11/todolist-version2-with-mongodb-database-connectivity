exports.getDate = function(){
    var options = {
        weekday : "long",
        month : "long",
        day : "numeric"
     };
     var day = new Date().toLocaleDateString("en-US",options);
     return day;
}
