pingServer();
getListNew();
setTimeout(() => {
	console.log('Get New List');
    getListNew();
}, 2000000);
function mappingParam() {
const mappingBtn = document.getElementById("map-btn");
var listParamObj = [];
    var quey = document.getElementById("queyinput").value
    var param = document.getElementById("paramInput").value
    var listParam = param.split(',');
    for (let i = 0; i < listParam.length; i++) {
        listParam[i].trim();
        if(!listParam[i].includes('(') || !listParam[i].includes(')')){
            if(listParam[i].trim() !== "null"){
                showToast(4, "Input valid, try again or view tutorial")
                return
            }
        }
        var arr = listParam[i].split("(");
        var vl = arr[0].trim();
        var type = arr[1];
        if (type !== "" && type !== undefined && type !== null) {
            type = type.substring(0, type.length - 1);
        } else if(type == undefined && vl === "null"){
            type = null;
        } else {
           showToast(4, "Input valid, try again or view tutorial")
            return
        }
        const paramObj = {
            vl: vl,
            type: type,
            index: i
        };
        listParamObj.push(paramObj);
    }
    var count = 0;
    for (var i = 0; i < quey.length; i++) {
        if (quey[i] === "?") {
            quey = setCharAt(quey, i, getPramByIndex(count, listParamObj));
            count++;
        }
    }

    if (listParamObj.length !== count) {
        showToast(4, "Input valid, try again or view tutorial")
        return
    }
 
  mappingBtn.classList.add("loading");
    $.ajax({
        url: 'https://sqlformat.org/api/v1/format',
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        data: {
            sql: quey,
            reindent: 1
        },
        success: (data) => {
            document.getElementById('result').value = data.result;
            showToast(2,"Mapping Param To Query Success")
            mappingBtn.classList.remove("loading")
        },
        error:() =>{
          showToast(3,"Mapping Param Erorr Please Try Again!")
          mappingBtn.classList.remove("loading")
        },
        done: () => {
            mappingBtn.classList.remove("loading")
        }
    });
}

function getPramByIndex(indexs,listParamObj) {
    for (let index = 0; index < listParamObj.length; index++) {
        const element = listParamObj[index];
        if (element.index == indexs) {
            var vl;
            if (element.type !== null) {
                switch (element.type.toLowerCase()) {
                    case "string":
                        vl = '"' + element.vl.trim() + '"'
                        break;
                    case "timestamp":
                        vl = '"' + element.vl.trim() + '"'
                        break;
                    default:
                        vl = element.vl;
                }
            } else {
                vl = element.vl;
            }
        }
    }
    return vl;
}


function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function copy() {
    var text = document.getElementById("result").value;
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text; //save main text in it
    sampleTextarea.select(); //select textarea contenrs
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
    showToast(1, "Copied SQL !")
}


async function pasteQuery() {
    const text = await navigator.clipboard.readText();
    $("#queyinput").val(text);
}

async function pasteParm() {
    const text = await navigator.clipboard.readText();
    $("#paramInput").val(text);
}

function pingServer(){
    var ipclient = "NaN"
    $.getJSON("https://api.ipify.org?format=json", function(data) {
        ipclient = data.ip;
       $.ajax({
        url: 'https://etaservice.ekysofts.xyz/api/v1/free/app/ping',
        // url: 'http://localhost:8088/api/v1/free/app/ping',
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        data: {
            appName : "MAP",
            ipAddress : ipclient
        },
        success: (data) => {
           $("#notify").html(data.lastNotify)
        },
        done: () => {

        }
    });
   })

    
}



///////////////////////
function showToast(type,message){
    switch(type) {
      case 1:
        iziToast.show({
          theme: 'dark',
          position : "bottomLeft",
          displayMode: 'replace',
          message: message,
          progressBarColor: 'rgb(0, 255, 184)',
        });
        break;
      case 2:
        iziToast.success({
          displayMode: 'replace',
          position : "bottomLeft",
          message: message,
        });
        break;
        case 3:
          iziToast.error({
          displayMode: 'replace',
          position : "bottomLeft",
          message:message,
        });
        break;
          case 4:
            iziToast.warning({
                 displayMode: 'replace',
                 position : "bottomLeft",
                 message:message,
              });
        break;
    }
  }



  function timingCalc(endtime) {
    var timeTotal = Date.parse(endtime) - Date.parse(new Date()),
        timeHours = Math.floor((timeTotal / (1000 * 60 * 60)) % 24),
        timeDays = Math.floor(timeTotal / (1000 * 60 * 60 * 24));
    
    return {
        'total': timeTotal,
        'hours': timeHours,
        'days': timeDays
    };
    
}


function installCalc(id, endtime) {
    var calc = document.getElementById(id),
        daySpan = calc.querySelector(".days"),
        hourSpan = calc.querySelector(".hours")
    function startCalc() {
        var timeTotal = timingCalc(endtime);
        daySpan.innerHTML = timeTotal.days;
        hourSpan.innerHTML = ("0" + timeTotal.hours).slice(-2);
        if (timeTotal.total <= 0) {
            clearInterval(timingNow);
        }
    }
    startCalc();
    var timingNow = setInterval(startCalc, 3000000);
}

var tetDate = new Date(Date.parse(new Date('2023-01-22T00:00:00')));
installCalc("countDiv", tetDate);

// Get News
function getListNew() {
    $("#divNews").html("");
    $.ajax({
        url: 'https://etaservice.ekysofts.xyz/api/v1/free/app/news/last',
        // url: 'http://localhost:8088/api/v1/free/app/news/last',
        type: 'GET',
        success: (data) => {
            if(data){
               var listNew = JSON.parse(data); 
               if(listNew.length > 0){
                listNew.forEach(n => {
                   var newsHtml = `
                   <li class="li-new-item" style="display:none;">
                    <a href="${n.urlFull}" target="_blank" ">
                     <div class="row">
                       <div class="col-3">
                         <img class="thumbNew" src="${n.urlThumbImage}" alt="">
                        ${getLogoNew(n.source)}
                       </div>
                       <div class="col-9">
                       <p class="title-new" ${checkTooltip(n.title)} >${n.title}</p>
                       </div>
                   </div>
                   </a>
                 </li>
                   `
                   $(newsHtml).appendTo('#divNews').fadeIn('slow');
                });
            }
            loadTooltip();
            }
        },
        done: () => {

        }
    });
}

function loadTooltip(){
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
}

function getLogoNew(source) {
    if(source == "GenK"){
      return `
      <span class="genk-tag">
      <img class="genk-lg" src="https://static.mediacdn.vn/genk/web_images/logogenk.svg" alt="">
      </span>
      `
    } else if(source == "Kenh14"){
        return `
        <span class="kenh14-tag">
        <img class="kenh14-lg" src="https://kenh14cdn.com/web_images/k14_logo2022.svg" alt="">
      </span>`

    } else if(source == "CafeBiz"){
        return `
         <span class="cafebiz-tag">                         
        <img class="cafebiz-lg" src="https://cafebiz.cafebizcdn.vn/web_images/cafebiz_logo_30052022.svg" alt="">
        </span>`
    }
    else{
        return `
          <span class="cafebiz-tag">                         
          NaN
         </span>
        `
    }
}

function checkTooltip(title){
    if(title.length > 80){
        return `
        data-bs-toggle="tooltip" title="${title}" 
        `
    } 
     return '';
}