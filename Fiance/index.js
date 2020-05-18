"use strict";
const apiKey="F7SNAVU4M1AYTG2O";

$(document).ready(function () {
    $("#IFR").hide();
    let clientID = "112533485115-q2g4rm7s2kh9qr0476rau3cgv4qn3o3c.apps.googleusercontent.com";
    const redirectUri = "http://127.0.0.1:8080/index.html";
    const clientSecret = "8a7c1ClIutbheQNik5Me3kMe";
    const pointTO = "https://www.googleapis.com/auth/drive";
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    let at=localStorage.getItem("accessToken");

    if (code) {
        $.ajax({
            type: 'POST',
            url: "https://www.googleapis.com/oauth2/v4/token",
            data: {
                code: code,
                redirect_uri: redirectUri,
                client_secret: clientSecret,
                client_id: clientID,
                scope: pointTO,
                grant_type: "authorization_code"
            },
            dataType: "json",
            success: function (resultData) {
                localStorage.setItem("accessToken", resultData.access_token);
                localStorage.setItem("refreshToken", resultData.refreshToken);
                localStorage.setItem("expires_in", resultData.expires_in);
                window.history.pushState({}, document.title, "index.html");

                at=localStorage.getItem("accessToken");
                if (at!=null) {
                    $("#logStatus").css("background-color","green");
                }
                else{
                    $("#logStatus").css("background-color","red");
                }
            }
        });
    }
    if (at!=null) {
        $("#logStatus").css("background-color","green");
    }
    else{
        $("#logStatus").css("background-color","red");
    }


    $("#logout").on("click",function () {
        localStorage.clear();
        $("#logStatus").css("background-color","red");
    })


    let _table=$("#tableData tbody");
    let _cmb=$("#cmbSymbols");
	let _chartTypeCmb=$("#chartStyleList");
    let ctx;
    let flag;

    _cmb.prop("selectedIndex","-1");

    _cmb.on("change",function () {
        _table.html("").append(createRows(0));
        getGlobalQuotes($(this).val(),0);
    });
	
	_chartTypeCmb.on("change",function(){
		let ds=Irequest("GET","http://localhost:3000/SECTOR");
		ds.done(function (data) {
		if(!ctx) {
            ctx = chartCreation("http://localhost:3000/chart");
		}
		chartMod(ctx, data[_chartTypeCmb.val()]);
		});
	});

    $("#textSearched").on("keyup",function () {
        if($("#textSearched").val().length>=2) {
            _table.html("");
            getSymbolSearched($(this).val(), _table);
        }
    });
     $("#download").on('click', function() {
        flag=false;
         download(flag);
    });

     $("#UpDrive").on("click",function () {
            $("#IFR").show();
     })

    $("#logStatus").on("click",function () {
        redirectionForLogin();
    })
});

function createRows(n) {
    let tr=$("<tr>");
    $("<td>").prop("id", "symbol"+n).appendTo(tr);
    $("<td>").prop("id", "lastTrade"+n).appendTo(tr);
    $("<td>").prop("id", "lastTradeTime"+n).appendTo(tr);
    $("<td>").prop("id", "change"+n).appendTo(tr);
    $("<td>").prop("id", "open"+n).appendTo(tr);
    $("<td>").prop("id", "previousClose"+n).appendTo(tr);
    $("<td>").prop("id", "daysLow"+n).appendTo(tr);
    $("<td>").prop("id", "daysHigh"+n).appendTo(tr);
    $("<td>").prop("id", "volume"+n).appendTo(tr);
    return tr;
}

let globalQuoteData;
function getGlobalQuotes(symbol,i) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+symbol+"&apikey="+apiKey;
    $.getJSON(url,
        function (data) {
            globalQuoteData = data["Global Quote"];
            $("#symbol"+i).text(globalQuoteData["01. symbol"]);
            $("#previousClose"+i).text(globalQuoteData["08. previous close"]);
            $("#open"+i).text(globalQuoteData["02. open"]);
            $("#lastTrade"+i).text(globalQuoteData["05. price"]);
            $("#lastTradeTime"+i).text(globalQuoteData["07. latest trading day"]);
            $("#change"+i).text(globalQuoteData["09. change"]);
            $("#daysLow"+i).text(globalQuoteData["04. low"]);
            $("#daysHigh"+i).text(globalQuoteData["03. high"]);
            $("#volume"+i).text(globalQuoteData["06. volume"]);
        }
    );
}

function getSymbolSearched(str,table) {
    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+str+"&apikey="+apiKey;
    $.getJSON(url, function (data) {
        for (let i = 0; i < data["bestMatches"].length; i++) {
            table.append(createRows(i));
            getGlobalQuotes(data["bestMatches"][i]["1. symbol"],i);
        }
    })
}

//Chart section
//includes:
//-json-server Request (Ajax technology)
//-Chart creation
//-Chart mod
//Chart creation an chart mod are call when the char type DDBox change ($document.ready Function)
function chartCreation(dataChart){
    let _data = Irequest("GET", dataChart,{},false);
    _data.done(function (data) { return data; });

    return new Chart($("#canvas"),JSON.parse(_data.responseText));
}

function chartMod(chart, content)
{
    let dataChart=chart["data"];
    dataChart["labels"]=[];
    let dataset=dataChart["datasets"][0];
    dataset["data"]=[];
    for (let key in content)
    {
        dataChart["labels"].push(key);
        dataset["data"].push(content[key].replace("%", ""));
        dataset["borderColor"].push("rgb(25, 52, 255)");
        dataset["backgroundColor"].push("rgb(25, 52, 255)");
    }
    chart.update();
}

function Irequest(method, url, parameters = "",async=true)
{
    return $.ajax({
        type: method,
        url: url,
        data: parameters,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        timeout: 5000,
        async:async
    });
}

function download(flag) {
    let urlBase64jp = document.getElementById("canvas").toDataURL("image/jpg");
    let a =  $("a[name=DW]");
    $(a).prop("href",urlBase64jp);

    if (flag==true){
        setTimeout(function ()
        {
            window.location.href="login.html";
        },1000);
    }
}

function redirectionForLogin(){
    let URL;
    const clientID="112533485115-q2g4rm7s2kh9qr0476rau3cgv4qn3o3c.apps.googleusercontent.com";
    const redirectURI="http://127.0.0.1:8080/index.html";
    const PointTO="https://www.googleapis.com/auth/drive";

    URL = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirectURI+"&prompt=consent&response_type=code&client_id="+clientID+"&scope="+PointTO+"&access_type=offline";
    window.location.href=URL;
}





