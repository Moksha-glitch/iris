import pandas as pd
import json
import os
import math
import numpy as np

file_path = r"C:\Users\MokshaVemula\Downloads\DUO_Dashboard_v3.8.xlsm"

# We will read all sheets, assuming they are date-based
xl = pd.ExcelFile(file_path, engine='openpyxl')
sheets = xl.sheet_names

# Sort sheets by date (assuming mm-dd-yy format or similar, let's just sort alphabetically if mm-dd-yy. Actually, 5-06-26, 5-07-26, 5-08-26. We can just parse as datetime if possible, or assume alphanumeric sort)
sheets_sorted = sorted(sheets) # 5-06, 5-07, 5-08

all_data = []
for sheet in sheets_sorted:
    try:
        df = pd.read_excel(file_path, sheet_name=sheet, engine='openpyxl')
        df['SheetDate'] = sheet
        all_data.append(df)
    except Exception as e:
        print(f"Skipping {sheet}: {e}")

if not all_data:
    print("No data found")
    exit(1)

full_df = pd.concat(all_data, ignore_index=True)

# Helper function to sanitize NaNs
def clean_val(val):
    if pd.isna(val) or pd.isnull(val):
        return 0
    if isinstance(val, (np.int64, np.float64)):
        return val.item()
    return val

locations = full_df['Location Name'].dropna().unique()

decisions = []

for loc in locations:
    loc_data = full_df[full_df['Location Name'] == loc].sort_values('SheetDate')
    
    # Get latest row for current status
    latest_row = loc_data.iloc[-1]
    
    cust_name = latest_row.get('Customer Name', 'Unknown')
    
    loc_id = f"LOC-{str(loc).replace(' ', '')}"
    
    # Verdict
    is_live = str(latest_row.get('Live?', 'no')).strip().lower() == 'yes'
    verdict = "Live" if is_live else "Not Live"
    
    # Extract metrics for RealityCheck (time series)
    metric_col = '% Lost Pallets vs Total Float'
    time_series = [clean_val(x) for x in loc_data[metric_col].tolist()]
    
    latest_lost_pct = clean_val(latest_row.get('% Lost Pallets vs Total Float', 0))
    undetected_rate = clean_val(latest_row.get('Undetected Stop Rate (%)', 0))
    
    # Calculate RAG
    rag = 'g'
    if latest_lost_pct > 15 or undetected_rate > 10:
        rag = 'r'
    elif latest_lost_pct > 5 or undetected_rate > 5:
        rag = 'a'
        
    trend = "stable"
    if len(time_series) > 1:
        diff = time_series[-1] - time_series[-2]
        if diff > 1: trend = "up"
        elif diff < -1: trend = "down"
    
    # Drivers
    drivers = []
    
    # 1. Lift Health
    offline = clean_val(latest_row.get('Lifts Offline (7+ days)', 0))
    low_bat = clean_val(latest_row.get('Low Battery Lifts (<=30%)', 0))
    lift_signals = []
    if offline > 0:
        lift_signals.append({"type": "negative", "text": f"{offline} Lifts Offline (7+ days)", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})
    if low_bat > 0:
        lift_signals.append({"type": "negative", "text": f"{low_bat} Low Battery Lifts", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})
    
    if len(lift_signals) == 0:
         lift_signals.append({"type": "positive", "text": "All active lifts are healthy", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})
         
    drivers.append({
        "id": f"DR-{loc_id}-1",
        "title": "Lift Health",
        "status": "vulnerable" if offline > 0 or low_bat > 0 else "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": lift_signals
    })
    
    # 2. Route Integrity
    missed_stops = clean_val(latest_row.get('Pending, Missed, Undetected Stops', 0))
    missing_seq = clean_val(latest_row.get('Total Missing Sequence Stops', 0))
    route_signals = []
    if missed_stops > 0:
        route_signals.append({"type": "negative", "text": f"{missed_stops} Pending/Missed/Undetected Stops ({undetected_rate}% rate)", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})
    if missing_seq > 0:
        route_signals.append({"type": "negative", "text": f"{missing_seq} Missing Sequence Stops", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})
        
    if len(route_signals) == 0:
         route_signals.append({"type": "positive", "text": "Route integrity is optimal", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})

    drivers.append({
        "id": f"DR-{loc_id}-2",
        "title": "Route Integrity",
        "status": "vulnerable" if missed_stops > 0 or missing_seq > 0 else "valid",
        "trend": "stable",
        "owner": "Routing",
        "lastUpdated": "Today",
        "signals": route_signals
    })

    # 3. Asset Tracking
    total_pallets = clean_val(latest_row.get('Total Pallets (ACTIVE)', 0))
    lost_pallets = clean_val(latest_row.get('Lost Pallets', 0))
    asset_signals = []
    
    asset_signals.append({"type": "positive" if latest_lost_pct < 10 else "negative", "text": f"{lost_pallets} Lost Pallets out of {total_pallets} Active", "source": "DUO Dashboard", "fresh": "Today", "reliability": "High", "quarantined": False})

    drivers.append({
        "id": f"DR-{loc_id}-3",
        "title": "Asset Tracking",
        "status": "broken" if latest_lost_pct > 15 else ("vulnerable" if latest_lost_pct > 5 else "valid"),
        "trend": "stable",
        "owner": "Logistics",
        "lastUpdated": "Today",
        "signals": asset_signals
    })
    
    # WhatsChanged
    whatsChanged = []
    if len(loc_data) > 1:
        prev_row = loc_data.iloc[-2]
        prev_lost = clean_val(prev_row.get('Lost Pallets', 0))
        if lost_pallets > prev_lost:
            whatsChanged.append(f"WARNING: Lost pallets increased from {prev_lost} to {lost_pallets}.")
        elif lost_pallets < prev_lost:
            whatsChanged.append(f"Lost pallets decreased from {prev_lost} to {lost_pallets}.")
            
        prev_offline = clean_val(prev_row.get('Lifts Offline (7+ days)', 0))
        if offline != prev_offline:
            whatsChanged.append(f"Lifts offline changed from {prev_offline} to {offline}.")
            
    if len(whatsChanged) == 0:
        whatsChanged.append("Metrics remained relatively stable since last report.")

    decisions.append({
        "id": loc_id,
        "title": f"{cust_name} - {loc}",
        "verdict": verdict,
        "rag": rag,
        "confidence": round(100 - latest_lost_pct - undetected_rate, 1),
        "valueAtRisk": f"{lost_pallets} Pallets",
        "financialImpact": latest_lost_pct,
        "trend": trend,
        "whatsChanged": whatsChanged,
        "drivers": drivers,
        "realityCheck": {
            "metric": "% Lost Pallets",
            "prediction": 5,
            "reality": latest_lost_pct,
            "unit": "%",
            "timeSeries": time_series
        }
    })

store_js_content = f"""// Auto-generated store data from DUO_Dashboard_v3.8.xlsm
export const decisions = {json.dumps(decisions, indent=2)};

export const connections = [];

export function getDecision(id) {{
  return decisions.find(d => d.id === id);
}}
"""

out_path = r"c:\Users\MokshaVemula\Downloads\decision-os\src\store.js"
with open(out_path, "w", encoding="utf-8") as f:
    f.write(store_js_content)
    
print(f"store.js updated successfully at {out_path}")
