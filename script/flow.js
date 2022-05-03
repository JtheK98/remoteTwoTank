var g_bPageRequested = false;

// a timer will be started, after one second the funktion OnTimer will be called
function Start() 
{
    DetermineBrowser();
    ForceUpdate(0)    // immediate initialization of the value visualization
    ForceUpdate2(0);
    updateInput(NaN);
    updateGauge(NaN);
    setTimeout("OnTimer()",50);
    setTimeout("OnTimer2()",100);
    setTimeout("OnTimer3()",300)
    setTimeout("OnTimer4()",200)
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
    setTimeout("OnTimer()", 50);  // the function OnTimer is to be called every 200 ms
}

function OnTimer2() 
{
    if (! g_bPageRequested) 
    {
        g_bPageRequested = true;
        // request the update page asynchronously, function UpdateCallback is called if response
        // has been received           
        DoHttpRequest(this, "update.dat", UpdateCallback2, true);
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer2()", 100);  // the function OnTimer is to be called every 200 ms
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
    setTimeout("OnTimer3()", 300);  // the function OnTimer is to be called every 200 ms
}

function OnTimer4() 
{
    if (! g_bPageRequested) 
    {
        g_bPageRequested = true;
        // request the update page asynchronously, function UpdateCallback is called if response
        // has been received           
        DoHttpRequest(this, "update.dat", UpdateCallback4, true);
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer4()", 200);  // the function OnTimer is to be called every 200 ms
}

// update11.dat has been received
function UpdateCallback(obj, response, status) {
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
    
    var signs = results[5].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue2 = results[5].substr(count, signs.length);

    var dynValueInt2 = parseInt(dynValue2);

    var signs = results[6].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue3 = results[6].substr(count, signs.length);

    var dynValueInt3 = parseInt(dynValue3);

    if (status < 300) {// check HTTP response status
        ForceUpdate(dynValueInt);         // update with the provided value 
        changeColorRunning(dynValueInt2);
        changeColorStopped(dynValueInt3);
       
        g_bPageRequested = false;
        setTimeout("OnTimer()", 50);  // the function OnTimer is to be called in 200 ms
        return;
    }
    if (status == 503) {               // service currently unvailable , server overloaded 
        ok = confirm(dynValueInt);
    } else {
        ok = confirm("FAILED: HTTP error " + status);
    }
    g_bPageRequested = false;
    if (ok) {
        setTimeout("OnTimer()", 300);  // the function OnTimer is to be called in 1 sec
    }
}

// update11.dat has been received
function UpdateCallback2(obj, response, status) {
    var ok;
    //Splitting the results
    var results = response.split(" ");
    //Splitting the results in single signs
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
    //delete signs which aren't numbers
    dynValue = results[2].substr(count, signs.length);
    
    var dynValueInt = parseInt(dynValue);

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
    dynValue4 = results[8].substr(count, signs.length);

    var dynValueInt4 = parseInt(dynValue4);

    if (status < 300) {// check HTTP response status
        ForceUpdate2(dynValueInt);         // update with the provided value  
        changeColorEStop(dynValueInt4);

        g_bPageRequested = false;
        setTimeout("OnTimer2()", 100);  // the function OnTimer is to be called in 200 ms
        return;
    }
    if (status == 503) {               // service currently unvailable , server overloaded 
        ok = confirm(dynValueInt);
    } else {
        ok = confirm("FAILED: HTTP error " + status);
    }
    g_bPageRequested = false;
    if (ok) {
        setTimeout("OnTimer2()", 400);  // the function OnTimer is to be called in 1 sec
    }
}


// update11.dat has been received
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
        setTimeout("OnTimer3()", 300);  // the function OnTimer is to be called in 200 ms
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

function UpdateCallback4(obj, response, status) {
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

    if (status < 300) {// check HTTP response status 
        updateGauge(dynValueInt); 
       
        g_bPageRequested = false;
        setTimeout("OnTimer4()",200);  // the function OnTimer is to be called in 200 ms
        return;
    }
    if (status == 503) {               // service currently unvailable , server overloaded 
        ok = confirm(dynValueInt);
    } else {
        ok = confirm("FAILED: HTTP error " + status);
    }
    g_bPageRequested = false;
    if (ok) {
        setTimeout("OnTimer4()", 600);  // the function OnTimer is to be called in 1 sec
    }
}

// Within the page update11_ajax.html or update11_ajax.js the function ForceUpdate is called with the current value.
// This value (0..255) controls the width of table "table2" within the table "table1"
function ForceUpdate(val) 
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

function ForceUpdate2(val) 
{

    var td = parent.document.getElementById("flow");      // display value numerically
    if (td.textContent) 
    {                                // textContent is ok for Firefox, not for IE
       td.textContent = val+" l/min";
    }
    else 
    {
       td.innerHTML   = val+" l/min";
    }
    g_bPageRequested = false; 
}

var aj_val

function updateInput(indicator){
 
    if(indicator > 1){
        document.getElementById("exper1").style.background = "#ffcccb";
        document.getElementById("exper1").value = "Deactivate";   
        aj_val = 0;
    }
    else{
        document.getElementById("exper1").style.background = "#ddeedc";
        document.getElementById("exper1").value = "Activate";  
        aj_val = 1;  
    }
}

function sendActivate(activate){
    if(aj_val>0){
        var indic = 2;
    }
    else{
        indic = 0;
    }

    send_ajax_request_number(activate, aj_val);
    
    updateInput(indic);
}


function checkVoltage(setPoint, inputField)
{
    if(document.getElementById('voltageField').value>10 || document.getElementById('voltageField').value<0){
        alert("Please enter value btw 0V and 10V");
        return(false);
    } else{
        send_ajax_request(setPoint, inputField);
        updateGauge(document.getElementById('voltageField').value)
    } 
}


function updateGauge(newValue)
{
 document.getElementById("gauge.pointer").setAttribute("transform", "rotate(" + (newValue*29.2) + ",55,55)");
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

function changeColorEStop(value){

    if (value==1) {
        document.getElementById("stopIndic").setAttribute("fill", "red");
      }
    if (value==0) {
        document.getElementById("stopIndic").setAttribute("fill", "white");
    }

}

function setVariable(vari){
    send_ajax_request_number(vari, 1);
    send_ajax_request_number(vari, 0);
}


function setEStop(vari){
    changeColorEStop(1);
    send_ajax_request_number(vari, 1);
    send_ajax_request_number(vari, 0);
}

function resetEStop(vari){
    changeColorEStop(0);
    send_ajax_request_number(vari, 1);
    send_ajax_request_number(vari, 0);
}