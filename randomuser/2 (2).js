"use strict";

//json contenenti results spin
var datiUtenti;
//indice del vettore results (datiUtenti)
var i;
var typeData, visData,btnOK;
var avanti, indietro;
var pRichiesta = "";
var lastImgAnim,
    fotoPiccola;
var slidebar;
var nRisultati;

window.onload=function(){
  //inviaRichiesta("results=5&gender=male", aggiornaPagina);
  nRisultati = document.getElementById("NResults");
  typeData = document.getElementsByTagName("h3");
  visData = document.getElementsByTagName("h1");
  avanti = document.getElementById("btnAvanti");
  indietro = document.getElementById("btnIndietro");
  btnOK = document.getElementById("btnOk");
  lastImgAnim = document.getElementById("btnName");
  fotoPiccola = document.getElementById("fotoPiccola");
  nRisultati.addEventListener("change", function () { let txtRis = document.getElementsByTagName("u")[0].innerHTML = nRisultati.value; });
  slidebar = document.getElementById("progress");
  leggiControlli();
}
function inviaRichiesta(parametri, callback) {
  $.ajax({
    url: "https://randomuser.me/api/",
    type: "GET",
    data: parametri,
    contentType: "application/x-www-form-unreloaded; charset=UTF-8",
    dataType: "json",
    async: true,
    timrout: 5000,
    success: callback /*function(data) {
     console.log(data);
     }*/,
    error: function(jqXHR, test_status, str_error) {
      alert("Server error: " + jqHXR.status + " - " + jqHXR.responseText);
    }
  });
}
function leggiControlli()
{
  let gender = document.getElementsByClassName("gender");
  let nationality = document.getElementsByClassName("nationality");
  let nat = false;
  pRichiesta = "results=" + nRisultati.value;
  if (gender[1].checked == true)
    pRichiesta += "&gender=male";
  else
  if (gender[2].checked == true)
    pRichiesta += "&gender=female";
  for (let j = 0; j < 5; j++) {
    if (nat == false)
      pRichiesta += "&nat=";
    if (nationality[j].checked == true) {
      if (nat == true)
        pRichiesta += ",";
      pRichiesta += nationality[j].value.toString();
      nat = true;

    }
  }
  console.log(pRichiesta);
  inviaRichiesta(pRichiesta, aggiornaPagina);
  slidebar.style.width = ( 100 / nRisultati.value) + "%";
}

function inviaRichiesta(parametri,callBack)
{
  $.ajax({
    "url": "https://randomuser.me/api", //default: currentPage
    "type": "GET",
    "data": parametri,
    "contentType": "application/x-www-form-urlencoded; charset=UTF-8",
    "dataType": "json",
    "async" : true, // default
    "timeout" : 5000,
    "success": callBack,
    "error" : function(jqXHR, test_status, str_error){
      alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText); }
  });
}

function aggiornaPagina(data)
{
  console.log(data);
  avanti.addEventListener("click", cambiaPersona);
  indietro.addEventListener("click", cambiaPersona);

  for (let btn of document.querySelectorAll('#buttons li')) {
    btn.addEventListener("mouseover", function() {
      aggiornaDati(this);
    });
  }
  indietro.disabled = true;
  avanti.disabled = false;
  i = 0;
  btnOK.addEventListener("click", leggiControlli);
  datiUtenti = data["results"];
  lastImgAnim = document.getElementById("btnName");
  aggiornaDati(lastImgAnim);
}

function cambiaPersona()
{
  if (this.id == "btnAvanti") {
    if (i == 0)
      indietro.disabled = false;
    i++;
    if (i == datiUtenti.length-1)
      avanti.disabled = true;
  }
  else {
    if (i == datiUtenti.length-1)
      avanti.disabled = false;
    i--;
    if (i == 0)
      indietro.disabled = true;
  }
  lastImgAnim.classList.remove("active");
  lastImgAnim = document.getElementById("btnName");
  aggiornaDati(lastImgAnim);
  slidebar.style.width = (((i+1) * 100) / nRisultati.value) + "%";
}

function aggiornaDati(elem) {
  fotoPiccola.setAttribute("src", datiUtenti[i]["picture"]["large"]);
  if (elem != undefined) {
    animazione(elem);
    switch (elem.id) {
      case "btnMail":
        typeData[0].innerHTML = "My email address is";
        visData[1].innerHTML = datiUtenti[i]["email"];
        break;
      case "btnDob":
        typeData[0].innerHTML = "My birthday is";
        visData[1].innerHTML = datiUtenti[i]["dob"]["date"].split('T')[0];
        break;
      case "btnAdd":
        typeData[0].innerHTML = "My address is"
        visData[1].innerHTML = datiUtenti[i]["location"]["street"]["number"]+" "+datiUtenti[i]["location"]["street"]["name"];
        break;
      case "btnPhone":
        typeData[0].innerHTML = "My phone number is";
        visData[1].innerHTML = datiUtenti[i]["phone"];
        break;
      case "btnPass":
        typeData[0].innerHTML = "My password is";
        visData[1].innerHTML = datiUtenti[i]["login"]["password"];
        break;
      default:
        typeData[0].innerHTML = "Hi my name is";
        visData[1].innerHTML = datiUtenti[i]["name"]["first"] + " " + datiUtenti[i]["name"]["last"];
        break;
    }
  }
  else
  {
    typeData[0].innerHTML = "Hi my name is";
    visData[1].innerHTML = datiUtenti[i]["name"]["first"] + " " + datiUtenti[i]["name"]["last"];
  }
}

function animazione(elem) {
  if (lastImgAnim) {
    lastImgAnim.classList.remove("active");
  }

  elem.classList.add("active");
  lastImgAnim = elem;
}
