

var listParamObj = [];

function mappingParam() {
  var quey = document.getElementById("queyinput").value
  var param = document.getElementById("paramInput").value
  console.log(quey);
  console.log(param);



    var listParam = param.split(',');
for (let i = 0; i < listParam.length; i++) {
    listParam[i].trim();
    var arr = listParam[i].split("(");
    var vl = arr[0];
    var type = arr[1];
    console.log(type);
    if(type !== "" && type !== undefined && type !== null){
        type = type.substring(0, type.length - 1);
    } else {
        type = null;
    }

    const paramObj = {
        vl: vl,
        type: type,
        index: i
    };

    listParamObj.push(paramObj);
}

var indices = [];
var count = 0;
for(var i=0; i<quey.length;i++) {
    if (quey[i] === "?"){
        quey = setCharAt(quey,i,getPramByIndex(count));
        count++;
    }
}
    $.ajax({
        url: 'https://sqlformat.org/api/v1/format',
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        data: {sql: quey, reindent: 1},
        success: (data)=>{
              document.getElementById('result').value = data.result;
                $("#loadingModal").modal('hide');
        },
        done: ()=>{
            $("#loadingModal").modal('hide');

        }
    });

}

function getPramByIndex(indexs) {
    for (let index = 0; index < listParamObj.length; index++) {
        const element = listParamObj[index];
        if(element.index == indexs){
            var vl;
            if(element.type !== null){
                switch (element.type.toLowerCase()) {
                    case "string":
                        vl = '"'+element.vl.trim()+'"'
                        break;
                        case "timestamp":
                        vl = '"'+element.vl.trim()+'"'
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


function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function copy() {
    var text = document.getElementById("result").value;
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text; //save main text in it
    sampleTextarea.select(); //select textarea contenrs
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
  }
<<<<<<< HEAD
  

  async  function  pasteQuery(){
    const text = await navigator.clipboard.readText();
    $("#queyinput").val(text);
  }

  async  function  pasteParm(){
    const text = await navigator.clipboard.readText();
    $("#paramInput").val(text);
  }
=======

function removeNotification(){
  $("#noti").remove();
}
  
>>>>>>> 0b476fb7c367570303a2c3bcca8786e45ec34319
