import pandas as pd

file_path = r"C:\Users\MokshaVemula\Downloads\DUO_Dashboard_v3.8.xlsm"

# Read the latest sheet
df = pd.read_excel(file_path, sheet_name='5-08-26', engine='openpyxl')

total_routes = df['Total Routes'].sum()
incomplete_routes = df['Incomplete Routes'].sum() + df['Routes Not Ran'].sum()
total_stops = df['Total Stops'].sum()
delayed_stops = df['Pending, Missed, Undetected Stops'].sum()

total_lifts = df['Total Lifts'].sum()
offline_lifts = df['Lifts Offline (7+ days)'].sum()
in_service = total_lifts - offline_lifts

total_pallets = df['Total Pallets (ACTIVE)'].sum()
lost_pallets = df['Lost Pallets'].sum()

recovery_rate = 100 - (lost_pallets / total_pallets * 100) if total_pallets > 0 else 0
uptime = (in_service / total_lifts * 100) if total_lifts > 0 else 0

print("--- ROUTE SUMMARY ---")
print(f"Total Routes: {total_routes}")
print(f"Incomplete/Not Ran: {incomplete_routes}")
print(f"Total Stops: {total_stops}")
print(f"Delayed Stops: {delayed_stops}")

print("\n--- LIFT SUMMARY ---")
print(f"Total Lifts: {total_lifts}")
print(f"In Service: {in_service}")
print(f"Offline: {offline_lifts}")
print(f"Avg Uptime: {uptime:.1f}%")

print("\n--- ASSET MANAGEMENT ---")
print(f"Total Pallets: {total_pallets}")
print(f"Lost Pallets: {lost_pallets}")
print(f"Recovery Rate (Est): {recovery_rate:.1f}%")
