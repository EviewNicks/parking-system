<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monitoring Parkir Realtime</title>
  <script src="https://unpkg.com/@supabase/supabase-js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Poppins', sans-serif;
      background: #2c3e50;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: #333;
    }

    .header { text-align: center; margin-bottom: 30px; color: white; }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      font-weight: 300;
    }

    .summary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 20px 40px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-around;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }

    .summary-item { text-align: center; color: white; }

    .summary-number {
      font-size: 2rem;
      font-weight: 700;
      display: block;
    }

    .summary-label { font-size: 0.9rem; opacity: 0.8; margin-top: 5px; }

    .parking-lot {
      background: #34495e;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      max-width: 900px;
      width: 100%;
    }

    .parking-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 30px;
      margin-bottom: 20px;
    }

    .parking-slot {
      position: relative;
      aspect-ratio: 1/1.5;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 10px,
        rgba(255, 255, 255, 0.1) 10px,
        rgba(255, 255, 255, 0.1) 12px
      );
      border: 3px dashed rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .parking-slot:hover {
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .slot-number {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 10;
    }

    .car-icon {
      font-size: 3rem;
      transition: transform 0.3s ease;
    }

    .parking-slot:hover .car-icon {
      transform: scale(1.1);
    }

    .slot-kosong {
      background-color: rgba(46, 204, 113, 0.2);
      border-color: #2ecc71;
    }

    .slot-kosong .car-icon {
      color: #2ecc71;
      opacity: 0.3;
    }

    .slot-terisi {
      background-color: rgba(231, 76, 60, 0.2);
      border-color: #e74c3c;
    }

    .slot-terisi .car-icon {
      color: #e74c3c;
    }

    .slot-info {
      margin-top: 10px;
      text-align: center;
      font-size: 0.75rem;
      color: white;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 15px;
      font-weight: 600;
      font-size: 0.7rem;
      margin-bottom: 5px;
    }

    .badge-kosong { background: #2ecc71; color: white; }
    .badge-terisi { background: #e74c3c; color: white; }

    .jarak-text {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 5px;
    }

    .loading {
      opacity: 0.5;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .loading .car-icon { color: #95a5a6; }

    @media (max-width: 768px) {
      .parking-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
      h1 { font-size: 1.8rem; }
      .summary { flex-direction: column; gap: 10px; padding: 15px 20px; }
      .parking-lot { padding: 20px; }
      .car-icon { font-size: 2rem; }
    }

  </style>
</head>
<body>
  <div class="header">
    <h1><i class="fas fa-parking"></i> Status Parkir Realtime</h1>
    <p class="subtitle">Monitor slot parkir secara live dengan data sensor jarak</p>
  </div>

  <div class="summary">
    <div class="summary-item">
      <span class="summary-number" id="totalKosong">0</span>
      <span class="summary-label">Slot Kosong</span>
    </div>
    <div class="summary-item">
      <span class="summary-number" id="totalTerisi">0</span>
      <span class="summary-label">Slot Terisi</span>
    </div>
    <div class="summary-item">
      <span class="summary-number" id="totalSlot">5</span>
      <span class="summary-label">Total Slot</span>
    </div>
  </div>

  <div class="parking-lot">
    <div class="parking-grid">
      <div id="slot1" class="parking-slot slot-kosong loading">
        <div class="slot-number">1</div>
        <i class="fas fa-car car-icon"></i>
        <div class="slot-info">
          <div class="status-badge badge-kosong" id="badge1">Kosong</div>
          <div class="jarak-text"><span id="jarak1">0</span> cm</div>
        </div>
      </div>

      <div id="slot2" class="parking-slot slot-kosong loading">
        <div class="slot-number">2</div>
        <i class="fas fa-car car-icon"></i>
        <div class="slot-info">
          <div class="status-badge badge-kosong" id="badge2">Kosong</div>
          <div class="jarak-text"><span id="jarak2">0</span> cm</div>
        </div>
      </div>

      <div id="slot3" class="parking-slot slot-kosong loading">
        <div class="slot-number">3</div>
        <i class="fas fa-car car-icon"></i>
        <div class="slot-info">
          <div class="status-badge badge-kosong" id="badge3">Kosong</div>
          <div class="jarak-text"><span id="jarak3">0</span> cm</div>
        </div>
      </div>

      <div id="slot4" class="parking-slot slot-kosong loading">
        <div class="slot-number">4</div>
        <i class="fas fa-car car-icon"></i>
        <div class="slot-info">
          <div class="status-badge badge-kosong" id="badge4">Kosong</div>
          <div class="jarak-text"><span id="jarak4">0</span> cm</div>
        </div>
      </div>

      <div id="slot5" class="parking-slot slot-kosong loading">
        <div class="slot-number">5</div>
        <i class="fas fa-car car-icon"></i>
        <div class="slot-info">
          <div class="status-badge badge-kosong" id="badge5">Kosong</div>
          <div class="jarak-text"><span id="jarak5">0</span> cm</div>
        </div>
      </div>
    </div>

  </div>

  <script>
    const SUPABASE_URL = "https://hbamjfskfcatsnboenmr.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYW1qZnNrZmNhdHNuYm9lbm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTY3NTEsImV4cCI6MjA3NDI5Mjc1MX0.TtMGDbhQVBvq9UsilKPefYbaatEaPF7s2ciimDf-bP8";
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let totalKosong = 0;
    let totalTerisi = 0;

    function updateSummary() {
      document.getElementById("totalKosong").textContent = totalKosong;
      document.getElementById("totalTerisi").textContent = totalTerisi;
    }

    function updateUI(slot, status, jarak) {
      const jarakEl = document.getElementById("jarak" + slot);
      const slotDiv = document.getElementById("slot" + slot);
      const badgeEl = document.getElementById("badge" + slot);

      jarakEl.textContent = jarak;
      if (status.toLowerCase() === "terisi") {
        slotDiv.classList.remove("slot-kosong", "loading");
        slotDiv.classList.add("slot-terisi");
        badgeEl.textContent = "Terisi";
        badgeEl.className = "status-badge badge-terisi";
      } else {
        slotDiv.classList.remove("slot-terisi", "loading");
        slotDiv.classList.add("slot-kosong");
        badgeEl.textContent = "Kosong";
        badgeEl.className = "status-badge badge-kosong";
      }
    }

    async function loadData() {
      const { data, error } = await client.from("parkingg").select("*");
      if (data) {
        totalKosong = 0;
        totalTerisi = 0;
        data.forEach(row => {
          updateUI(row.slot, row.status, row.jarak);
          if (row.status.toLowerCase() === "terisi") totalTerisi++;
          else totalKosong++;
        });
        updateSummary();
      }
      if (error) console.error("Error loading data:", error);
    }

    loadData();
    setInterval(loadData, 1000);

    client.channel("parking-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "parkingg" }, payload => {
        const d = payload.new;
        updateUI(d.slot, d.status, d.jarak);
      })
      .subscribe();
  </script>
</body>
</html>
