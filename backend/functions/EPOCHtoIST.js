
function epocihtoist(epocihtime){
    console.log(epocihtime);
  
var rawtime1=new Date(epocihtime*1000);

    locale ="en-US",
postDate = rawtime1.toLocaleString(locale, { month: "long" ,day:"numeric", year:"numeric"});



var currentOffset = rawtime1.getTimezoneOffset();

var ISTOffset = 330; // IST offset UTC +5:30

var ISTTime = new Date(rawtime1.getTime() + (ISTOffset + currentOffset)*60000);

// ISTTime now represents the time in IST coordinates

 var hoursIST = ISTTime.getHours()
 var minutesIST = ISTTime.getMinutes()
 var secondsIST = ISTTime.getSeconds()
//console.log(hoursIST+"----"+minutesIST+"---"+secondsIST);
var timezone1="TIME: "+ hoursIST+":"+minutesIST+":"+secondsIST;
var datezone1="DATE: "+" "+postDate;
var indianStandardTime=datezone1+"'\n'"+timezone1;
console.log(indianStandardTime)
//resolve(indianStandardTime);
return indianStandardTime;
//console.log(rawtime1);
//console.log(ttime);

 
}


/* module.exports.epocihtoist = epocihtoist; */
module.exports={
    epocihtoist
}
