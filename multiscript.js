// Function to handle file import for File 1


function handleFile(fileName, resultTargetDiv) {
    const fileInput = document.getElementById(fileName);
    const file = fileInput.files[0];
    parseCSVFile(file, resultTargetDiv);
  }

function formatDateRange(dateRangeString) {
  const dateRegex = /(\w{3} \d{1,2} \d{4})/g;
  const dates = dateRangeString.match(dateRegex);
  
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[1]);
  
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedStartDate = startDate.toLocaleDateString('en-US', options);
  const formattedEndDate = endDate.toLocaleDateString('en-US', options);
  
  const formattedString = `${formattedStartDate} - ${formattedEndDate}`;
  console.log(formattedString + "is date")
  return formattedString;
}



function parseCSVFile(file, targetDiv) {
    const reader = new FileReader();
    reader.onload = function(event) {
    const csvData = event.target.result;
    const rows = csvData.split('\n'); 
    const headerRowParse = rows[0]; // Remove the header row if it exists
    const headers = headerRowParse.split(',');
    const dataRows = rows.slice(1);
    const headerDate = headers[3] + headers[4] + headers[5];
    const dateRangeFormatted = formatDateRange(headerDate);
    console.log(dateRangeFormatted)
    if (targetDiv === "file1-results"){
       const parsedDataUnclean = dataRows.filter( Boolean ).map(row => {
        const values = row.split(',');

        // get the number of sessions that lasted x time 
        const date = values[0];
        const restaurantName = values[2]
        const pageViews = Number(values[3])
        return { date, restaurantName, pageViews };
        
        });
        const parsedData = removeNullValues(parsedDataUnclean);
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedData, null, 2);

        const headerDate = headers[3] + headers[4] + headers[5];
        const dateRange = headerDate.replace(/"/g, '');
        createRestaurantDivs(parsedData, dateRange);
        pageViewPivot(parsedData);
        // createLineGraph(parsedData);
        createRestaurantData(parsedData);
        

   
    
    } else if (targetDiv === "file2-results"){
        const parsedRetentionDataUnclean = dataRows.map(row => {
        const values = row.split(',');
        
        if (values[0] === "$overall" || values[0] === "" || values[0] === "undefined"){
          console.log("skipped blank value")
        } else {
          const restaurant = values[0]
          const viewAllergyMenu = Number(values[1]);
          const seeMenuButton = Number(values[2]);
          const menuCardClicked = Number(values[3]);
          const orderOnlineClicked = Number(values[4])
          createUserRetentionStructure(restaurant)
          
          return {restaurant, viewAllergyMenu, seeMenuButton, menuCardClicked, orderOnlineClicked};
        }
       
       
        
        });
        
        console.log(parsedRetentionDataUnclean)
        const parsedRetentionData = removeNullValues(parsedRetentionDataUnclean);
        console.log(parsedRetentionData)
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedRetentionData, null, 2);
        createUserRetentionGraph(parsedRetentionData)
    } else if (targetDiv === "file3-results"){
      const parsedSessionDataUnclean = dataRows.filter( Boolean ).map(row => {
        const values = row.split(',');
        const date = values[0];
        const sessionLength = values[2];
        const restaurantUrl = values[3];
        const sessionCount = Number(values[4])
        return { date, sessionLength, restaurantUrl, sessionCount };
        
        });
        const parsedSessionData = removeNullValues(parsedSessionDataUnclean);
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedSessionData, null, 2);
        createSessionDataPivot(parsedSessionData)

       
        //createRestaurantDivs(parsedData, dateRange);
        //pageViewPivot(parsedData);
        // createLineGraph(parsedData);
        //createRestaurantData(parsedData);
    }
     else if (targetDiv === "file4-results"){ 
        const parsedAllergenData = dataRows.filter( Boolean ).map(row => {
            const values = row.split(',');
    
            // get the number of sessions that lasted x time 
            
            const allergen = values[1].trim()
            const restaurant = values[2]
            const totalSelections = Number(values[3])
            return {allergen, restaurant, totalSelections};
            
            });
            generateRestaurantAllergenSummary(parsedAllergenData)
            const resultDiv = document.getElementById(targetDiv);
            resultDiv.textContent = JSON.stringify(parsedAllergenData, null, 2);
    }  else if (targetDiv === "file5-results"){
        const parsedData = dataRows.map(row => {
            const values = row.split(',');
    
            // get the number of sessions that lasted x time 
            const date = values[0].trim();
            const restaurant = values[2];
            const menuItem = values[3];
            
            return {date, restaurant, menuItem};
            
            });
            const resultDiv = document.getElementById(targetDiv);
            resultDiv.textContent = JSON.stringify(parsedData, null, 2);
        }
    
};

reader.onerror = function() {
    console.error('Error occurred while reading the file.');
};

reader.readAsText(file);

}


