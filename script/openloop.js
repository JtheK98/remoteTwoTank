var g_bPageRequested = false;

var elementStart;
var elementStop;
var elementResevoir;
var elementTankEmpty;

// a timer will be started, after one second the funktion OnTimer will be called
function Start() 
{
    DetermineBrowser();
    ForceUpdate("Web2Plc.tankLevel1mm","Web2Plc.flow1");    // immediate initialization of the value visualization
    ForceUpdate2("Web2Plc.pumpVoltage");
    changeTank("Web2Plc.tankLevel1mm");
    setTimeout("OnTimer()",100);
    setTimeout("OnTimer2()",150);


    elementStart = document.getElementById('start1');
    elementStart.addEventListener("click", () => {
        document.getElementById("pump1running").setAttribute("fill", "green");
        document.getElementById("pump1stopped").setAttribute("fill", "white");
    });
    
    elementStart = document.getElementById('stop1');
    elementStart.addEventListener("click", () => {
        document.getElementById("pump1running").setAttribute("fill", "white");
        document.getElementById("pump1stopped").setAttribute("fill", "red");
    });
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
        DoHttpRequest(this, "update2.dat",   UpdateCallback, true);    // response is javascript
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer()", 200);  // the function OnTimer is to be called every 200 ms
}

function OnTimer2() 
{
    if (! g_bPageRequested) 
    {
        g_bPageRequested = true;
        // request the update page asynchronously, function UpdateCallback is called if response
        // has been received           
        DoHttpRequest(this, "update2.dat",   UpdateCallback2, true);
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer2()", 250);  // the function OnTimer is to be called every 200 ms
}

// update11.dat has been received
   function UpdateCallback(obj, response, status) {
    var ok;
    //Splitting the results
    var results = response.split(" ");
    //Splitting the results in single signs
    var signs = results[4].split("");
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
    dynValue = results[4].substr(count, signs.length);
    
    var dynValueInt = parseInt(dynValue);

    var signs = results[2].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue2 = results[2].substr(count, signs.length);

    var dynValueInt2 = parseFloat(dynValue2);


    if (status < 300) {// check HTTP response status
        ForceUpdate(dynValueInt,dynValueInt2);         // update with the provided value  
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

// update11.dat has been received
function UpdateCallback2(obj, response, status) {
    var ok;
    //Splitting the results
    var results = response.split(" ");
    //Splitting the results in single signs
    var signs = results[1].split("");
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
    dynValue = results[1].substr(count, signs.length);
    
    var dynValueInt = parseInt(dynValue);

    if (status < 300) {// check HTTP response status
        ForceUpdate2(dynValueInt);         // update with the provided value  
       
        g_bPageRequested = false;
        setTimeout("OnTimer2()", 250);  // the function OnTimer is to be called in 200 ms
        return;
    }
    if (status == 503) {               // service currently unvailable , server overloaded 
        ok = confirm(dynValueInt);
    } else {
        ok = confirm("FAILED: HTTP error " + status);
    }
    g_bPageRequested = false;
    if (ok) {
        setTimeout("OnTimer2()", 1100);  // the function OnTimer is to be called in 1 sec
    }
}
// Within the page update11_ajax.html or update11_ajax.js the function ForceUpdate is called with the current value.
// This value (0..255) controls the width of table "table2" within the table "table1"
function ForceUpdate(val1,val2) 
{

    var td = parent.document.getElementById("level");      // display value numerically
    if (td.textContent) 
    {                                // textContent is ok for Firefox, not for IE
       td.textContent = val1+" mm";
    }
    else 
    {
       td.innerHTML   = val1+" mm";
    }
    var td = parent.document.getElementById("flow");      // display value numerically
    if (td.textContent) 
    {                                // textContent is ok for Firefox, not for IE
       td.textContent = val2+" l/min";
    }
    else 
    {
       td.innerHTML   = val2+" l/min";
    }
    g_bPageRequested = false; 
}

function ForceUpdate2(val) 
{

    var td = parent.document.getElementById("voltage");      // display value numerically
    if (td.textContent) 
    {                                // textContent is ok for Firefox, not for IE
       td.textContent = val+" V";
    }
    else 
    {
       td.innerHTML   = val+" V";
    }
    g_bPageRequested = false; 
}

function changeTank (newValue)
{
	document.getElementById("tank.blue").setAttribute("y", 330 - (newValue*1.58));
    document.getElementById("tank.blue").setAttribute("height", (newValue*1.58));
			
}


//buttons für operator ansteuern, platzierung der einzelnen felder, buttons von Jens, Tankanzeige