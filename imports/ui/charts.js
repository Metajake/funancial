export const drawChart = function(canvas, nodes) {

    // Create the data table.
    const data = google.visualization.arrayToDataTable(nodes);

    // Set chart options
    const options = {'title':'Amount saved over time',
        // 'width':width,
        'height':300,
        legend: { position: 'bottom' },
    };

    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.LineChart(document.getElementById(canvas));
    chart.draw(data, options);
};