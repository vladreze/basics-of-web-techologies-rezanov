document.addEventListener('DOMContentLoaded', function() {

const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

const categories = {
    electronics: {
        currentYear: [25000, 26500, 28000, 27500, 30000, 32000, 31500, 34000, 36000, 38500, 41000, 43000],
        year2024: [22000, 23500, 24000, 26000, 25500, 27000, 29000, 28500, 31000, 33000, 35000, 37000],
        year2025: [24000, 25000, 27500, 26500, 29000, 31000, 30500, 33000, 35000, 37000, 39500, 42000]
    },
    clothing: {
        currentYear: [32000, 31000, 34000, 36500, 35000, 38000, 41000, 40000, 43000, 46000, 49000, 52000],
        year2024: [28000, 29500, 31000, 33000, 32500, 35000, 37000, 36500, 39000, 41000, 43500, 46000],
        year2025: [31000, 30500, 33000, 35000, 34000, 37500, 40000, 39500, 42000, 45000, 47000, 50000]
    },
    books: {
        currentYear: [16000, 18500, 17500, 20000, 22000, 21500, 24000, 23500, 26000, 28500, 31000, 33000],
        year2024: [14000, 15500, 15000, 17500, 19000, 18500, 21000, 20500, 23000, 25000, 27000, 29000],
        year2025: [15500, 17000, 16500, 19000, 21000, 20500, 23000, 22500, 25000, 27500, 29500, 31500]
    }
};

const barCtx = document.getElementById('barChart').getContext('2d');
const lineCtx = document.getElementById('lineChart').getContext('2d');

const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Продажі (грн)',
                data:  categories.electronics.currentYear,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true }
    });

const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: '2024 рік',
            data: categories.electronics.year2024,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
        },
        {
            label: '2025 рік',
            data: categories.electronics.year2025,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
        }]
    },
    options: { responsive: true }
})

const categoryFilter = document.getElementById('category-selector');
categoryFilter.addEventListener("change" , function(event){
    const selectedCategory = event.target.value;
    const newData = categories[selectedCategory];

    barChart.data.datasets[0].data = newData.currentYear;
    barChart.update();

    lineChart.data.datasets[0].data = newData.year2024;
    lineChart.data.datasets[1].data = newData.year2025;
    lineChart.update();
});

});

