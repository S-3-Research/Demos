"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

// Re-export most components from shared.tsx
export {
  SidebarItem,
  MapboxStyles,
  AdminTrials,
  AdminSystemConfig,
  type Address,
  type Nurse,
  type Trial,
  type PathItem,
  MOCK_ASSIGNMENTS,
  MOCK_NURSE,
  MOCK_NURSES,
  MOCK_OPPORTUNITY
} from './shared';

// Modified MOCK_TRIALS for v2 - no assignment relationships
export const MOCK_TRIALS_V2 = [
  {
    id: 't1',
    name: 'AD-Early-Detection-Phase2',
    sponsor: 'BioGen Therapeutics',
    status: 'Matching',
    requirements: { nurseCount: 3, capabilities: ['Phlebotomy'] },
    startDate: '2024-05-12',
    addresses: [
      { id: 'a1', type: 'Patient Home', address: '123 Queens Blvd, NY', lat: 40.7282, lng: -73.8448, assignedNurseId: null },
      { id: 'a2', type: 'Trial Site', address: 'Mount Sinai Hospital, NY', lat: 40.7895, lng: -73.9482, assignedNurseId: null },
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
    addresses: [{ id: 'a4', type: 'Trial Site', address: 'MSKCC, New York', lat: 40.7641, lng: -73.9554, assignedNurseId: null }]
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

// Modified MOCK_NURSES for v2 - all active by default
export const MOCK_NURSES_V2 = [
  { id: 'n1', name: 'Sarah Jenkins, RN', status: 'Active', distance: '1.2 mi', rating: 4.8, capabilities: ['Phlebotomy', 'Vitals'], specialty: ['Alzheimer\'s'], lat: 40.7128, lng: -74.0060, license: 'RN-99201', joined: 'Oct 2023', address: '725 5th Ave, New York, NY', radius: 25 },
  { id: 'n2', name: 'Michael Chen, NP', status: 'Active', distance: '3.5 mi', rating: 4.9, capabilities: ['ECG', 'Wound Care'], specialty: ['Oncology'], lat: 40.7300, lng: -73.9352, license: 'RN-88312', joined: 'Nov 2023', address: '123 Main St, NY', radius: 15 },
  { id: 'n3', name: 'Elena Rodriguez, RN', status: 'Active', distance: '0.8 mi', rating: 4.7, capabilities: ['Home Visit', 'Infusion'], specialty: ['Pediatrics'], lat: 40.7580, lng: -73.9855, license: 'RN-77210', joined: 'Jan 2024', address: '456 Broadway, NY', radius: 30 },
  { id: 'n4', name: 'James Wilson, RN', status: 'Inactive', distance: '5.5 mi', rating: 4.5, capabilities: ['Assessment'], specialty: ['Cardiology'], lat: 40.6782, lng: -73.9442, license: 'RN-66123', joined: 'Sep 2023', address: '789 2nd Ave, NY', radius: 20 },
  { id: 'n5', name: 'David Smith, LPN', status: 'Active', distance: '2.1 mi', rating: 4.6, capabilities: ['Phlebotomy'], specialty: ['Diabetes'], lat: 40.7000, lng: -73.9200, license: 'RN-55412', joined: 'Dec 2023', address: '101 1st Ave, NY', radius: 25 },
  { id: 'n6', name: 'Jennifer Park, RN', status: 'Active', distance: '1.8 mi', rating: 4.9, capabilities: ['Vitals', 'ECG'], specialty: ['Geriatrics'], lat: 40.7489, lng: -73.9680, license: 'RN-44521', joined: 'Aug 2023', address: '234 Park Ave, NY', radius: 20 },
  { id: 'n7', name: 'Robert Martinez, RN', status: 'Active', distance: '2.3 mi', rating: 4.7, capabilities: ['Home Visit', 'Phlebotomy'], specialty: ['General'], lat: 40.7200, lng: -73.9950, license: 'RN-33410', joined: 'Jan 2024', address: '567 3rd Ave, NY', radius: 30 },
  { id: 'n8', name: 'Lisa Thompson, NP', status: 'Active', distance: '3.2 mi', rating: 4.8, capabilities: ['Assessment', 'Wound Care'], specialty: ['Oncology'], lat: 40.7450, lng: -73.9200, license: 'RN-22398', joined: 'Sep 2023', address: '890 Lexington Ave, NY', radius: 15 },
  { id: 'n9', name: 'Kevin Lee, RN', status: 'Active', distance: '1.5 mi', rating: 4.6, capabilities: ['Vitals', 'Infusion'], specialty: ['Pediatrics'], lat: 40.7350, lng: -74.0100, license: 'RN-11287', joined: 'Nov 2023', address: '123 Hudson St, NY', radius: 25 },
  { id: 'n10', name: 'Amanda White, RN', status: 'Active', distance: '2.8 mi', rating: 4.9, capabilities: ['ECG', 'Phlebotomy'], specialty: ['Cardiology'], lat: 40.7080, lng: -73.9600, license: 'RN-00176', joined: 'Oct 2023', address: '456 East 14th St, NY', radius: 20 },
  { id: 'n11', name: 'Brian Garcia, LPN', status: 'Active', distance: '1.9 mi', rating: 4.5, capabilities: ['Vitals'], specialty: ['Diabetes'], lat: 40.7600, lng: -73.9700, license: 'RN-99065', joined: 'Dec 2023', address: '789 Amsterdam Ave, NY', radius: 25 },
  { id: 'n12', name: 'Maria Santos, RN', status: 'Active', distance: '3.8 mi', rating: 4.7, capabilities: ['Home Visit', 'Assessment'], specialty: ['Geriatrics'], lat: 40.6900, lng: -73.9800, license: 'RN-88054', joined: 'Aug 2023', address: '234 Atlantic Ave, Brooklyn', radius: 15 },
  { id: 'n13', name: 'Daniel Kim, NP', status: 'Active', distance: '2.2 mi', rating: 4.8, capabilities: ['Infusion', 'Wound Care'], specialty: ['Oncology'], lat: 40.7550, lng: -74.0000, license: 'RN-77043', joined: 'Jan 2024', address: '567 West 57th St, NY', radius: 30 },
  { id: 'n14', name: 'Patricia Brown, RN', status: 'Active', distance: '1.6 mi', rating: 4.6, capabilities: ['Phlebotomy', 'ECG'], specialty: ['General'], lat: 40.7250, lng: -73.9500, license: 'RN-66032', joined: 'Sep 2023', address: '890 Queens Blvd, Queens', radius: 20 },
  { id: 'n15', name: 'Thomas Anderson, RN', status: 'Active', distance: '2.5 mi', rating: 4.9, capabilities: ['Vitals', 'Assessment'], specialty: ['Alzheimer\'s'], lat: 40.7400, lng: -73.9900, license: 'RN-55021', joined: 'Nov 2023', address: '123 Madison Ave, NY', radius: 25 },
  { id: 'n16', name: 'Jessica Taylor, RN', status: 'Active', distance: '3.1 mi', rating: 4.7, capabilities: ['Home Visit'], specialty: ['Pediatrics'], lat: 40.7150, lng: -74.0150, license: 'RN-44010', joined: 'Oct 2023', address: '456 Greenwich St, NY', radius: 15 },
  { id: 'n17', name: 'Christopher Moore, LPN', status: 'Active', distance: '1.3 mi', rating: 4.5, capabilities: ['Vitals', 'Phlebotomy'], specialty: ['Diabetes'], lat: 40.7480, lng: -73.9550, license: 'RN-33009', joined: 'Dec 2023', address: '789 Lexington Ave, NY', radius: 20 },
  { id: 'n18', name: 'Nancy Jackson, RN', status: 'Active', distance: '2.7 mi', rating: 4.8, capabilities: ['ECG', 'Infusion'], specialty: ['Cardiology'], lat: 40.7320, lng: -73.9750, license: 'RN-22008', joined: 'Aug 2023', address: '234 5th Ave, NY', radius: 30 },
];

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  MapPin, Users, Search, Layers,
  X, Zap, ChevronDown, CheckCircle, Phone, ShieldCheck
} from 'lucide-react';
import { ActionCard, NurseCoverage, NurseSettings, MOCK_NURSE as _MOCK_NURSE } from './shared';

// V2 SidebarItem with collapse support
export const SidebarItemV2 = ({ icon: Icon, label, active, onClick, collapsed }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void; collapsed: boolean }) => (
  <div 
    onClick={onClick} 
    title={collapsed ? label : undefined}
    className={`flex items-center cursor-pointer transition-all duration-200 group ${
      collapsed 
        ? `justify-center p-2 rounded-xl ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'}` 
        : `gap-3 px-4 py-3 mx-2 rounded-xl ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'}`
    }`}
  >
    <Icon size={collapsed ? 20 : 18} className={`shrink-0 ${active ? 'text-white' : collapsed ? '' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}`} />
    {!collapsed && <span className={`text-sm whitespace-nowrap ${active ? 'font-semibold' : 'font-medium group-hover:font-semibold'}`}>{String(label)}</span>}
  </div>
);

// ========== Standalone InteractiveMapV2 ==========
// Fully independent map component — no dependency on shared.tsx InteractiveMap

type MapV2Props = {
  addresses?: any[];
  nurses?: any[];
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string) => void;
  viewMode?: string;
  customCenter?: { lat: number; lng: number } | null;
  customRadius?: number | null;
  showNursesOnMap?: boolean;
  recommendedNurses?: string[];
};

export const InteractiveMapV2 = ({
  addresses = [],
  nurses = [],
  selectedAddressId,
  onSelectAddress,
  viewMode = 'match',
  showNursesOnMap = true,
  recommendedNurses = [],
}: MapV2Props) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const addrCacheRef = useRef<Map<string, any>>(new Map());
  const nurseCacheRef = useRef<Map<string, any>>(new Map());
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // --- Load Mapbox ---
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const load = () => {
      if (window.mapboxgl) { setStatus('ready'); return; }
      // CSS
      if (!document.getElementById('mapbox-css')) {
        const link = document.createElement('link');
        link.id = 'mapbox-css'; link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        document.head.appendChild(link);
      }
      const existing = document.getElementById('mapbox-js');
      if (existing) {
        timer = setInterval(() => { if (window.mapboxgl) { clearInterval(timer!); setStatus('ready'); } }, 100);
      } else {
        const s = document.createElement('script');
        s.id = 'mapbox-js'; s.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'; s.async = true;
        s.onload = () => { timer = setInterval(() => { if (window.mapboxgl) { clearInterval(timer!); setStatus('ready'); } }, 100); };
        s.onerror = () => setStatus('error');
        document.head.appendChild(s);
      }
    };
    load();
    return () => { if (timer) clearInterval(timer); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  // --- Address icon helpers ---
  const addrIcons: Record<string, string> = {
    home: '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    hospital: '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>',
    location: '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>',
  };
  const addrConfig: Record<string, { color: string; icon: string }> = {
    'Patient Home': { color: '#3b82f6', icon: 'home' },
    'Trial Site': { color: '#8b5cf6', icon: 'hospital' },
    'Candidate Site': { color: '#f59e0b', icon: 'location' },
  };

  // --- Helper: remove layers/sources safely ---
  const removeLayers = useCallback((ids: string[]) => {
    if (!mapRef.current) return;
    ids.forEach(id => { if (mapRef.current.getLayer(id)) mapRef.current.removeLayer(id); });
  }, []);
  const removeSource = useCallback((id: string) => {
    if (!mapRef.current) return;
    if (mapRef.current.getSource(id)) mapRef.current.removeSource(id);
  }, []);

  // --- Update address markers ---
  const updateAddressMarkers = useCallback(() => {
    const mbgl = window.mapboxgl;
    if (!mbgl || !mapRef.current) return;
    removeLayers(['selected-circle-outline', 'selected-circle']);
    removeSource('selected');

    const currentIds = new Set(addresses.map(a => a.id));
    const cache = addrCacheRef.current;
    cache.forEach((m, id) => { if (!currentIds.has(id)) { m.remove(); cache.delete(id); } });

    addresses.forEach(addr => {
      const isActive = selectedAddressId === addr.id;
      const isOther = !!(selectedAddressId && selectedAddressId !== addr.id);
      const cached = cache.get(addr.id);
      const needsUpdate = !cached || cached._isActive !== isActive || cached._isOther !== isOther;
      if (!needsUpdate) return;
      if (cached) { cached.remove(); cache.delete(addr.id); }

      let cfg = addrConfig[addr.type] || addrConfig['Candidate Site'];
      if (isOther) cfg = { ...cfg, color: '#94a3b8' };
      const sz = isActive ? 42 : 32;
      const iconSvg = addrIcons[cfg.icon] || addrIcons.location;

      const el = document.createElement('div');
      el.style.cursor = 'pointer';
      if (isActive) {
        el.innerHTML = `
          <div style="position:absolute;top:50%;left:50%;width:${sz + 16}px;height:${sz + 16}px;transform:translate(-50%,-50%);border:3px solid ${cfg.color};border-radius:50%;opacity:0.6;animation:addressPulse 2s ease-out infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;width:${sz}px;height:${sz}px;background:${cfg.color};border-radius:16px;border:4px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,0.25);">${iconSvg}</div>`;
      } else {
        el.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${sz}px;height:${sz}px;background:${cfg.color};border-radius:12px;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.2);">${iconSvg}</div>`;
      }
      el.addEventListener('click', () => onSelectAddress?.(addr.id));
      const marker = new mbgl.Marker({ element: el, anchor: 'center' }).setLngLat([addr.lng, addr.lat]).addTo(mapRef.current!);
      marker._isActive = isActive; marker._isOther = isOther;
      cache.set(addr.id, marker);
      markersRef.current.push(marker);
    });

    // Selected address circle
    const activeAddr = addresses.find(a => a.id === selectedAddressId);
    if (activeAddr) {
      const cfg = addrConfig[activeAddr.type] || addrConfig['Candidate Site'];
      const radiusM = 3000;
      const createCircle = (c: [number, number], r: number, pts = 64) => {
        const coords = [];
        const dx = r / (111320 * Math.cos(c[1] * Math.PI / 180)), dy = r / 110574;
        for (let i = 0; i <= pts; i++) { const t = (i / pts) * 2 * Math.PI; coords.push([c[0] + dx * Math.cos(t), c[1] + dy * Math.sin(t)]); }
        return coords;
      };
      mapRef.current.addSource('selected', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [createCircle([activeAddr.lng, activeAddr.lat], radiusM)] } } });
      mapRef.current.addLayer({ id: 'selected-circle', type: 'fill', source: 'selected', paint: { 'fill-color': cfg.color, 'fill-opacity': 0.06 } });
      mapRef.current.addLayer({ id: 'selected-circle-outline', type: 'line', source: 'selected', paint: { 'line-color': cfg.color, 'line-width': 2, 'line-dasharray': [3, 3] } });
      mapRef.current.flyTo({ center: [activeAddr.lng, activeAddr.lat], zoom: 12, duration: 1000 });
    }
  }, [addresses, selectedAddressId, onSelectAddress, removeLayers, removeSource]);

  // --- Update nurse markers ---
  const updateNurseMarkers = useCallback(() => {
    const mbgl = window.mapboxgl;
    if (!mbgl || !mapRef.current) return;
    const cache = nurseCacheRef.current;
    const currentIds = new Set(nurses.map(n => n.id));

    // Remove gone nurses
    cache.forEach((m, id) => { if (!currentIds.has(id)) { m.remove(); cache.delete(id); } });

    // Hide all if showNursesOnMap is false or not match mode
    if (!showNursesOnMap || viewMode !== 'match') {
      cache.forEach((m, id) => { m.remove(); cache.delete(id); });
      return;
    }

    nurses.forEach(n => {
      const isRecommended = recommendedNurses.includes(n.id);
      const isActive = n.status === 'Active';
      const cached = cache.get(n.id);
      const needsUpdate = !cached || cached._isRec !== isRecommended || cached._st !== n.status;
      if (!needsUpdate) return;
      if (cached) { cached.remove(); cache.delete(n.id); }

      const el = document.createElement('div');
      el.style.position = 'relative';
      el.style.cursor = 'pointer';

      // Popup HTML
      const popupHTML = `
        <div style="padding:12px;font-family:ui-sans-serif,system-ui,-apple-system;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:${isRecommended ? '#3b82f6' : isActive ? '#22c55e' : '#94a3b8'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-weight:700;color:white;font-size:14px;">${n.name[0]}</span>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:14px;color:#1e293b;">${n.license}</div>
              <div style="font-size:11px;color:${isActive ? '#22c55e' : '#94a3b8'};font-weight:600;display:flex;align-items:center;gap:4px;">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:currentColor;"></span>
                ${isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #f1f5f9;font-size:10px;color:#64748b;">${n.license}</div>
        </div>`;

      if (isRecommended) {
        el.innerHTML = `
          <div style="position:absolute;top:50%;left:50%;width:40px;height:40px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(59,130,246,0.3) 0%,rgba(59,130,246,0) 70%);border-radius:50%;animation:nursePulse 2s ease-in-out infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;background:#3b82f6;width:32px;height:32px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>`;
      } else if (isActive) {
        el.innerHTML = `
          <div style="position:absolute;top:50%;left:50%;width:22px;height:22px;transform:translate(-50%,-50%);border:1.5px solid #22c55e;border-radius:50%;opacity:0.5;animation:availablePulse 3s ease-in-out infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;width:12px;height:12px;background:#22c55e;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.1);"></div>`;
      } else {
        el.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:#94a3b8;border-radius:50%;border:1.5px solid white;opacity:0.6;"></div>`;
      }

      const popup = new mbgl.Popup({ offset: isRecommended ? 20 : 12, className: 'nurse-popup-enhanced', closeButton: false }).setHTML(popupHTML);
      const marker: any = new mbgl.Marker({ element: el, anchor: 'center' }).setLngLat([n.lng, n.lat]).setPopup(popup).addTo(mapRef.current!);
      marker._isRec = isRecommended; marker._st = n.status;
      cache.set(n.id, marker);
      markersRef.current.push(marker);
    });
  }, [nurses, showNursesOnMap, viewMode, recommendedNurses]);

  // --- Update heatmap ---
  const updateHeatmap = useCallback(() => {
    if (!mapRef.current) return;
    removeLayers(['nurse-heatmap']);
    removeSource('nurses-heat');
    if (viewMode !== 'heatmap') return;

    const data = {
      type: 'FeatureCollection',
      features: nurses.map(n => ({
        type: 'Feature',
        properties: { intensity: n.status === 'Active' ? 1.5 : 0.4 },
        geometry: { type: 'Point', coordinates: [n.lng, n.lat] }
      }))
    };
    mapRef.current.addSource('nurses-heat', { type: 'geojson', data });
    mapRef.current.addLayer({
      id: 'nurse-heatmap', type: 'heatmap', source: 'nurses-heat',
      paint: {
        'heatmap-weight': ['get', 'intensity'], 'heatmap-intensity': 1.2,
        'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(59,130,246,0)', 0.2, '#3b82f6', 0.4, '#22c55e', 0.6, '#fbbf24', 0.8, '#f87171', 1, '#dc2626'],
        'heatmap-radius': 40, 'heatmap-opacity': 0.7
      }
    });
  }, [viewMode, nurses, removeLayers, removeSource]);

  // --- Init map ---
  useEffect(() => {
    if (status !== 'ready' || !mapDivRef.current || mapRef.current) return;
    const mbgl = window.mapboxgl;
    mbgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    const map = new mbgl.Map({ container: mapDivRef.current, style: 'mapbox://styles/mapbox/light-v11', center: [-74.006, 40.7128], zoom: 11 });
    map.on('load', () => {
      mapRef.current = map;
      updateAddressMarkers();
      updateNurseMarkers();
      updateHeatmap();
    });
  }, [status, updateAddressMarkers, updateNurseMarkers, updateHeatmap]);

  // --- React to prop changes ---
  useEffect(() => { if (status === 'ready' && mapRef.current?.isStyleLoaded()) updateAddressMarkers(); }, [status, updateAddressMarkers]);
  useEffect(() => { if (status === 'ready' && mapRef.current) updateNurseMarkers(); }, [status, updateNurseMarkers]);
  useEffect(() => { if (status === 'ready' && mapRef.current?.isStyleLoaded()) updateHeatmap(); }, [status, updateHeatmap]);

  // --- Resize observer ---
  useEffect(() => {
    if (!mapDivRef.current) return;
    let t: NodeJS.Timeout;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => mapRef.current?.resize(), 100); });
    ro.observe(mapDivRef.current);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);

  return (
    <div className="w-full h-full bg-slate-50 relative border-l border-slate-200">
      <div ref={mapDivRef} className="w-full h-full z-0" />

      {/* Active nurses count card — centered on visible map area (offset when nurse panel is open) */}
      <div 
        className="absolute top-5 z-10 bg-emerald-50/90 backdrop-blur-sm border border-emerald-200/60 rounded-xl px-5 py-2.5 shadow-sm flex items-center gap-2.5 transition-all duration-300"
        style={{ left: selectedAddressId ? 'calc(50% - 180px)' : '50%', transform: 'translateX(-50%)' }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[14px] font-bold text-emerald-800">{nurses.filter(n => n.status === 'Active').length}</span>
        <span className="text-[14px] text-emerald-600 font-bold">active within 50 miles radius</span>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
        <button onClick={() => mapRef.current?.zoomIn()} className="w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-slate-700 hover:text-blue-600 font-semibold text-xl active:scale-95 border border-slate-100" title="Zoom In">+</button>
        <button onClick={() => mapRef.current?.zoomOut()} className="w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-slate-700 hover:text-blue-600 font-semibold text-xl active:scale-95 border border-slate-100" title="Zoom Out">−</button>
        <button onClick={() => mapRef.current?.flyTo({ center: [-74.006, 40.7128], zoom: 11, duration: 1000 })} className="w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-slate-700 hover:text-blue-600 active:scale-95 border border-slate-100" title="Reset View">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        </button>
      </div>

      {/* Location-only legend — always visible */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-5 max-w-xs transition-opacity duration-300 hover:opacity-100 opacity-90">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Map Legend</h3>
        <div>
          <p className="text-[10px] font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
            <MapPin size={10} className="text-blue-600"/>
            Locations
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-500 border border-blue-600 shadow-sm flex items-center justify-center scale-90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              </div>
              <span className="text-xs font-semibold text-slate-600">Patient Home</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-500 border border-purple-600 shadow-sm flex items-center justify-center scale-90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
              </div>
              <span className="text-xs font-semibold text-slate-600">Trial Site</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500 border border-amber-600 shadow-sm flex items-center justify-center scale-90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              </div>
              <span className="text-xs font-semibold text-slate-600">Candidate Site</span>
            </div>
          </div>
        </div>
      </div>

      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-400">Loading Map Engine...</p>
        </div>
      )}
    </div>
  );
};

