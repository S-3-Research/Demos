"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, Users, ClipboardList, Settings, Bell, CheckCircle, 
  Plus, Search, Layers, Activity, Calendar, ChevronRight, Clock,
  ShieldCheck, Map as MapIcon, Home, Heart, UserPlus, PlusSquare, X, 
  Mail, Zap, History, LucideIcon, ChevronDown
} from 'lucide-react';

// Extend Window interface for Mapbox
declare global {
  interface Window {
    mapboxgl: MapboxGLType;
  }
}

// Declare mapboxgl types
type MapboxGLType = {
  accessToken: string;
  Map: new (options: Record<string, unknown>) => MapInstance;
  Marker: new (options?: Record<string, unknown> | HTMLElement) => MarkerInstance;
  Popup: new (options?: Record<string, unknown>) => PopupInstance;
  NavigationControl: new () => unknown;
};

type MapInstance = {
  addControl: (control: unknown) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  remove: () => void;
  resize: () => void;
  getSource: (id: string) => GeoJSONSource | undefined;
  addSource: (id: string, source: unknown) => void;
  addLayer: (layer: unknown) => void;
  removeLayer: (id: string) => void;
  removeSource: (id: string) => void;
  getLayer: (id: string) => unknown;
  setLayoutProperty: (layerId: string, name: string, value: unknown) => void;
  setPaintProperty: (layerId: string, name: string, value: unknown) => void;
  flyTo: (options: Record<string, unknown>) => void;
  isStyleLoaded: () => boolean;
  zoomIn: () => void;
  zoomOut: () => void;
};

type GeoJSONSource = {
  setData: (data: unknown) => void;
};

type MarkerInstance = {
  setLngLat: (coords: [number, number]) => MarkerInstance;
  addTo: (map: MapInstance) => MarkerInstance;
  setPopup: (popup: PopupInstance) => MarkerInstance;
  getElement: () => HTMLElement;
  remove: () => void;
  _element?: HTMLElement;
  _isRecommended?: boolean;
  _status?: string;
  _isAssigned?: boolean;
  _isActive?: boolean;
  _addrType?: string;
  _isOther?: boolean;
};

type PopupInstance = {
  setLngLat: (coords: [number, number]) => PopupInstance;
  setHTML: (html: string) => PopupInstance;
  addTo: (map: MapInstance) => PopupInstance;
  on: (event: string, callback: () => void) => PopupInstance;
  remove: () => void;
};

declare const mapboxgl: MapboxGLType;

// Type definitions
export type Address = {
  id: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  assignedNurseId: string | null;
};

export type Nurse = {
  id: string;
  name: string;
  status: string;
  distance: string;
  rating: number;
  capabilities: string[];
  specialty: string[];
  lat: number;
  lng: number;
  license: string;
  joined: string;
  address: string;
  radius: number;
};

export type Trial = {
  id: string;
  name: string;
  sponsor: string;
  status: string;
  requirements: { nurseCount: number; capabilities: string[] };
  startDate: string;
  addresses: Address[];
};

export type PathItem = {
  path: [number, number][];
  isActive: boolean;
};

// --- Mock Data ---
export const MOCK_NURSES = [
  { id: 'n1', name: 'Sarah Jenkins, RN', status: 'Available', distance: '1.2 mi', rating: 4.8, capabilities: ['Phlebotomy', 'Vitals'], specialty: ['Alzheimer\'s'], lat: 40.7128, lng: -74.0060, license: 'RN-99201', joined: 'Oct 2023', address: '725 5th Ave, New York, NY', radius: 25 },
  { id: 'n2', name: 'Michael Chen, NP', status: 'Limited', distance: '3.5 mi', rating: 4.9, capabilities: ['ECG', 'Wound Care'], specialty: ['Oncology'], lat: 40.7300, lng: -73.9352, license: 'RN-88312', joined: 'Nov 2023', address: '123 Main St, NY', radius: 15 },
  { id: 'n3', name: 'Elena Rodriguez, RN', status: 'Available', distance: '0.8 mi', rating: 4.7, capabilities: ['Home Visit', 'Infusion'], specialty: ['Pediatrics'], lat: 40.7580, lng: -73.9855, license: 'RN-77210', joined: 'Jan 2024', address: '456 Broadway, NY', radius: 30 },
  { id: 'n4', name: 'James Wilson, RN', status: 'Unavailable', distance: '5.5 mi', rating: 4.5, capabilities: ['Assessment'], specialty: ['Cardiology'], lat: 40.6782, lng: -73.9442, license: 'RN-66123', joined: 'Sep 2023', address: '789 2nd Ave, NY', radius: 20 },
  { id: 'n5', name: 'David Smith, LPN', status: 'Available', distance: '2.1 mi', rating: 4.6, capabilities: ['Phlebotomy'], specialty: ['Diabetes'], lat: 40.7000, lng: -73.9200, license: 'RN-55412', joined: 'Dec 2023', address: '101 1st Ave, NY', radius: 25 },
  { id: 'n6', name: 'Jennifer Park, RN', status: 'Available', distance: '1.8 mi', rating: 4.9, capabilities: ['Vitals', 'ECG'], specialty: ['Geriatrics'], lat: 40.7489, lng: -73.9680, license: 'RN-44521', joined: 'Aug 2023', address: '234 Park Ave, NY', radius: 20 },
  { id: 'n7', name: 'Robert Martinez, RN', status: 'Available', distance: '2.3 mi', rating: 4.7, capabilities: ['Home Visit', 'Phlebotomy'], specialty: ['General'], lat: 40.7200, lng: -73.9950, license: 'RN-33410', joined: 'Jan 2024', address: '567 3rd Ave, NY', radius: 30 },
  { id: 'n8', name: 'Lisa Thompson, NP', status: 'Limited', distance: '3.2 mi', rating: 4.8, capabilities: ['Assessment', 'Wound Care'], specialty: ['Oncology'], lat: 40.7450, lng: -73.9200, license: 'RN-22398', joined: 'Sep 2023', address: '890 Lexington Ave, NY', radius: 15 },
  { id: 'n9', name: 'Kevin Lee, RN', status: 'Available', distance: '1.5 mi', rating: 4.6, capabilities: ['Vitals', 'Infusion'], specialty: ['Pediatrics'], lat: 40.7350, lng: -74.0100, license: 'RN-11287', joined: 'Nov 2023', address: '123 Hudson St, NY', radius: 25 },
  { id: 'n10', name: 'Amanda White, RN', status: 'Available', distance: '2.8 mi', rating: 4.9, capabilities: ['ECG', 'Phlebotomy'], specialty: ['Cardiology'], lat: 40.7080, lng: -73.9600, license: 'RN-00176', joined: 'Oct 2023', address: '456 East 14th St, NY', radius: 20 },
  { id: 'n11', name: 'Brian Garcia, LPN', status: 'Available', distance: '1.9 mi', rating: 4.5, capabilities: ['Vitals'], specialty: ['Diabetes'], lat: 40.7600, lng: -73.9700, license: 'RN-99065', joined: 'Dec 2023', address: '789 Amsterdam Ave, NY', radius: 25 },
  { id: 'n12', name: 'Maria Santos, RN', status: 'Limited', distance: '3.8 mi', rating: 4.7, capabilities: ['Home Visit', 'Assessment'], specialty: ['Geriatrics'], lat: 40.6900, lng: -73.9800, license: 'RN-88054', joined: 'Aug 2023', address: '234 Atlantic Ave, Brooklyn', radius: 15 },
  { id: 'n13', name: 'Daniel Kim, NP', status: 'Available', distance: '2.2 mi', rating: 4.8, capabilities: ['Infusion', 'Wound Care'], specialty: ['Oncology'], lat: 40.7550, lng: -74.0000, license: 'RN-77043', joined: 'Jan 2024', address: '567 West 57th St, NY', radius: 30 },
  { id: 'n14', name: 'Patricia Brown, RN', status: 'Available', distance: '1.6 mi', rating: 4.6, capabilities: ['Phlebotomy', 'ECG'], specialty: ['General'], lat: 40.7250, lng: -73.9500, license: 'RN-66032', joined: 'Sep 2023', address: '890 Queens Blvd, Queens', radius: 20 },
  { id: 'n15', name: 'Thomas Anderson, RN', status: 'Available', distance: '2.5 mi', rating: 4.9, capabilities: ['Vitals', 'Assessment'], specialty: ['Alzheimer\'s'], lat: 40.7400, lng: -73.9900, license: 'RN-55021', joined: 'Nov 2023', address: '123 Madison Ave, NY', radius: 25 },
  { id: 'n16', name: 'Jessica Taylor, RN', status: 'Limited', distance: '3.1 mi', rating: 4.7, capabilities: ['Home Visit'], specialty: ['Pediatrics'], lat: 40.7150, lng: -74.0150, license: 'RN-44010', joined: 'Oct 2023', address: '456 Greenwich St, NY', radius: 15 },
  { id: 'n17', name: 'Christopher Moore, LPN', status: 'Available', distance: '1.3 mi', rating: 4.5, capabilities: ['Vitals', 'Phlebotomy'], specialty: ['Diabetes'], lat: 40.7480, lng: -73.9550, license: 'RN-33009', joined: 'Dec 2023', address: '789 Lexington Ave, NY', radius: 20 },
  { id: 'n18', name: 'Nancy Jackson, RN', status: 'Available', distance: '2.7 mi', rating: 4.8, capabilities: ['ECG', 'Infusion'], specialty: ['Cardiology'], lat: 40.7320, lng: -73.9750, license: 'RN-22008', joined: 'Aug 2023', address: '234 5th Ave, NY', radius: 30 },
];

