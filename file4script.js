function file4Analyze(dataRows, targetDiv){
    const parsedAllergenDataUnclean = dataRows.filter( Boolean ).map(row => {
        const values = row.split(',');
        
        const allergen = values[1].trim()
        const restaurant = values[2]
        const totalSelections = Number(values[3])
        return {allergen, restaurant, totalSelections};
        
        });
        //generateRestaurantAllergenSummary(parsedAllergenData)
       
        const parsedAllergenData = removeNullValues(parsedAllergenDataUnclean);
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedAllergenData, null, 2);
        createAllergenPivotTable(parsedAllergenData);
        createAllergenArray(parsedAllergenData)
        document.getElementById('allergen-container').classList.remove('unfinished-shadow')
        document.getElementById('menu-items-container').style.display = "block"
}

function createAllergenArray(parsedAllergenData) {
    const allergenArray = [];
  
    for (let i = 0; i < parsedAllergenData.length; i++) {
      const data = parsedAllergenData[i];
      const restaurant = data.restaurant;
      const allergen = data.allergen;
      const totalSelections = Number(data.totalSelections);
  
      // Check if the restaurant exists in allergenArray
      const existingRestaurant = allergenArray.find(item => Object.keys(item)[0] === restaurant);
  
      if (existingRestaurant) {
        // If the restaurant already exists, update the allergen-totalSelections pair
        existingRestaurant[restaurant][allergen] = (existingRestaurant[restaurant][allergen] || 0) + totalSelections;
      } else {
        // If the restaurant is new, create a new allergen-totalSelections pair
        const allergenPair = { [restaurant]: { [allergen]: totalSelections } };
        allergenArray.push(allergenPair);
      }
    }
  
    
    createAllergenTables(allergenArray)
  }


  function createAllergenTables(allergenArray) {
    for (let i = 0; i < allergenArray.length; i++) {
      const restaurantObj = allergenArray[i];
      const restaurant = Object.keys(restaurantObj)[0];
      const allergens = restaurantObj[restaurant];
  
      // Find the existing restaurant div
      const restaurantDiv = document.getElementById(restaurant);
        const bottomWrapper = document.createElement('div');
        bottomWrapper.className = "flex-start-spacebetween bottom-page-wrapper"
        bottomWrapper.id = restaurant + '-bottom-wrapper';
        restaurantDiv.appendChild(bottomWrapper)
      if (restaurantDiv) {
        // Create the allergen-container div

        const allergenContainerDiv = document.createElement("div");
        allergenContainerDiv.classList.add("allergen-container");
        const allergenDivHeader = document.createElement('h3');
        allergenDivHeader.textContent = "Allergens"
        const allergenDivDescription = document.createElement('p');
        allergenDivDescription.innerHTML = "This pie chart represents the allergens users selected <br> before looking at your filterable menu."
        allergenContainerDiv.appendChild(allergenDivHeader);
        allergenContainerDiv.appendChild(allergenDivDescription);

        const allergenDataWrapper = document.createElement('div');
        allergenDataWrapper.className = "allergen-data-wrapper";
        allergenContainerDiv.append(allergenDataWrapper);

        const allergenChartTitle = document.createElement('h4');
        allergenChartTitle.innerHTML = 'Allergen Cards Selected';
        
        allergenDataWrapper.appendChild(allergenChartTitle)
  
        
        
  
        // Create a canvas for the pie chart
        const canvas = document.createElement("canvas");
        canvas.className = "pie-chart"
        canvas.id = `${restaurant}-chart`;
        allergenDataWrapper.appendChild(canvas);
        
  
        // Generate the pie chart using Chart.js
        

        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(allergens),
            datasets: [
              {
                data: Object.values(allergens),
                backgroundColor: [
                    "#FF0000",
                    "#FF7F00",
                    "#FFFF00",
                    "#5c8001",
                    "#a1c181",
                    "#2ec4b6",
                    "#00FFFF",
                    "#007FFF",
                    "#0000FF",
                    "#7F00FF",
                    "#FF00FF",
                    "#FF007F",
                    "#800000",
                    "#FF4500",
                    "#808000",
                    "#008000",
                    "#008080",
                    "#000080",
                    "#4B0082",
                    "#FF1493",
                    "#B22222",
                    "#FF8C00",
                    "#F0E68C",
                    "#8B0000",
                    "#00BFFF",
                    "#00CED1",
                    "#FF69B4",
                    "#FFD700",
                    "#DAA520",
                    "#8B4513",
                    "#228B22",
                    "#4682B4"
                  ],
                  
              },
            ],
          },
          options: {
            aspectRatio: 2|2,
          }

        });
        Chart.overrides.pie.plugins.legend.display = true;
        
        Chart.overrides.pie.plugins.legend.position = "left";
        Chart.overrides.pie.plugins.legend.labels.generateLabels =  function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
  // Calculate and sort the percentages in descending order
  const percentages = data.datasets[0].data.map(function (value, i) {
    const meta = chart.getDatasetMeta(0);
    const total = meta.total;
    const currentValue = value;
    const percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
    return { index: i, percentage: percentage };
  });
  percentages.sort(function (a, b) {
    return b.percentage - a.percentage;
  });

  return percentages.map(function (item) {
    const label = data.labels[item.index];
    const color = data.datasets[0].backgroundColor[item.index];
    const meta = chart.getDatasetMeta(0);
    const currentValue = data.datasets[0].data[item.index];
    const percentage = item.percentage.toFixed(1);
    return {
      text: label + " - " + percentage + "%" + " (" + currentValue + " Selections)",
      fillStyle: color,
      hidden: isNaN(currentValue) || meta.data[item.index].hidden,
      index: item.index,
    };
  });
}

            return [];
          }
        // Append the allergen-container div to the restaurant div
        bottomWrapper.appendChild(allergenContainerDiv);
      }
    }
  }


  

function createAllergenPivotTable(parsedAllergenData) {
    // Create the pivot table structure
    const pivotTable = {};
    for (let i = 0; i < parsedAllergenData.length; i++) {
      const data = parsedAllergenData[i];
      const restaurant = data.restaurant;
      const allergen = data.allergen;
      const totalSelections = Number(data.totalSelections);
  
      if (!pivotTable[restaurant]) {
        pivotTable[restaurant] = {};
      }
  
      if (!pivotTable[restaurant][allergen]) {
        pivotTable[restaurant][allergen] = 0;
      }
  
      pivotTable[restaurant][allergen] += totalSelections;
    }
  
    // Generate HTML table from the pivot table data
    let tableHTML = "<table>";
    tableHTML += "<tr>";
    tableHTML += "<th>Restaurant</th>";
    tableHTML += "<th>Allergen</th>";
    tableHTML += "<th>Total Selections</th>";
    tableHTML += "</tr>";
  
    for (const restaurant in pivotTable) {
      for (const allergen in pivotTable[restaurant]) {
        const totalSelections = pivotTable[restaurant][allergen];
        tableHTML += "<tr>";
        tableHTML += `<td>${restaurant}</td>`;
        tableHTML += `<td>${allergen}</td>`;
        tableHTML += `<td>${totalSelections}</td>`;
        tableHTML += "</tr>";
      }
    }
  
    tableHTML += "</table>";
  
    // Output the pivot table into the specified div element
    const pivotDiv = document.getElementById("allergen-pivot");
    pivotDiv.innerHTML = tableHTML;
  }
  