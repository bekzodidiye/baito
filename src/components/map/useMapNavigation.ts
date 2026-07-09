import { UZBEKISTAN_REGIONS } from '../mapConstants';
import { areDistrictNamesEqual } from '../mapUtils';

interface UseMapNavigationProps {
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  districtsGeoJsonData: any;
  panToCoords: (lat: number, lng: number, zoom: number) => void;
}

export const useMapNavigation = ({
  filterLocation,
  setFilterLocation,
  districtsGeoJsonData,
  panToCoords,
}: UseMapNavigationProps) => {
  const selectedRegion = UZBEKISTAN_REGIONS.find(r => 
    filterLocation.toLowerCase().includes(r.id.toLowerCase()) ||
    filterLocation.toLowerCase().includes(r.name.toLowerCase())
  );

  const breadcrumbItems = (() => {
    if (filterLocation === 'Barchasi') return [];
    const items = ["O'zbekiston"];

    if (selectedRegion) {
      items.push(selectedRegion.name);
    } else {
      const matchedDistrict = districtsGeoJsonData?.features?.find((f: any) => 
        f.properties && areDistrictNamesEqual(filterLocation, f.properties.shapeName || "")
      );

      if (matchedDistrict?.properties?.regionId) {
        const parentRegion = UZBEKISTAN_REGIONS.find(r => r.id === matchedDistrict.properties.regionId);
        if (parentRegion) {
          items.push(parentRegion.name);
        } else {
          items.push("Toshkent viloyati");
        }
      } else {
        items.push(['chilonzor', 'yunusobod', 'bektemir'].includes(filterLocation.toLowerCase()) ? "Toshkent shahri" : "Toshkent viloyati");
      }
      items.push(filterLocation);
    }
    return items;
  })();

  const handleBreadcrumbBack = () => {
    if (['chilonzor', 'yunusobod', 'bektemir'].includes(filterLocation.toLowerCase())) {
      setFilterLocation('Toshkent shahri');
      const parentRegion = UZBEKISTAN_REGIONS.find(r => r.id === 'Toshkent shahri');
      if (parentRegion?.center) {
        panToCoords(parentRegion.center[0], parentRegion.center[1], parentRegion.zoom);
      }
      return;
    }

    const matchedDistrict = districtsGeoJsonData?.features?.find((f: any) => 
      f.properties && areDistrictNamesEqual(filterLocation, f.properties.shapeName || "")
    );
    
    if (matchedDistrict?.properties?.regionId) {
      const parentRegion = UZBEKISTAN_REGIONS.find(r => r.id === matchedDistrict.properties.regionId);
      if (parentRegion) {
        setFilterLocation(parentRegion.id);
        if (parentRegion.center) {
          panToCoords(parentRegion.center[0], parentRegion.center[1], parentRegion.zoom);
        }
        return;
      }
    }
    
    setFilterLocation('Barchasi');
    panToCoords(41.2, 64.0, 5.1);
  };

  return {
    selectedRegion,
    breadcrumbItems,
    handleBreadcrumbBack,
  };
};
