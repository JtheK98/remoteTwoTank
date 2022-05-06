var g_bPageRequested = false;

//Graphzeugs
var xVal1 = 0;
var yVal1 = 100; 
var xVal2 = 0;
var yVal2 = 100; 
var updateInterval = 100;
var dataLength = 50; // number of dataPoints visible at any point

var dps_setpoint2 = []; // dataPoints
var dps_tanklevel2 = [];

var chart;
var updateChart;

// a timer will be started, after one second the funktion OnTimer will be called
function Start() 
{
    DetermineBrowser();
    ForceUpdate("Web2Plc.setPoint2","Web2Plc.flow1");    // immediate initialization of the value visualization
    //ForceUpdate2("Web2Plc.pumpVoltage");
    changeTank("Web2Plc.tankLevel2mm");
    updateInput(NaN);
    changeColorEStop(NaN);
    changeColorRunning(0);
    changeColorStopped(1);
    setTimeout("OnTimer()",100);
    setTimeout("OnTimer2()",150);
    setTimeout("OnTimer3()",200);


    var x = document.getElementById("hideshow");
    x.style.display = "none";

    chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true, 
        title :{
            text: "Tank level 2"
        },
        axisX:{
            title : "Time",
            minimum : 0,
            //maximum : 500,
            gridColor: "grey" ,
            gridThickness: 2   
        },
        axisY:{
            title : "Tank level in mm",
            minimum : 0,
            maximum : 190,
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor:"pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick : toggleDataSeries
        },
        data: [{
            type: "line",
            yValueFormatString: "###.00mm",
            showInLegend: true,
            name: "Setpoint 2",
            dataPoints: dps_setpoint2
            },
            {
            type: "line",
            yValueFormatString: "###.00mm",
            showInLegend: true,
            name: "Current tank level",
            dataPoints: dps_tanklevel2
            
        }]
        });

    renderUpdatedChart(dps_setpoint2,dps_tanklevel2,chart,dataLength,0,0);
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
        DoHttpRequest(this, "update.dat",   UpdateCallback3, true);
        // this asynchronous method does silently update the data within the browser
    }
    setTimeout("OnTimer3()", 300);  // the function OnTimer is to be called every 200 ms
}

// update11.dat has been received
   function UpdateCallback(obj, response, status) {
    var ok;
    //Splitting the results
    var results = response.split(" ");
    //Splitting the results in single signs
    var signs = results[13].split("");
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
    dynValue = results[13].substr(count, signs.length);
    
    var dynValueInt = parseFloat(dynValue);

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

    var signs = results[12].split("");
    var i;
    var count = 0;
    for (i = 0; i < signs.length; i++) {
        //Check if the first signs are numbers
        if (true == isNaN(signs[i])) {
            count = count + 1;
        }
        else {break;}		
    }
    dynValue3 = results[12].substr(count, signs.length);

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
        ForceUpdate(dynValueInt,dynValueInt2);         // update with the provided value  
        changeTank(dynValueInt3);
        changeColorRunning(dynValueInt4);
        changeColorStopped(dynValueInt5);
        renderUpdatedChart(dps1,dps2,chart,dataLength,dynValueInt,dynValueInt3)

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

function UpdateCallback3(obj, response, status) {
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
        updateInput(dynValueInt); 
        changeColorEStop(dynValueInt4);
       
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
function ForceUpdate(val1,val2) 
{

    var td = parent.document.getElementById("setpoint2");      // display value numerically
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

function hideshowfunction() {
    var x = document.getElementById("hideshow");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
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


var aj_val

function updateInput(indicator){
 
    if(indicator > 1){
        document.getElementById("exper3").style.background = "#ffcccb";
        document.getElementById("exper3").value = "Deactivate";   
        aj_val = 0;

    }
    else{
        document.getElementById("exper3").style.background = "#ddeedc";
        document.getElementById("exper3").value = "Activate";  
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


function renderUpdatedChart(dps1,dps2,chart,dataLength,dynValueInt,dynValueInt2){
    dataLength = dataLength || 1;

    for (var j = 0; j < dataLength; j++) {
        yVal1 = dynValueInt;
        yVal2 = dynValueInt2;

        dps1.push({
            x: xVal1,
            y: yVal1
        });
        dps2.push({
            x: xVal2,
            y: yVal2
        });
        xVal1++;
        xVal2=xVal1
    }

    if (dps1.length > dataLength) {
        dps1.shift();
    }
    if (dps2.length > dataLength) {
        dps2.shift();
    }


    chart.options.data[0].legendText = " Setpoint: " + yVal1.toFixed(2)+"mm";
	chart.options.data[1].legendText = " Tank level: " + yVal2.toFixed(2)+"mm"; 

    chart.render();
};

function toggleDataSeries(e) {
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	chart.render();
}

function checkSetpoint2(setPoint, inputField)
{
    if(document.getElementById('setPoint2Field').value>190 || document.getElementById('setPoint2Field').value<0){
        alert("Please enter value btw 0mm and 190mm");
        return(false);
    } else{
        send_ajax_request(setPoint, inputField);
    } 
}

function checkPid(setPoint, inputField)
{
    if(document.getElementById(inputField).value>190 || document.getElementById(inputField).value<0){
        alert("Please enter value btw 0 and 100");
        return(false);
    } else{
        send_ajax_request(setPoint, inputField);
    } 
}