var xValues = ["Cours",  "Travaux" ];
var yValues = [55, 49, 44];
var barColors = ["green","orange"];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Statistique des cours et travaux"
    }
  }
});