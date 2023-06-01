

function file2Analyze(dataRows, targetDiv){
    const parsedRetentionDataUnclean = dataRows.map(row => {
        const values = row.split(',');
        
        if (values[0] === "$overall" || values[0] === "" || values[0] === "undefined"){
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
        const parsedRetentionData = removeNullValues(parsedRetentionDataUnclean);
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedRetentionData, null, 2);
        createUserRetentionGraph(parsedRetentionData)
}

function createUserRetentionStructure(restaurant){
    // Create User Retention Section
    const pdfContainer = document.getElementById(restaurant);
    const retentionContainer = document.createElement('div');
    retentionContainer.className = "retention-container";
    pdfContainer.appendChild(retentionContainer);
    
    //Create Header
    const retentionTitle = document.createElement('h3'); 
    retentionTitle.innerHTML = "User Retention"
    const retentionDescription = document.createElement('p')
    retentionDescription.innerHTML = "User Retention tracks how your menu is interacted with, not just overall page views. <strong>1.View Menu:</strong> a user agreed to Terms &amp; Conditions. <strong>2. See Menu:</strong> a user selected their food restrictions <strong>3. Menu Card:</strong> a user clicked a menu item for more information. <strong>4. Order Online: </strong>a user clicked the Order Online button (only applicable if you have one active)"
    retentionContainer.appendChild(retentionTitle)
    retentionContainer.appendChild(retentionDescription)
    
    // Create container for charts
    const retentionData = document.createElement('div');
    retentionData.className = "retention-data-container flex-end-spacebetween"
    retentionData.id = restaurant+'-retention-data-container';
    retentionContainer.appendChild(retentionData)

    const retentionChart = document.createElement('div');
    retentionChart.id = restaurant+'-retention-chart';
    retentionChart.className = "retention-chart";
    retentionData.appendChild(retentionChart)



    
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

    
    const graphContainer = document.createElement('canvas')
    const retentionChartTitle = document.createElement('h4');
    retentionChartTitle.innerHTML = "<br>User Conversion &amp; Drop-Off"
    // Append the graph container to the existing div with id "restaurant"
    const restaurantDiv = document.getElementById(restaurant+'-retention-chart')
    restaurantDiv.appendChild(retentionChartTitle)
    restaurantDiv.appendChild(graphContainer);
  
    // Create the bar graph using Chart.js
    new Chart(graphContainer, {
      type: 'bar',
      data: {
        labels: ['1.View Menu', '2.See Menu', '3.Menu Card', '4.Order Online'],
        datasets: [
          {
            label: 'Retention',
            data: [viewAllergyMenu/viewAllergyMenu*100, seeMenuButton/viewAllergyMenu*100, menuCardClicked/viewAllergyMenu*100, orderOnlineClicked/viewAllergyMenu*100],
            backgroundColor: 'orange',
            borderWidth: 1,
            fontFamily: 'Poppins'
          }
        ]
      },
      options: {
        responsive: true, 
        showTooltips: false,
        plugins: {
            legend: {display: false}

        },
        animation: {
            duration: 1,
            onComplete:  (x) => {
              const chart = x.chart;
              var { ctx } = chart;
              ctx.textAlign = 'center';
              ctx.fillStyle = "rgba(0, 0, 0, 1)";
              ctx.textBaseline = 'hanging';
              
              
              
              // Loop through each data in the datasets
              const metaFunc = this.getDatasetMeta;
              chart.data.datasets.forEach((dataset, i) => {
                var meta = chart.getDatasetMeta(i);
                meta.data.forEach((bar, index) => {
                  var data = dataset.data[index];
                  ctx.fillText(`${(Math.ceil(data * viewAllergyMenu / 100))} User(s)`, bar.x, bar.y - 5);
                //   
                });
              });
            }
          },
          layout: {autoPadding: true},
        scales: { x: {ticks: {
          maxRotation: 0, minRotation: 0
        }},
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {stepSize: 25, callback: function (value, index, values) {
                return value + " %";
              }}
          }
        },
         
        
      }
    });
  });

  }
  