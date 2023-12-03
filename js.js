pingServer();

getListNew();

setInterval(getListNew, 30 * 60 * 1000);

var listHistory = [];

initHistory();



const socket = new SockJS('https://service.etasoft.tech/websocket');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    const subscription1 = stompClient.subscribe('/topic/onlineUsers', function (response) {
        const onlineUsers = JSON.parse(response.body);
        document.getElementById('usersOnlines').innerText = onlineUsers / 2;
    });

    stompClient.send('/app/requestEndpoint', {}, JSON.stringify({ key: 'value' }));
    const subscription2 = stompClient.subscribe('/topic/onlineUserNow', function (response) {
        const onlineUsers = JSON.parse(response.body);
        document.getElementById('usersOnlines').innerText = onlineUsers / 2;
    });
});



function mappingParam() {
    const mappingBtn = document.getElementById("map-btn");
    var listParamObj = [];
    var quey = document.getElementById("queyinput").value
    var queyOri = document.getElementById("queyinput").value
    var param = document.getElementById("paramInput").value
    var listParam = splitParameters(param);
    for (let i = 0; i < listParam.length; i++) {
        listParam[i].trim();
        if (!listParam[i].includes('(') || !listParam[i].includes(')')) {
            if (listParam[i].trim() !== "null") {
                showToast(4, "Input valid, try again or view tutorial")
                return
            }
        }
        var arr = listParam[i].split("(");
        var vl = arr[0].trim();
        var type = arr[1];
        if (type !== "" && type !== undefined && type !== null) {
            type = type.substring(0, type.length - 1);
        } else if (type == undefined && vl === "null") {
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
            pushHistorty(data.result, queyOri, param);
            showToast(2, "Mapping Param To Query Success")
            mappingBtn.classList.remove("loading")

        },
        error: () => {
            showToast(3, "Mapping Param Erorr Please Try Again!")
            mappingBtn.classList.remove("loading")
        },
        done: () => {
            mappingBtn.classList.remove("loading")
        }
    });
}

function splitParameters(inputString) {
    const results = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];

        if (char === '{' || char === '[' || char === '(') {
            depth++;
        } else if (char === '}' || char === ']' || char === ')') {
            depth--;
        }

        if (char === ',' && depth === 0) {
            results.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    results.push(current.trim());

    return results;
}

function getPramByIndex(indexs, listParamObj) {
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
                    case "localdate":
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

function pingServer() {
    $.ajax({
        url: 'https://service.etasoft.tech/api/v1/free/app/ping',
        // url: 'http://localhost:8088/api/v1/free/app/ping',
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        data: {
            appName: "MAP",
            ipAddress: "888.8.8.8.8"
        },
        success: (data) => {
            $("#notify").html(data.lastNotify)
            $("#totalVisit").html(data.totalVisit)
        },
        done: () => {

        }
    });

}



///////////////////////
function showToast(type, message) {
    switch (type) {
        case 1:
            iziToast.show({
                theme: 'dark',
                position: "bottomLeft",
                displayMode: 'replace',
                message: message,
                progressBarColor: 'rgb(0, 255, 184)',
            });
            break;
        case 2:
            iziToast.success({
                displayMode: 'replace',
                position: "bottomLeft",
                message: message,
            });
            break;
        case 3:
            iziToast.error({
                displayMode: 'replace',
                position: "bottomLeft",
                message: message,
            });
            break;
        case 4:
            iziToast.warning({
                displayMode: 'replace',
                position: "bottomLeft",
                message: message,
            });
            break;
    }
}


// Get News
function getListNew() {
    $("#divNews").html("");
    $.ajax({
        url: 'https://service.etasoft.tech/api/v1/free/app/news/last',
        // url: 'http://localhost:8088/api/v1/free/app/news/last',
        type: 'GET',
        success: (data) => {
            if (data) {
                var listNew = JSON.parse(data);
                if (listNew.length > 0) {
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

function loadTooltip() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function getLogoNew(source) {
    if (source == "GenK") {
        return `
      <span class="genk-tag">
      <img class="genk-lg" src="https://static.mediacdn.vn/genk/web_images/logogenk.svg" alt="">
      </span>
      `
    } else if (source == "Kenh14") {
        return `
        <span class="kenh14-tag">
        <img class="kenh14-lg" src="https://kenh14cdn.com/web_images/k14_logo2022.svg" alt="">
      </span>`

    } else if (source == "CafeBiz") {
        return `
         <span class="cafebiz-tag">                         
        <img class="cafebiz-lg" src="https://cafebiz.cafebizcdn.vn/web_images/cafebiz_logo_30052022.svg" alt="">
        </span>`
    }
    else {
        return `
          <span class="cafebiz-tag">                         
          NaN
         </span>
        `
    }
}

function checkTooltip(title) {
    if (title.length > 80) {
        return `
        data-bs-toggle="tooltip" title="${title}" 
        `
    }
    return '';
}

function pushHistorty(result, query, param) {
    const item = {
        result: result,
        query: query,
        param: param,
        id: listHistory.length
    }
    listHistory.reverse();
    listHistory.push(item);
    localStorage.setItem("listHistory", JSON.stringify(listHistory));
    initHistory();
}

function initHistory() {
    listHistory = JSON.parse(localStorage.getItem("listHistory", listHistory));
    if (listHistory == null) {
        listHistory = [];
    }
    $('#divHisto').html('');
    listHistory.reverse();
    listHistory.forEach(n => {
        if (n != null) {

            var toolTipText = n.result.replaceAll('"', "'");
            var hisItem = `
                   <li class="li-new-item" >
                   <div >
                     <div class="row">
                       <div class="col-10"  data-bs-toggle="tooltip" title="${toolTipText}">
                        <p class="title-new query-his" onclick="appplyQuery(${n.id})" >${n.result} </p>
                       </div>
                       <div class="col-2">
                           <button class="btn-his cr-red" onclick="removeQuery(${n.id})" >✘</button>
                       </div>
                   </div>
                   </div>
               </li>
                   `
            $(hisItem).appendTo('#divHisto').fadeIn('slow');
        };
    });
    loadTooltip();
}


function appplyQuery(id) {
    var length = listHistory.length;
    var index = length - 1 - id;
    const itemPick = listHistory[index];
    if (itemPick != null) {
        document.getElementById('result').value = itemPick.result;
        document.getElementById("queyinput").value = itemPick.query;
        document.getElementById("paramInput").value = itemPick.param;
        showToast(1, "Apply history success!")
    }
}

function removeQuery(id) {
    var length = listHistory.length;
    var index = length - 1 - id;
    listHistory[index] = null;
    listHistory.reverse();
    localStorage.setItem("listHistory", JSON.stringify(listHistory));
    initHistory();
}