export const MOCK_ASSIGNMENTS = [
  { id: 'as1', trialName: 'AD-Early-Detection-Phase2', type: 'Home Visit', date: 'Feb 10, 2024', time: '10:30 AM', status: 'Upcoming', address: '123 Queens Blvd, NY', patient: 'Mrs. Gable', tasks: ['Blood Draw', 'Vitals'] },
  { id: 'as2', trialName: 'AD-Early-Detection-Phase2', type: 'Home Visit', date: 'Feb 12, 2024', time: '02:00 PM', status: 'Upcoming', address: '88 Madison Ave, NY', patient: 'Mr. Henderson', tasks: ['Vitals', 'Cognitive Assessment'] },
  { id: 'as3', trialName: 'ONCO-T-Cell-Immuno', type: 'Clinical Support', date: 'Feb 05, 2024', time: '09:00 AM', status: 'Completed', address: 'MSKCC, New York', patient: 'N/A (Site Duty)', tasks: ['IV Support'] },
];

export const MOCK_TRIALS = [
  {
    id: 't1',
    name: 'AD-Early-Detection-Phase2',
    sponsor: 'BioGen Therapeutics',
    status: 'Matching',
    requirements: { nurseCount: 3, capabilities: ['Phlebotomy'] },
    startDate: '2024-05-12',
    addresses: [
      { id: 'a1', type: 'Patient Home', address: '123 Queens Blvd, NY', lat: 40.7282, lng: -73.8448, assignedNurseId: null },
      { id: 'a2', type: 'Trial Site', address: 'Mount Sinai Hospital, NY', lat: 40.7895, lng: -73.9482, assignedNurseId: 'n3' },
      { id: 'a3', type: 'Candidate Site', address: 'Brooklyn Health Center', lat: 40.6782, lng: -73.9442, assignedNurseId: null }
    ]
  },
  {
    id: 't2',
    name: 'ONCO-T-Cell-Immuno',
    sponsor: 'Global Pharma',
    status: 'In Progress',
    requirements: { nurseCount: 5, capabilities: ['Infusion'] },
    startDate: '2024-03-20',
    addresses: [{ id: 'a4', type: 'Trial Site', address: 'MSKCC, New York', lat: 40.7641, lng: -73.9554, assignedNurseId: 'n1' }]
  },
  {
    id: 't3',
    name: 'DIAB-Long-Term-Care',
    sponsor: 'Novo Care',
    status: 'Draft',
    requirements: { nurseCount: 2, capabilities: ['Vitals'] },
    startDate: '2024-08-01',
    addresses: []
  }
];

export const MOCK_NURSE = {
  id: 'n1',
  name: 'Sarah Jenkins, RN',
  status: 'Active',
  expiryDays: 7,
  lastAvailabilityConfirm: 23,
  lastRadiusConfirm: 28,
  lat: 40.7128,
  lng: -74.0060,
  address: '725 5th Ave, New York, NY',
  radius: 5
};

export const MOCK_OPPORTUNITY = {
  id: 'opp1',
  title: 'Potential Home Visit Nearby',
  dateWindow: 'Feb 24 - Feb 28',
  type: 'BioGen Phase 3',
  distance: '1.5 miles'
};

