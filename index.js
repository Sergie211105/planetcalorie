// Data Makanan Pluto (Diambil dari informasi yang Anda berikan)
const PLUTO_DATA = [
    { name: 'Dada Ayam', portion: '100 gram', kalori: 165, protein: 31 },
    { name: 'Paha Ayam', portion: '100 gram', kalori: 179, protein: 24 },
    { name: 'Daging Sapi', portion: '100 gram', kalori: 250, protein: 26 },
    { name: 'Telur Ayam', portion: '1 butir (±50g)', kalori: 72, protein: 6 },
    { name: 'Nasi Putih', portion: '100 gram', kalori: 130, protein: 2.7 },
    { name: 'Ubi Jalar', portion: '100 gram', kalori: 90, protein: 2.0 },
    { name: 'Singkong', portion: '100 gram', kalori: 160, protein: 1.4 },
    { name: 'Kacang Kedelai', portion: '100 gram', kalori: 173, protein: 16.6 },
];

// Multiplier TDEE berdasarkan aktivitas (Mifflin-St Jeor)
const TDEE_MULTIPLIERS = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'very': 1.725,
    'extra': 1.9
};

// Variabel global untuk menyimpan kalori maintenance (Dihitung di Mars)
let maintenanceCalories = 0; 

// --- FUNGSI UTAMA (INIT & UI) ---

// Membuat bintang di background
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        star.style.animationDelay = Math.random() * 2 + 's';
        
        starsContainer.appendChild(star);
    }
}
window.createStars = createStars;

// Logika interaksi mobile/tap pada daratan
function initMobileInteraction() {
    document.querySelectorAll('.continent').forEach(continent => {
        continent.addEventListener('click', function(event) {
            // Hanya aktifkan pada layar kecil
            if (window.innerWidth <= 768) {
                const planet = this.closest('.planet-sphere');
                // Hapus 'active' dari semua continent di planet yang SAMA
                planet.querySelectorAll('.continent').forEach(c => {
                    if (c !== this) {
                        c.classList.remove('active');
                    }
                });
                
                this.classList.toggle('active');

                // Cegah toggle panel jika tombol hitung diklik
                if (event.target.classList.contains('btn')) {
                    event.stopPropagation();
                    this.classList.add('active'); 
                }
            }
        });
    });
}

// --- EARTH FUNCTIONS (Kalori Terbakar) ---

function calculateCaloriesBurned() {
    const weightInput = document.getElementById('weight');
    const sportSelect = document.getElementById('sport');
    const durationInput = document.getElementById('duration');
    const resultContainer = document.getElementById('resultContainerEarth');
    
    const weight = parseFloat(weightInput.value);
    const sportMET = parseFloat(sportSelect.value);
    const duration = parseFloat(durationInput.value); 
    const sportName = sportSelect.options[sportSelect.selectedIndex].text;
    
    if (!weight || weight <= 0) {
        alert('Silakan masukkan Berat Badan yang valid di planet Earth terlebih dahulu!');
        document.getElementById('weight').focus();
        return;
    }
    if (!sportMET || !duration || duration <= 0) {
        alert('Silakan lengkapi jenis olahraga dan durasi yang valid.');
        return;
    }

    const caloriesBurned = sportMET * weight * (duration / 60);
    
    resultContainer.innerHTML = `
        <p>Olahraga: <strong>${sportName}</strong> (${duration} menit)</p>
        <p>Total Kalori Terbakar: <strong>${Math.round(caloriesBurned)} Kkal</strong></p>
        <p class="hint">Perhitungan ini menggunakan satuan setara metabolisme (MET).</p>
    `;

    document.querySelector('.results-earth').classList.add('active');
}
window.calculateCaloriesBurned = calculateCaloriesBurned;

// --- MARS FUNCTIONS (BMR & MAINTENANCE) ---

