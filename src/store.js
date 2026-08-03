// Auto-generated from excelData.js (Customers + Missing WO reports)
// Run: node scripts/generateStore.mjs

export const decisions = [
  {
    "id": "WO-Edmonton-Missing",
    "title": "Edmonton AB — Missing Work Orders",
    "verdict": "Critical Backlog",
    "rag": "r",
    "confidence": 92.5,
    "valueAtRisk": "$6,250",
    "financialImpact": 6250,
    "trend": "down",
    "truckCount": 0,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 0,
    "openWOs": 16,
    "whatsChanged": [
      "16 open missing work orders (avg age 741 days).",
      "5 cases exceed 700-day threshold.",
      "Oldest: WO #03843390 at 1217 days (Cart pick Delivery)."
    ],
    "drivers": [
      {
        "id": "DR-WO-Edmonton-1",
        "title": "Case Aging",
        "status": "invalid",
        "trend": "down",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "WO #03843390 — Cart pick Delivery — 1217d",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03849366 — A3-Confirm Cart — 1210d",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03889373 — A3-Repair RFID — 840d",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03889643 — A1-Lost or Stolen Cart — 805d",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03892181 — A3-Repair Cart - Wheel — 762d",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "WO #03892897 — OBS-Repair Cart — 698d",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-WO-Edmonton-2",
        "title": "Request Type Mix",
        "status": "valid",
        "trend": "stable",
        "owner": "Dispatch",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "OBS-Bulk Pickup: 5 (avg 614d)",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "OBS-Repair Cart: 3 (avg 689d)",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "OBS-Brush: 2 (avg 603d)",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "A1-Lost or Stolen Cart: 1 (avg 805d)",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "A3-Confirm Cart: 1 (avg 1210d)",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-WO-Edmonton-3",
        "title": "Dispatch Load",
        "status": "valid",
        "trend": "stable",
        "owner": "Dispatch",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "D-05960: 5 open WOs",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "D-05977: 4 open WOs",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "D-06261: 2 open WOs",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "D-06275: 2 open WOs",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "D-05029: 1 open WOs",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "Avg Case Age (days)",
      "prediction": 30,
      "reality": 741,
      "unit": "days",
      "timeSeries": [
        350,
        500,
        650,
        750,
        741
      ]
    }
  },
  {
    "id": "SP-AD-Work-Orders",
    "title": "AD Work Orders",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 1,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-AD-Work-Orders-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1/1 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-AD-Work-Orders-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-AD-Work-Orders-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Albany-NY",
    "title": "Albany NY",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 9,
    "trucksWithRFID": 8,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 88.9,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Albany-NY-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "8/9 trucks RFID-equipped (88.9%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Albany-NY-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Albany-NY-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "9 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 88.9,
      "unit": "%",
      "timeSeries": [
        80.9,
        83.9,
        85.9,
        87.9,
        88.9
      ]
    }
  },
  {
    "id": "SP-Alexandria-VA",
    "title": "Alexandria VA",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 1,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Alexandria-VA-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1/1 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Alexandria-VA-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Alexandria-VA-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Barbados",
    "title": "Barbados",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 95.2,
    "valueAtRisk": "$2,700",
    "financialImpact": 2700,
    "trend": "down",
    "truckCount": 46,
    "trucksWithRFID": 40,
    "trucksWithoutRFID": 6,
    "rfidCoverage": 87,
    "openWOs": 0,
    "whatsChanged": [
      "6 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Barbados-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "40/46 trucks RFID-equipped (87.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Barbados-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Barbados-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "46 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 87,
      "unit": "%",
      "timeSeries": [
        79,
        82,
        84,
        86,
        87
      ]
    }
  },
  {
    "id": "SP-Billdon",
    "title": "Billdon",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Billdon-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/2 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Billdon-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Billdon-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Bourne",
    "title": "Bourne",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 8,
    "trucksWithRFID": 8,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Bourne-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8/8 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Bourne-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Bourne-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Cambridge-MA",
    "title": "Cambridge MA",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 4,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 75,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Cambridge-MA-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "3/4 trucks RFID-equipped (75.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Cambridge-MA-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Cambridge-MA-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "4 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 75,
      "unit": "%",
      "timeSeries": [
        67,
        70,
        72,
        74,
        75
      ]
    }
  },
  {
    "id": "SP-Centre-County-PA",
    "title": "Centre County PA",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 4,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 75,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Centre-County-PA-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "3/4 trucks RFID-equipped (75.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Centre-County-PA-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Centre-County-PA-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "4 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 75,
      "unit": "%",
      "timeSeries": [
        67,
        70,
        72,
        74,
        75
      ]
    }
  },
  {
    "id": "SP-Cincinnati-OH",
    "title": "Cincinnati OH",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 93.6,
    "valueAtRisk": "$3,600",
    "financialImpact": 3600,
    "trend": "down",
    "truckCount": 27,
    "trucksWithRFID": 19,
    "trucksWithoutRFID": 8,
    "rfidCoverage": 70.4,
    "openWOs": 0,
    "whatsChanged": [
      "8 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Cincinnati-OH-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "19/27 trucks RFID-equipped (70.4%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Cincinnati-OH-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Cincinnati-OH-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "27 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 70.4,
      "unit": "%",
      "timeSeries": [
        62.4,
        65.4,
        67.4,
        69.4,
        70.4
      ]
    }
  },
  {
    "id": "SP-City-of-Clinton",
    "title": "City of Clinton",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 7,
    "trucksWithRFID": 6,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 85.7,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-Clinton-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "6/7 trucks RFID-equipped (85.7%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Clinton-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Clinton-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 85.7,
      "unit": "%",
      "timeSeries": [
        77.7,
        80.7,
        82.7,
        84.7,
        85.7
      ]
    }
  },
  {
    "id": "SP-City-of-Kenosha-WI",
    "title": "City of Kenosha WI",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 15,
    "trucksWithRFID": 15,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-Kenosha-WI-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "15/15 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Kenosha-WI-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Kenosha-WI-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "15 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-City-of-Kissimmee",
    "title": "City of Kissimmee",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 96,
    "valueAtRisk": "$2,250",
    "financialImpact": 2250,
    "trend": "down",
    "truckCount": 24,
    "trucksWithRFID": 19,
    "trucksWithoutRFID": 5,
    "rfidCoverage": 79.2,
    "openWOs": 0,
    "whatsChanged": [
      "5 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-Kissimmee-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "19/24 trucks RFID-equipped (79.2%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Kissimmee-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Kissimmee-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "24 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 79.2,
      "unit": "%",
      "timeSeries": [
        71.2,
        74.2,
        76.2,
        78.2,
        79.2
      ]
    }
  },
  {
    "id": "SP-City-of-Los-Angeles",
    "title": "City of Los Angeles",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-Los-Angeles-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/2 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Los-Angeles-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Los-Angeles-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-City-of-Monroe-WI",
    "title": "City of Monroe WI",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 50,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-Monroe-WI-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "1/2 trucks RFID-equipped (50.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Monroe-WI-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Monroe-WI-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 50,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        50
      ]
    }
  },
  {
    "id": "SP-City-of-San-Diego",
    "title": "City of San Diego",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 1,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-San-Diego-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1/1 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-San-Diego-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-San-Diego-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-City-of-St-Cloud",
    "title": "City of St Cloud",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 9,
    "trucksWithRFID": 9,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-St-Cloud-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "9/9 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-St-Cloud-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-St-Cloud-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "9 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-City-of-Troy-AL",
    "title": "City of Troy AL",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 6,
    "trucksWithRFID": 5,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 83.3,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-City-of-Troy-AL-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "5/6 trucks RFID-equipped (83.3%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Troy-AL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-City-of-Troy-AL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "6 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 83.3,
      "unit": "%",
      "timeSeries": [
        75.3,
        78.3,
        80.3,
        82.3,
        83.3
      ]
    }
  },
  {
    "id": "SP-Edmonton-AB",
    "title": "Edmonton AB",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 78.8,
    "valueAtRisk": "$12,550",
    "financialImpact": 12550,
    "trend": "down",
    "truckCount": 271,
    "trucksWithRFID": 257,
    "trucksWithoutRFID": 14,
    "rfidCoverage": 94.8,
    "openWOs": 16,
    "whatsChanged": [
      "14 trucks operating without RFID readers.",
      "16 open missing work orders in segment.",
      "5 work orders exceed 700-day age threshold."
    ],
    "drivers": [
      {
        "id": "DR-SP-Edmonton-AB-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "257/271 trucks RFID-equipped (94.8%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Edmonton-AB-2",
        "title": "Missing Work Orders",
        "status": "invalid",
        "trend": "down",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "WO #03889643 — A1-Lost or Stolen Cart — 805d — D-06261",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03849366 — A3-Confirm Cart — 1210d — D-05029",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "positive",
            "text": "WO #123454655 — A3-Deliver New Service — 677d — D-05977",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03892181 — A3-Repair Cart - Wheel — 762d — D-06277",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          },
          {
            "type": "negative",
            "text": "WO #03889373 — A3-Repair RFID — 840d — D-06261",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Edmonton-AB-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "271 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 94.8,
      "unit": "%",
      "timeSeries": [
        86.8,
        89.8,
        91.8,
        93.8,
        94.8
      ]
    }
  },
  {
    "id": "SP-EL-Harvey-and-Sons",
    "title": "EL Harvey and Sons",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 97.6,
    "valueAtRisk": "$1,350",
    "financialImpact": 1350,
    "trend": "down",
    "truckCount": 7,
    "trucksWithRFID": 4,
    "trucksWithoutRFID": 3,
    "rfidCoverage": 57.1,
    "openWOs": 0,
    "whatsChanged": [
      "3 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-EL-Harvey-and-Sons-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "4/7 trucks RFID-equipped (57.1%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-EL-Harvey-and-Sons-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-EL-Harvey-and-Sons-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 57.1,
      "unit": "%",
      "timeSeries": [
        50,
        52.1,
        54.1,
        56.1,
        57.1
      ]
    }
  },
  {
    "id": "SP-FCC-Orange-County",
    "title": "FCC Orange County",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 94.4,
    "valueAtRisk": "$3,150",
    "financialImpact": 3150,
    "trend": "down",
    "truckCount": 53,
    "trucksWithRFID": 46,
    "trucksWithoutRFID": 7,
    "rfidCoverage": 86.8,
    "openWOs": 0,
    "whatsChanged": [
      "7 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-FCC-Orange-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "46/53 trucks RFID-equipped (86.8%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-FCC-Orange-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-FCC-Orange-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "53 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 86.8,
      "unit": "%",
      "timeSeries": [
        78.8,
        81.8,
        83.8,
        85.8,
        86.8
      ]
    }
  },
  {
    "id": "SP-FCC-Rowlett",
    "title": "FCC Rowlett",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 11,
    "trucksWithRFID": 11,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-FCC-Rowlett-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "11/11 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-FCC-Rowlett-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-FCC-Rowlett-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "11 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-FT-Saskatchewan-AB",
    "title": "FT Saskatchewan AB",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 5,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 60,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-FT-Saskatchewan-AB-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "3/5 trucks RFID-equipped (60.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-FT-Saskatchewan-AB-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-FT-Saskatchewan-AB-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "5 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 60,
      "unit": "%",
      "timeSeries": [
        52,
        55,
        57,
        59,
        60
      ]
    }
  },
  {
    "id": "SP-GFL-Burlington-NC",
    "title": "GFL Burlington NC",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 5,
    "trucksWithRFID": 4,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 80,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-GFL-Burlington-NC-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "4/5 trucks RFID-equipped (80.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GFL-Burlington-NC-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GFL-Burlington-NC-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "5 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 80,
      "unit": "%",
      "timeSeries": [
        72,
        75,
        77,
        79,
        80
      ]
    }
  },
  {
    "id": "SP-GFL-Nashville",
    "title": "GFL Nashville",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 1,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-GFL-Nashville-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/1 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GFL-Nashville-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GFL-Nashville-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-GFL-NC",
    "title": "GFL NC",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 96.8,
    "valueAtRisk": "$1,800",
    "financialImpact": 1800,
    "trend": "stable",
    "truckCount": 24,
    "trucksWithRFID": 20,
    "trucksWithoutRFID": 4,
    "rfidCoverage": 83.3,
    "openWOs": 0,
    "whatsChanged": [
      "4 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-GFL-NC-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "20/24 trucks RFID-equipped (83.3%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GFL-NC-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GFL-NC-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "24 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 83.3,
      "unit": "%",
      "timeSeries": [
        75.3,
        78.3,
        80.3,
        82.3,
        83.3
      ]
    }
  },
  {
    "id": "SP-GreenvilleSC",
    "title": "GreenvilleSC",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 6,
    "trucksWithRFID": 6,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-GreenvilleSC-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "6/6 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GreenvilleSC-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-GreenvilleSC-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "6 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Hagerstown-MD",
    "title": "Hagerstown MD",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 3,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Hagerstown-MD-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "3/3 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Hagerstown-MD-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Hagerstown-MD-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "3 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Hernando",
    "title": "Hernando",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Hernando-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/2 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Hernando-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Hernando-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Jamestown-NY",
    "title": "Jamestown NY",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "stable",
    "truckCount": 12,
    "trucksWithRFID": 10,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 83.3,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Jamestown-NY-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "10/12 trucks RFID-equipped (83.3%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Jamestown-NY-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Jamestown-NY-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "12 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 83.3,
      "unit": "%",
      "timeSeries": [
        75.3,
        78.3,
        80.3,
        82.3,
        83.3
      ]
    }
  },
  {
    "id": "SP-Kewanee-IL",
    "title": "Kewanee IL",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 3,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Kewanee-IL-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "3/3 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Kewanee-IL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Kewanee-IL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "3 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Lakeland",
    "title": "Lakeland",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 84,
    "valueAtRisk": "$9,000",
    "financialImpact": 9000,
    "trend": "down",
    "truckCount": 52,
    "trucksWithRFID": 32,
    "trucksWithoutRFID": 20,
    "rfidCoverage": 61.5,
    "openWOs": 0,
    "whatsChanged": [
      "20 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Lakeland-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "32/52 trucks RFID-equipped (61.5%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Lakeland-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Lakeland-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "52 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 61.5,
      "unit": "%",
      "timeSeries": [
        53.5,
        56.5,
        58.5,
        60.5,
        61.5
      ]
    }
  },
  {
    "id": "SP-Largo-FL",
    "title": "Largo FL",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 96,
    "valueAtRisk": "$2,250",
    "financialImpact": 2250,
    "trend": "down",
    "truckCount": 31,
    "trucksWithRFID": 26,
    "trucksWithoutRFID": 5,
    "rfidCoverage": 83.9,
    "openWOs": 0,
    "whatsChanged": [
      "5 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Largo-FL-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "26/31 trucks RFID-equipped (83.9%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Largo-FL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Largo-FL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "31 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 83.9,
      "unit": "%",
      "timeSeries": [
        75.9,
        78.9,
        80.9,
        82.9,
        83.9
      ]
    }
  },
  {
    "id": "SP-Laurel-MD",
    "title": "Laurel MD",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 1,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Laurel-MD-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/1 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Laurel-MD-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Laurel-MD-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Mercer-County",
    "title": "Mercer County",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 50,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Mercer-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "1/2 trucks RFID-equipped (50.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Mercer-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Mercer-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 50,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        50
      ]
    }
  },
  {
    "id": "SP-Middletown-NJ",
    "title": "Middletown NJ",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 15,
    "trucksWithRFID": 14,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 93.3,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Middletown-NJ-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "14/15 trucks RFID-equipped (93.3%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Middletown-NJ-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Middletown-NJ-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "15 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 93.3,
      "unit": "%",
      "timeSeries": [
        85.3,
        88.3,
        90.3,
        92.3,
        93.3
      ]
    }
  },
  {
    "id": "SP-Milford-DE",
    "title": "Milford DE",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 3,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Milford-DE-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "3/3 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Milford-DE-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Milford-DE-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "3 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-New-Bedford-MA",
    "title": "New Bedford MA",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 15,
    "trucksWithRFID": 15,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-New-Bedford-MA-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "15/15 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-New-Bedford-MA-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-New-Bedford-MA-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "15 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Plant-City-FL",
    "title": "Plant City FL",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 7,
    "trucksWithRFID": 7,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Plant-City-FL-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7/7 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Plant-City-FL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Plant-City-FL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Pleasant-Prairie",
    "title": "Pleasant Prairie",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 5,
    "trucksWithRFID": 5,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Pleasant-Prairie-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "5/5 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Pleasant-Prairie-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Pleasant-Prairie-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "5 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Racine",
    "title": "Racine",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "up",
    "truckCount": 21,
    "trucksWithRFID": 20,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 95.2,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Racine-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "20/21 trucks RFID-equipped (95.2%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Racine-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Racine-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "21 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 95.2,
      "unit": "%",
      "timeSeries": [
        87.2,
        90.2,
        92.2,
        94.2,
        95.2
      ]
    }
  },
  {
    "id": "SP-Republic",
    "title": "Republic",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 7,
    "trucksWithRFID": 7,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Republic-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7/7 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Republic-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Republic-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Republic-Service",
    "title": "Republic Service",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 1,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Republic-Service-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/1 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Republic-Service-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Republic-Service-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Revere-MA",
    "title": "Revere MA",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 5,
    "trucksWithRFID": 5,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Revere-MA-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "5/5 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Revere-MA-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Revere-MA-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "5 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-RISE-Center",
    "title": "RISE Center",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 96,
    "valueAtRisk": "$2,250",
    "financialImpact": 2250,
    "trend": "down",
    "truckCount": 8,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 5,
    "rfidCoverage": 37.5,
    "openWOs": 0,
    "whatsChanged": [
      "5 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-RISE-Center-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "3/8 trucks RFID-equipped (37.5%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-RISE-Center-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-RISE-Center-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 37.5,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        37.5
      ]
    }
  },
  {
    "id": "SP-RV-Account",
    "title": "RV Account",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 86.4,
    "valueAtRisk": "$7,650",
    "financialImpact": 7650,
    "trend": "down",
    "truckCount": 23,
    "trucksWithRFID": 6,
    "trucksWithoutRFID": 17,
    "rfidCoverage": 26.1,
    "openWOs": 0,
    "whatsChanged": [
      "17 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-RV-Account-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "6/23 trucks RFID-equipped (26.1%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-RV-Account-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-RV-Account-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "23 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 26.1,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        26.1
      ]
    }
  },
  {
    "id": "SP-Sacramento-County",
    "title": "Sacramento County",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Sacramento-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/2 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Sacramento-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Sacramento-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Safety-Harbor",
    "title": "Safety Harbor",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 6,
    "trucksWithRFID": 4,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 66.7,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Safety-Harbor-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "4/6 trucks RFID-equipped (66.7%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Safety-Harbor-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Safety-Harbor-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "6 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 66.7,
      "unit": "%",
      "timeSeries": [
        58.7,
        61.7,
        63.7,
        65.7,
        66.7
      ]
    }
  },
  {
    "id": "SP-Sarasota-FL",
    "title": "Sarasota FL",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 90.4,
    "valueAtRisk": "$5,400",
    "financialImpact": 5400,
    "trend": "down",
    "truckCount": 12,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 12,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "12 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Sarasota-FL-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/12 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Sarasota-FL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Sarasota-FL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "12 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Scott-County",
    "title": "Scott County",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 94.4,
    "valueAtRisk": "$3,150",
    "financialImpact": 3150,
    "trend": "down",
    "truckCount": 10,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 7,
    "rfidCoverage": 30,
    "openWOs": 0,
    "whatsChanged": [
      "7 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Scott-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "3/10 trucks RFID-equipped (30.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Scott-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Scott-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "10 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 30,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        30
      ]
    }
  },
  {
    "id": "SP-State-College-2",
    "title": "State College 2",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "stable",
    "truckCount": 10,
    "trucksWithRFID": 8,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 80,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-State-College-2-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "8/10 trucks RFID-equipped (80.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-State-College-2-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-State-College-2-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "10 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 80,
      "unit": "%",
      "timeSeries": [
        72,
        75,
        77,
        79,
        80
      ]
    }
  },
  {
    "id": "SP-St-Kitts",
    "title": "St Kitts",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 9,
    "trucksWithRFID": 9,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-St-Kitts-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "9/9 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-St-Kitts-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-St-Kitts-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "9 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Strathcona",
    "title": "Strathcona",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "stable",
    "truckCount": 13,
    "trucksWithRFID": 11,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 84.6,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Strathcona-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "11/13 trucks RFID-equipped (84.6%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Strathcona-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Strathcona-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "13 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 84.6,
      "unit": "%",
      "timeSeries": [
        76.6,
        79.6,
        81.6,
        83.6,
        84.6
      ]
    }
  },
  {
    "id": "SP-Sunrise",
    "title": "Sunrise",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 4,
    "trucksWithRFID": 4,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Sunrise-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "4/4 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Sunrise-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Sunrise-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "4 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Taunton",
    "title": "Taunton",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 2,
    "trucksWithRFID": 2,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Taunton-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2/2 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Taunton-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Taunton-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Test-Mitchell",
    "title": "Test_Mitchell",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 1,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Test-Mitchell-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1/1 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Test-Mitchell-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Test-Mitchell-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Timmins-ON",
    "title": "Timmins ON",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 10,
    "trucksWithRFID": 10,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Timmins-ON-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "10/10 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Timmins-ON-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Timmins-ON-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "10 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Trans-Trash",
    "title": "Trans Trash",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 94.4,
    "valueAtRisk": "$3,150",
    "financialImpact": 3150,
    "trend": "down",
    "truckCount": 10,
    "trucksWithRFID": 3,
    "trucksWithoutRFID": 7,
    "rfidCoverage": 30,
    "openWOs": 0,
    "whatsChanged": [
      "7 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Trans-Trash-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "3/10 trucks RFID-equipped (30.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Trans-Trash-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Trans-Trash-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "10 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 30,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        30
      ]
    }
  },
  {
    "id": "SP-Waste-Connections",
    "title": "Waste Connections",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 96.8,
    "valueAtRisk": "$1,800",
    "financialImpact": 1800,
    "trend": "down",
    "truckCount": 13,
    "trucksWithRFID": 9,
    "trucksWithoutRFID": 4,
    "rfidCoverage": 69.2,
    "openWOs": 0,
    "whatsChanged": [
      "4 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Waste-Connections-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "9/13 trucks RFID-equipped (69.2%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Connections-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Connections-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "13 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 69.2,
      "unit": "%",
      "timeSeries": [
        61.2,
        64.2,
        66.2,
        68.2,
        69.2
      ]
    }
  },
  {
    "id": "SP-Waste-Expo",
    "title": "Waste Expo",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 2,
    "trucksWithRFID": 1,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 50,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Waste-Expo-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "1/2 trucks RFID-equipped (50.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Expo-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Expo-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 50,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        50
      ]
    }
  },
  {
    "id": "SP-Waste-Industries-Atlanta",
    "title": "Waste Industries Atlanta",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 1,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Waste-Industries-Atlanta-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/1 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Industries-Atlanta-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Industries-Atlanta-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-Waste-Management",
    "title": "Waste Management",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 19,
    "trucksWithRFID": 19,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-Waste-Management-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "19/19 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Management-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Management-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "19 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-Waste-Pro-FL",
    "title": "Waste Pro FL",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "up",
    "truckCount": 44,
    "trucksWithRFID": 43,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 97.7,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Waste-Pro-FL-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "43/44 trucks RFID-equipped (97.7%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Pro-FL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Waste-Pro-FL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "44 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 97.7,
      "unit": "%",
      "timeSeries": [
        89.7,
        92.7,
        94.7,
        96.7,
        97.7
      ]
    }
  },
  {
    "id": "SP-WCA",
    "title": "WCA",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 8,
    "trucksWithRFID": 7,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 87.5,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WCA-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "7/8 trucks RFID-equipped (87.5%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WCA-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WCA-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 87.5,
      "unit": "%",
      "timeSeries": [
        79.5,
        82.5,
        84.5,
        86.5,
        87.5
      ]
    }
  },
  {
    "id": "SP-WCA-Lake-County-FL",
    "title": "WCA Lake County FL",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 96,
    "valueAtRisk": "$2,250",
    "financialImpact": 2250,
    "trend": "down",
    "truckCount": 18,
    "trucksWithRFID": 13,
    "trucksWithoutRFID": 5,
    "rfidCoverage": 72.2,
    "openWOs": 0,
    "whatsChanged": [
      "5 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WCA-Lake-County-FL-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "13/18 trucks RFID-equipped (72.2%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WCA-Lake-County-FL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WCA-Lake-County-FL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "18 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 72.2,
      "unit": "%",
      "timeSeries": [
        64.2,
        67.2,
        69.2,
        71.2,
        72.2
      ]
    }
  },
  {
    "id": "SP-Wilmington-DE",
    "title": "Wilmington DE",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 13,
    "trucksWithRFID": 12,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 92.3,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-Wilmington-DE-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "12/13 trucks RFID-equipped (92.3%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Wilmington-DE-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-Wilmington-DE-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "13 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 92.3,
      "unit": "%",
      "timeSeries": [
        84.3,
        87.3,
        89.3,
        91.3,
        92.3
      ]
    }
  },
  {
    "id": "SP-WM-Atlanta",
    "title": "WM Atlanta",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 8,
    "trucksWithRFID": 8,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-WM-Atlanta-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8/8 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Atlanta-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Atlanta-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-WM-Lauderhill",
    "title": "WM Lauderhill",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 2,
    "trucksWithRFID": 2,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-WM-Lauderhill-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2/2 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Lauderhill-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Lauderhill-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-WM-Orange-County",
    "title": "WM Orange County",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "up",
    "truckCount": 27,
    "trucksWithRFID": 26,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 96.3,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WM-Orange-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "26/27 trucks RFID-equipped (96.3%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Orange-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Orange-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "27 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 96.3,
      "unit": "%",
      "timeSeries": [
        88.3,
        91.3,
        93.3,
        95.3,
        96.3
      ]
    }
  },
  {
    "id": "SP-WM-Ridgeland-MS",
    "title": "WM Ridgeland MS",
    "verdict": "On Track",
    "rag": "g",
    "confidence": 99.5,
    "valueAtRisk": "$0",
    "financialImpact": 0,
    "trend": "up",
    "truckCount": 2,
    "trucksWithRFID": 2,
    "trucksWithoutRFID": 0,
    "rfidCoverage": 100,
    "openWOs": 0,
    "whatsChanged": [
      "Full RFID coverage with no open work orders."
    ],
    "drivers": [
      {
        "id": "DR-SP-WM-Ridgeland-MS-1",
        "title": "RFID Coverage",
        "status": "valid",
        "trend": "up",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2/2 trucks RFID-equipped (100.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Ridgeland-MS-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WM-Ridgeland-MS-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "2 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 100,
      "unit": "%",
      "timeSeries": [
        92,
        95,
        97,
        99,
        100
      ]
    }
  },
  {
    "id": "SP-WP-Hollywood-FL",
    "title": "WP Hollywood FL",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 7,
    "trucksWithRFID": 5,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 71.4,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WP-Hollywood-FL-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "5/7 trucks RFID-equipped (71.4%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Hollywood-FL-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Hollywood-FL-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "7 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 71.4,
      "unit": "%",
      "timeSeries": [
        63.4,
        66.4,
        68.4,
        70.4,
        71.4
      ]
    }
  },
  {
    "id": "SP-WP-Lake-County",
    "title": "WP Lake County",
    "verdict": "Critical Gap",
    "rag": "r",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "down",
    "truckCount": 1,
    "trucksWithRFID": 0,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 0,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WP-Lake-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "0/1 trucks RFID-equipped (0.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Lake-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Lake-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "1 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 0,
      "unit": "%",
      "timeSeries": [
        50,
        50,
        50,
        50,
        0
      ]
    }
  },
  {
    "id": "SP-WP-Orange-County",
    "title": "WP Orange County",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "up",
    "truckCount": 25,
    "trucksWithRFID": 24,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 96,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WP-Orange-County-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "24/25 trucks RFID-equipped (96.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Orange-County-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Orange-County-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "25 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 96,
      "unit": "%",
      "timeSeries": [
        88,
        91,
        93,
        95,
        96
      ]
    }
  },
  {
    "id": "SP-WP-Port-St-Lucie",
    "title": "WP Port St Lucie",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 99.2,
    "valueAtRisk": "$450",
    "financialImpact": 450,
    "trend": "stable",
    "truckCount": 18,
    "trucksWithRFID": 17,
    "trucksWithoutRFID": 1,
    "rfidCoverage": 94.4,
    "openWOs": 0,
    "whatsChanged": [
      "1 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WP-Port-St-Lucie-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "17/18 trucks RFID-equipped (94.4%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Port-St-Lucie-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Port-St-Lucie-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "18 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 94.4,
      "unit": "%",
      "timeSeries": [
        86.4,
        89.4,
        91.4,
        93.4,
        94.4
      ]
    }
  },
  {
    "id": "SP-WP-Winter-Park",
    "title": "WP Winter Park",
    "verdict": "Needs Attention",
    "rag": "a",
    "confidence": 98.4,
    "valueAtRisk": "$900",
    "financialImpact": 900,
    "trend": "down",
    "truckCount": 8,
    "trucksWithRFID": 6,
    "trucksWithoutRFID": 2,
    "rfidCoverage": 75,
    "openWOs": 0,
    "whatsChanged": [
      "2 trucks operating without RFID readers."
    ],
    "drivers": [
      {
        "id": "DR-SP-WP-Winter-Park-1",
        "title": "RFID Coverage",
        "status": "invalid",
        "trend": "down",
        "owner": "Fleet Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "negative",
            "text": "6/8 trucks RFID-equipped (75.0%)",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Winter-Park-2",
        "title": "Missing Work Orders",
        "status": "valid",
        "trend": "stable",
        "owner": "Service Ops",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "No open missing work orders for this provider",
            "source": "Missing WO Report",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      },
      {
        "id": "DR-SP-WP-Winter-Park-3",
        "title": "Fleet Size",
        "status": "valid",
        "trend": "stable",
        "owner": "Operations",
        "lastUpdated": "Today",
        "signals": [
          {
            "type": "positive",
            "text": "8 active trucks in service",
            "source": "Customers with Truck/Cameras",
            "fresh": "Today",
            "reliability": "High",
            "quarantined": false
          }
        ]
      }
    ],
    "realityCheck": {
      "metric": "RFID Coverage %",
      "prediction": 95,
      "reality": 75,
      "unit": "%",
      "timeSeries": [
        67,
        70,
        72,
        74,
        75
      ]
    }
  }
];

