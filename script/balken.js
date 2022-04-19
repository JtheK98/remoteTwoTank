var g_bPageRequested = false;

// a timer will be started, after one second the funktion OnTimer will be called
function Start() 
{
    DetermineBrowser();
    ForceUpdate("Web2Plc.setPoint1");    // immediate initialization of the value visualization
    changeSpeed("Web2Plc.setPoint1");
    changeTank("Web2Plc.setPoint1");
    setTimeout("OnTimer()",100);

}

// The page update11.dat solely consists of a reference to the variable "Dynvalue".
// <colon><equalsign><Variablenname><colon> is the common syntax for variable references.
// Since this page is set "manual" (in AWP_Start_Fragment - statement at begin of the page), a dedicated
// user program within the PCL is triggered when this page is requested and will then defer the HTTP response 
// until the variables value has been changed
function OnTimer() 
{
    if (! g_bPageRequested) 
    {
        g_bPageRequested = true;
        // request the update page asynchronously, function UpdateCallback is called if response
        // has been received           
        DoHttpRequest(this, "update.dat",   UpdateCallback, true);    // response is javascript
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer()", 200);  // the function OnTimer is to be called every 200 ms
}

// update11.dat has been received
   function UpdateCallback(obj, response, status) {
    var ok;
    //Splitting the results
    var results = response.split(" ");
    //Splitting the results in single signs
    var signs = results[0].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    //delete signs which aren't numbers
    dynValue = results[0].substr(count, signs.length);
    
    var dynValueInt = parseInt(dynValue);

    if (status < 300) {// check HTTP response status
        document.getElementById('veloDiv').innerHTML = results[1];
        ForceUpdate(dynValueInt);         // update with the provided value  
        changeSpeed(dynValueInt);
        changeTank(dynValueInt);
        g_bPageRequested = false;
        setTimeout("OnTimer()", 200);  // the function OnTimer is to be called in 200 ms
        return;
    }
    if (status == 503) {               // service currently unvailable , server overloaded 
        ok = confirm(dynValueInt);
    } else {
        ok = confirm("FAILED: HTTP error " + status);
    }
    g_bPageRequested = false;
    if (ok) {
        setTimeout("OnTimer()", 1000);  // the function OnTimer is to be called in 1 sec
    }
}
// Within the page update11_ajax.html or update11_ajax.js the function ForceUpdate is called with the current value.
// This value (0..255) controls the width of table "table2" within the table "table1"
function ForceUpdate(val) 
{
    var width, barval;
    var tabelem;
    
    tabelem = parent.document.getElementById("bar");
    width = tabelem.parentNode.clientWidth;
           
    barval = ((val*width)/190);                          // convert to percent, Firefox can display % only for integral numbers ! 
    if (barval == 0) barval = 1;                         // 0 not allowed for IE    
    tabelem.style.width = Math.floor(barval)+"px";       // set table width

    var td = parent.document.getElementById("td1");      // display value numerically
    if (td.textContent) 
    {                                // textContent is ok for Firefox, not for IE
       td.textContent = val+" mm";
    }
    else 
    {
       td.innerHTML   = val+" mm";
    }
    g_bPageRequested = false; 
}


function changeSpeed(newValue)
{
 document.getElementById("gauge.pointer").setAttribute("transform", "rotate(" + (newValue*1.42) + ",55,55)");
}

function changeTank (newValue)
{
	document.getElementById("tank.blue").setAttribute("y", 330 - (newValue*1.58));
    document.getElementById("tank.blue").setAttribute("height", (newValue*1.58));
			
}

function checkTankValue(setPoint, inputField)
{
    if(document.getElementById('velocityField').value>190){
        alert("Please enter value btw 0mm and 190mm");
        return(false);
    } else{
        send_ajax_request(setPoint, inputField);
    } 
}

//----------------------------------------s-------------------------------
