
// // Inform the background page that 
// // this tab should have a page-action.
// chrome.runtime.sendMessage({
//   from: 'content',
//   subject: 'showPageAction',
//   // loadImageButton
// });

// // Listen for messages from the popup.
// chrome.runtime.onMessage.addListener((msg, sender, response) => {
//   // First, validate the message's structure.
//   if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
//     // Collect the necessary data. 
//     // (For your specific requirements `document.querySelectorAll(...)`
//     //  should be equivalent to jquery's `$(...)`.)
//     console.log("hi from content.js")
//     var domInfo = {
//       loadImageButton:loadImageButton
//     };

//     // Directly respond to the sender (popup), 
//     // through the specified callback.
//     response(domInfo);
//   }
// });



const gotUrl=(message,sender,sendResponse)=>{
    console.log(message.url)
    // url=message.url
    var loadImageButton= document.getElementsByClassName("step")[0].lastElementChild;
    loadImageButton.click();
    var modalInput= document.getElementById("image-mapper-url");
    modalInput.value=message.url
    let continueButton=document.getElementById("image-mapper-continue");    
    continueButton.disabled=false
    continueButton.click();
    
}
chrome.runtime.onMessage.addListener(gotUrl);