export const connections = [];

export const networkMeta = {
  totalProviders: 74,
  totalTrucks: 1072,
  trucksWithRFID: 899,
  trucksWithoutRFID: 173,
  rfidCoverage: '83.9',
  totalWOs: 16,
  avgCaseAge: 741,
  overdueWOs: 5,
};

export function getDecision(id) {
  return decisions.find(d => d.id === id) || null;
}

export function findDecisionByQuery(query) {
  const q = String(query || '').toLowerCase();
  if (!q) return null;
  if (
    q.includes('missing') ||
    q.includes('work order') ||
    q.includes('sla') ||
    q.includes('overdue') ||
    q.includes('case age') ||
    q.includes('dispatch') ||
    q.includes('bulk') ||
    q.includes('repair')
  ) {
    return decisions.find(d => d.id === 'WO-Edmonton-Missing') || null;
  }
  if (q.includes('rfid') || q.includes('gap') || q.includes('unequipp') || q.includes('coverage') || q.includes('fleet')) {
    const gap = decisions
      .filter(d => d.trucksWithoutRFID > 0)
      .sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID)[0];
    return gap || decisions.find(d => d.title === 'Edmonton AB') || null;
  }
  const byTitle = decisions.find(d => {
    const t = d.title.toLowerCase();
    return t.length > 2 && (q.includes(t) || t.includes(q));
  });
  if (byTitle) return byTitle;
  return decisions.find(d => {
    const tokens = d.title.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    return tokens.some(t => q.includes(t));
  }) || null;
}
