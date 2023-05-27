function createPivotTable(parsedData) {
  const pivotTable = {};

  // Sum up the values of "sessionCount" for each unique combination of "restaurant" and "session"
  parsedData.forEach(obj => {
    const restaurant = obj.restaurant;
    const session = obj.session;
    const sessionCount = obj.sessionCount;

    // Ignore undefined values for restaurant or session
    if (restaurant === undefined || session === undefined) {
      return;
    }

    // Ignore restaurants containing "localhost:8080"
    if (restaurant.includes('localhost:8080')) {
      return;
    }

    if (!pivotTable[restaurant]) {
      pivotTable[restaurant] = {};
    }

    if (!pivotTable[restaurant][session]) {
      pivotTable[restaurant][session] = 0;
    }

    pivotTable[restaurant][session] += sessionCount;
  });

  const groupRestaurantsDiv = document.getElementById('groupRestaurants');
  
  // Clear the content of the div
  groupRestaurantsDiv.innerHTML = '';

  // Get all unique session values
  const sessions = new Set();
  Object.values(pivotTable).forEach(restaurant => {
    Object.keys(restaurant).forEach(session => {
      sessions.add(session);
    });
  });

  // Sort the session values
  const sortedSessions = Array.from(sessions).sort();

  // Get all unique restaurants and sort them alphabetically
  const restaurants = Object.keys(pivotTable).sort();

  // Create a table for the pivot table data
  const table = document.createElement('table');

  // Create table headers
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Create empty cell for the top-left corner
  const emptyHeader = document.createElement('th');
  headerRow.appendChild(emptyHeader);

  // Create table headers for each session
  sortedSessions.forEach(session => {
    const sessionHeader = document.createElement('th');
    sessionHeader.textContent = session;
    headerRow.appendChild(sessionHeader);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table rows for each restaurant
  const tbody = document.createElement('tbody');
  restaurants.forEach(restaurant => {
    const row = document.createElement('tr');

    // Create restaurant cell
    const restaurantCell = document.createElement('td');
    restaurantCell.textContent = restaurant;
    row.appendChild(restaurantCell);

    // Create table cells for each session and populate with the sum of sessionCount values
    sortedSessions.forEach(session => {
      const cell = document.createElement('td');
      const sum = pivotTable[restaurant][session] || 0;
      cell.textContent = sum;
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  groupRestaurantsDiv.appendChild(table);
  createBarGraphs(pivotTable)
}






// Make graph
function createBarGraphs(pivotTable) {
  const graphsDiv = document.getElementById('graphs');

  // Clear the content of the div
  graphsDiv.innerHTML = '';

  // Iterate over each restaurant in the pivot table
  Object.entries(pivotTable).forEach(([restaurant, data]) => {
    // Create a new div for the graph
    const graphDiv = document.createElement('div');
    graphDiv.classList.add('graph');
    graphDiv.id = restaurant;

    // Create the graph title element
    const title = document.createElement('h2');
    title.textContent = restaurant;
    graphDiv.appendChild(title);

    // Create a canvas element for drawing the bar graph
    const canvas = document.createElement('canvas');
    graphDiv.appendChild(canvas);

    // Get the context of the canvas
    const ctx = canvas.getContext('2d');

    // Set the canvas dimensions
    const canvasWidth = 600; // Adjust the width as needed
    const canvasHeight = 300; // Adjust the height as needed
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Get the sessions and values for the current restaurant
    const sessions = Object.keys(data);
    const values = Object.values(data);

    // Calculate the maximum value for scaling the y-axis
    const maxValue = Math.max(...values);

    // Calculate the width and spacing for each bar
    const barWidth = 50; // Adjust the width as needed
    const barSpacing = 10; // Adjust the spacing as needed

    // Calculate the scaling factor for the y-axis
    const yScale = (canvasHeight - 30) / maxValue; // Subtract 30 for bottom padding

    // Draw the bars and add value on top
    sessions.forEach((session, index) => {
      const value = values[index];
      const barHeight = value * yScale;

      const x = index * (barWidth + barSpacing);
      const y = canvasHeight - barHeight - 15; // Subtract 15 for bottom padding

      // Set the color of the bar (customize as needed)
      ctx.fillStyle = 'steelblue';

      // Draw the bar
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw the value on top of the bar
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value, x + barWidth / 2, y - 5); // Adjust the y position as needed

      // Draw the x-axis labels with left and right padding of 3px
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(session, x + barWidth / 2, canvasHeight - 5); // Adjust the y position as needed
    });

    // Draw the x-axis title
    ctx.fillStyle = 'black';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Session Time (seconds)', canvasWidth / 2, canvasHeight + 40); // Adjust the y position as needed

    // Append the graph to the graphsDiv
    graphsDiv.appendChild(graphDiv);
  });
}
