"use strict";
const apiKey="F7SNAVU4M1AYTG2O";

$(document).ready(function () {
    let _table=$("#tableData tbody");
    let _cmb=$("#cmbSymbols");
    _cmb.prop("selectedIndex","-1");

    _cmb.on("change",function () {
        _table.html("").append(createRows(0));
        getGlobalQuotes($(this).val(),0);
    });

    $("#textSearched").on("keyup",function () {
        if($("#textSearched").val().length>=2) {
            _table.html("");
            getSymbolSearched($(this).val(), _table);
        }
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

function getGlobalQuotes(symbol,i) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+symbol+"&apikey="+apiKey;
    $.getJSON(url,
        function (data) {
            let globalQuoteData = data["Global Quote"];
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