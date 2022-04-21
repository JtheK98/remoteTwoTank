var g_bPageRequested = false;

//Graphzeugs
var xVal1 = 0;
var yVal1 = 100; 
var xVal2 = 0;
var yVal2 = 100; 
var updateInterval = 100;
var dataLength = 20; // number of dataPoints visible at any point

var dps_setpoint1 = []; // dataPoints
var dps_tanklevel1 = [];

var chart;
var updateChart;

// a timer will be started, after one second the funktion OnTimer will be called
function Start() 
{
    DetermineBrowser();
    ForceUpdate("Web2Plc.setPoint1");    // immediate initialization of the value visualization
    changeSpeed("Web2Plc.setPoint1");
    changeTank("Web2Plc.setPoint1");

    chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true, 
        title :{
            text: "Tank level 1"
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
            name: "Setpoint",
            dataPoints: dps_setpoint1
            },
            {
            type: "line",
            yValueFormatString: "###.00mm",
            showInLegend: true,
            name: "Current tank level",
            dataPoints: dps_tanklevel1
            
        }]
        });

    renderUpdatedChart(dps_setpoint1,dps_tanklevel1,chart,dataLength,0,0);
    //renderUpdatedChart(dps_setpoint1,dps_tanklevel1,chart,dataLength);
    setTimeout("OnTimer()",updateInterval);

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
    //setTimeout("OnTimer()", 200);  // the function OnTimer is to be called every 200 ms
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

    console.log(response)

    var results = response.split(" ");
    console.log(results)

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
    dynValue2 = results[2].substr(count, signs.length);
    console.log(dynValue2)
    var dynValueInt2 = parseInt(dynValue2);



    if (status < 300) {// check HTTP response status
        document.getElementById('veloDiv').innerHTML = results[1];
        ForceUpdate(dynValueInt);         // update with the provided value  
        changeSpeed(dynValueInt);
        changeTank(dynValueInt);
        renderUpdatedChart(dps_setpoint1,dps_tanklevel1,chart,dataLength,dynValueInt,dynValueInt2);
        //renderUpdatedChart(dps_setpoint1,dps_tanklevel1,chart,dataLength);
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
    if(inputField>190){
        alert("Please enter value btw 0mm and 190mm");
        return(false);
    } else{
        send_ajax_request(setPoint, inputField);
    } 
}

//----------------------------------------s-------------------------------


function renderUpdatedChart(dps1,dps2,chart,dataLength,dynValueInt,dynValueInt2){
//function renderUpdatedChart(dps1,dps2,chart,dataLength){
    dataLength = dataLength || 1;

    for (var j = 0; j < dataLength; j++) {
        yVal1 = dynValueInt;
        yVal2 = dynValueInt2;
        //yVal1 = 100;
        //yVal2 = yVal1+30;
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


//setpoint und tanklevel
