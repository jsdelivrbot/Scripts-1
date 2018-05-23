      

      function drawChart() {
        google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
        var positive = parseInt(document.getElementById("positive").innerHTML);
        var negative = parseInt(document.getElementById("negative").innerHTML);
        var neutral =  parseInt(document.getElementById("neutral").innerHTML);

        console.log(positive);
                console.log(negative);
        console.log(neutral);


        var data = google.visualization.arrayToDataTable([
          ['Effort', 'Amount given'],
          ['Positive',positive],
          ['Negative',negative],
          ['Neutral',neutral]
        ]);

        var options = {
          pieHole: 0.5,
           width:900,
          height:500,
          pieSliceTextStyle: {
            color: 'black',
          },
        };

        var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
        chart.draw(data, options);
      }
