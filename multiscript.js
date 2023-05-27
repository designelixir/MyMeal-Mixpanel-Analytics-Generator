// Function to handle file import for File 1


function handleFile(fileName, resultTargetDiv) {
    const fileInput = document.getElementById(fileName);
    const file = fileInput.files[0];
    parseCSVFile(file, resultTargetDiv);
  }
  

function parseCSVFile(file, targetDiv) {
    const reader = new FileReader();
    reader.onload = function(event) {
    const csvData = event.target.result;
    const rows = csvData.split('\n'); 
    const headerRowParse = rows[0]; // Remove the header row if it exists
    const headers = headerRowParse.split(',');
    const dataRows = rows.slice(1);
    
    
    if (targetDiv === "file1-results"){
    const parsedData = dataRows.map(row => {
        const values = row.split(',');
        // get the number of sessions that lasted x time 
        const date = values[0];
        const session = values[2]
        const restaurant = values[3]
        const sessionCount = Number(values[4])
        return { date, session, restaurant, sessionCount };
        });
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedData, null, 2);
    
    } else if (targetDiv === "file2-results"){
    const parsedData = dataRows.map(row => {
        const values = row.split(',');

        // get the number of sessions that lasted x time 
        const date = values[0];
        const restaurantName = values[2]
        const pageViews = Number(values[3])
        return { date, restaurantName, pageViews };
        
        });
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedData, null, 2);

        const headerDate = headers[3] + headers[4] + headers[5];
        const dateRange = headerDate.replace(/"/g, '');
        createRestaurantDivs(parsedData, dateRange);
        pageViewPivot(parsedData);
        // createLineGraph(parsedData);
        createRestaurantData(parsedData);
        


    } else if (targetDiv === "file3-results"){
        const parsedData = dataRows.map(row => {
            const values = row.split(',');
    
            // get the number of sessions that lasted x time 
            
            const allergen = values[1].trim()
            const restaurant = values[2]
            const totalSelections = Number(values[3])
            return {allergen, restaurant, totalSelections};
            
            });
            const resultDiv = document.getElementById(targetDiv);
            resultDiv.textContent = JSON.stringify(parsedData, null, 2);
    } else if (targetDiv === "file4-results"){
        const parsedData = dataRows.map(row => {
            const values = row.split(',');
    
            // get the number of sessions that lasted x time 
            
            const restaurant = values[0].trim()
            const totalAudience = Number(values[1]);
            const seeMenuButtonClicks = Number(values[2]);
            const menuCardClicks = Number(values[3]);
            const orderOnlineClicks = Number(values[4]);
            return {restaurant, totalAudience, seeMenuButtonClicks, menuCardClicks, orderOnlineClicks};
            
            });
            const resultDiv = document.getElementById(targetDiv);
            resultDiv.textContent = JSON.stringify(parsedData, null, 2);
    } else if (targetDiv === "file5-results"){
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

function createRestaurantData(parsedData) {
    const restaurantData = {};
  
    parsedData.forEach((data) => {
      const restaurantName = data.restaurantName;
      const unformmateddate = new Date(data.date);
      const month = unformmateddate.getMonth() + 1;
      const day = unformmateddate.getDate();
      const date = `${month}-${day}`;
      console.log(date)
      const pageViews = data.pageViews;
  
      if (!restaurantData[restaurantName]) {
        restaurantData[restaurantName] = [];
      }
  
      restaurantData[restaurantName].push({ date, pageViews });
    });
    createLineGraphs(restaurantData);
    return restaurantData;
  }
  
function createLineGraphs(restaurantData) {
// Iterate over each restaurantName and create a line graph
for (const restaurantName in restaurantData) {
    const data = restaurantData[restaurantName];

    // Get the div element by ID
    const divId = restaurantName;
    const divElement = document.getElementById(divId).querySelector('.summary-results-container');
    const chartId = restaurantName+'-views-chart';
    // Create a canvas element for the chart
    const canvas = document.createElement('canvas');
    canvas.id = chartId;
    canvas.className = "views-chart"


    divElement.appendChild(canvas);

    
    
    
    // Extract the dates and page views from the data
    const dates = data.map((item) => item.date);
    const pageViews = data.map((item) => item.pageViews);
    const maxValue = Math.max(...pageViews);
    // Create a new Chart instance
    new Chart(canvas, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
        {
            
            data: pageViews,
        },
        ],
    },
    options: {
        plugins: {legend: {display: false}},
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: false}
    }
    });
}

}
    