// --- Sub-Component: SidebarItem ---
export const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 mx-2 cursor-pointer transition-all duration-200 group rounded-xl ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'}`}>
    <Icon size={18} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}`} />
    <span className={`text-sm ${active ? 'font-semibold' : 'font-medium group-hover:font-semibold'}`}>{String(label)}</span>
  </div>
);

// --- Interactive Map Component ---
export const InteractiveMap = ({ addresses = [], nurses = [], selectedAddressId, onSelectAddress, viewMode = 'match', customCenter, customRadius, showNurses = true, recommendedNurses = [], onNurseClick, onActivePopupChange }: {
  addresses?: Address[];
  nurses?: Nurse[];
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string) => void;
  viewMode?: string;
  customCenter?: { lat: number; lng: number } | null;
  customRadius?: number | null;
  showNurses?: boolean;
  recommendedNurses?: string[];
  onNurseClick?: (nurseId: string) => void;
  onActivePopupChange?: (nurseId: string | null) => void;
}) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);
  // Marker caches for incremental updates
  const addressMarkersCache = useRef<Map<string, MarkerInstance>>(new Map());
  const nurseMarkersCache = useRef<Map<string, MarkerInstance>>(new Map());
  const assignmentPathsRef = useRef<PathItem[]>([]);
  const [engineStatus, setEngineStatus] = useState('loading');

  // Helper function to get address icon SVG
  const getAddressIcon = useCallback((type: string, size: number) => {
    const icons = {
      home: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
      hospital: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>`,
      location: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
    };
    return icons[type as keyof typeof icons] || icons.location;
  }, []);

  // Helper to adjust color brightness
  const adjustColor = useCallback((color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }, []);

  useEffect(() => {
    let checkTimer: ReturnType<typeof setInterval> | undefined;
    const loadMapbox = () => {
      if (window.mapboxgl) {
        setEngineStatus('ready');
        return;
      }
      
      // Load CSS
      if (!document.getElementById('mapbox-css')) {
        const link = document.createElement('link');
        link.id = 'mapbox-css';
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        document.head.appendChild(link);
      }
      
      // Load or wait for JS
      const existingScript = document.getElementById('mapbox-js') as HTMLScriptElement | null;
      if (existingScript) {
        // Script exists but may not be loaded yet - start polling
        checkTimer = setInterval(() => {
          if (window.mapboxgl) {
            clearInterval(checkTimer!);
            setEngineStatus('ready');
          }
        }, 100);
      } else {
        // Create new script
        const script = document.createElement('script');
        script.id = 'mapbox-js';
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.async = true;
        script.onload = () => {
          checkTimer = setInterval(() => {
            if (window.mapboxgl) {
              clearInterval(checkTimer!);
              setEngineStatus('ready');
            }
          }, 100);
        };
        script.onerror = () => {
          console.error('Failed to load Mapbox GL JS');
          setEngineStatus('error');
        };
        document.head.appendChild(script);
      }
    };
    loadMapbox();
    return () => {
      if (checkTimer) clearInterval(checkTimer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // ✅ OPTIMIZED: Split update functions for better performance
  
  // Helper functions for layer management
  const removeLayers = (layerIds: string[]) => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    layerIds.forEach(id => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
    });
  };

  const removeSource = (sourceId: string) => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  // Update radius circle (for custom center mode)
  const updateRadiusCircle = useCallback(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl || !mapInstance.current) return;

    // Remove existing radius layers
    removeLayers(['radius-circle-outline', 'radius-circle']);
    removeSource('radius');

    // Remove existing center marker
    const centerMarkerIndex = markersRef.current.findIndex(m => m._element?.classList.contains('custom-center-marker'));
    if (centerMarkerIndex !== -1) {
      markersRef.current[centerMarkerIndex].remove();
      markersRef.current.splice(centerMarkerIndex, 1);
    }

    if (!customCenter || !customRadius) return;

    // Center marker
    const el = document.createElement('div');
    el.className = 'custom-center-marker';
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#2563eb';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([customCenter.lng, customCenter.lat])
      .addTo(mapInstance.current!);
    markersRef.current.push(marker);

    // Radius circle
    const radiusInMeters = customRadius * 1609.34;
    const createCircle = (center: [number, number], radiusInMeters: number, points = 64) => {
      const coords = [];
      const distanceX = radiusInMeters / (111320 * Math.cos(center[1] * Math.PI / 180));
      const distanceY = radiusInMeters / 110574;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        coords.push([center[0] + x, center[1] + y]);
      }
      return coords;
    };

    mapInstance.current.addSource('radius', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [createCircle([customCenter.lng, customCenter.lat], radiusInMeters)]
        }
      }
    });

    mapInstance.current.addLayer({
      id: 'radius-circle',
      type: 'fill',
      source: 'radius',
      paint: {
        'fill-color': '#2563eb',
        'fill-opacity': 0.1
      }
    });

    mapInstance.current.addLayer({
      id: 'radius-circle-outline',
      type: 'line',
      source: 'radius',
      paint: {
        'line-color': '#2563eb',
        'line-width': 2
      }
    });

    mapInstance.current.flyTo({ center: [customCenter.lng, customCenter.lat], zoom: 10 });
  }, [customCenter, customRadius]);

  // Update heatmap layer (already optimized with setData)
  const updateHeatmap = useCallback(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl || !mapInstance.current || viewMode !== 'heatmap') {
      // Remove heatmap if not in heatmap mode
      removeLayers(['nurse-heatmap']);
      removeSource('nurses');
      return;
    }

    const heatmapData = {
      type: 'FeatureCollection',
      features: nurses.map((n) => ({
        type: 'Feature',
        properties: {
          intensity: n.status === 'Available' ? 1.5 : n.status === 'Limited' ? 0.8 : 0.4
        },
        geometry: {
          type: 'Point',
          coordinates: [n.lng, n.lat]
        }
      }))
    };

    // Check if source exists - use setData for better performance
    const existingSource = mapInstance.current.getSource('nurses');
    if (existingSource) {
      // ✅ OPTIMIZED: Update existing source instead of recreating
      existingSource.setData(heatmapData);
    } else {
      // Create new source and layer on first render
      mapInstance.current.addSource('nurses', {
        type: 'geojson',
        data: heatmapData
      });

      mapInstance.current.addLayer({
        id: 'nurse-heatmap',
        type: 'heatmap',
        source: 'nurses',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1.2,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(59, 130, 246, 0)',
            0.2, '#3b82f6',
            0.4, '#22c55e',
            0.6, '#fbbf24',
            0.8, '#f87171',
            1, '#dc2626'
          ],
          'heatmap-radius': 40,
          'heatmap-opacity': 0.7
        }
      });
    }
  }, [viewMode, nurses]);

  // Helper to create a curved line between two points
  const getCurvedLineCoordinates = useCallback((start: [number, number], end: [number, number]): [number, number][] => {
    const startLng = start[0];
    const startLat = start[1];
    const endLng = end[0];
    const endLat = end[1];
    
    const midLng = (startLng + endLng) / 2;
    const midLat = (startLat + endLat) / 2;
    
    const deltaLng = endLng - startLng;
    const deltaLat = endLat - startLat;
    
    // Offset amount - 0.2 factor gives a nice gentle curve
    const offsetScale = 0.2;
    const controlLng = midLng - deltaLat * offsetScale;
    const controlLat = midLat + deltaLng * offsetScale;

    const coordinates: [number, number][] = [];
    const steps = 100; // Increased smoothness for animation
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Quadratic Bezier
        const lng = Math.pow(1 - t, 2) * startLng + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * endLng;
        const lat = Math.pow(1 - t, 2) * startLat + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * endLat;
        coordinates.push([lng, lat]);
    }
    return coordinates;
  }, []);

  // Update assignment lines (connects assigned nurses to their addresses)
  const updateAssignmentLines = useCallback(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl || !mapInstance.current) return;

    // Remove existing assignment lines and particles
    removeLayers(['assignment-lines', 'flow-layer']);
    removeSource('assignments');
    removeSource('flow');

    // Find all addresses with assigned nurses
    const assignments = addresses
      .filter(addr => addr.assignedNurseId)
      .map(addr => {
        const nurse = nurses.find(n => n.id === addr.assignedNurseId);
        if (!nurse) return null;
        return {
          address: addr,
          nurse: nurse
        };
      })
      .filter(a => a !== null);

    if (assignments.length === 0) {
      assignmentPathsRef.current = [];
      return;
    }

    // Generate curved paths and store for animation
    const newPaths: PathItem[] = [];
    const lineFeatures = assignments.map(assignment => {
      const start: [number, number] = [assignment!.address.lng, assignment!.address.lat];
      const end: [number, number] = [assignment!.nurse.lng, assignment!.nurse.lat];
      const curvedPath = getCurvedLineCoordinates(start, end);

      const isActive = selectedAddressId === assignment!.address.id;
      
      newPaths.push({
        path: curvedPath,
        isActive: isActive
      });

      return {
        type: 'Feature',
        properties: {
          isActive: isActive,
          isOtherAddress: !!(selectedAddressId && selectedAddressId !== assignment!.address.id)
        },
        geometry: {
          type: 'LineString',
          coordinates: curvedPath
        }
      };
    });

    assignmentPathsRef.current = newPaths;

    // Add source for lines
    mapInstance.current.addSource('assignments', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: lineFeatures
      }
    });

    // Add BACKGROUND line layer (Solid, dimmer)
    mapInstance.current.addLayer({
      id: 'assignment-lines',
      type: 'line',
      source: 'assignments',
      paint: {
        'line-color': [
          'case',
          ['get', 'isActive'],
          '#15803d',  // Darker Green for active (green-700)
          ['get', 'isOtherAddress'],
          '#cbd5e1',  // Light gray when another address is selected
          '#166534'   // Darker green for inactive default (green-800)
        ],
        'line-width': [
          'case',
          ['get', 'isActive'],
          2,  // Thinner base
          1.5
        ],
        'line-opacity': 0.5 // Increased slightly for visibility
      }
    });

    // Add source and layer for moving flow light
    if (!mapInstance.current.getSource('flow')) {
      mapInstance.current.addSource('flow', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
    }

    // Add FLOW layer (Bright, glowing)
    if (!mapInstance.current.getLayer('flow-layer')) {
      mapInstance.current.addLayer({
        id: 'flow-layer',
        type: 'line',
        source: 'flow',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#10b981',  // Emerald-500 (slightly darker than neon green) matching new darker theme
          'line-width': 6,
          'line-blur': 4,           // Stronger blur for flow effect
          'line-opacity': 0.8
        }
      });
    }

  }, [addresses, nurses, selectedAddressId, getCurvedLineCoordinates]);

  // ✅ OPTIMIZED: Incremental address marker updates with caching
  const updateAddressMarkers = useCallback(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl || !mapInstance.current) return;

    // Skip if in custom center mode
    if (customCenter && customRadius) return;

    // Remove selected address layers
    removeLayers(['selected-circle-outline', 'selected-circle']);
    removeSource('selected');

    // Track current address IDs
    const currentAddressIds = new Set(addresses.map(a => a.id));
    const cache = addressMarkersCache.current;

    // Remove markers that no longer exist
    cache.forEach((marker, id) => {
      if (!currentAddressIds.has(id)) {
        marker.remove();
        cache.delete(id);
        const idx = markersRef.current.indexOf(marker);
        if (idx !== -1) markersRef.current.splice(idx, 1);
      }
    });

    // Update or create markers for each address
    addresses.forEach((addr) => {
      const isActive = selectedAddressId === addr.id;
      const isOtherAddress = Boolean(selectedAddressId && selectedAddressId !== addr.id);
      const cachedMarker = cache.get(addr.id);
      
      // Enhanced color scheme and configuration for different address types
      const addressConfig = {
        'Patient Home': { color: '#3b82f6', icon: 'home', size: isActive ? 42 : 32 },
        'Trial Site': { color: '#8b5cf6', icon: 'hospital', size: isActive ? 42 : 32 },
        'Candidate Site': { color: '#f59e0b', icon: 'location', size: isActive ? 42 : 32 }
      };
      
      let config = addressConfig[addr.type as keyof typeof addressConfig] || addressConfig['Candidate Site'];
      
      // If another address is selected, make this address gray
      if (isOtherAddress) {
        config = { ...config, color: '#94a3b8' };
      }

      // Check if we need to update this marker
      const needsUpdate = !cachedMarker || 
        cachedMarker._isActive !== isActive || 
        cachedMarker._addrType !== addr.type ||
        cachedMarker._isOther !== isOtherAddress;

      if (needsUpdate) {
        // Remove old marker if exists
        if (cachedMarker) {
          cachedMarker.remove();
          const idx = markersRef.current.indexOf(cachedMarker);
          if (idx !== -1) markersRef.current.splice(idx, 1);
        }

        // Create new marker element
        const el = document.createElement('div');
        el.className = isActive ? 'custom-pin active-pin' : 'custom-pin';
        el.style.cursor = 'pointer';
        
        // Add pulsing ring for active address
        if (isActive) {
          el.innerHTML = `
            <div class="address-pulse-ring" style="position: absolute; top: 50%; left: 50%; width: ${config.size + 16}px; height: ${config.size + 16}px; transform: translate(-50%, -50%); border: 3px solid ${config.color}; border-radius: 50%; opacity: 0.6; animation: addressPulse 2s ease-out infinite;"></div>
            <div class="address-marker-body" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: ${config.size}px; height: ${config.size}px; background: linear-gradient(135deg, ${config.color} 0%, ${adjustColor(config.color, -20)} 100%); border-radius: 16px; border: 4px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,0.25);">
              ${getAddressIcon(config.icon, config.size * 0.5)}
            </div>
          `;
        } else {
          el.innerHTML = `
            <div class="address-marker-body" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${config.size}px; height: ${config.size}px; background: ${config.color}; border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              ${getAddressIcon(config.icon, config.size * 0.5)}
            </div>
          `;
        }
        
        el.addEventListener('click', () => onSelectAddress?.(addr.id));

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([addr.lng, addr.lat])
          .addTo(mapInstance.current!);
        
        // Store metadata for future comparison
        marker._isActive = isActive;
        marker._addrType = addr.type;
        marker._isOther = isOtherAddress;
        
        markersRef.current.push(marker);
        cache.set(addr.id, marker);
      }
    });

    // Add circle around selected address
    const activeAddr = addresses.find(a => a.id === selectedAddressId);
    if (activeAddr) {
      const radiusInMeters = 3000;
      const createCircle = (center: [number, number], radiusInMeters: number, points = 64) => {
        const coords = [];
        const distanceX = radiusInMeters / (111320 * Math.cos(center[1] * Math.PI / 180));
        const distanceY = radiusInMeters / 110574;
        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * (2 * Math.PI);
          const x = distanceX * Math.cos(theta);
          const y = distanceY * Math.sin(theta);
          coords.push([center[0] + x, center[1] + y]);
        }
        return coords;
      };

      const addressConfig = {
        'Patient Home': { color: '#3b82f6', icon: 'home', size: 42 },
        'Trial Site': { color: '#8b5cf6', icon: 'hospital', size: 42 },
        'Candidate Site': { color: '#f59e0b', icon: 'location', size: 42 }
      };
      const config = addressConfig[activeAddr.type as keyof typeof addressConfig] || addressConfig['Candidate Site'];
      
      mapInstance.current.addSource('selected', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [createCircle([activeAddr.lng, activeAddr.lat], radiusInMeters)]
          }
        }
      });

      mapInstance.current.addLayer({
        id: 'selected-circle',
        type: 'fill',
        source: 'selected',
        paint: {
          'fill-color': config.color,
          'fill-opacity': 0.06
        }
      });

      mapInstance.current.addLayer({
        id: 'selected-circle-outline',
        type: 'line',
        source: 'selected',
        paint: {
          'line-color': config.color,
          'line-width': 2,
          'line-dasharray': [3, 3]
        }
      });

      mapInstance.current.flyTo({ center: [activeAddr.lng, activeAddr.lat], zoom: 12, duration: 1000 });
    }
  }, [addresses, selectedAddressId, customCenter, customRadius, onSelectAddress, getAddressIcon, adjustColor]);

  // ✅ OPTIMIZED: Incremental nurse marker updates with caching
  const updateNurseMarkers = useCallback(() => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl || !mapInstance.current) return;

    // Track current nurse IDs
    const currentNurseIds = new Set(nurses.map(n => n.id));
    const cache = nurseMarkersCache.current;

    // Remove markers that no longer exist
    cache.forEach((marker, id) => {
      if (!currentNurseIds.has(id)) {
        marker.remove();
        cache.delete(id);
        const idx = markersRef.current.indexOf(marker);
        if (idx !== -1) markersRef.current.splice(idx, 1);
      }
    });

    // Remove unassigned nurses if showNurses is false or not in match mode
    if (!showNurses || viewMode !== 'match') {
      cache.forEach((marker, id) => {
        const nurse = nurses.find(n => n.id === id);
        if (nurse) {
          const isAssigned = addresses.some(addr => addr.assignedNurseId === nurse.id);
          if (!isAssigned) {
            marker.remove();
            cache.delete(id);
            const idx = markersRef.current.indexOf(marker);
            if (idx !== -1) markersRef.current.splice(idx, 1);
          }
        }
      });
    }

    // Update or create markers for each nurse
    nurses.forEach((n) => {
      const isRecommended = recommendedNurses.includes(n.id);
      const isAvailable = n.status === 'Available';
      const isLimited = n.status === 'Limited';
      const isUnavailable = n.status === 'Unavailable';
      
      // Check if this nurse is assigned to any address
      const isAssigned = addresses.some(addr => addr.assignedNurseId === n.id);
      
      // Skip unassigned nurses if nurses are hidden or not in match mode
      if (!isAssigned && (!showNurses || viewMode !== 'match')) {
        return;
      }
      
      const cachedMarker = cache.get(n.id);
      
      // Check if we need to update this marker
      const needsUpdate = !cachedMarker || 
        cachedMarker._isRecommended !== isRecommended || 
        cachedMarker._status !== n.status ||
        cachedMarker._isAssigned !== isAssigned;

      if (needsUpdate) {
        // Remove old marker if exists
        if (cachedMarker) {
          cachedMarker.remove();
          const idx = markersRef.current.indexOf(cachedMarker);
          if (idx !== -1) markersRef.current.splice(idx, 1);
        }

        const el = document.createElement('div');
        el.style.position = 'relative';
        
        let marker;
        // Common popup HTML generator
        const createPopupHTML = (title: string, subtitle: string, colorClass: string, iconColor: string) => `
          <div style="padding: 12px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont;">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${iconColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); flex-shrink: 0;">
                <span style="font-weight: 700; color: white; font-size: 14px;">${n.name[0]}</span>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; font-size: 14px; color: #1e293b; line-height: 1.2; margin-bottom: 2px;">${n.name}</div>
                <div style="font-size: 11px; color: ${colorClass}; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: currentColor;"></span>
                  ${subtitle}
                </div>
              </div>
            </div>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; color: #64748b; font-weight: 500;">${n.license}</span>
              <span style="font-size: 10px; font-weight: 600; color: #3b82f6;">View Profile →</span>
            </div>
          </div>
        `;

        if (isAssigned) {
          // Assigned nurses - Darker Green for differentiation
          el.className = 'assigned-nurse-marker';
          el.style.cursor = 'pointer';
          el.innerHTML = `
            <div class="nurse-pulse-ring" style="position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(21, 128, 61, 0.3) 0%, rgba(21, 128, 61, 0) 70%); border-radius: 50%; animation: nursePulse 2s ease-in-out infinite;"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background: #166534; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <path d="M12 11h.01" />
              </svg>
            </div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(calc(-50% + 12px), calc(-50% - 12px)); width: 16px; height: 16px; background: #166534; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; z-index: 3;">
               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
          `;
          
          el.addEventListener('click', () => onNurseClick?.(n.id));
          
          const popup = new mapboxgl.Popup({ offset: 20, className: 'nurse-popup-enhanced', closeButton: false })
            .setHTML(createPopupHTML('Assigned Nurse', 'Assigned', '#166534', '#166534'));
          
          popup.on('open', () => {
            if (onActivePopupChange) onActivePopupChange(n.id);
          });
          popup.on('close', () => {
            if (onActivePopupChange) onActivePopupChange(null);
          });
          
          marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([n.lng, n.lat])
            .setPopup(popup)
            .addTo(mapInstance.current!);
        } else if (isRecommended) {
          // Recommended nurses - blue, star
          el.className = 'recommended-nurse-marker';
          el.style.cursor = 'pointer';
          el.innerHTML = `
            <div class="nurse-pulse-ring" style="position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%); border-radius: 50%; animation: nursePulse 2s ease-in-out infinite;"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          `;
          
          el.addEventListener('click', () => onNurseClick?.(n.id));
          
          const popup = new mapboxgl.Popup({ offset: 20, className: 'nurse-popup-enhanced', closeButton: false })
            .setHTML(createPopupHTML('Recommended Match', 'Top Match', '#3b82f6', '#3b82f6'));
          
          popup.on('open', () => {
            if (onActivePopupChange) onActivePopupChange(n.id);
          });
          popup.on('close', () => {
            if (onActivePopupChange) onActivePopupChange(null);
          });
          
          marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([n.lng, n.lat])
            .setPopup(popup)
            .addTo(mapInstance.current!);
        } else if (isAvailable) {
          // Available nurses - small green dot
          el.className = 'available-nurse-marker';
          el.style.cursor = 'pointer';
          el.innerHTML = `
            <div class="nurse-availability-ring" style="position: absolute; top: 50%; left: 50%; width: 22px; height: 22px; transform: translate(-50%, -50%); border: 1.5px solid #22c55e; border-radius: 50%; opacity: 0.5; animation: availablePulse 3s ease-in-out infinite;"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
          `;
          
          el.addEventListener('click', () => onNurseClick?.(n.id));
          
          const popup = new mapboxgl.Popup({ offset: 12, className: 'nurse-popup-enhanced', closeButton: false })
            .setHTML(createPopupHTML('Available Nurse', 'Available', '#22c55e', '#22c55e'));
          
          popup.on('open', () => {
            if (onActivePopupChange) onActivePopupChange(n.id);
          });
          popup.on('close', () => {
            if (onActivePopupChange) onActivePopupChange(null);
          });
          
          marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([n.lng, n.lat])
            .setPopup(popup)
            .addTo(mapInstance.current!);
        } else if (isLimited) {
          // Limited - small orange dot
          el.className = 'limited-nurse-marker';
          el.style.cursor = 'pointer';
          el.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
          `;
          
          el.addEventListener('click', () => onNurseClick?.(n.id));
          
          const popup = new mapboxgl.Popup({ offset: 10, className: 'nurse-popup-enhanced', closeButton: false })
            .setHTML(createPopupHTML('Limited Availability', 'Limited', '#f59e0b', '#f59e0b'));
          
          popup.on('open', () => {
            if (onActivePopupChange) onActivePopupChange(n.id);
          });
          popup.on('close', () => {
            if (onActivePopupChange) onActivePopupChange(null);
          });
          
          marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([n.lng, n.lat])
            .setPopup(popup)
            .addTo(mapInstance.current!);
        } else if (isUnavailable) {
          // Unavailable - gray dot
          el.className = 'unavailable-nurse-marker';
          el.style.cursor = 'pointer';
          el.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #94a3b8; border-radius: 50%; border: 1.5px solid white; opacity: 0.6;"></div>
          `;
          
          el.addEventListener('click', () => onNurseClick?.(n.id));
          
          const popup = new mapboxgl.Popup({ offset: 8, className: 'nurse-popup-enhanced', closeButton: false })
            .setHTML(createPopupHTML('Unavailable', 'Unavailable', '#94a3b8', '#94a3b8'));
          
          popup.on('open', () => {
            if (onActivePopupChange) onActivePopupChange(n.id);
          });
          popup.on('close', () => {
            if (onActivePopupChange) onActivePopupChange(null);
          });
          
          marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([n.lng, n.lat])
            .setPopup(popup)
            .addTo(mapInstance.current!);
        }

        if (marker) {
          // Store metadata for future comparison
          marker._isRecommended = isRecommended;
          marker._status = n.status;
          marker._isAssigned = isAssigned;
          
          markersRef.current.push(marker);
          cache.set(n.id, marker);
        }
      }
    });
  }, [nurses, showNurses, viewMode, recommendedNurses, addresses, onNurseClick, onActivePopupChange]);

  // Initialize map
  useEffect(() => {
    if (engineStatus === 'ready' && mapDivRef.current && !mapInstance.current) {
      const mapboxgl = window.mapboxgl;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      
      const map = new mapboxgl.Map({
        container: mapDivRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.0060, 40.7128],
        zoom: 11
      });

      map.on('load', () => {
        mapInstance.current = map;
        updateRadiusCircle();
        updateHeatmap();
        updateAddressMarkers();
        updateNurseMarkers();
        updateAssignmentLines();
      });
    }
  }, [engineStatus, updateRadiusCircle, updateHeatmap, updateAddressMarkers, updateNurseMarkers, updateAssignmentLines]);

  // ✅ Update radius circle when custom center/radius changes
  useEffect(() => {
    if (engineStatus === 'ready' && mapInstance.current && mapInstance.current.isStyleLoaded()) {
      updateRadiusCircle();
    }
  }, [engineStatus, updateRadiusCircle]);

  // ✅ Update heatmap when view mode or nurses change
  useEffect(() => {
    if (engineStatus === 'ready' && mapInstance.current && mapInstance.current.isStyleLoaded()) {
      updateHeatmap();
    }
  }, [engineStatus, updateHeatmap]);

  // ✅ Update address markers when addresses or selection changes
  useEffect(() => {
    if (engineStatus === 'ready' && mapInstance.current && mapInstance.current.isStyleLoaded()) {
      updateAddressMarkers();
    }
  }, [engineStatus, updateAddressMarkers]);

  // ✅ Update nurse markers when nurses, visibility, or recommendations change
  useEffect(() => {
    if (engineStatus === 'ready' && mapInstance.current) {
      updateNurseMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineStatus, nurses, showNurses, viewMode, recommendedNurses]);

  // ✅ Update assignment lines when addresses or nurses change
  useEffect(() => {
    if (engineStatus === 'ready' && mapInstance.current) {
      updateAssignmentLines();
    }
  }, [engineStatus, updateAssignmentLines]);

  // ✅ Use Mapbox 'line-dasharray' animation for a robust workflow ("marching ants")
  // This is the standard, optimized way to animate lines in Mapbox without heavy setData calls.
  useEffect(() => {
    if (!mapInstance.current || engineStatus !== 'ready') return;
    
    let animationFrameId: number;
    let dashOffset = 0;
    
    const animateDash = () => {
      // Dash pattern: [dash_length, gap_length]
      // We essentially want a long gap and a short dash to simulate a packet moving
      // Or standard marching ants: [2, 1]
      // To simulate "flowing light", we can shift the offset
      
      dashOffset = (dashOffset - 0.2) % 8; // Speed of flow
      
      const layer = mapInstance.current?.getLayer('flow-layer');
      if (layer) {
         // We update line-dasharray offset if Mapbox supports it (it does not directly on lines), 
         // BUT we can use 'line-dasharray' itself to simulate movement by changing the array values?
         // No, simpler: Use 'line-dasharray' on a separate layer and shift it?
         // Mapbox GL JS DOES NOT support animating dash offset natively on lines efficiently.
         
         // FALLBACK: The "Airline" flow using setData is actually correct, but requires care.
         // Let's retry the setData approach but safer.
      }
      
      // Let's stick thereto the setData "comet" approach as it allows the "airline" look (fading tail).
      // The previous implementation likely failed because of empty refs or timing.
      // Re-implementing the loop with safety checks.
      
      // 2 seconds loop duration
      const duration = 2500; 
      const now = performance.now();
      const progress = (now % duration) / duration;
      const tailLength = 0.25; // Longer tail for visibility
      
      const flowFeatures: Array<{
        type: 'Feature';
        properties: { isActive: boolean };
        geometry: { type: 'LineString'; coordinates: [number, number][] };
      }> = [];
      
      if (assignmentPathsRef.current && assignmentPathsRef.current.length > 0) {
        assignmentPathsRef.current.forEach(item => {
           // Show flow on ALL lines or just active? Let's show on all to be visible
           // if (!item.isActive && selectedAddressId) return;

           const path = item.path;
           if (!path || path.length < 2) return;
           
           const totalPoints = path.length;
           
           // Calculate start and end indices
           // REVERSED DIRECTION: Start from 1.0 down to 0.0
           // Current progress goes 0 -> 1. We want flow from Nurse (end) to Address (start) ? 
           // Or Address (start) to Nurse (end)? 
           // Default matched logic usually: Nurse goes TO Patient.
           // Path is [Address, ..., Nurse]. 
           // Originally flowing 0->1 (Address -> Nurse).
           // To reverse (Nurse -> Address), we iterate backwards or invert progress.
           
           const invertedProgress = 1 - progress;
           
           const endIndex = Math.floor(invertedProgress * totalPoints);
           const startIndex = Math.floor((invertedProgress + tailLength) * totalPoints); // Tail is BEHIND head. 
           // If head is at 0.8, tail is at 0.8 + 0.2 = 1.0 (since we are moving backwards).
           // Wait, if moving 1 -> 0.
           // Head at 0.9. Tail should be "behind" movement, so 0.9 + 0.1 = 1.0.
           // Head at 0.5. Tail at 0.6.
           // Head at 0.1. Tail at 0.2.
           
           // Correct variables for slicing: slice(start, end) expects start < end.
           // Our logical "start" of the comet is `endIndex` (the leading edge in reverse).
           // Our logical "tail" is `startIndex` (the trailing edge).
           
           // We need to slice from min(head, tail) to max(head, tail).
           const idx1 = endIndex; 
           const idx2 = startIndex;
           
           let sliceStart = Math.min(idx1, idx2);
           let sliceEnd = Math.max(idx1, idx2);
           
           if (sliceStart < 0) sliceStart = 0;
           if (sliceEnd >= totalPoints) sliceEnd = totalPoints - 1;
           
           if (sliceStart < sliceEnd) {
             const segmentCoords = path.slice(sliceStart, sliceEnd + 1);
             // If we want the comet to look tapered, we might need more complex logic, 
             // but for a solid line segment, just coordinate order matters for line-gradient if used.
             // For simple solid color, order doesn't matter visually for the segment itself.
             
             if (segmentCoords.length >= 2) {
               flowFeatures.push({
                 type: 'Feature',
                 properties: {
                    isActive: item.isActive
                 },
                 geometry: {
                   type: 'LineString',
                   coordinates: segmentCoords
                 }
               });
             }
           }
        });
        
        const source = mapInstance.current?.getSource('flow');
        if (source && mapInstance.current?.isStyleLoaded()) {
           // Important: Check if layer exists to avoid "source not found" errors during HMR/updates
           source.setData({
            type: 'FeatureCollection',
            features: flowFeatures
          });
        }
      }
      
      animationFrameId = requestAnimationFrame(animateDash);
    };
    
    // Start animation
    animateDash();
    
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [engineStatus, selectedAddressId]);

  // ✅ Resize map when container size changes
  // We use a ResizeObserver to handle window resizing.
  // Since the sidebar is now an overlay, we don't need complex resize logic for sidebar transitions.
  useEffect(() => {
    if (!mapDivRef.current) return;

    let timeoutId: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      // Basic debounce
      timeoutId = setTimeout(() => {
        mapInstance.current?.resize();
      }, 100);
    });

    resizeObserver.observe(mapDivRef.current);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);


  return (
    <div className="w-full h-full bg-slate-50 relative border-l border-slate-200">
      <div ref={mapDivRef} className="w-full h-full z-0" />
      
      {/* Map Controls */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
        <button
          onClick={() => mapInstance.current?.zoomIn()}
          className="w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-slate-700 hover:text-blue-600 font-semibold text-xl active:scale-95 border border-slate-100"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => mapInstance.current?.zoomOut()}
          className="w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-slate-700 hover:text-blue-600 font-semibold text-xl active:scale-95 border border-slate-100"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => {
            if (mapInstance.current) {
              mapInstance.current.flyTo({ 
                center: [-74.0060, 40.7128], 
                zoom: 11,
                duration: 1000 
              });
            }
          }}
          className="w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-slate-700 hover:text-blue-600 active:scale-95 border border-slate-100"
          title="Reset View"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>

      {/* Map Legend */}
      {showNurses && (
      <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-5 max-w-xs transition-opacity duration-300 hover:opacity-100 opacity-90">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Map Legend</h3>
        
        {/* Address Types */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
            <MapPin size={10} className="text-blue-600"/>
            Locations
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-500 border border-blue-600 shadow-sm flex items-center justify-center scale-90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-600">Patient Home</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-500 border border-purple-600 shadow-sm flex items-center justify-center scale-90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-600">Trial Site</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500 border border-amber-600 shadow-sm flex items-center justify-center scale-90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-600">Candidate Site</span>
            </div>
          </div>
        </div>

        {/* Nurse Status */}
        <div>
          <p className="text-[10px] font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
            <Users size={10} className="text-blue-600"/>
            Nurses
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-5 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-green-500 border-[2px] border-white shadow-md flex items-center justify-center ring-1 ring-green-100">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600">Assigned</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-5 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-blue-500 border-[2px] border-white shadow-md flex items-center justify-center ring-1 ring-blue-100">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600">Recommended</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-5 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 border-[2px] border-white shadow-sm"></div>
              </div>
              <span className="text-xs text-slate-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 border-[2px] border-white shadow-sm"></div>
              </div>
              <span className="text-xs text-slate-700">Limited Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-400 border-[2px] border-white shadow-sm opacity-50"></div>
              </div>
              <span className="text-xs text-slate-700">Unavailable</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {engineStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-400">Loading Map Engine...</p>
        </div>
      )}
    </div>
  );
};

// --- Page: Admin Match Workspace ---
export const AdminMatchWorkspace = ({ trials, setTrials, selectedAddrId, setSelectedAddrId, viewMode, setViewMode, isLocked, setIsLocked, selectedTrialId, setSelectedTrialId }: {
  trials: Trial[];
  setTrials: (trials: Trial[] | ((prev: Trial[]) => Trial[])) => void;
  selectedAddrId: string;
  setSelectedAddrId: (id: string) => void;
  viewMode: string;
  setViewMode: (mode: string | ((v: string) => string)) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  selectedTrialId: string;
  setSelectedTrialId: (id: string) => void;
}) => {
  const [showNursesLayer, setShowNursesLayer] = useState(true);
  const [showMatchingPopup, setShowMatchingPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAIMatch = () => {
    setShowMatchingPopup(true);
    setTimeout(() => {
        setTrials((prev) => prev.map((t) => {
            if (t.id === selectedTrialId) {
                // Get list of available nurses
                const availableNurses = MOCK_NURSES.filter(n => n.status !== 'Unavailable');
                const assignedNurseIds = new Set(t.addresses.map((a) => a.assignedNurseId).filter(Boolean));
                
                return {
                    ...t,
                    addresses: t.addresses.map((a) => {
                        if (!a.assignedNurseId) {
                            // Find the closest available nurse to this address
                            const nursesWithDistance = availableNurses
                                .filter(n => !assignedNurseIds.has(n.id)) // Exclude already assigned nurses
                                .map(nurse => ({
                                    id: nurse.id,
                                    distance: calculateDistance(a.lat, a.lng, nurse.lat, nurse.lng)
                                }))
                                .sort((x, y) => x.distance - y.distance);
                            
                            if (nursesWithDistance.length > 0) {
                                const closestNurse = nursesWithDistance[0];
                                assignedNurseIds.add(closestNurse.id); // Mark as assigned
                                return { ...a, assignedNurseId: closestNurse.id };
                            }
                        }
                        return a;
                    })
                };
            }
            return t;
        }));
        setShowMatchingPopup(false);
    }, 2500);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Patient Home', address: '', lat: 40.7128, lng: -74.0060 });
  const [activePopupNurseId, setActivePopupNurseId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const trial = trials.find(t => t.id === selectedTrialId) || trials[0];
  const activeAddr = selectedAddrId 
    ? trial.addresses.find((a) => a.id === selectedAddrId) || null
    : null;
  const assignedTotal = trial.addresses.filter((a) => a.assignedNurseId).length;
  
  // Filter trials based on search query
  const filteredTrials = trials.filter((t) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to assigned nurse when address is selected
  useEffect(() => {
    if (activeAddr?.assignedNurseId) {
      setTimeout(() => {
        const nurseCard = document.getElementById(`nurse-card-${activeAddr.assignedNurseId}`);
        if (nurseCard) {
          nurseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300); // Delay to allow rendering
    }
  }, [activeAddr?.assignedNurseId, selectedAddrId]);
  
  // Handle nurse marker click on map
  const handleNurseClick = (nurseId: string) => {
    // Find the address assigned to this nurse
    const assignedAddress = trial.addresses.find((a) => a.assignedNurseId === nurseId);
    
    if (assignedAddress) {
      // If nurse is assigned, select that address
      setSelectedAddrId(assignedAddress.id);
    } else if (activeAddr) {
      // If nurse is not assigned but we have an active address, just ensure it's visible
      // The nurse list is already showing
    } else if (trial.addresses.length > 0) {
      // If no active address, select the first one to show the nurse list
      setSelectedAddrId(trial.addresses[0].id);
    }
    
    // Scroll to the nurse card
    setTimeout(() => {
      const nurseCard = document.getElementById(`nurse-card-${nurseId}`);
      if (nurseCard) {
        nurseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief highlight effect
        nurseCard.style.transition = 'transform 0.3s ease';
        nurseCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
          nurseCard.style.transform = 'scale(1)';
        }, 300);
      }
    }, 400);
  };
  
  const handleTrialSelect = (trialId: string) => {
    setSelectedTrialId(trialId);
    const newTrial = trials.find(t => t.id === trialId);
    if (newTrial && newTrial.addresses.length > 0) {
      setSelectedAddrId(newTrial.addresses[0].id);
    }
    setIsDropdownOpen(false);
    setSearchQuery('');
  };
  
  // Calculate distance between two coordinates using Haversine formula (returns distance in miles)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Get recommended nurses (closest 3 available nurses to the selected address)
  const recommendedNurseIds = useMemo(() => {
    if (!activeAddr) return [];
    
    // Calculate distance for each available nurse
    const nursesWithDistance = MOCK_NURSES
      .filter(n => n.status !== 'Unavailable')
      .map(nurse => ({
        id: nurse.id,
        name: nurse.name,
        distance: calculateDistance(activeAddr.lat, activeAddr.lng, nurse.lat, nurse.lng)
      }))
      .sort((a, b) => a.distance - b.distance) // Sort by distance ascending
      .slice(0, 3); // Take closest 3
    
    return nursesWithDistance.map(n => n.id);
  }, [activeAddr]);

  const updateAssignment = (nurseId: string | null, addressId?: string) => {
    const targetAddressId = addressId || selectedAddrId;
    setTrials((prev) => prev.map((t) => 
      t.id === selectedTrialId ? {
        ...t,
        addresses: t.addresses.map((a) => a.id === targetAddressId ? { ...a, assignedNurseId: nurseId } : a)
      } : t
    ));
  };
  
  const handleAddAddress = () => {
    const newId = `a${Date.now()}`;
    const addressToAdd = {
      id: newId,
      type: newAddress.type,
      address: newAddress.address,
      lat: newAddress.lat,
      lng: newAddress.lng,
      assignedNurseId: null
    };
    
    setTrials((prev) => prev.map((t) => 
      t.id === selectedTrialId ? {
        ...t,
        addresses: [...t.addresses, addressToAdd]
      } : t
    ));
    
    setShowAddAddressModal(false);
    setNewAddress({ type: 'Patient Home', address: '', lat: 40.7128, lng: -74.0060 });
    setSelectedAddrId(newId);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm z-[40]" id="workspace-header">
        <div className="flex gap-6">
          <div className="relative z-[40]" ref={dropdownRef} id="protocol-selector">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0 whitespace-nowrap">Current Protocol</p>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-slate-50 px-2 -ml-2 py-0.5 rounded-lg transition-colors group"
            >
              <h2 className="text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">{String(trial.name)}</h2>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-[50] overflow-hidden">
                <div className="p-3 border-b border-slate-50">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search protocols..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {filteredTrials.length > 0 ? (
                    filteredTrials.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleTrialSelect(t.id)}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-all border-l-2 ${
                          t.id === selectedTrialId 
                            ? 'border-blue-600 bg-blue-50/30' 
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-semibold text-sm text-slate-800 truncate">{t.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5 truncate">{t.sponsor}</p>
                          </div>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${
                            t.status === 'Matching' ? 'bg-blue-100 text-blue-700' :
                            t.status === 'In Progress' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-400 text-xs font-medium">
                      No protocols found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="h-8 w-px bg-slate-100 self-center" />

          <div className="flex flex-col gap-1 min-w-[140px]" id="progress-indicator">
             <div className="flex justify-between items-end mb-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">Progress</p>
             </div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full transition-all duration-500 ease-out" style={{ width: `${(assignedTotal / trial.addresses.length) * 100}%` }} />
             </div>
             <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-700 leading-none">{Math.round((assignedTotal / trial.addresses.length) * 100)}% <span className="text-slate-400 font-normal">Complete</span></p>
             </div>
          </div>
        </div>
        <div 
          className="flex gap-2 overflow-x-auto no-scrollbar ml-4 items-center [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] px-6" 
          id="action-buttons-group"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
           <style jsx>{`
            @keyframes shimmer {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>
          <button onClick={handleAIMatch} id="btn-ai-match" className="relative group px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 transition-all hover:scale-105 active:scale-95 border border-slate-800 overflow-hidden whitespace-nowrap flex-shrink-0">
             {/* Flowing shimmer border effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 w-[200%] h-full -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_linear_infinite]" style={{ animation: 'shimmer 2s linear infinite' }}></div>
             
             {/* Subtle internal glow */}
             <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

             {/* Content */}
             <span className="relative z-30 flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-colors">
               <Zap size={14} className="text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" /> 
               AI Match
             </span>
          </button>
          <button onClick={() => setShowNursesLayer(!showNursesLayer)} id="btn-show-nurses" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap flex-shrink-0 ${showNursesLayer ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Users size={14} /> {showNursesLayer ? 'Hide Nurses' : 'Show Nurses'}
          </button>
          <button onClick={() => setViewMode((v: string) => v === 'match' ? 'heatmap' : 'match')} id="btn-density" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap flex-shrink-0 ${viewMode === 'heatmap' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Layers size={14} /> {viewMode === 'heatmap' ? 'Hide Density' : 'Density Analysis'}
          </button>
          <button onClick={() => setIsLocked(!isLocked)} id="btn-lock-plan" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${isLocked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
            {isLocked ? <CheckCircle size={14} /> : <ShieldCheck size={14} />} {isLocked ? 'Plan Confirmed' : 'Lock Matching Plan'}
          </button>
          <button disabled={!isLocked} id="btn-batch-notify" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap flex-shrink-0">
            <Mail size={14} /> Batch Notify
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50" id="locations-sidebar">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <MapPin size={14} className="text-blue-600" />
              Locations ({trial.addresses.length})
            </h3>
            <button onClick={() => setShowAddAddressModal(true)} className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"><Plus size={16}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" onClick={(e) => { if (e.target === e.currentTarget) setSelectedAddrId(''); }}>
            {trial.addresses.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MapPin size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No addresses yet</p>
                <p className="text-xs mt-1">Click + to add an address</p>
              </div>
            ) : (
              trial.addresses.map((addr) => (
              <div key={addr.id} onClick={() => setSelectedAddrId(addr.id)} className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${selectedAddrId === addr.id ? 'border-blue-500 bg-white shadow-md ring-1 ring-blue-500/10' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${addr.type === 'Patient Home' ? 'bg-blue-50 text-blue-700' : addr.type === 'Trial Site' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'}`}>{String(addr.type)}</span>
                  {addr.assignedNurseId && <CheckCircle size={14} className="text-green-500" />}
                </div>
                <p className="text-xs font-semibold text-slate-700 line-clamp-2 leading-relaxed mb-3">{String(addr.address)}</p>
                {addr.assignedNurseId ? (
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[9px]">{(MOCK_NURSES.find(n => n.id === addr.assignedNurseId)?.name || "?")[0]}</div>
                    <span className="text-[10px] font-bold text-slate-600 truncate flex-1">{String(MOCK_NURSES.find(n => n.id === addr.assignedNurseId)?.name || 'Unknown')}</span>
                    {!isLocked && <button onClick={(e) => { e.stopPropagation(); updateAssignment(null, addr.id); }} className="text-slate-400 hover:text-red-500 transition-colors p-0.5"><X size={12}/></button>}
                  </div>
                ) : <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Awaiting Staffing</div>}
              </div>
            ))
            )}
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <InteractiveMap 
              addresses={trial.addresses} 
              nurses={MOCK_NURSES} 
              selectedAddressId={selectedAddrId} 
              onSelectAddress={setSelectedAddrId} 
              viewMode={viewMode} 
              customCenter={null} 
              customRadius={null}
              showNurses={showNursesLayer}
              recommendedNurses={recommendedNurseIds}
              onNurseClick={handleNurseClick}
              onActivePopupChange={setActivePopupNurseId}
            />
          </div>

          <div 
            className="absolute top-0 right-0 bottom-0 z-20 bg-white shadow-xl border-l border-slate-100 flex flex-col transition-transform duration-300 ease-in-out"
            style={{ 
              width: '360px',
              transform: selectedAddrId ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide flex items-center gap-2"><Users size={14} className="text-blue-600" /> Recommendations</h3>
                <button 
                  onClick={() => setSelectedAddrId('')}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-md"
                  title="Hide nurse list"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate pl-6">Target: {activeAddr ? String(activeAddr.address) : 'No address selected'}</p>
            </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30" id="nurse-list-container">
            {!activeAddr ? (
              <div className="text-center py-12 text-slate-400">
                <Users size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No address selected</p>
                <p className="text-xs mt-1">Select an address to see recommendations</p>
              </div>
            ) : (
              MOCK_NURSES
                .filter(n => n.status !== 'Unavailable')
                .map(nurse => ({
                  ...nurse,
                  calculatedDistance: calculateDistance(activeAddr.lat, activeAddr.lng, nurse.lat, nurse.lng)
                }))
                .sort((a, b) => {
                  const aIsAssigned = activeAddr.assignedNurseId === a.id;
                  const bIsAssigned = activeAddr.assignedNurseId === b.id;
                  const aIsRecommended = recommendedNurseIds.includes(a.id);
                  const bIsRecommended = recommendedNurseIds.includes(b.id);
                  
                  // Assigned first
                  if (aIsAssigned && !bIsAssigned) return -1;
                  if (!aIsAssigned && bIsAssigned) return 1;
                  
                  // Then recommended
                  if (aIsRecommended && !bIsRecommended) return -1;
                  if (!aIsRecommended && bIsRecommended) return 1;
                  
                  return 0;
                })
                .map(nurse => {
              const assignedToSelected = activeAddr.assignedNurseId === nurse.id;
              const isRecommended = recommendedNurseIds.includes(nurse.id);
              const hasActivePopup = activePopupNurseId === nurse.id;
              return (
                <div 
                  key={nurse.id} 
                  id={`nurse-card-${nurse.id}`}
                  className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden bg-white ${
                    assignedToSelected 
                      ? 'border-green-500 shadow-md ring-1 ring-green-500/20' 
                      : isRecommended 
                      ? 'border-blue-300 shadow-sm' 
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  } ${hasActivePopup ? 'ring-2 ring-blue-400 border-blue-400 shadow-lg scale-[1.02]' : ''}`}
                >
                  {assignedToSelected && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 rounded-bl-lg text-[9px] font-bold uppercase flex items-center gap-1 shadow-sm">
                      <CheckCircle size={10} />
                      Assigned
                    </div>
                  )}
                  {!assignedToSelected && isRecommended && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded-bl-lg text-[9px] font-bold uppercase flex items-center gap-1 shadow-sm">
                      <Zap size={10} fill="currentColor"/>
                      Top Match
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-6">
                      <h5 className="font-bold text-slate-800 text-sm mb-1">{String(nurse.license)}</h5>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-slate-500">{nurse.calculatedDistance.toFixed(1)} mi away</span>
                        {isRecommended && <span className="text-blue-600 font-bold text-[10px]">• 98% Match</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {nurse.capabilities.map((c: string) => <span key={c} className="text-[9px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">{String(c)}</span>)}
                  </div>
                  
                  <button 
                    disabled={isLocked || assignedToSelected} 
                    onClick={() => updateAssignment(nurse.id)} 
                    className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        assignedToSelected 
                        ? 'bg-green-50 text-green-700 cursor-default border border-green-200' 
                        : 'bg-slate-900 text-white hover:bg-blue-600 shadow-sm'
                    }`}
                  >
                    {assignedToSelected ? 'Assigned' : 'Assign Nurse'}
                  </button>
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>
    </div>
      
      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] backdrop-blur-sm" onClick={() => setShowAddAddressModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[480px] p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Add New Address</h3>
              <button onClick={() => setShowAddAddressModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Address Type</label>
                <div className="relative">
                    <select 
                    value={newAddress.type}
                    onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                    >
                    <option value="Patient Home">Patient Home</option>
                    <option value="Trial Site">Trial Site</option>
                    <option value="Candidate Site">Candidate Site</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Address</label>
                <input 
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  placeholder="e.g., 123 Main St, New York, NY"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Latitude</label>
                  <input 
                    type="number"
                    step="0.0001"
                    value={newAddress.lat}
                    onChange={(e) => setNewAddress({...newAddress, lat: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Longitude</label>
                  <input 
                    type="number"
                    step="0.0001"
                    value={newAddress.lng}
                    onChange={(e) => setNewAddress({...newAddress, lng: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowAddAddressModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAddress}
                disabled={!newAddress.address}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      )}

      {showMatchingPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <Zap className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} fill="currentColor" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">AI Matching Agent</h3>
            <p className="text-sm text-slate-500 text-center">Analyzing nurse schedules, location proximity, and specialty requirements...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Nurse Dashboard Sub-Components ---
export const ReadinessDashboard = ({ nurse }: { nurse: typeof MOCK_NURSE }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex flex-col items-center text-center">
    <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Your Readiness Status</h2>
    <div className="inline-flex items-center gap-4 bg-slate-50 border-[3px] border-slate-100 rounded-2xl px-10 py-3 shadow-inner relative">
      {/* Animated border ring */}
      <span className="absolute inset-0 rounded-2xl border-2 border-green-300 opacity-40 pointer-events-none" />
      <span className="absolute inset-0 rounded-2xl border border-green-200 opacity-60 pointer-events-none" />
      {/* Ripple pulse indicator */}
      <span className="relative flex h-3.5 w-3.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
      </span>
      <span className="text-lg font-black text-slate-700 tracking-tight">Active</span>
    </div>
    <div className="mt-4 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
      Expires in {nurse.expiryDays} days
    </div>
  </div>
);

export const ActionCard = ({ icon: Icon, title, lastUpdate, accentColor, accentBg, confirmedLabel, onConfirm }: {
  icon: React.ElementType; title: string; lastUpdate: number;
  accentColor: string; accentBg: string;
  confirmedLabel: string; onConfirm?: () => void;
}) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  const dragging = React.useRef(false);
  const startX = React.useRef(0);

  const THUMB = 58;
  const PAD = 6;
  const trackWidth = () => (trackRef.current?.offsetWidth ?? 280) - THUMB - PAD * 2;

  const onStart = (clientX: number) => {
    if (confirmed) return;
    dragging.current = true;
    startX.current = clientX - offset;
  };
  const onMove = (clientX: number) => {
    if (!dragging.current) return;
    setOffset(Math.min(Math.max(0, clientX - startX.current), trackWidth()));
  };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (offset >= trackWidth() * 0.82) {
      setOffset(trackWidth());
      setConfirmed(true);
      setTimeout(() => onConfirm?.(), 320);
    } else {
      setOffset(0);
    }
  };

  const progress = Math.min(offset / (trackWidth() || 1), 1);
  const textOpacity = Math.max(0, 1 - progress * 2);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Slider track */}
      <div
        ref={trackRef}
        className="relative h-[72px] rounded-full select-none overflow-hidden w-full"
        style={{
          background: confirmed ? '#dcfce7' : '#f1f5f9',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.07)',
        }}
        onMouseMove={e => onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchMove={e => { e.preventDefault(); onMove(e.touches[0].clientX); }}
        onTouchEnd={onEnd}
      >
        {/* Colored fill */}
        <div
          className={`absolute transition-none rounded-full ${confirmed ? 'inset-0' : 'top-[6px] bottom-[6px] left-[6px]'}`}
          style={{
            width: confirmed ? '100%' : `${offset + THUMB}px`,
            background: confirmed ? '#86efac' : accentBg,
            opacity: confirmed ? 1 : 0.15 + progress * 0.45,
          }}
        />

        {/* Title — centered right of thumb rest position */}
        <div
          className="absolute inset-y-0 flex items-center pointer-events-none"
          style={{
            left: `${PAD * 2 + THUMB + 8}px`,
            right: '16px',
            opacity: textOpacity,
          }}
        >
          <p className="text-base font-black text-slate-700 leading-tight truncate">{title}</p>
        </div>

        {/* Confirmed state label */}
        {confirmed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-bold text-green-600 tracking-wide">✓ {confirmedLabel}</span>
          </div>
        )}

        {/* Thumb — drag handle */}
        {!confirmed && (
          <div
            className="absolute top-[6px] bottom-[6px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
            style={{
              left: `${PAD + offset}px`,
              width: `${THUMB}px`,
              background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)',
            }}
            onMouseDown={e => { e.preventDefault(); onStart(e.clientX); }}
            onTouchStart={e => onStart(e.touches[0].clientX)}
          >
            <Icon size={22} style={{ color: accentBg }} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Last confirmed — small centered text below slider */}
      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
        {confirmed ? 'Last confirmed just now' : lastUpdate === 0 ? 'Last confirmed just now' : `Last confirmed ${lastUpdate} days ago`}
      </p>
    </div>
  );
};

export const ResponsiveOpportunity = ({ opp }: { opp: typeof MOCK_OPPORTUNITY }) => (
  <div className="bg-slate-800 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
    <div className="absolute -right-8 -top-8 opacity-10 rotate-12">
      <Zap size={180} fill="currentColor" />
    </div>
    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="text-center md:text-left">
        <h3 className="text-xl sm:text-2xl font-black mb-2">{opp.title}</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <span className="flex items-center gap-1"><Calendar size={14}/> {opp.dateWindow}</span>
          <span className="flex items-center gap-1"><MapPin size={14}/> {opp.distance}</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <button className="flex-1 sm:flex-none bg-gradient-to-b from-green-400 to-green-500 px-6 py-3 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2">
          <CheckCircle size={18} /> Interested
        </button>
        <button className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 border border-white/10">
          <X size={18} /> Decline
        </button>
      </div>
    </div>
  </div>
);

// --- Page: Nurse Portal Component ---
export const NursePortal = ({ user, currentPage, setCurrentPage }: { user: Nurse; currentPage: string; setCurrentPage: (p: string) => void }) => {
  const [lastAvailabilityConfirm, setLastAvailabilityConfirm] = useState(MOCK_NURSE.lastAvailabilityConfirm);
  const [lastRadiusConfirm, setLastRadiusConfirm] = useState(MOCK_NURSE.lastRadiusConfirm);
  const [expiryDays, setExpiryDays] = useState(MOCK_NURSE.expiryDays);

  if (currentPage === 'Coverage') return (
    <NurseCoverage
      user={user}
      onSave={() => { setLastRadiusConfirm(0); setCurrentPage('Dashboard'); }}
    />
  );
  if (currentPage === 'Settings') return <NurseSettings user={user} />;
  return (
    <NurseDashboard
      user={user}
      setCurrentPage={setCurrentPage}
      lastAvailabilityConfirm={lastAvailabilityConfirm}
      lastRadiusConfirm={lastRadiusConfirm}
      expiryDays={expiryDays}
      onConfirmAvailability={() => { setLastAvailabilityConfirm(0); setExpiryDays(30); }}
    />
  );
};

export const NurseDashboard = ({ user, setCurrentPage, lastAvailabilityConfirm, lastRadiusConfirm, expiryDays, onConfirmAvailability }: {
  user: Nurse;
  setCurrentPage: (p: string) => void;
  lastAvailabilityConfirm: number;
  lastRadiusConfirm: number;
  expiryDays: number;
  onConfirmAvailability: () => void;
}) => (
  /* ── Mobile-first: Active card fills top, bottom 3-group sticks to bottom ── */
  <div className="flex flex-col h-full px-4 pt-3 pb-5 md:pt-6 md:pb-8 md:max-w-xl md:mx-auto md:w-full">

    {/* ─ 1. Active Status Card — fills all remaining vertical space ─ */}
    <div className="flex-1 min-h-0 bg-white rounded-[1.75rem] border border-slate-100 shadow-sm px-6 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Readiness Status</p>
      <div className="inline-flex items-center gap-2.5 mb-2">
        <span className="relative flex h-3.5 w-3.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]" />
        </span>
        <span className="text-2xl font-black text-slate-800 tracking-tight">Active</span>
      </div>
      <p className="text-xs font-semibold text-amber-600">Expires in {expiryDays} days</p>
    </div>

    {/* ─ Bottom group: sliders + opportunity, pinned to bottom ─ */}
    <div className="shrink-0 flex flex-col gap-3 mt-8">

      {/* ─ 2. Action Sliders ─ */}
      <ActionCard
        icon={CheckCircle}
        title="Confirm Availability"
        lastUpdate={lastAvailabilityConfirm}
        accentColor="#2563eb"
        accentBg="#2563eb"
        confirmedLabel="Confirmed"
        onConfirm={onConfirmAvailability}
      />
      <ActionCard
        icon={MapPin}
        title="Update Location Radius"
        lastUpdate={lastRadiusConfirm}
        accentColor="#f43f5e"
        accentBg="#f43f5e"
        confirmedLabel="Navigating…"
        onConfirm={() => setCurrentPage('Coverage')}
      />

      {/* ─ 3. Opportunity Card ─ */}
      <div className="bg-slate-800 rounded-[1.75rem] px-5 py-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">{MOCK_OPPORTUNITY.title}</p>
            <p className="text-slate-400 text-[10px] font-semibold mt-0.5">{MOCK_OPPORTUNITY.distance} · {MOCK_OPPORTUNITY.dateWindow}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-green-500 text-white text-xs font-bold py-2.5 rounded-2xl active:scale-[0.97] transition-transform flex items-center justify-center gap-1.5">
            <CheckCircle size={14} /> Interested
          </button>
          <button className="flex-1 bg-white/10 text-white text-xs font-bold py-2.5 rounded-2xl active:scale-[0.97] transition-transform flex items-center justify-center gap-1.5 border border-white/10">
            <X size={14} /> Unavailable
          </button>
        </div>
      </div>

    </div>

  </div>
);

export const NurseCoverage = ({ user, onSave }: { user: Nurse; onSave?: () => void }) => {
  const [radius, setRadius] = useState(MOCK_NURSE.radius);
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden md:flex-row">

      {/* Map — fills remaining space on mobile, right side on desktop */}
      <div className="flex-1 min-h-0 relative md:order-last">
        <InteractiveMap addresses={[]} nurses={[]} selectedAddressId={null} onSelectAddress={() => {}} viewMode="match" customCenter={{ lat: user.lat, lng: user.lng }} customRadius={radius} showNurses={false} recommendedNurses={[]} />
      </div>

      {/* Controls panel — pinned to bottom on mobile, left sidebar on desktop */}
      <div className="shrink-0 md:w-80 px-4 py-4 md:px-6 md:py-6 border-t md:border-t-0 md:border-r border-slate-100 flex flex-col gap-4 bg-white md:bg-slate-50/30">
        <h2 className="text-base font-bold text-slate-800">Service Coverage</h2>

        {/* Address */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Primary Residence</label>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-[1.25rem] text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{user.address}</span>
          </div>
        </div>

        {/* Radius slider */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coverage Radius</label>
            <span className="text-blue-600 font-black text-sm bg-blue-50 px-3 py-0.5 rounded-full">{radius} mi</span>
          </div>
          <input
            type="range" min="5" max="100" step="5"
            value={radius}
            onChange={e => setRadius(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-full accent-blue-600 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-semibold text-slate-300 mt-1">
            <span>5 mi</span><span>100 mi</span>
          </div>
        </div>

        <button
          onClick={onSave}
          className="w-full bg-slate-900 text-white py-3 rounded-[1.25rem] font-bold text-sm shadow-md hover:bg-blue-600 transition-colors active:scale-[0.98]"
        >
          Save Coverage Profile
        </button>
      </div>
    </div>
  );
};

export const NurseSettings = ({ user }: { user: Nurse }) => (
  <div className="flex flex-col h-full bg-slate-50/50 overflow-y-auto px-4 pt-3 pb-8 md:pt-6 md:max-w-xl md:mx-auto md:w-full">
    <h2 className="text-lg font-bold text-slate-800 mb-5">Settings</h2>

    {/* Profile card */}
    <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5 mb-4">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-lg shrink-0">
          {user.name.split(',')[0].split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-bold text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{user.license} · Joined {user.joined}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
          <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Home Address</label>
          <input type="text" defaultValue={user.address} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">License</label>
            <input type="text" defaultValue={user.license} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Coverage Radius</label>
            <input type="text" defaultValue={`${user.radius} mi`} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all" />
          </div>
        </div>
      </div>
    </div>

    {/* Specialties */}
    <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5 mb-4">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Specialties & Capabilities</label>
      <div className="flex flex-wrap gap-2">
        {user.specialty.map(s => (
          <span key={s} className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">{s}</span>
        ))}
        {user.capabilities.map(c => (
          <span key={c} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">{c}</span>
        ))}
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Notifications</label>
      <div className="space-y-3">
        {[
          { label: 'New opportunity alerts', defaultOn: true },
          { label: 'Assignment confirmations', defaultOn: true },
          { label: 'Coverage radius reminders', defaultOn: false },
        ].map(item => (
          <label key={item.label} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            <input type="checkbox" defaultChecked={item.defaultOn} className="w-5 h-5 rounded accent-blue-600" />
          </label>
        ))}
      </div>
    </div>

    <button className="mt-5 w-full bg-slate-900 text-white py-3 rounded-[1.25rem] font-bold text-sm shadow-md hover:bg-blue-600 transition-colors active:scale-[0.98]">
      Save Changes
    </button>
  </div>
);

export const NurseAssignments = () => (
  <div className="p-8 h-full bg-slate-50/50 overflow-y-auto">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">My Assignments</h2>
    <div className="space-y-3">
      {MOCK_ASSIGNMENTS.map((as) => (
        <div key={as.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
          <div className="w-16 text-center shrink-0 border-r border-slate-100 pr-6 group-hover:border-blue-100 transition-colors">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{as.date.split(' ')[0]}</p>
            <p className="text-sm font-bold text-slate-800">{as.time}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{as.type}</p>
            <h4 className="font-bold text-slate-800 text-sm truncate">{as.trialName}</h4>
            <p className="text-xs text-slate-500 truncate">{as.address}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${as.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
            {as.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Admin Sub-Pages ---
export const AdminTrials = () => (
  <div className="p-8 space-y-6 h-full bg-slate-50/50 overflow-y-auto">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">Trial Management</h2>
      <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg shadow-blue-100/50 hover:bg-blue-700 transition-colors">New Trial</button>
    </div>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
          <tr><th className="px-6 py-4">Trial</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Locations</th><th className="px-6 py-4 text-right">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_TRIALS.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 font-semibold text-sm text-slate-800">{t.name}<p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{t.sponsor}</p></td>
              <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-100">{t.status}</span></td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-600">{t.addresses.length} Sites</td>
              <td className="px-6 py-4 text-right"><button className="text-blue-600 font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 px-3 py-1.5 rounded-lg">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const AdminNurseDirectory = () => (
  <div className="p-8 space-y-6 h-full bg-slate-50/50 overflow-y-auto">
    <h2 className="text-2xl font-bold text-slate-800">Nurse Directory</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_NURSES.map((n) => (
        <div key={n.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-slate-200">{n.name[0]}</div>
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${n.status === 'Available' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{n.status}</span>
          </div>
          <h4 className="font-bold text-slate-800 text-base mb-0.5">{n.name}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-wide">{n.license}</p>
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
            {n.capabilities.map((c: string) => <span key={c} className="text-[10px] font-semibold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">{c}</span>)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AdminSystemConfig = () => (
  <div className="p-8 space-y-8 h-full bg-slate-50/50 overflow-y-auto">
    <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2"><Settings size={16} className="text-blue-600"/> Matching Parameters</h3>
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Default Search Radius</label>
            <div className="flex items-center gap-3">
              <input type="number" defaultValue="50" className="w-24 border border-slate-200 bg-slate-50 p-2.5 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <span className="text-sm font-medium text-slate-500">Miles</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2"><History size={16} className="text-slate-400"/> Audit Logs</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-slate-500 font-medium">Matching Plan Confirmed</span>
            <span className="text-slate-400 ml-auto">12m ago</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-slate-500 font-medium">Nurse Sarah Jenkins Updated Address</span>
            <span className="text-slate-400 ml-auto">1h ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Shared Mapbox Styles ---
export const MapboxStyles = () => (
  <style>{`
    @media (min-width: 768px) {
      .header-collapsible { height: 64px !important; }
    }
    .custom-pin { background: none !important; border: none !important; }
    .custom-nurse-marker { background: none !important; border: none !important; }
    .recommended-nurse-marker { background: none !important; border: none !important; }
    .available-nurse-marker { background: none !important; border: none !important; }
    .limited-nurse-marker { background: none !important; border: none !important; }
    .unavailable-nurse-marker { background: none !important; border: none !important; }
    @keyframes addressPulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
      50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    }
    @keyframes nursePulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
      50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.1; }
    }
    @keyframes availablePulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
    }
    .mapboxgl-popup { z-index: 50; }
    .mapboxgl-popup-content {
      background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0;
      font-family: inherit; border-radius: 12px; padding: 0;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    }
    .mapboxgl-popup-tip { border-top-color: #ffffff; border-bottom-color: #ffffff; }
    .nurse-popup-enhanced .mapboxgl-popup-content {
      padding: 0; min-width: 220px; border-radius: 16px; overflow: hidden; border: none;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }
    .mapboxgl-ctrl-attrib { font-size: 10px; opacity: 0.5; display: none; }
    .mapboxgl-ctrl-bottom-right { display: none; }
    @keyframes subtle-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
      50% { transform: scale(1.01); box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
    }
  `}</style>
);
// End of shared module - no remaining code after MapboxStyles