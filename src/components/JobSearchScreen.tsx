import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { Briefcase } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import { areDistrictNamesEqual } from './mapUtils';
import { SearchFilterSection } from './search/SearchFilterSection';
import { JobCardItem } from './search/JobCardItem';
import { JobSearchModalDetail } from './search/JobSearchModalDetail';
import { MapViewCallout } from './search/MapViewCallout';

export const JobSearchScreen: React.FC = () => {
  const { 
    jobs, 
    toggleBookmark, 
    applyToJob,
    filterLocation,
    setFilterLocation,
    setShowRegionSelector,
    setCurrentScreen,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Barchasi');
  const [sortBy, setSortBy] = useState<'yangilari' | 'maosh'>('yangilari');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filterLocation === 'Barchasi' ||
      job.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
      areDistrictNamesEqual(job.location, filterLocation);

    const matchesType =
      filterType === 'Barchasi' ||
      job.tags.some(tag => tag.toLowerCase() === filterType.toLowerCase());

    return matchesSearch && matchesLocation && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'maosh') {
      const aVal = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
      const bVal = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
      return bVal - aVal;
    }
    return 0; // Default sorting (chronological)
  });

  return (
    <div className="flex flex-col gap-5 pb-20 pt-16 md:pt-4">
      {/* Search & Filter Section */}
      <SearchFilterSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        filterType={filterType}
        setFilterType={setFilterType}
        setShowRegionSelector={setShowRegionSelector}
      />

      {/* Results Summary */}
      <div className="flex justify-between items-center text-brand-text-variant text-xs font-semibold px-1">
        <span>Toshkent shahrida {filteredJobs.length} ta bo'sh ish o'rni topildi</span>
        <div className="flex items-center gap-1 cursor-pointer hover:text-brand-primary transition-colors">
          <select
            className="bg-transparent border-none text-brand-text font-bold focus:outline-hidden text-xs py-0 pl-0 pr-6 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'yangilari' | 'maosh')}
          >
            <option value="yangilari">Eng yangilari</option>
            <option value="maosh">Maksimal maosh</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedJobs.map((job, idx) => (
          <JobCardItem 
            key={job.id}
            job={job}
            idx={idx}
            onClick={() => setSelectedJob(job)}
            toggleBookmark={toggleBookmark}
          />
        ))}

        {sortedJobs.length === 0 && (
          <div className="col-span-full bg-white border border-brand-outline-variant rounded-2xl p-8 text-center text-brand-text-variant">
            <Briefcase size={40} className="mx-auto text-brand-outline-variant mb-2" />
            <p className="font-display font-bold text-sm">Mos keladigan ish o'rinlari topilmadi</p>
            <p className="text-xs mt-1">Filtr parametrlarini o'zgartirib ko'ring.</p>
          </div>
        )}

        {/* Map View Bento-style Callout */}
        <MapViewCallout setCurrentScreen={setCurrentScreen} />
      </div>

      {/* Pagination / Load More */}
      <div className="flex justify-center mt-6">
        <button className="border-2 border-brand-primary text-brand-primary font-bold py-3 px-8 rounded-full hover:bg-brand-surface-low transition-colors text-sm cursor-pointer shadow-xs">
          Yana ko'rsatish
        </button>
      </div>

      {/* High-Fidelity Job Detail Modal Overlay */}
      <AnimatePresence>
        {selectedJob && (
          <JobSearchModalDetail 
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            toggleBookmark={toggleBookmark}
            applyToJob={applyToJob}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
