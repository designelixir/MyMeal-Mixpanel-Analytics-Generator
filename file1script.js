function file1Analyze(dataRows, targetDiv, dateRangeFormatted) {
    const parsedDataUnclean = dataRows.filter(Boolean).map(row => {
        const values = row.split(',');

        // get the number of sessions that lasted x time 
        const date = values[0];
        const restaurantName = values[2]
        const pageViews = Number(values[3])
        return {
            date,
            restaurantName,
            pageViews
        };

    });

    const parsedData = removeNullValues(parsedDataUnclean);
    const resultDiv = document.getElementById(targetDiv);
    resultDiv.textContent = JSON.stringify(parsedData, null, 2);
    //Create date range for PDF 
    createRestaurantDivs(parsedData, dateRangeFormatted);
    pageViewPivot(parsedData);
    createRestaurantData(parsedData, dateRangeFormatted);
}

// Creates a PDF for each restaurant in the Page Views data
function createRestaurantDivs(parsedData, dateRange) {
    const reportGeneratorDiv = document.getElementById("report-generator");
    // Create a Set to store unique restaurant values
    const uniqueRestaurants = new Set(
        parsedData.map((data) => data.restaurantName).filter((name) => name !== "undefined")
    );

    // Iterate over the unique restaurant values and create a div for each with formatted sections for data 
    uniqueRestaurants.forEach((restaurant) => {
        // Create a new div element
        const divHolder = document.createElement('div');
        divHolder.className = "pdf-wrapper"
        divHolder.id = restaurant+'-pdf-wrapper'

        const div = document.createElement("div");
        div.className = "pdf";
        div.id = restaurant;
        divHolder.appendChild(div)
        const divHeader = document.createElement("div");
        divHeader.className = "pdf-header flex-center-spacebetween";
        div.appendChild(divHeader);
        const title = document.createElement("div")
        const h1 = document.createElement("h1");
        h1.innerHTML = restaurant;
        const reportDate = document.createElement("p");
        reportDate.innerHTML = '<span class="header-date">' + dateRange + '</span><br><br>Below is the analysis for your restaurants MyMeal menu interactions.'
        title.appendChild(h1)
        title.appendChild(reportDate)
        const logoContainer = document.createElement('div');
        logoContainer.className = "logo-container"
        const logo = document.createElement("img");
        logo.src = "mymeal-logo.png"
        const logoLabel = document.createElement('p');
        logoLabel.innerHTML = "Analytics Report"
        divHeader.appendChild(title);
        divHeader.appendChild(logoContainer)
        logoContainer.appendChild(logo)
        logoContainer.appendChild(logoLabel)
        reportGeneratorDiv.appendChild(divHolder);
    });
}

function pageViewPivot(parsedData) {
    let pivotTable = {};
    // Create the pivot table for the output 
    for (let i = 0; i < parsedData.length; i++) {
        let {
            restaurantName,
            pageViews
        } = parsedData[i];

        if (!pivotTable[restaurantName]) {
            pivotTable[restaurantName] = 0;
        }

        pivotTable[restaurantName] += pageViews;
    }

    // Output the pivot table to the div
    let div = document.getElementById('file1-pivot-results');
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
    document.getElementById('user-retention-container').style.display = "block"
    document.getElementById('page-visit-container').classList.remove('unfinished-shadow')
}

function updateDivsWithPivotData(pivotTable) {
    for (let restaurantName in pivotTable) {
        let divId = restaurantName;
        let div = document.getElementById(divId);

        if (div) {
            let divContainer = document.createElement('div');
            divContainer.className = 'summary-results-container flex-start-spacebetween';
            let p = document.createElement('p');
            p.innerHTML = 'Total Page Views <br><br> <span class="bolded-result">' + pivotTable[restaurantName] + '</span>';
            div.appendChild(divContainer);
            divContainer.appendChild(p)
        }
    }
}

function createRestaurantData(parsedData, dateRange) {
    const restaurantData = {};

    parsedData.forEach((data) => {
        const restaurantName = data.restaurantName;
        const unformmateddate = new Date(data.date);
        const month = unformmateddate.getMonth() + 1;
        const day = unformmateddate.getDate();
        const date = `${month}-${day}`;
        const pageViews = data.pageViews;

        if (!restaurantData[restaurantName]) {
            restaurantData[restaurantName] = [];
        }

        restaurantData[restaurantName].push({
            date,
            pageViews
        });
    });
    createLineGraphs(restaurantData, dateRange);
    return restaurantData;
}


function createLineGraphs(restaurantData, dateRange) {
    // Iterate over each restaurantName and create a line graph
    for (const restaurantName in restaurantData) {
        const data = restaurantData[restaurantName];

        // Get the div element by ID
        const divId = restaurantName;
        const divElement = document.getElementById(divId).querySelector('.summary-results-container');
        const chartId = restaurantName + '-views-chart';
        const chartXLabel = document.createElement('p')
        chartXLabel.innerHTML = "X Axis"
        // Create a canvas element for the chart
        const canvas = document.createElement('canvas');
        canvas.id = chartId;
        canvas.className = "views-chart"

        divElement.appendChild(canvas);
        
        // Extract the dates and page views from the data
        const dates = data.map((item) => item.date);
        const pageViews = data.map((item) => item.pageViews);
        const maxValueMultiplier = (Math.max(...pageViews) * 1.2);
        const maxValue = Math.ceil(maxValueMultiplier);
        // Create a new Chart instance
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{

                    data: pageViews,
                }, ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {display: true, text: "Users per Day from "+ dateRange}
                },
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    display: false
                },
                scales: {
                    
                   y: {
                    max: maxValue,
                    ticks: {stepSize: 1}
                   }
                }
            }
        });
    }

}