function generateRestaurantAllergenSummary(parsedAllergenData, restaurantName) {
  const restaurantSummary = {};
  
  parsedAllergenData.forEach(item => {
    const { allergen, restaurant, totalSelections } = item;
    
    if (!restaurantSummary[restaurant]) {
      restaurantSummary[restaurant] = {};
    }
    
    if (restaurantSummary[restaurant][allergen]) {
      restaurantSummary[restaurant][allergen] += totalSelections;
    } else {
      restaurantSummary[restaurant][allergen] = totalSelections;
    }
    const targetDivId = restaurantName;
    createAllergenTable(restaurantSummary, targetDivId )
  });
  console.log(restaurantSummary)
  
 
  return restaurantSummary;
}

function createAllergenTable(restaurantSummary, restaurantName) {
  const targetDiv = document.getElementById(restaurantName);
  
  // Create a new div for the allergen table
  const allergenTableDiv = document.createElement('div');
  allergenTableDiv.classList.add('allergen-table');
  
  // Create the table element
  const table = document.createElement('table');
  
  // Create the table headers
  const tableHeaders = ['Restaurant'].concat(Object.keys(restaurantSummary));
  const headerRow = document.createElement('tr');
  
  tableHeaders.forEach(headerText => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  
  table.appendChild(headerRow);
  
  // Create the table rows with data
  for (const restaurant in restaurantSummary) {
    const rowData = [restaurant].concat(Object.values(restaurantSummary[restaurant]));
    const row = document.createElement('tr');
    
    rowData.forEach(cellData => {
      const cell = document.createElement('td');
      cell.textContent = cellData;
      row.appendChild(cell);
    });
    
    table.appendChild(row);
  }
  
  // Append the table to the allergen table div
  allergenTableDiv.appendChild(table);
  
  // Append the allergen table div to the target div
  targetDiv.appendChild(allergenTableDiv);
}









for (const restaurant in restaurantSummary) {
  const allergenChartDiv = document.createElement('div');
  allergenChartDiv.classList.add('allergen-chart');
  
  const allergenTable = createAllergenTable(restaurantSummary[restaurant]);
  allergenChartDiv.appendChild(allergenTable);

  const restaurantDivId = restaurant;
  const targetDiv = document.getElementById(restaurantDivId);
  if (targetDiv) {
    targetDiv.appendChild(allergenChartDiv);
  }
}


function createSessionDataPivot(parsedSessionData){
  document.getElementById('session-time-container').classList.remove('unfinished-shadow');
  document.getElementById('allergen-container').style.display = "block"
}






  
function createUserRetentionStructure(restaurant){
  const pdfContainer = document.getElementById(restaurant);
  
  
  const retentionContainer = document.createElement('div');
  retentionContainer.className = "retention-container";
  pdfContainer.appendChild(retentionContainer);

  const retentionTitle = document.createElement('h2'); 
  retentionTitle.innerHTML = "User Retention"
  const retentionDescription = document.createElement('p')
  retentionDescription.innerHTML = "A session starts when the user clicks 'View Allergy Menu'. Each session tracks interaction with menu items, and your order online button (if applicable)."
  retentionContainer.appendChild(retentionTitle)
  retentionContainer.appendChild(retentionDescription)

  const retentionChart = document.createElement('div');
  retentionChart.id = restaurant+'-retention-chart';
  retentionChart.className = "retention-chart";

  
  pdfContainer.appendChild(retentionChart)
  
}

function createUserRetentionGraph(parsedRetentionData){
  document.getElementById('user-retention-container').classList.remove('unfinished-shadow')
  document.getElementById('session-time-container').style.display = "block"
  // Loop through each item in parsedRetentionData
parsedRetentionData.forEach(item => {
  const restaurant = item.restaurant;
  const viewAllergyMenu = item.viewAllergyMenu;
  const seeMenuButton = item.seeMenuButton;
  const menuCardClicked = item.menuCardClicked;
  const orderOnlineClicked = item.orderOnlineClicked;
 console.log(restaurant)
  
  const graphContainer = document.createElement('canvas')
  // Append the graph container to the existing div with id "restaurant"
  const restaurantDiv = document.getElementById(restaurant+'-retention-chart')
  restaurantDiv.appendChild(graphContainer);

  // Create the bar graph using Chart.js
  new Chart(graphContainer, {
    type: 'bar',
    data: {
      labels: ['1.View Allergy Menu', '2.See Menu', '3.Menu Card', '4.Order Online'],
      datasets: [
        {
          label: 'Retention',
          data: [viewAllergyMenu, seeMenuButton, menuCardClicked, orderOnlineClicked],
          backgroundColor: 'orange',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: { x: {gridLines: {color: "rgba(0,0,0,0"}},
        y: {
          beginAtZero: true,
          max: Math.ceil(Math.max(viewAllergyMenu)),
          stepSize: 1
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }, 
      
    }
  });
});

}

  function downloadAsPDF(restaurant) {
    const content = document.getElementById(restaurant);

    // Create a new jsPDF instance
    const pdf = new jspdf.jsPDF();

    // Convert the content to a canvas element
    html2canvas(content)
      .then(canvas => {
        // Get the canvas data as an image
        const imageData = canvas.toDataURL('image/png');

        // Add the image to the PDF
        pdf.addImage(imageData, 'PNG', 10, 10, 190, 0);

        // Save the PDF file
        pdf.save(restaurant+'-report.pdf');
      });
  }