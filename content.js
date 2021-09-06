
const gotUrl=(message,sender,sendResponse)=>{
    // console.log(message)
    // url=message.url
    if(message.type=="image"){
        var loadImageButton= document.getElementsByClassName("step")[0].lastElementChild;
        loadImageButton.click();
        var modalInput= document.getElementById("image-mapper-url");
        modalInput.value=message.url
        let continueButton=document.getElementById("image-mapper-continue");    
        continueButton.disabled=false
        continueButton.click();
      
    }

    else{
                      
            $("#downloadButton").attr("download",`${message.fileName}.html`)
            
    }
    
}
chrome.runtime.onMessage.addListener(gotUrl);



// crating a download html file button
var htmlFileButton=`<a class="btn btn-success btn-lg" id="downloadButton" style="margin-left:5px;" download="aster.html">Download</a>`        

//adding download button beside show me code button
$("div.segment button").after(htmlFileButton);


//getting preHeader from local storage
var header;
chrome.storage.local.get(['tableRows','preHeader'],function(message){
    console.log(message.preHeader)
    // preHeader=message.preHeader;
    header=`<p style='color: gray; font-family: Verdana, Geneva, sans-serif; font-size: 11px; line-height: 13px; text-align: center; width: 800px'>${message.preHeader}</p>`
})

$("#downloadButton").click(function(){
    //when the user clicks on download button then show me code button and its download button gets closed
    $("div.segment button").click();
    $(".modal-header  button").click();
    
 
    const htmlFileData=document.getElementById("modal-code-result").value;
        // console.log(htmlFileData)
        // console.log(preHeader)
        const footer=`<p style='color: gray; font-family: Verdana, Geneva, sans-serif; font-size: 11px; line-height: 13px; text-align: center; width: 800px'> To remove your email address from our mailing list please click on&nbsp;<a href='{{{unsubscribe}}}'>unsubscribe</a></p>`
        let blob= new Blob([header,htmlFileData,footer],{type:"text/plain;charset=utf-8"})
        $(this).attr("href",URL.createObjectURL(blob));
   
    
});
   



