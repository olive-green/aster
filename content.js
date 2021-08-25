const gotUrl=(message,sender,sendResponse)=>{
    // console.log(message.url)
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
    else {
        console.log(message.url);
        
        //getting image-mapper-table
        const mapperTableInputs=document.getElementById("image-mapper-table").getElementsByTagName("input");

        // console.log(mapperTableInputs)

        for(var i = 0; i < mapperTableInputs.length; i++){
            if(mapperTableInputs[i].type === "radio" & mapperTableInputs[i].checked===true){
                // console.log(mapperTableInputs[i]);
                console.log(mapperTableInputs[i].parentElement.parentElement.nextSibling.nextSibling.firstChild);
                mapperTableInputs[i].parentElement.parentElement.nextSibling.nextSibling.firstChild.value=message.url;

            }
        }
        
    }
    
}
chrome.runtime.onMessage.addListener(gotUrl);


// const gotCampaingUrl=(message,sender,sendResponse)=>{
//     console.log(message);
// }
// chrome.runtime.onMessage.addListener(gotCampaingUrl);

