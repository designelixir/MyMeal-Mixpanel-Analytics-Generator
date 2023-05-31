window.jsPDF = window.jspdf.jsPDF;
//Parse the CSV file. 
function handleFile(fileName, resultTargetDiv) {
    const fileInput = document.getElementById(fileName);
    const file = fileInput.files[0];
    parseCSVFile(file, resultTargetDiv);
  }


// Depending on where the CSV file was parsed, do different things: 
function parseCSVFile(file, targetDiv) {
  const reader = new FileReader();
  reader.onload = function(event) {
  const csvData = event.target.result;
  const rows = csvData.split('\n'); 
  const headerRowParse = rows[0]; // Remove the header row if it exists
  const headers = headerRowParse.split(',');
  const dataRows = rows.slice(1);
  if (targetDiv === "file1-results"){
    const headerDate = headers[3] + headers[4] + headers[5];
    const dateRangeFormatted = formatDateRange(headerDate);
    file1Analyze(dataRows, targetDiv, dateRangeFormatted)
  } else if (targetDiv === "file2-results"){
     file2Analyze(dataRows, targetDiv)
  } else if (targetDiv === "file3-results"){
    file3Analyze(dataRows, targetDiv)
  }
   else if (targetDiv === "file4-results"){ 
     file4Analyze(dataRows, targetDiv)
  }  else if (targetDiv === "file5-results"){
      file5Analyze(dataRows, targetDiv)
  }
};

reader.onerror = function() {
  console.error('Error occurred while reading the file.');
};

reader.readAsText(file);

}

function removeNullValues(parsedData) {return parsedData.filter( Boolean );}

function formatDateRange(dateRangeString) {
    const dateRegex = /(\w{3} \d{1,2} \d{4})/g;
    const dates = dateRangeString.match(dateRegex);
    
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedStartDate = startDate.toLocaleDateString('en-US', options);
    const formattedEndDate = endDate.toLocaleDateString('en-US', options);
    
    const formattedString = `${formattedStartDate} - ${formattedEndDate}`;
    return formattedString;
  }
  
  function downloadDivAsPDF(divId, filename) {
    const element = document.getElementById(divId);
    if (!element) {
      console.error(`Element with ID '${divId}' not found.`);
      return;
    }
  
    // Create a new jsPDF instance
    const pdf = new jsPDF();
  
    // Get the dimensions of the div element
    const width = element.offsetWidth;
    const height = element.offsetHeight;
  
    // Convert the div element to a canvas
    html2canvas(element, { scale: 2 }).then(canvas => {
      // Create an image data URL from the canvas
      const imageData = canvas.toDataURL('image/png');
  
      // Add the image to the PDF
      pdf.addImage(imageData, 'PNG', 0, 0, width, height);
  
      // Save the PDF
      pdf.save(filename);
    });
  }