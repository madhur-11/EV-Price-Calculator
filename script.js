// API for fuel prices
const fetchFuelPrices = async () => {
    const url = 'https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/maharashtra';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'bbd5a50004msh13cfcf4784b11c8p1c9f38jsnd0945e0121fb',
            'x-rapidapi-host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const fp = document.getElementById("fp");
        fp.value = Math.round(result.fuel.petrol.retailPrice);
    } catch (error) {
        console.error('Error fetching fuel prices:', error);
    }
};

let petrol = null;
let ev = null;
let line = null;

const destroyPrevious = () => {
    if (petrol){
        petrol.destroy();
    }
    if (ev){
        ev.destroy();
    }
    if (line){
        line.destroy();
    }
};

const sampleValues = (event) => {
    event.preventDefault();
    document.getElementById('initp').value = 1000000;
    document.getElementById('dist').value = 20;
    document.getElementById('kmpl').value = 25;
    document.getElementById('maintp').value = 100000;
    document.getElementById('inite').value = 1000000;
    document.getElementById('pc').value = 10;
    document.getElementById('range').value = 40;
    document.getElementById('mainte').value = 100000;
}

// Function to be called on form submit
const afterSubmit = (event) => {
    event.preventDefault();  
    destroyPrevious();
    const res = document.querySelector('.result');

    const initp = document.getElementById('initp').value.trim();
    const fp = document.getElementById('fp').value.trim();
    const dist = document.getElementById('dist').value.trim();
    const kmpl = document.getElementById('kmpl').value.trim();
    const maintp = document.getElementById('maintp').value.trim();
    const inite = document.getElementById('inite').value.trim();
    const pc = document.getElementById('pc').value.trim();
    const range = document.getElementById('range').value.trim();
    const mainte = document.getElementById('mainte').value.trim();

    if (!initp || !fp || !dist || !kmpl || !maintp || !inite || !pc || !range || !mainte) {
        const err = document.getElementById('err');
        err.style.display = 'flex';
        res.style.display = 'none';
    } else {
        // Petrol Vehicle Pie Chart
        res.style.display = 'flex';
        const dataPetrol = {
            labels: ["Initial Cost", "Fueling Cost", "Long Term Costs"],
            datasets: [{
                label: "Cost of Ownership of Petrol Vehicle",
                data: [initp, (dist / kmpl) * fp * 365 * 4, maintp],  
                backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 205, 86, 0.7)'],
                borderColor: ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
                borderWidth: 1
            }]
        };

        petrol = new Chart(document.getElementById('petrol'), {
            type: 'pie',
            data: dataPetrol,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true },
                    title: {
                        display: true,
                        text: 'Petrol Vehicle Cost Distribution',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });

        // EV Pie Chart
        const dataEV = {
            labels: ["Initial Cost", "Charging Cost", "Long Term Costs"],
            datasets: [{
                label: "Cost of Ownership of EV",
                data: [inite, (dist / range) * pc * 365 * 4, mainte],  
                backgroundColor: ['rgba(255, 159, 64, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
                borderColor: ['rgba(0,0,0, 1)', 'rgba(0,0,0, 1)', 'rgba(0,0,0, 1)'],
                borderWidth: 1
            }]
        };

        ev = new Chart(document.getElementById('ev'), {
            type: 'pie',
            data: dataEV,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true },
                    title: {
                        display: true,
                        text: 'EV Cost Distribution',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });

        // Line Chart
        const lineData = {
            labels: ['Year 0','Year 1', 'Year 2', 'Year 3', 'Year 4'],  
            datasets: [
                {
                    label: 'Petrol Vehicle',
                    data: [+initp, +initp + 0.25*+maintp + (+dist / +kmpl) * +fp * 365, +initp + (+dist / +kmpl) * +fp * 365 * 2 + 0.5*+maintp, +initp + (+dist / +kmpl) * fp * 365 * 3 + 0.75*+maintp, +initp + (+dist / +kmpl) * fp * 365 * 4 + +maintp],
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                },
                {
                    label: 'EV',
                    data: [+inite, +inite + 0.25*+mainte + (+dist / +range) * +pc * 365 , +inite + (+dist / +range) * +pc * 365 * 2 + 0.5*+mainte, +inite + (+dist / +range) * +pc * 365 * 3 + 0.75*+mainte, +inite + (+dist / +range) * +pc * 365 * 4 + +mainte],
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.1
                }
            ]
        };

        line = new Chart(document.getElementById('line'), {
            type: 'line',
            data: lineData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Time Period' }
                    },
                    y: {
                        title: { display: true, text: 'Accumulated Cost (in INR)' }
                    }
                }
            }
        });
    }
};

const errClose = () => {
    const err = document.getElementById('err');
    err.style.display = 'none';
}

const reset = () => {
    const res = document.querySelector('.result');
    res.style.display = 'none';
}

const download = (chartId,fileName) => {
    const chart = document.getElementById(chartId);
    const link = document.createElement('a');
    link.href = chart.toDataURL('image/png');
    link.download = fileName;
    link.click();
}

const dp = () => {
    download('petrol','petrol-pie-chart.png');
}
const de = () => {
    download('ev','electric-pie-chart.png');
}
const dl = () => {
    download('line','line-chart.png');
}