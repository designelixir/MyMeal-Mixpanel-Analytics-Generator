function file2Analyze(dataRows, targetDiv){
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
    retentionDescription.innerHTML = "A session starts when the user clicks 'View Allergy Menu'. Each session tracks interaction with menu items, and your order online button (if applicable)."
    retentionContainer.appendChild(retentionTitle)
    retentionContainer.appendChild(retentionDescription)
    
    // Create container for charts
    const retentionData = document.createElement('div');
    retentionData.className = "retention-data-container flex-start-spacebetween"
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
            data: [viewAllergyMenu/viewAllergyMenu*100, seeMenuButton/viewAllergyMenu*100, menuCardClicked/viewAllergyMenu*100, orderOnlineClicked/viewAllergyMenu*100],
            backgroundColor: 'orange',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true, 
        showTooltips: false,
        plugins: {
            title: {
                display: true,
                text: 'User Funnel Retention & Conversion'
            },
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
        scales: { x: {gridLines: {color: "rgba(0,0,0,0"}},
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
  