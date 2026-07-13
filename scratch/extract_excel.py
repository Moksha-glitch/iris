import pandas as pd
import json

file_path = r"C:\Users\MokshaVemula\Downloads\DUO_Dashboard_v3.8.xlsm"

try:
    xl = pd.ExcelFile(file_path, engine='openpyxl')
    sheets_info = {}
    for sheet in xl.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet, engine='openpyxl', nrows=5)
        sheets_info[sheet] = {
            "columns": df.columns.tolist(),
            "first_rows": df.head(3).to_dict(orient='records')
        }
    
    print(json.dumps(sheets_info, indent=2, default=str))
except Exception as e:
    print(f"Error reading excel: {e}")
