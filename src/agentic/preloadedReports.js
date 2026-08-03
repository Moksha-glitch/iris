// ============================================================
// Preloaded Reports — Excel-backed mock report catalog
// Used by predictive questions + mock agent RAG simulation
// ============================================================

import {
  fleetSummary,
  woSummary,
  truckFleetData,
  missingWorkOrders,
} from '../excelData';

export const preloadedReports = [
  {
    id: 'rpt-fleet-rfid',
    name: 'Customers with Truck and/or Cameras',
    asOf: '2026-08-03',
    domain: 'fleet',
    summary: {
      providers: fleetSummary.totalProviders,
      trucks: fleetSummary.totalTrucks,
      rfidCoverage: Number(fleetSummary.rfidCoverage),
      unequipped: fleetSummary.trucksWithoutRFID,
    },
    highlights: [
      `${fleetSummary.totalTrucks} trucks across ${fleetSummary.totalProviders} providers`,
      `RFID coverage at ${fleetSummary.rfidCoverage}%`,
      `Largest gap: ${fleetSummary.largestGap?.serviceProvider} (${fleetSummary.largestGap?.trucksWithoutRFID} unequipped)`,
    ],
  },
  {
    id: 'rpt-missing-wo',
    name: 'Missing Work Orders — Edmonton AB',
    asOf: '2026-08-03',
    domain: 'workOrders',
    summary: {
      openWOs: woSummary.totalWOs,
      avgCaseAge: woSummary.avgCaseAge,
      overdue: woSummary.overdueWOs,
      maxAge: woSummary.maxCaseAge,
    },
    highlights: [
      `${woSummary.totalWOs} open missing work orders`,
      `Average case age ${woSummary.avgCaseAge} days`,
      `${woSummary.overdueWOs} cases exceed 700-day threshold`,
    ],
  },
];

export const reportContext = {
  fleetSummary,
  woSummary,
  truckFleetData,
  missingWorkOrders,
  edmonton: truckFleetData.find((p) => p.serviceProvider === 'Edmonton AB'),
  gapProviders: [...truckFleetData]
    .filter((p) => p.trucksWithoutRFID > 0)
    .sort((a, b) => b.trucksWithoutRFID - a.trucksWithoutRFID),
  preloadedReports,
};
