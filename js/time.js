var once = false;

document.addEventListener("DOMContentLoaded", function () 
{
  // Update time every second
  var timerID = setInterval(updateDateTime, 1000);
  
  // display the initial time
  updateDateTime();
});

function updateDateTime() 
{
  // Get initial variables
  var cd            = new Date();
  var dateElement   = document.querySelector(".date");
  var timeElement   = document.querySelector(".time");
  var week 			= ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // get formatted Date
  var formattedDate = zeroPadding(cd.getFullYear(), 4)  + '-' +
                      zeroPadding(cd.getMonth() + 1, 2) + '-' +
                      zeroPadding(cd.getDate(), 2)      + ' ' +
                      week[cd.getDay()];
    
  // get formatted Time
  var formattedTime = zeroPadding(cd.getHours(), 2)   + ':' +
                      zeroPadding(cd.getMinutes(), 2) + ':' +
                      zeroPadding(cd.getSeconds(), 2);

  // Update the Date and Time
  dateElement.textContent = formattedDate;
  timeElement.textContent = formattedTime;
  
  // log once when is called from setInterval
  if(once || updateDateTime.caller !== null)
	return;
  
  console.log("Time Updating");
  once = true;
}

function zeroPadding(num, digit) 
{
  var zero = '';
  for (var i = 0; i < digit; i++) 
    zero += '0';
  return (zero + num).slice(-digit);
}