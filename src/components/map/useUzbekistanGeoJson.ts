import { useState, useEffect } from 'react';
import { shiftGeoJson, LNG_OFFSET, LAT_OFFSET, formatDistrictName } from '../mapUtils';

export interface GeoJsonData {
  geoJsonData: any;
  districtsGeoJsonData: any;
}

// Global memory cache to prevent heavy re-parsing and coordinate shifting on every mount
let cachedRegionsData: any = null;
let cachedDistrictsData: any = null;

export const useUzbekistanGeoJson = (): GeoJsonData => {
  const [geoJsonData, setGeoJsonData] = useState<any>(cachedRegionsData);
  const [districtsGeoJsonData, setDistrictsGeoJsonData] = useState<any>(cachedDistrictsData);

  useEffect(() => {
    // If already loaded and cached, do nothing
    if (cachedRegionsData && cachedDistrictsData) {
      return;
    }

    if (!cachedRegionsData) {
      import('../../../public/uzbekistan_regions_std.json')
        .then(module => {
          const data = module.default;
          const shiftedData = shiftGeoJson(data, LNG_OFFSET, LAT_OFFSET);
          cachedRegionsData = shiftedData;
          setGeoJsonData(shiftedData);
        })
        .catch(err => console.error("Error loading GeoJSON:", err));
    }

    if (!cachedDistrictsData) {
      import('../../../public/uzbekistan_districts.json')
        .then(module => {
          const data = module.default;
          const shiftedData = shiftGeoJson(data, LNG_OFFSET, LAT_OFFSET);
          if (shiftedData && shiftedData.features) {
            shiftedData.features = shiftedData.features.map((f: any) => {
              if (f.properties && f.properties.shapeName) {
                return {
                  ...f,
                  properties: {
                    ...f.properties,
                    shapeName: formatDistrictName(f.properties.shapeName)
                  }
                };
              }
              return f;
            });
          }
          cachedDistrictsData = shiftedData;
          setDistrictsGeoJsonData(shiftedData);
        })
        .catch(err => console.error("Error loading Districts GeoJSON:", err));
    }
  }, []);

  return { geoJsonData, districtsGeoJsonData };
};
