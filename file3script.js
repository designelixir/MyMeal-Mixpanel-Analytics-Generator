function file3Analyze(dataRows, targetDiv){
    const change = document.getElementById('session-time-container');
    change.classList.remove('unfinished-shadow');
    document.getElementById('allergen-container').style.display = "block"
    const parsedSessionDataUnclean = dataRows.filter( Boolean ).map(row => {
        const values = row.split(',');
        const date = values[0];
        const sessionLength = values[2];
        const restaurantUrl = values[3];
        const sessionCount = Number(values[4])
        return { date, sessionLength, restaurantUrl, sessionCount };});
        const parsedData = removeNullValues(parsedSessionDataUnclean);
        
        
        rewriteValue(parsedData, targetDiv)

}


function rewriteValue(parsedData, targetDiv) {
    const restaurantReference = [
        {
           restaurant:"Hash Tag", url:"https://mymealmenus.com/order/restaurants/65/locations/78"
        },
        {
            restaurant:"Postino", url:"https://mymealmenus.com/order/restaurants/12/locations/9"
         },
        {
           restaurant:"Los Chingones", url:"https://mymealmenus.com/order/restaurants/27/locations/26"
        },
        {
           restaurant:"Bubu", url:"https://mymealmenus.com/order/restaurants/60/locations/74"
        },
        {
           restaurant:"Bubu", url:"https://mymealmenus.com/order/restaurants/60/locations/73"
        },
        {
           restaurant:"Bubu", url:"https://mymealmenus.com/order/restaurants/60/locations/72"
        },
        {
           restaurant:"Crock Spot", url:"https://mymealmenus.com/order/restaurants/5/locations/4"
        },
        {
           restaurant:"Vital Root", url:"https://mymealmenus.com/order/restaurants/7/locations/6"
        },
        {
           restaurant:"XATRUCHO", url:"https://mymealmenus.com/order/restaurants/3/locations/2"
        },
        {
           restaurant:"Rheinlander Bakery", url:"https://mymealmenus.com/order/restaurants/24/locations/24"
        },
        {
           restaurant:"hopdoddy", url:"https://mymealmenus.com/order/restaurants/11/locations/11"
        },
        {
           restaurant:"Old Blinking Light", url:"https://mymealmenus.com/order/restaurants/4/locations/3"
        },
        {
           restaurant:"Indulge Bistro & Wine Bar", url:"https://mymealmenus.com/order/restaurants/15/locations/13"
        },
        {
           restaurant:"Indulge Bistro & Wine Bar", url:"https://mymealmenus.com/order/restaurants/15/locations/18"
        },
        {
           restaurant:"Indulge Bistro & Wine Bar", url:"https://mymealmenus.com/order/restaurants/15/locations/17"
        },
        {
           restaurant:"Yampa Sandwich Co.", url:"https://mymealmenus.com/order/restaurants/10/locations/8"
        },
        {
           restaurant:"Whole Sol", url:"https://mymealmenus.com/order/restaurants/13/locations/10"
        },
        {
           restaurant:"Turtle Boat", url:"https://mymealmenus.com/order/restaurants/17/locations/14"
        },
        {
           restaurant:"Jennie Pho", url:"https://mymealmenus.com/order/restaurants/18/locations/16"
        },
        {
           restaurant:"bartaco", url:"https://mymealmenus.com/order/restaurants/14/locations/12"
        },
        {
           restaurant:"bartaco", url:"https://mymealmenus.com/order/restaurants/14/locations/21"
        },
        {
           restaurant:"Spice Kitchen", url:"https://mymealmenus.com/order/restaurants/37/locations/37"
        },
        {
           restaurant:"Just BE Kitchen", url:"https://mymealmenus.com/order/restaurants/2/locations/1"
        },
        {
           restaurant:"Just BE Kitchen", url:"https://mymealmenus.com/order/restaurants/2/locations/47"
        },
        {
           restaurant:"Just BE Kitchen", url:"https://mymealmenus.com/order/restaurants/2/locations/80"
        },
        {
           restaurant:"Just BE Kitchen", url:"https://mymealmenus.com/order/restaurants/2/locations/81"
        },
        {
           restaurant:"Vibe Foods", url:"https://mymealmenus.com/order/restaurants/21/locations/22"
        },
        {
           restaurant:"A Cup of Peace", url:"https://mymealmenus.com/order/restaurants/22/locations/23"
        },
        {
           restaurant:"Colore Italian", url:"https://mymealmenus.com/order/restaurants/23/locations/41"
        },
        {
           restaurant:"Bacon Social House", url:"https://mymealmenus.com/order/restaurants/25/locations/36"
        },
        {
           restaurant:"La Chiva Colombian", url:"https://mymealmenus.com/order/restaurants/26/locations/25"
        },
        {
           restaurant:"Fresh Thymes Eatery", url:"https://mymealmenus.com/order/restaurants/16/locations/15"
        },
        {
           restaurant:"Bodega", url:"https://mymealmenus.com/order/restaurants/20/locations/20"
        },
        {
           restaurant:"Teocalli", url:"https://mymealmenus.com/order/restaurants/34/locations/33"
        },
        {
           restaurant:"Gemini", url:"https://mymealmenus.com/order/restaurants/28/locations/27"
        },
        {
           restaurant:"Quiero Arepas", url:"https://mymealmenus.com/order/restaurants/29/locations/28"
        },
        {
           restaurant:"Falafel King", url:"https://mymealmenus.com/order/restaurants/30/locations/29"
        },
        {
           restaurant:"Dagabi Cucina", url:"https://mymealmenus.com/order/restaurants/32/locations/31"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/59"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/61"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/63"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/64"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/65"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/66"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/67"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/68"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/69"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/60"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/5"
        },
        {
           restaurant:"Illegal Petes", url:"https://mymealmenus.com/order/restaurants/6/locations/62"
        },
        {
           restaurant:"Blue Bonnet", url:"https://mymealmenus.com/order/restaurants/31/locations/30"
        },
        {
           restaurant:"Parker Garage", url:"https://mymealmenus.com/order/restaurants/33/locations/32"
        },
        {
           restaurant:"FOR[a]GED", url:"https://mymealmenus.com/order/restaurants/9/locations/7"
        },
        {
           restaurant:"Sforno", url:"https://mymealmenus.com/order/restaurants/35/locations/34"
        },
        {
           restaurant:"Snack Attack", url:"https://mymealmenus.com/order/restaurants/36/locations/35"
        },
        {
           restaurant:"Crestone Bakery", url:"https://mymealmenus.com/order/restaurants/38/locations/38"
        },
        {
           restaurant:"Abrusci's Fire & Vine", url:"https://mymealmenus.com/order/restaurants/40/locations/39"
        },
        {
           restaurant:"Stoic & Genuine", url:"https://mymealmenus.com/order/restaurants/19/locations/19"
        },
        {
           restaurant:"Acreage", url:"https://mymealmenus.com/order/restaurants/42/locations/42"
        },
        {
           restaurant:"Ghost Box Pizza", url:"https://mymealmenus.com/order/restaurants/43/locations/43"
        },
        {
           restaurant:"My Neighbor Felix", url:"https://mymealmenus.com/order/restaurants/44/locations/44"
        },
        {
           restaurant:"Hundy's", url:"https://mymealmenus.com/order/restaurants/45/locations/45"
        },
        {
           restaurant:"Bread Winners Cafe", url:"https://mymealmenus.com/order/restaurants/46/locations/48"
        },
        {
           restaurant:"Sacred Society", url:"https://mymealmenus.com/order/restaurants/47/locations/49"
        },
        {
           restaurant:"Reelfish", url:"https://mymealmenus.com/order/restaurants/49/locations/50"
        },
        {
           restaurant:"Gina's Kitchen", url:"https://mymealmenus.com/order/restaurants/50/locations/52"
        },
        {
           restaurant:"Cavegirl Coffeehouse", url:"https://mymealmenus.com/order/restaurants/51/locations/51"
        },
        {
           restaurant:"Rocky Mountain Tap & Garden", url:"https://mymealmenus.com/order/restaurants/53/locations/54"
        },
        {
           restaurant:"Morning Glory Cafe", url:"https://mymealmenus.com/order/restaurants/54/locations/55"
        },
        {
           restaurant:"Bamboo Sushi", url:"https://mymealmenus.com/order/restaurants/52/locations/53"
        },
        {
           restaurant:"Denver Poke Company", url:"https://mymealmenus.com/order/restaurants/55/locations/56"
        },
        {
           restaurant:"Sushi Ronin", url:"https://mymealmenus.com/order/restaurants/57/locations/57"
        },
        {
           restaurant:"Woody's", url:"https://mymealmenus.com/order/restaurants/58/locations/58"
        },
        {
           restaurant:"Aloy Thai", url:"https://mymealmenus.com/order/restaurants/59/locations/70"
        },
        {
           restaurant:"Aloy Thai", url:"https://mymealmenus.com/order/restaurants/59/locations/75"
        },
        {
           restaurant:"Wild Pastures Burger Co", url:"https://mymealmenus.com/order/restaurants/61/locations/71"
        },
        {
           restaurant:"The Post Chicken & Beer", url:"https://mymealmenus.com/order/restaurants/62/locations/76"
        },
        {
           restaurant:"Acova", url:"https://mymealmenus.com/order/restaurants/64/locations/77"
        },
        {
           restaurant:"The Hornet", url:"https://mymealmenus.com/order/restaurants/41/locations/40"
        },
        {
           restaurant:"Gluten Free Food Festival", url:"https://mymealmenus.com/order/restaurants/66/locations/79"
        }
      ]
      
      for (let i = 0; i < parsedData.length; i++) {
        const data = parsedData[i];
      
        for (let j = 0; j < restaurantReference.length; j++) {
          const reference = restaurantReference[j];
      
          if (data.restaurantUrl.includes(reference.url)) {
            data.restaurantUrl = reference.restaurant;
            break;
          }
        }
      }
    const resultDiv = document.getElementById(targetDiv);
    resultDiv.textContent = JSON.stringify(parsedData, null, 2);
    createPivotTable(parsedData);
  }


  function createPivotTable(parsedSessionData) {
    // Extract unique sessionLength values
    const sessionLengths = [...new Set(parsedSessionData.map(obj => obj.sessionLength))];
  
    // Create the pivot table structure
    const pivotTable = {};
    for (let i = 0; i < parsedSessionData.length; i++) {
      const data = parsedSessionData[i];
      const restaurantUrl = data.restaurantUrl.trim();
      const sessionCount = Number(data.sessionCount);
      const sessionLength = data.sessionLength.trim();
  
      if (!pivotTable[restaurantUrl]) {
        pivotTable[restaurantUrl] = {};
      }
  
      if (!pivotTable[restaurantUrl][sessionLength]) {
        pivotTable[restaurantUrl][sessionLength] = 0;
      }
  
      pivotTable[restaurantUrl][sessionLength] += sessionCount;
    }
  
    // Generate HTML table from the pivot table data
    let tableHTML = "<table>";
    tableHTML += "<tr>";
    tableHTML += "<th>Restaurant</th>";
    sessionLengths.forEach(sessionLength => {
      tableHTML += `<th>${sessionLength}</th>`;
    });
    tableHTML += "</tr>";
  
    const pivotArray = [];
    for (const restaurantUrl in pivotTable) {
      const pivotRow = [restaurantUrl];
      sessionLengths.forEach(sessionLength => {
        const sessionCount = pivotTable[restaurantUrl][sessionLength] || 0;
        //const keyValue = { [sessionLength]: sessionCount };
        pivotRow.push(sessionCount);
      });
  
      pivotArray.push(pivotRow);
      createBarGraph(pivotRow)
  
      tableHTML += "<tr>";
      pivotRow.forEach(value => {
        tableHTML += `<td>${value}</td>`;
      });
      tableHTML += "</tr>";
    }
  
    tableHTML += "</table>";
  
    // Output the pivot table into the specified div element
    const pivotDiv = document.getElementById("session-time-pivot");
    pivotDiv.innerHTML = tableHTML;
    console.log("pivot array is ", pivotArray);
    
    return pivotArray;
  }
  


  function createBarGraph(pivotRow){

        var current = pivotRow;
        var restaurantId = current[0];
        // console.log("the restaurant name is "+current)
        var restaurantPdf = document.getElementById(restaurantId+'-retention-data-container');
        
        if (restaurantPdf){
            const barGraphContainer = document.createElement("div");
            barGraphContainer.classList="session-time-graph";
            barGraphContainer.id = restaurantId + "-pie-chart"
            restaurantPdf.appendChild(barGraphContainer);
            
            const canvas = document.createElement('canvas');
            canvas.id = 'horizontal-bar-chart';

          
            // Create the chart using Chart.js
            new Chart(canvas, {
              type: 'bar',
              data: {
                labels: current.map((_, index) => `Value ${index + 1}`),
                datasets: [{
                  label: 'Current',
                  data: current,
                  backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue color
                }]
              },
              options: {
                layout: {autoPadding: true},
                indexAxis: 'y',
                plugins: {
                    title: {
                        display: true,
                        text: 'Session Time in Seconds per User'
                    },
                    legend: {display: false}

                },
                
                responsive: true,
                scales: {
                  x: {
                    title: {display: true, text: "Total Users"},
                    beginAtZero: true, 
                    // max: maxValue,
                    ticks: {stepSize: 1}
                  },
                  y: {
                    beginAtZero: true,
                    
                    ticks: {stepSize: 1, callback: function (value, index, ticks) {
                        const values = [
                            "0-10", "10-20", "20-30", "30-40", "40-50",
                            "50-60", "60-70", "70-80", "80-90", "90-100", "100-110",
                            "110-120", ">=120"
                          ]
                          if (value > 0){
                            return values[index-1] + 'secs';
                        }
                        
                        
                      }}
                  }
                }
              }
            });
            
            
        
              const canvasContainer = document.getElementById(restaurantId + "-pie-chart")
        canvasContainer.appendChild(canvas);

        } else {
            console.log("div does not exist")
        }
    }
  
  

  
  
  