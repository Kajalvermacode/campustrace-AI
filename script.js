let currentCoords = null;

// Photo Preview
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = () => { 
        document.getElementById('imgPreview').src = reader.result; 
        document.getElementById('imgPreview').style.display = 'block'; 
    };
    if (event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

// GPS Location Capture
function getLocation() {
    const status = document.getElementById('locStatus');
    status.innerText = "⏳ Capturing GPS...";
    navigator.geolocation.getCurrentPosition(
        (p) => { 
            currentCoords = { lat: p.coords.latitude, lng: p.coords.longitude }; 
            status.innerHTML = "✅ GPS Locked!"; 
            status.style.color = "#38bdf8"; 
        },
        () => { 
            currentCoords = { lat: 28.6139, lng: 77.2090 }; // Delhi Demo Coords
            status.innerHTML = "📍 GPS Locked (Demo Mode)"; 
            status.style.color = "#f59e0b"; 
        }
    );
}

// OWNER SUBMIT LOGIC
function submitLost() {
    const name = document.getElementById('ownerName').value;
    const email = document.getElementById('ownerEmail').value;
    const item = document.getElementById('lostCategory').value;

    if(!name || !email) { alert("Please fill all details!"); return; }

    const lostData = { name, email, item };
    localStorage.setItem('recentLostReport', JSON.stringify(lostData));
    
    alert(`Hi ${name}, your report for ${item} is saved. We will notify you when found!`);
    window.location.href = 'check-items.html';
}

// FOUNDER SUBMIT LOGIC (With Email & Location Match)
function startScanning() {
    const photo = document.getElementById('imgPreview').src;
    const category = document.getElementById('foundCategory').value;
    const date = document.getElementById('foundDate').value;
    const time = document.getElementById('foundTime').value;

    if (!currentCoords || !photo || !date) { alert("Please capture Location and Photo!"); return; }

    document.getElementById('scannerOverlay').style.display = 'flex';
    
    setTimeout(() => {
        // Create Google Maps Link
        const mapLink = `https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`;
        
        // Save to Gallery
        const newItem = { category, photo, mapLink, date, time };
        let allItems = JSON.parse(localStorage.getItem('allFoundItems')) || [];
        allItems.unshift(newItem);
        localStorage.setItem('allFoundItems', JSON.stringify(allItems));

        // CHECK FOR MATCH
        const lostReport = JSON.parse(localStorage.getItem('recentLostReport'));
        if (lostReport && lostReport.item === category) {
            alert(`🔥 AI MATCH! Found item location sent to ${lostReport.name} at ${lostReport.email}`);
            // Note: EmailJS code yahan integrate hoga notifications ke liye
        }

        document.getElementById('scannerOverlay').style.display = 'none';
        window.location.href = 'check-items.html';
    }, 3000);
}