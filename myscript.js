//function for uploading image into the user page
imgForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//make visible the spinner
	$('.loading-icon').removeClass('hide');
	$('#upload-text').text('Uploading..');

	const imgForm = document.getElementById('imgForm');
	const inpFile = document.getElementById('inpFile');
	const url =
		'https://api.imgbb.com/1/upload?key=e5b29e6df5494fda797b1bef038a5288';
	const formData = new FormData();

	const file = inpFile.files[0];

	console.log(file);
	if (file) {
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = function (event) {
			const imgElement = document.createElement('img');
			imgElement.src = event.target.result;
			// document.querySelector("#inputImage").src=event.target.result;

			imgElement.onload = function (e) {
				// alert(e.target.height + e.target.width)
				if (e.target.width > 800) {
					const canvas = document.createElement('canvas');
					const MAX_WIDTH = 800;
					const scaleSize = MAX_WIDTH / e.target.width;
					canvas.width = MAX_WIDTH;
					canvas.height = e.target.height * scaleSize;

					const ctx = canvas.getContext('2d');
					ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
					const dataUrl = canvas.toDataURL('image/jpeg');

					const base64img = dataUrl.split(',')[1];

					console.log(base64img);

					formData.append('image', base64img);

					// formData.append("image",dataUrl)
					// console.log(dataUrl);
				} else {
					formData.append('image', inpFile.files[0]);
				}

				fetch(url, {
					method: 'post',
					body: formData,
				})
					.then((res) => {
						// console.log(res)
						return res.json();
					})
					.then((result) => {
						//hide the spinner
						$('.loading-icon').addClass('hide');
						$('#upload-text').text('Upload');

						alert('uploaded successfully');
						console.log(result);
						// Update the relevant fields with the new data.
						const sendingUrl = {
							url: result.data.image.url,
							type: 'image',
						};

						chrome.tabs.query(
							{ active: true, currentWindow: true },
							function (tabs) {
								chrome.tabs.executeScript(
									tabs[0].id,
									{
										file: 'content.js',
									},
									function () {
										chrome.tabs.sendMessage(tabs[0].id, sendingUrl);
									}
								);
							}
						);
					})
					.catch((error) => {
						alert('uploading failed');
						console.log(error);
					});
			};
		};
	}
});



//sending html filename to content.js
$('#fileName').change(function (event) {
	const sendingFileName = {
		fileName: $(this).val(),
		type: 'fileName',
	};

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{
				file: 'content.js',
			},
			function () {
				chrome.tabs.sendMessage(tabs[0].id, sendingFileName);
				console.log('message sent to conetent.js');
			}
		);
	});
});

//function for changing data into table;
function getExcelTable() {
	chrome.storage.local.get(['tableRows', 'preHeader'], function (message) {
		if (message.tableRows) {
			console.log(message);
			// console.log(message.preHeader);

			let table = `<table class="table-striped border-success" id="campaign-table">
        <thead>
            <tr>
            <th data-field="id">
                <span class="text-success">
                Campaign Name
                </span>
            </th>
            <th data-field="name">
                <span class="text-success">
                Campaign Links 
                </span>
            </th>
            </tr>
        </thead>
        `;
			table += '<tbody>';
			let XL_row_object = message.tableRows;

			XL_row_object.forEach(function (row, i) {
				if (row['__EMPTY']) {
					// console.log(row["Aster Online"]);
					table += `<tr>
                <td>${row['__EMPTY']}</td>
                <td><a class="campaign-links" href="${row['Aster Online']}">${row['Aster Online']}<a></td>
            </tr>`;
				}
			});
			table += `</tbody>
            </table>`;

			document.getElementById('linksTable').innerHTML = table;
		}
		//copying campaign links on clipboard
		$('.campaign-links').click(function () {
			//copy text to clipboard
			navigator.clipboard.writeText($(this).attr('href'));
		});
	});
}

//reading excel file data and converting it into table form
$('#fileUploader').change(function (evt) {
	let selectedFile = evt.target.files[0];
	let reader = new FileReader();
	reader.readAsBinaryString(selectedFile);
	reader.onload = function (e) {
		// the files text will be printed here
		// console.log(e.target.result)
		let data = e.target.result;
		let workbook = XLSX.read(data, {
			type: 'binary',
		});

		workbook.SheetNames.forEach(function (sheet, index) {
			if (index == 1) return;

			let XL_row_object = XLSX.utils.sheet_to_row_object_array(
				workbook.Sheets[sheet]
			);
			console.log(XL_row_object);

			var preHeader;

			XL_row_object.forEach(function (row, i) {
				if (row['Campaign Name : '] === 'Pre-header') {
					// console.log(row["Aster Online"])
					preHeader = row['Aster Online'];
				}
			});

			chrome.storage.local.clear(function () {
				error = chrome.runtime.lastError;
				if (error) {
					alert(error);
				}
			});
			//storing table data locally
			chrome.storage.local.set(
				{ tableRows: XL_row_object, preHeader: preHeader },
				function () {
					console.log('your data is saved in local storage');
				}
			);

			getExcelTable();

			reader.onerror = function (event) {
				console.error('File could not be read!' + event.target.error.code);
			};
		});
	};
});

getExcelTable();