// Modified AdminMatchWorkspaceV2 - no assignment relationship
export const AdminMatchWorkspaceV2 = ({ trials, setTrials, selectedAddrId, setSelectedAddrId, viewMode, setViewMode, selectedTrialId, setSelectedTrialId }: {
  trials: any[];
  setTrials: (trials: any[] | ((prev: any[]) => any[])) => void;
  selectedAddrId: string;
  setSelectedAddrId: (id: string) => void;
  viewMode: string;
  setViewMode: (mode: string | ((v: string) => string)) => void;
  selectedTrialId: string;
  setSelectedTrialId: (id: string) => void;
}) => {
  const [showNursesLayer, setShowNursesLayer] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const trial = trials.find(t => t.id === selectedTrialId) || trials[0];
  const activeAddr = selectedAddrId 
    ? trial.addresses.find((a: any) => a.id === selectedAddrId) || null
    : null;
  
  // Filter trials based on search query
  const filteredTrials = trials.filter((t: any) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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
  
  // Get recommended nurses (closest 3 active nurses to the selected address)
  const recommendedNurseIds = useMemo(() => {
    if (!activeAddr) return [];
    
    // Calculate distance for each active nurse
    const nursesWithDistance = MOCK_NURSES_V2
      .filter(n => n.status === 'Active')
      .map(nurse => ({
        id: nurse.id,
        name: nurse.name,
        distance: calculateDistance(activeAddr.lat, activeAddr.lng, nurse.lat, nurse.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    return nursesWithDistance.map(n => n.id);
  }, [activeAddr]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm z-[40]">
        <div className="flex gap-6">
          <div className="relative z-[40]" ref={dropdownRef}>
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
                    filteredTrials.map((t: any) => (
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
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar ml-4 items-center">
          <button onClick={() => setShowNursesLayer(!showNursesLayer)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap flex-shrink-0 ${showNursesLayer ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Users size={14} /> {showNursesLayer ? 'Hide Nurses' : 'Show Nurses'}
          </button>
          <button onClick={() => setViewMode((v: string) => v === 'match' ? 'heatmap' : 'match')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap flex-shrink-0 ${viewMode === 'heatmap' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Layers size={14} /> {viewMode === 'heatmap' ? 'Hide Density' : 'Density Analysis'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <MapPin size={14} className="text-blue-600" />
              Locations ({trial.addresses.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {trial.addresses.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MapPin size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No addresses yet</p>
              </div>
            ) : (
              trial.addresses.map((addr: any) => (
              <div key={addr.id} onClick={() => setSelectedAddrId(addr.id)} className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${selectedAddrId === addr.id ? 'border-blue-500 bg-white shadow-md ring-1 ring-blue-500/10' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${addr.type === 'Patient Home' ? 'bg-blue-50 text-blue-700' : addr.type === 'Trial Site' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'}`}>{String(addr.type)}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 line-clamp-2 leading-relaxed mb-3">{String(addr.address)}</p>
              </div>
            ))
            )}
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <InteractiveMapV2 
              addresses={trial.addresses} 
              nurses={MOCK_NURSES_V2} 
              selectedAddressId={selectedAddrId} 
              onSelectAddress={setSelectedAddrId} 
              viewMode={viewMode} 
              customCenter={null} 
              customRadius={null}
              showNursesOnMap={showNursesLayer}
              recommendedNurses={recommendedNurseIds}
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
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide flex items-center gap-2"><Users size={14} className="text-blue-600" /> Nurse List</h3>
                <button 
                  onClick={() => setSelectedAddrId('')}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-md"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate pl-6">Location: {activeAddr ? String(activeAddr.address) : 'No address selected'}</p>
            </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {!activeAddr ? (
              <div className="text-center py-12 text-slate-400">
                <Users size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No address selected</p>
                <p className="text-xs mt-1">Select an address to see nurse list</p>
              </div>
            ) : (
              MOCK_NURSES_V2
                .map(nurse => ({
                  ...nurse,
                  calculatedDistance: calculateDistance(activeAddr.lat, activeAddr.lng, nurse.lat, nurse.lng)
                }))
                .sort((a, b) => {
                  // Active first
                  if (a.status === 'Active' && b.status !== 'Active') return -1;
                  if (a.status !== 'Active' && b.status === 'Active') return 1;
                  
                  // Then by distance
                  return a.calculatedDistance - b.calculatedDistance;
                })
                .map(nurse => {
              const isActive = nurse.status === 'Active';
              const isRecommended = recommendedNurseIds.includes(nurse.id);
              
              return (
                <div 
                  key={nurse.id} 
                  id={`nurse-card-${nurse.id}`}
                  className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden bg-white ${
                    isRecommended 
                      ? 'border-blue-300 shadow-sm' 
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  {isRecommended && (
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
                        {isRecommended && <span className="text-blue-600 font-bold text-[10px]">• Top Match</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {nurse.capabilities.map((c: string) => <span key={c} className="text-[9px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">{String(c)}</span>)}
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-emerald-50/80 border border-emerald-200/60' 
                      : 'bg-slate-50 border border-slate-150'
                  }`}>
                    {isActive ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[14px] font-bold text-emerald-700 tracking-wide">Active</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex rounded-full h-2 w-2 bg-slate-300"></span>
                        <span className="text-[10px] font-medium text-slate-400 tracking-wide">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

// ========== NursePortalV2 — V2 nurse portal ==========
export const NursePortalV2 = ({ user, currentPage, setCurrentPage }: { user: any; currentPage: string; setCurrentPage: (p: string) => void }) => {
  const [lastAvailabilityConfirm, setLastAvailabilityConfirm] = useState(_MOCK_NURSE.lastAvailabilityConfirm);
  const [lastRadiusConfirm, setLastRadiusConfirm] = useState(_MOCK_NURSE.lastRadiusConfirm);
  const [expiryDays, setExpiryDays] = useState(_MOCK_NURSE.expiryDays);

  if (currentPage === 'Coverage') return (
    <NurseCoverage
      user={user}
      onSave={() => { setLastRadiusConfirm(0); setCurrentPage('Dashboard'); }}
    />
  );
  if (currentPage === 'Settings') return <NurseSettings user={user} />;
  return (
    <NurseDashboardV2
      user={user}
      setCurrentPage={setCurrentPage}
      lastAvailabilityConfirm={lastAvailabilityConfirm}
      lastRadiusConfirm={lastRadiusConfirm}
      expiryDays={expiryDays}
      onConfirmAvailability={() => { setLastAvailabilityConfirm(0); setExpiryDays(30); }}
    />
  );
};

export const NurseDashboardV2 = ({ user, setCurrentPage, lastAvailabilityConfirm, lastRadiusConfirm, expiryDays, onConfirmAvailability }: {
  user: any;
  setCurrentPage: (p: string) => void;
  lastAvailabilityConfirm: number;
  lastRadiusConfirm: number;
  expiryDays: number;
  onConfirmAvailability: () => void;
}) => (
  <div className="flex flex-col h-full px-4 pt-3 pb-5 md:pt-6 md:pb-8 md:max-w-xl md:mx-auto md:w-full">

    {/* ─ 1. Active Status Card — light green style ─ */}
    <div className="flex-1 min-h-0 bg-emerald-50/60 rounded-[1.75rem] border border-emerald-200/50 shadow-sm px-6 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-3">Your Readiness Status</p>
      <div className="inline-flex items-center gap-2.5 mb-2">
        <span className="relative flex h-3.5 w-3.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </span>
        <span className="text-2xl font-black text-emerald-800 tracking-tight">Active</span>
      </div>
      <p className="text-xs font-semibold text-emerald-600/70">Expires in {expiryDays} days</p>
    </div>

    {/* ─ Bottom group: action sliders ─ */}
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
      <ActionCard
        icon={ShieldCheck}
        title="Training & License Verified"
        lastUpdate={0}
        accentColor="#059669"
        accentBg="#059669"
        confirmedLabel="Verified ✓"
        onConfirm={() => {}}
      />
      <ActionCard
        icon={Phone}
        title="Contact Information"
        lastUpdate={0}
        accentColor="#7c3aed"
        accentBg="#7c3aed"
        confirmedLabel="Updated"
        onConfirm={() => {}}
      />

    </div>

  </div>
);
