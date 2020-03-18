"use strict";

$(document).ready(function () {
  let param;
  let personIndex=0;
  let person;
  let dataLength;

  inviaRichiesta(param, aggiornaPagina);

  let _wrapper;
  let _paramW=$("#parmaWrapper");
  let _imgWR;
  let _img;
  let _range;
  let _radio;
  let _btnPlus,_btnMinus;
  let _lblPrf;
  let _lblPrfDes;

  let ausArr1=[" ALL "," WOMAN "," MAN "];
  let ausArr2=["US","DE","GB","BR","IR"];
  let arrayLblDes=["Hi, my name is","My e-mail address is","My birthday is","My address is","My phone number","My password is"];

  generaPagina();

  function generaPagina(){

    $("<br>").appendTo(_paramW);
    _range=$("<input type='range' max='25' min='1' step='1' value='1'>").addClass("slider").appendTo(_paramW);
    $("<p>").html("GENERATE: "+1+" PROFILE").prop("id","nRange").appendTo(_paramW);
    $("<br>").appendTo(_paramW);
      for(let i=0;i<3;i++){
        _radio=$("<input type='radio' name='gender'>").prop("id","gender-"+i).appendTo(_paramW);
        $("<a>").html("&nbsp&nbsp"+ausArr1[i]+"&nbsp&nbsp").appendTo(_paramW);
        if(i==0)
          $(_radio).prop("checked","checked");
      }
    $("<br>").appendTo(_paramW);
    $("<br>").appendTo(_paramW);
      for(let i=0;i<5;i++){
        $("<input type='checkbox' name='nationality'>").prop("id",i+"-"+ausArr2[i]).appendTo(_paramW);
        $("<a>").html("&nbsp&nbsp"+ausArr2[i]+"&nbsp&nbsp").appendTo(_paramW);
      }
    $("<br>").appendTo(_paramW);
    $("<br>").appendTo(_paramW);
      $("<input type='button' value='GENERATE'>").prop("id","btnGenera").addClass("btnDes").appendTo(_paramW);

    $("<br>").appendTo(_paramW);
    $("<br>").appendTo(_paramW);
      _wrapper=$("<div>").prop("id","wrapper").addClass("wr").appendTo(_paramW);
      $("<div>").prop("id","Nbar").css({"border":"1px solid #2c2e36","height":"10px","background-color":"#ff006a","width":"0%"}).appendTo(_wrapper);
    _btnMinus=$("<input type='button' value='<<'>").prop("id","btnM").css({"height":"50px","width":"40px","font-size":"16pt","color":"white","background-color":"#404040","border":"none","margin-right":"10px"}).appendTo(_wrapper);
      $("<a>").html(" profile number: ".toUpperCase()+(personIndex+1)+" ").prop("id","profileN").appendTo(_wrapper);
      _btnPlus=$("<input type='button' value='>>'>").prop("id","btnP").css({"height":"50px","width":"40px","font-size":"16pt","color":"white","background-color":"#404040","border":"none","margin-left":"10px"}).appendTo(_wrapper);
      _imgWR=$("<div>").css({"border-radius":"50%","border":"2px solid #444","height":"130px","width":"130px","margin":"0 auto","margin-bottom":"10px"}).appendTo(_wrapper);
      _img=$("<img>").css({"border-radius":"50%","margin":"0 auto"}).appendTo(_imgWR);

     _lblPrfDes=$("<h3>").css({"margin":"0 auto","font-weight":"bold","color":"white","font-size":"13pt","margin-top":"10px"}).appendTo(_wrapper);
    _lblPrf=$("<h3>").css({"margin":"0 auto","font-weight":"bold","color":"white","font-size":"25pt","margin-top":"10px"}).appendTo(_wrapper);
    for(let i=0;i<6;i++)
      $("<img>").prop({"id": "i-" + i, "src": "c" + (i + 1) + "2.png"}).css("margin", "10px").appendTo(_wrapper);
    $("#i-0").prop("src", "c" + (1) + ".png");

    $("<div>").css("height","15px").appendTo(_wrapper);

    $("#Nbar").animate({"width":"100%"},1000);
    $("#Nbar").animate({"width":((1)*100)/_range.prop("value")+"%"},1000);
  }

  _range.on("change",function () {
    if (_range.prop("value")==="1")
      $("#nRange").html("GENERATE: "+_range.prop("value")+" PROFILE");
    else
      $("#nRange").html("GENERATE: "+_range.prop("value")+" PROFILES");
  })

  $("img").on("mouseover",function () {
    for(let i=0;i<6;i++)
      $("#i-"+i).prop("src","c"+(i+1)+"2.png");
    let id=$(this).prop("id");
    let aus=id.split("-");
    $(this).prop("src","c"+(parseInt(aus[1])+1)+".png");

    let aus2=person["results"][personIndex]["dob"]["date"].split("T");
    switch (aus[1]) {
      case "0": _lblPrfDes.html(arrayLblDes[0]); _lblPrf.html(person["results"][personIndex]["name"]["first"]+" "+person["results"][personIndex]["name"]["last"]); break;
      case "1": _lblPrfDes.html(arrayLblDes[1]); _lblPrf.html(person["results"][personIndex]["email"]); break;
      case "2": _lblPrfDes.html(arrayLblDes[2]); _lblPrf.html(aus2[0]); break;
      case "3": _lblPrfDes.html(arrayLblDes[3]); _lblPrf.html(person["results"][personIndex]["location"]["street"]["number"]+" "+person["results"][personIndex]["location"]["street"]["name"]); break;
      case "4": _lblPrfDes.html(arrayLblDes[4]); _lblPrf.html(person["results"][personIndex]["cell"]); break;
      case "5": _lblPrfDes.html(arrayLblDes[5]); _lblPrf.html(person["results"][personIndex]["login"]["password"]); break;
    }
  });

  _img.off();

  $("#btnGenera").on("click", function() {
    personIndex=0;
    $("#profileN").html(" profile number: ".toUpperCase()+(personIndex+1)+" ");
    dataLength=param="results="+_range.prop("value");
    if ($("#gender-1").is(":checked")) {
      param += "&gender=female";
    }
      if ($("#gender-2").is(":checked"))
        param += "&gender=male";

    let firstNat=true;
    for(let i=0;i<5;i++)
    {
      if(i==0)
        param+="&nat=";
      if($("#"+i+"-"+ausArr2[i]).is(":checked")) {
        if(firstNat) {
          param += ausArr2[i];
          firstNat=false;
        }
        else
          param+=","+ausArr2[i];
      }
    }

    $("#Nbar").animate({"width":"100%"},1000);
    $("#Nbar").animate({"width":((1)*100)/_range.prop("value")+"%"},1000);
    console.log(param);
    inviaRichiesta(param, aggiornaPagina);
    setHoverSection();
  });

  $("#btnP").on("mouseover",function () {
    $("#btnP").animate({"height":"70px","width":"60px","font-size":"18pt"},400);
  })

  $("#btnP").on("mouseout",function () {
    $("#btnP").animate({"height":"50px","width":"40px","font-size":"16pt"},400);
  })

  $("#btnP").on("click",function () {
    if(personIndex+1<dataLength) {
      personIndex++;
      $("#Nbar").animate({"width":((personIndex+1)*100)/dataLength+"%"},500);
      //$("#Nbar").css("width",((personIndex+1)*100)/dataLength+"%");
      $("#profileN").html("profile number: ".toUpperCase() + (personIndex + 1));
      graphicSet();
      setHoverSection();
    }
  })

  $("#btnM").on("mouseover",function () {
    $("#btnM").animate({"height":"70px","width":"60px","font-size":"18pt"},400);
  })

  $("#btnM").on("mouseout",function () {
    $("#btnM").animate({"height":"50px","width":"40px","font-size":"16pt"},400);
  })

  $("#btnM").on("click",function () {

    if(personIndex+1>1) {
      personIndex--;
      $("#Nbar").animate({"width":((personIndex+1)*100)/dataLength+"%"},500);
      //$("#Nbar").css("width",((personIndex+1)*100)/dataLength+"%");
      $("#profileN").html("profile number: ".toUpperCase() + (personIndex + 1));
      graphicSet();
      setHoverSection();
    }
  })
  
  $("#header h1").on("mouseover",function () {
    $("#header h1").animate({"color":"FF006A"},750);
  })

  function setHoverSection() {
    $("#i-0").prop("src", "c" + (1) + ".png");
    for(let i=1;i<6;i++){
      $("#i-"+i).prop("src", "c" + (i+1) + "2.png");
    }
  }

  function inviaRichiesta(parametri, callback) {
    $.ajax({
      url: "https://randomuser.me/api/",
      type: "GET",
      data: parametri,
      contentType: "application/x-www-form-unreloaded; charset=UTF-8",
      dataType: "json",
      async: true,
      timeout: 5000,
      success: callback /*function(data) {
        console.log(data);
      }*/,
      error: function(jqXHR, test_status, str_error) {
        alert("Server error");
      }
    });
  }

  function aggiornaPagina(data) {
    person = data;
    dataLength=data["results"].length;
    console.log(person);
    graphicSet();
  }

  function graphicSet() {
    _img.prop("src",person["results"][personIndex]["picture"]["large"]);
    _lblPrfDes.html(arrayLblDes[0]);
    _lblPrf.html(person["results"][personIndex]["name"]["first"]+" "+person["results"][personIndex]["name"]["last"]);
    }
})

