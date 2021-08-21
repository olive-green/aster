const imgForm=document.getElementById("imgForm");
const inpFile=document.getElementById("inpFile");

imgForm.addEventListener("submit", e =>{
    e.preventDefault();

    const url="https://api.imgbb.com/1/upload?key=e5b29e6df5494fda797b1bef038a5288";
    const formData= new FormData();

    formData.append("image",inpFile.files[0]);

    fetch(url,{
        method:"post",
        body:formData
    }).then(res =>{
        alert("uploaded successfully")
        // console.log(res)
        return res.json();
    })
    .then(result=> {
        console.log(result)
       // Update the relevant fields with the new data.
        const sendingUrl = {
          url:result.data.display_url
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.executeScript(tabs[0].id, {
              file: "content.js"
          }, function(){
              chrome.tabs.sendMessage(tabs[0].id,sendingUrl);
          });
      });

    })
    .catch(error=>{
        alert("uploading failed")
        console.log(error)
    }) 
})


$(document).ready(function(){
    $("#fileUploader").change(function(evt){
        let selectedFile=evt.target.files[0];
        let reader= new FileReader()
        reader.readAsBinaryString(selectedFile)
        reader.onload= function(e){
            // the files text will be printed here
            // console.log(e.target.result)
            let data=e.target.result;
            let workbook=XLSX.read(data,{
                type:"binary"
            });

            workbook.SheetNames.forEach(function(sheet){
                let XL_row_object=XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
                let json_object=JSON.stringify(XL_row_object)
                console.log(json_object);

                // let table=document.getElementById("urlTable");
                 // Use the given data to create 
                // the table and display it
                $('table').bootstrapTable({
                    data: json_object
                });
                
                // console.log(table)
                // for(let i=10;i<=28;i++){
                    // <td>${json_object[i].__EMPTY}</td>
                    // <td>${json_object[i]["Aster Online"]}</td>
                   
                
            })

            reader.onerror= function(event){
                console.error("File could not be read!"+ event.target.error.code)
            }
        }
        
    })
})
















// $("#test-btn").on("click", function() {

//     var formData = new FormData();
//     let inpFile=document.getElementById("inpFile");
//     $("#img").on("change",function(){
//         if(formData){
//             formData.append("inpFile",inpFile.files[0]);
//             $.ajax({
//                 url : `https://api.imgbb.com/1/upload?key=e5b29e6df5494fda797b1bef038a5288`,
//                 type : 'POST',
//                 processData: false,
//                 contentType: false,
//                 data:formData,
                    
//                 success : function(){
//                     alert("data send successfully");
//                     console.log(data)
        
//                 },
//                 error : function(e){
//                     alert("data doesnt sends",e);
//                     console.log(e)}
//             });
//         }
//     })

// });