function pageViewPivot(parsedData) {
    let pivotTable = {};
  
    // Create the pivot table
    for (let i = 0; i < parsedData.length; i++) {
      let { restaurantName, pageViews } = parsedData[i];
  
      if (!pivotTable[restaurantName]) {
        pivotTable[restaurantName] = 0;
      }
  
      pivotTable[restaurantName] += pageViews;
    }
  
    // Output the pivot table to the div
    let div = document.getElementById('file2-pivot-results');
    div.innerHTML = '';
  
    let table = document.createElement('table');
  
    // Create the table headers
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let thRestaurant = document.createElement('th');
    let thPageViews = document.createElement('th');
    thRestaurant.textContent = 'Restaurant';
    thPageViews.textContent = 'Page Views';
    tr.appendChild(thRestaurant);
    tr.appendChild(thPageViews);
    thead.appendChild(tr);
    table.appendChild(thead);
  
    // Create the table rows
    let tbody = document.createElement('tbody');
  
    for (let restaurantName in pivotTable) {
      let tr = document.createElement('tr');
      let tdRestaurant = document.createElement('td');
      let tdPageViews = document.createElement('td');
      tdRestaurant.textContent = restaurantName;
      tdPageViews.textContent = pivotTable[restaurantName];
      tr.appendChild(tdRestaurant);
      tr.appendChild(tdPageViews);
      tbody.appendChild(tr);
    }
  
    table.appendChild(tbody);
    div.appendChild(table);
    updateDivsWithPivotData(pivotTable);
  }
  
  function updateDivsWithPivotData(pivotTable) {
    for (let restaurantName in pivotTable) {
      let divId = restaurantName;
      let div = document.getElementById(divId);
  
      if (div) {
        let divContainer = document.createElement('div');
        divContainer.className='summary-results-container flex-center-spacebetween';

        let p = document.createElement('p');
        p.className = "page-views"
        p.innerHTML = 'Total Page Views <br><br> <span class="bolded-result">' + pivotTable[restaurantName] + '</span>'; 
        div.appendChild(divContainer);
        divContainer.appendChild(p)
      }
    }
  }



  
  

  


function createRestaurantDivs(parsedData, dateRange) {
    const reportGeneratorDiv = document.getElementById("report-generator");
  
    // Create a Set to store unique restaurant values
    const uniqueRestaurants = new Set(
      parsedData.map((data) => data.restaurantName).filter((name) => name !== "undefined")
    );
  
    // Iterate over the unique restaurant values and create a div for each
    uniqueRestaurants.forEach((restaurant) => {
      // Create a new div element
      const div = document.createElement("div");
      div.className = "pdf";
      div.id = restaurant;

      const divHeader = document.createElement("div");
      divHeader.className = "pdf-header flex-center-spacebetween";

      div.appendChild(divHeader);
  
      // Create an h1 element and set its innerHTML to the restaurant value
      const title = document.createElement("div")
      const h1 = document.createElement("h1");
      h1.innerHTML = restaurant;

      const headerDescribe = document.createElement("p");
      headerDescribe.innerHTML = 'Analytics Report - <span class="header-date">'+ dateRange+'</span><br><br>Below is the analysis for your restaurants MyMeal menu interactions.'

      title.appendChild(h1)
      title.appendChild(headerDescribe)
      

      const logo = document.createElement("img");
      logo.className = "logo"
      logo.src = "mymeal-logo.png"
  
      // Append the h1 element to the div
      divHeader.appendChild(title);
      divHeader.appendChild(logo)
  
      // Append the div to the report-generator div
      reportGeneratorDiv.appendChild(div);

    //   const downloadButton = document.createElement('button');
    //   downloadButton.id = restaurant + '-download';
    //   downloadButton.onclick = function() {
    //     downloadAsPDF(restaurant);
    //   };
    //   div.appendChild(downloadButton)
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