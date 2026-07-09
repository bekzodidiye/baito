import { Job } from '../types';
import { UZBEKISTAN_REGIONS } from './mapConstants';

// Map custom percentages (0-100) to real Tashkent coordinates
export const getLatLng = (job: Job) => {
  const x = job.coordinates ? job.coordinates.x : 50;
  const y = job.coordinates ? job.coordinates.y : 50;
  // Bounding box for Tashkent
  const lng = 69.15 + (x / 100) * (69.35 - 69.15);
  const lat = 41.38 - (y / 100) * (41.38 - 41.22);
  return { lat, lng };
};

export const getDistrictColor = (name: string): string => {
  const clean = name.toLowerCase().replace(/['`’‘-]/g, '').trim();
  if (clean.includes('peshku')) return '#b91c1c'; // Red/burgundy
  if (clean.includes('romitan')) return '#15803d'; // Green
  if (clean.includes('shofirkon')) return '#1d4ed8'; // Blue
  if (clean.includes('gijduvon') || clean.includes('g\'ijduvon')) return '#c2410c'; // Orange
  if (clean.includes('jondor')) return '#0f766e'; // Light teal
  if (clean.includes('qorakol') || clean.includes('qorako\'l')) return '#7e22ce'; // Purple
  if (clean.includes('olot')) return '#991b1b'; // Darker red/terracotta
  if (clean.includes('qorovulbozor')) return '#0369a1'; // Blue/cyan
  if (clean.includes('vobkent')) return '#047857'; // Sage/emerald green
  if (clean.includes('kogon')) return '#be185d'; // Light magenta/pink
  if (clean.includes('buxoro') || clean.includes('bukhara')) return '#4338ca'; // Indigo
  
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#d946ef', '#ec4899', '#14b8a6', '#84cc16'
  ];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const getRegionStats = (regionId: string) => {
  const cleanId = regionId.toLowerCase();
  if (cleanId.includes('buxoro') || cleanId.includes('buxara')) {
    return {
      total: 133,
      checked: 85,
      completed: 55,
      percent: 41
    };
  }
  if (cleanId.includes('toshkent') && !cleanId.includes('shahr')) {
    return {
      total: 203,
      checked: 130,
      completed: 83,
      percent: 41
    };
  }
  let total = 120;
  if (cleanId.includes('samarqand')) total = 185;
  else if (cleanId.includes('fargona')) total = 145;
  else if (cleanId.includes('andijon')) total = 110;
  else if (cleanId.includes('namangan')) total = 115;
  else if (cleanId.includes('qashqadaryo')) total = 135;
  else if (cleanId.includes('surxondaryo')) total = 95;
  else if (cleanId.includes('jizzax')) total = 75;
  else if (cleanId.includes('sirdaryo')) total = 50;
  else if (cleanId.includes('navoiy')) total = 65;
  else if (cleanId.includes('xorazm')) total = 85;
  else if (cleanId.includes('qoraqalpogiston')) total = 105;

  const completed = Math.round(total * 0.41);
  const checked = Math.round(total * 0.64);
  return {
    total,
    checked,
    completed,
    percent: 41
  };
};

export const areDistrictNamesEqual = (name1: string, name2: string): boolean => {
  if (!name1 || !name2) return false;
  
  const lower1 = name1.toLowerCase();
  const lower2 = name2.toLowerCase();
  
  const isRegion1 = lower1.includes('viloyati') || lower1.includes('respublikasi');
  const isRegion2 = lower2.includes('viloyati') || lower2.includes('respublikasi');
  
  const isCity1 = lower1.includes('shahri') || lower1.includes('city');
  const isCity2 = lower2.includes('shahri') || lower2.includes('city');
  
  const isDistrict1 = lower1.includes('tumani') || lower1.includes('district');
  const isDistrict2 = lower2.includes('tumani') || lower2.includes('district');

  // A city/district and a region (viloyati) should not be equal
  if ((isRegion1 && (isCity2 || isDistrict2)) || (isRegion2 && (isCity1 || isDistrict1))) {
    return false;
  }
  
  // A city (shahri) and a district (tumani) with similar base names should not be equal
  if ((isCity1 && isDistrict2) || (isDistrict1 && isCity2)) {
    return false;
  }

  const normalize = (s: string) => {
    return s.toLowerCase()
      .replace(/tumani/g, '')
      .replace(/shahri/g, '')
      .replace(/city/g, '')
      .replace(/region/g, '')
      .replace(/viloyati/g, '')
      .replace(/prov/g, '')
      .replace(/province/g, '')
      .replace(/['’'`‘\s-]/g, '') // remove quotes, spaces, hyphens
      .replace(/o'/g, 'o')
      .replace(/g'/g, 'g')
      .replace(/sh/g, 's')
      .replace(/ch/g, 'c')
      .replace(/kh/g, 'x')
      .replace(/x/g, 'h') // unify x and h
      .replace(/q/g, 'k') // unify q and k
      .replace(/o/g, 'a') // unify o and a for spelling variants like Yunusobod vs Yunusabad, Chilonzor vs Chilanzar
      .trim();
  };

  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  return n1 === n2 || n1.includes(n2) || n2.includes(n1);
};

export const mapFeatureToRegionId = (adm1En: string): string => {
  const name = adm1En.toLowerCase();
  if (name.includes('karakalpakstan')) return "Qoraqalpog'iston";
  if (name.includes('khorezm')) return "Xorazm";
  if (name.includes('navoi')) return "Navoiy";
  if (name.includes('bukhara')) return "Buxoro";
  if (name.includes('samarkand')) return "Samarqand";
  if (name.includes('kashkadarya')) return "Qashqadaryo";
  if (name.includes('surkhandarya')) return "Surxondaryo";
  if (name.includes('jizzakh')) return "Jizzax";
  if (name.includes('syrdarya')) return "Sirdaryo";
  if (name.includes('tashkent')) return "Toshkent";
  if (name.includes('namangan')) return "Namangan";
  if (name.includes('fergana')) return "Farg'ona";
  if (name.includes('andijan')) return "Andijon";
  return "";
};

export const isRegionName = (locationName: string): boolean => {
  if (!locationName) return false;
  const lower = locationName.toLowerCase();
  
  // Only "Toshkent shahri" is a region. Other city names like "Samarqand shahri" are districts.
  if (lower.includes('shahri') && !lower.includes('toshkent')) {
    return false;
  }
  
  return UZBEKISTAN_REGIONS.some(r => {
    const rId = r.id.toLowerCase();
    const rName = r.name.toLowerCase();
    return lower === rId || 
           lower === rName || 
           lower === `${rId} viloyati` || 
           (rId === 'toshkent' && lower === 'toshkent shahri') ||
           lower === `${rId} respublikasi` ||
           lower.replace(/['’'`‘]/g, '') === rId.replace(/['’'`‘]/g, '') ||
           lower.replace(/['’'`‘]/g, '') === rName.replace(/['’'`‘]/g, '') ||
           lower.replace(/['’'`‘]/g, '') === `${rId.replace(/['’'`‘]/g, '')} viloyati`;
  });
};

// Offset values to correct the alignment of Uzbekistan GeoJSON boundaries (shifting them north/east)
export const LAT_OFFSET = 0.055;
export const LNG_OFFSET = 0.035;

export const shiftCoordinates = (coords: any, lngOffset: number, latOffset: number, type: string): any => {
  if (!coords) return coords;
  
  if (type === 'Point') {
    return [coords[0] + lngOffset, coords[1] + latOffset];
  }
  
  if (type === 'LineString' || type === 'MultiPoint') {
    return coords.map((c: any) => [c[0] + lngOffset, c[1] + latOffset]);
  }
  
  if (type === 'Polygon' || type === 'MultiLineString') {
    return coords.map((ring: any) => 
      ring.map((c: any) => [c[0] + lngOffset, c[1] + latOffset])
    );
  }
  
  if (type === 'MultiPolygon') {
    return coords.map((polygon: any) => 
      polygon.map((ring: any) => 
        ring.map((c: any) => [c[0] + lngOffset, c[1] + latOffset])
      )
    );
  }
  
  return coords;
};

export const shiftGeometry = (geometry: any, lngOffset: number, latOffset: number): any => {
  if (!geometry) return geometry;
  
  if (geometry.type === 'GeometryCollection') {
    return {
      ...geometry,
      geometries: geometry.geometries.map((g: any) => shiftGeometry(g, lngOffset, latOffset))
    };
  }
  
  return {
    ...geometry,
    coordinates: shiftCoordinates(geometry.coordinates, lngOffset, latOffset, geometry.type)
  };
};

export const shiftGeoJson = (geojson: any, lngOffset: number = LNG_OFFSET, latOffset: number = LAT_OFFSET): any => {
  if (!geojson) return geojson;
  
  if (geojson.type === 'FeatureCollection') {
    return {
      ...geojson,
      features: geojson.features.map((f: any) => ({
        ...f,
        geometry: shiftGeometry(f.geometry, lngOffset, latOffset)
      }))
    };
  }
  
  if (geojson.type === 'Feature') {
    return {
      ...geojson,
      geometry: shiftGeometry(geojson.geometry, lngOffset, latOffset)
    };
  }
  
  return shiftGeometry(geojson, lngOffset, latOffset);
};

// Haversine formula to calculate the distance between two coordinates in kilometers
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Standard ray-casting point-in-polygon algorithm
export const isPointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Check if a point [lng, lat] falls inside a GeoJSON feature
export const isPointInFeature = (lng: number, lat: number, feature: any): boolean => {
  if (!feature || !feature.geometry) return false;
  const { type, coordinates } = feature.geometry;
  const point: [number, number] = [lng, lat];

  if (type === 'Polygon') {
    if (!coordinates || coordinates.length === 0) return false;
    return isPointInPolygon(point, coordinates[0]);
  } else if (type === 'MultiPolygon') {
    if (!coordinates) return false;
    for (const poly of coordinates) {
      if (poly && poly.length > 0) {
        if (isPointInPolygon(point, poly[0])) {
          return true;
        }
      }
    }
  }
  return false;
};
