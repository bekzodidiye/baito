import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface UseMapSetupProps {
  isPanelExpanded: boolean;
  isViloyatDashboard: boolean;
  onMapClick: () => void;
  mapType: 'xarita' | 'sputnik' | 'gibrid' | 'tungi' | 'relyef' | 'retro';
}

export const useMapSetup = ({
  isPanelExpanded,
  isViloyatDashboard,
  onMapClick,
  mapType,
}: UseMapSetupProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const regionsGroupRef = useRef<L.LayerGroup | null>(null);
  const userGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5.1);

  // Keep a mutable ref of map click to prevent re-binding map event listeners on state change
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Handle Map Type Layer switching dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile base layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    // Remove existing labels overlay if any
    if ((map as any)._labelLayer) {
      map.removeLayer((map as any)._labelLayer);
      delete (map as any)._labelLayer;
    }

    let baseLayer: L.TileLayer;
    let labelLayer: L.TileLayer | null = null;

    if (mapType === 'sputnik') {
      baseLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
    } else if (mapType === 'gibrid') {
      baseLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
      
      // Create custom pane if not exists to avoid intercepting clicks on region polygons
      let labelsPane = map.getPane('labelsPane');
      if (!labelsPane) {
        labelsPane = map.createPane('labelsPane');
        labelsPane.style.zIndex = '500';
        labelsPane.style.pointerEvents = 'none';
      }

      // Overlay clear text labels so they show above regions
      labelLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        pane: 'labelsPane',
        attribution: '&copy; Google Maps'
      });
    } else if (mapType === 'tungi') {
      baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      });
    } else if (mapType === 'relyef') {
      baseLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
    } else if (mapType === 'retro') {
      baseLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
    } else { // 'xarita'
      baseLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      });
    }

    baseLayer.addTo(map);
    tileLayerRef.current = baseLayer;

    if (labelLayer) {
      labelLayer.addTo(map);
      (map as any)._labelLayer = labelLayer;
    }
  }, [mapType, mapInstanceRef.current]);

  // Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [41.2, 64.0],
      zoom: 5.1,
      zoomControl: false,
      attributionControl: true
    });

    const defaultLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    }).addTo(map);
    tileLayerRef.current = defaultLayer;

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    map.on('click', () => {
      onMapClickRef.current();
    });

    mapInstanceRef.current = map;

    const regionsGroup = L.layerGroup().addTo(map);
    regionsGroupRef.current = regionsGroup;

    const markerGroup = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `
            <div class="flex items-center justify-center rounded-full text-white font-extrabold shadow-[0_4px_12px_rgba(0,6,102,0.3)] border-2 border-white select-none text-xs transition-transform duration-200 hover:scale-105" 
                 style="width: 36px; height: 36px; background-color: #000666; line-height: 32px;">
              ${count}
            </div>
          `,
          className: 'custom-cluster-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
      }
    }).addTo(map);
    markerGroupRef.current = markerGroup;

    const userGroup = L.layerGroup().addTo(map);
    userGroupRef.current = userGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerGroupRef.current = null;
        regionsGroupRef.current = null;
        userGroupRef.current = null;
      }
    };
  }, []);

  // Responsive size invalidation to avoid Leaflet gray rendering bugs
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();
    const t1 = setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 150);
    const t2 = setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 450);

    const handleResize = () => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isViloyatDashboard, isPanelExpanded]);

  return {
    mapContainerRef,
    mapInstanceRef,
    markerGroupRef,
    regionsGroupRef,
    userGroupRef,
    tileLayerRef,
    zoomLevel,
    setZoomLevel,
  };
};