function calculateMaintenanceTDEE() {
    // Ambil BB dari Earth
    const weight = parseFloat(document.getElementById('weight').value); 
    // Ambil input dari Mars
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const age = parseFloat(document.getElementById('age').value);
    const activity = document.getElementById('activity').value;
    
    const resultContainerMars = document.getElementById('resultContainerMars');
    const maintenanceDisplayMars = document.getElementById('maintenanceDisplayMars');
    const maintenanceDisplayJupiter = document.getElementById('maintenanceDisplayJupiter');
    const maintenanceDisplayPluto = document.getElementById('maintenanceDisplayPluto');


    if (!weight || !gender || !height || !age || !activity) {
        alert('Mohon lengkapi data Berat Badan (di Earth) dan data Maintenance di Mars.');
        return;
    }

    let BMR;
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === 'female') {
        BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
        alert('Jenis Kelamin tidak valid.');
        return;
    }

    const TDEE = BMR * TDEE_MULTIPLIERS[activity];
    
    maintenanceCalories = Math.round(TDEE);
    
    // Update semua display maintenance di planet lain
    maintenanceDisplayMars.textContent = maintenanceCalories + ' Kkal';
    maintenanceDisplayJupiter.textContent = maintenanceCalories + ' Kkal';
    maintenanceDisplayPluto.textContent = maintenanceCalories + ' Kkal';


    resultContainerMars.innerHTML = `
        <p>BMR Anda: <strong>${Math.round(BMR)} Kkal</strong></p>
        <p>Maintenance (TDEE): <strong>${maintenanceCalories} Kkal</strong></p>
        <p class="hint">Maintenance kalori Anda sudah dihitung dan siap digunakan di planet Jupiter & Pluto.</p>
    `;

    document.querySelector('#mars-planet .results-mars').classList.add('active');
}
window.calculateMaintenanceTDEE = calculateMaintenanceTDEE; 

// --- JUPITER FUNCTIONS (LEAN BULK) ---

function calculateLeanBulk() {
    const resultContainerJupiter = document.getElementById('resultContainerJupiter');
    
    if (maintenanceCalories === 0) {
        alert('Harap hitung Maintenance Kalori Anda terlebih dahulu di planet Mars.');
        return;
    }

    // Lean bulk = naikin 10% dari maintanence
    const targetCalories = maintenanceCalories * 1.10;
    const diff = Math.round(targetCalories - maintenanceCalories);

    resultContainerJupiter.innerHTML = `
        <h3>🎯 Target Kalori Lean Bulk</h3>
        <p>Maintenance Kalori: <strong>${maintenanceCalories} Kkal</strong></p>
        <p>Target Harian (+10%): <strong>${Math.round(targetCalories)} Kkal</strong></p>
        <p class="hint">Anda perlu surplus ${diff} Kkal per hari untuk Lean Bulk.</p>
    `;
    
    document.querySelector('#jupiter-planet .results-jupiter').classList.add('active');
}
window.calculateLeanBulk = calculateLeanBulk; 

// --- PLUTO FUNCTIONS (CUTTING) ---

function calculateCutting() {
    const cutTarget = document.getElementById('cut_target').value;
    const resultContainerPluto = document.getElementById('resultContainerPluto');
    
    if (maintenanceCalories === 0) {
        alert('Harap hitung Maintenance Kalori Anda terlebih dahulu di planet Mars.');
        return;
    }

    // Cutting = turunin 10% dari maintanence untuk 1 kg perbulan, berarti 2 turun 20% dst
    const targetKg = parseFloat(cutTarget);
    const reductionPercent = targetKg * 10; 
    const multiplier = 1 - (reductionPercent / 100);
    const targetCalories = maintenanceCalories * multiplier;

    const diff = Math.round(maintenanceCalories - targetCalories);
    
    resultContainerPluto.innerHTML = `
        <h3>🎯 Target Kalori Cutting</h3>
        <p>Maintenance Kalori: <strong>${maintenanceCalories} Kkal</strong></p>
        <p>Target Turun: <strong>${targetKg} kg/bulan</strong> (Reduksi ${reductionPercent}%)</p>
        <p>Target Kalori Harian: <strong>${Math.round(targetCalories)} Kkal</strong></p>
        <p class="hint">Anda perlu defisit ${diff} Kkal per hari untuk Cutting.</p>
    `;
    
    document.querySelector('#pluto-planet .results-pluto').classList.add('active');
}
window.calculateCutting = calculateCutting; 

// --- NEPTUNE FUNCTIONS (FOOD DATA) ---

function displayFoodData() {
    const container = document.getElementById('plutoTableContainer');
    
    let tableHTML = `
        <table class="pluto-table">
            <thead>
                <tr>
                    <th>Makanan</th>
                    <th>Porsi</th>
                    <th>Kalori (Kkal)</th>
                    <th>Protein (g)</th>
                </tr>
            </thead>
            <tbody>
    `;

    PLUTO_DATA.forEach(data => {
        tableHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.portion}</td>
                <td>${data.kalori}</td>
                <td>${data.protein}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}
window.displayFoodData = displayFoodData;

// --- INITIATION ---
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    displayFoodData(); // Data makanan ditampilkan di Neptune
    initMobileInteraction();
});