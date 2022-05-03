var g_bPageRequested = false;

var elementStart;
var elementStop;
var elementResevoir;
var elementTankEmpty;
var elementhideshow;

// a timer will be started, after one second the funktion OnTimer will be called
function Start() 
{
    DetermineBrowser();
    ForceUpdate("Web2Plc.tankLevel1mm");    // immediate initialization of the value visualization
    ForceUpdate2("Web2Plc.level1mA");
    changeTank("Web2Plc.tankLevel1mm");
    updateInput(NaN);
    setTimeout("OnTimer()",100);
    setTimeout("OnTimer2()",150);
    setTimeout("OnTimer3()",200)


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
function OnTimer3() 
{
    if (! g_bPageRequested) 
    {
        g_bPageRequested = true;
        // request the update page asynchronously, function UpdateCallback is called if response
        // has been received           
        DoHttpRequest(this, "update.dat", UpdateCallback3, true);
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer3()", 100);  // the function OnTimer is to be called every 200 ms
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

    var signs = results[11].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue2 = results[11].substr(count, signs.length);

    var dynValueInt2 = parseFloat(dynValue2);

    var signs = results[10].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue3 = results[10].substr(count, signs.length);

    var dynValueInt3 = parseFloat(dynValue3);

    var signs = results[7].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue4 = results[7].substr(count, signs.length);

    var dynValueInt4 = parseFloat(dynValue4);

    var signs = results[8].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue5 = results[8].substr(count, signs.length);
    var dynValueInt5 = parseFloat(dynValue5);


    if (status < 300) {// check HTTP response status
        ForceUpdate(dynValueInt);         // update with the provided value  
        changeTank(dynValueInt);
        changeColorTankEmpty(dynValueInt2);
        changeColorResevoir(dynValueInt3);
        changeColorRunning(dynValueInt4);
        changeColorStopped(dynValueInt5);

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
    var signs = results[9].split("");
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
    dynValue = results[9].substr(count, signs.length);
    
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
function UpdateCallback3(obj, response, status) {
    var ok;
    //Splitting the results
    var results = response.split(" ");
    //Splitting the results in single signs
    var signs = results[3].split("");
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
    dynValue = results[3].substr(count, signs.length);
    
    var dynValueInt = parseInt(dynValue);

    if (status < 300) {// check HTTP response status 
        updateInput(dynValueInt); 
       
        g_bPageRequested = false;
        setTimeout("OnTimer3()", 100);  // the function OnTimer is to be called in 200 ms
        return;
    }
    if (status == 503) {               // service currently unvailable , server overloaded 
        ok = confirm(dynValueInt);
    } else {
        ok = confirm("FAILED: HTTP error " + status);
    }
    g_bPageRequested = false;
    if (ok) {
        setTimeout("OnTimer3()", 800);  // the function OnTimer is to be called in 1 sec
    }
}


// Within the page update11_ajax.html or update11_ajax.js the function ForceUpdate is called with the current value.
// This value (0..255) controls the width of table "table2" within the table "table1"
function ForceUpdate(val) 
{

    var td = parent.document.getElementById("level");      // display value numerically
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

function ForceUpdate2(val) 
{

    var td = parent.document.getElementById("current");      // display value numerically
    if (td.textContent) 
    {                                // textContent is ok for Firefox, not for IE
       td.textContent = val+" mA";
    }
    else 
    {
       td.innerHTML   = val+" mA";
    }
    g_bPageRequested = false; 
}

function changeTank (newValue)
{
	document.getElementById("tank.blue").setAttribute("y", 330 - (newValue*1.58));
    document.getElementById("tank.blue").setAttribute("height", (newValue*1.58));
			
}

function changeColorResevoir(newValue)
{
	if (newValue==1) {
        document.getElementById("resevoirempty").setAttribute("fill", "red");
      }
    if (newValue==0) {
        document.getElementById("resevoirempty").setAttribute("fill", "white");
    } 
			
}

function changeColorRunning(newValue)
{
	if (newValue==1) {
        document.getElementById("pump1running").setAttribute("fill", "green");
      }
    if (newValue==0) {
        document.getElementById("pump1running").setAttribute("fill", "white");
    } 
			
}

function changeColorStopped(newValue)
{
	if (newValue==1) {
        document.getElementById("pump1stopped").setAttribute("fill", "red");
      }
    if (newValue==0) {
        document.getElementById("pump1stopped").setAttribute("fill", "white");
    } 
			
}

function changeColorTankEmpty(newValue)
{
	if (newValue==1) {
        document.getElementById("tank1empty").setAttribute("fill", "yellow");
      }
    if (newValue==0) {
        document.getElementById("tank1empty").setAttribute("fill", "white");
    } 
			
}

function updateInput(indicator){
 
    if(indicator > 1){
        document.getElementById("exper1").style.background = "#ffcccb";
        document.getElementById("exper1").value = "Deactivate";   
        document.getElementById("value1").value = 0;

    }
    else{
        document.getElementById("exper1").style.background = "#ddeedc";
        document.getElementById("exper1").value = "Activate";  
        document.getElementById("value1").value = 1;  
    }
}

function hideshowfunction() {
    var x = document.getElementById("hideshow");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

//buttons für operator ansteuern, platzierung der einzelnen felder, buttons von Jens, Tankanzeige