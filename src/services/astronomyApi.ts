import { DayEvents } from '../types/astronomy';
import { nasaApi } from './nasaApi';

// Updated astronomy API service that uses real NASA data
export const astronomyApi = {
  async getEventsForDate(date: string): Promise<DayEvents> {
    try {
      // Use NASA API for real astronomical data
      return await nasaApi.getEventsForDate(date);
    } catch (error) {
      console.error('Error fetching NASA events:', error);
      
      // Fallback to a basic event if NASA API fails
      return {
        date: `2025-${date}`,
        events: [{
          id: `${date}-fallback`,
          name: 'Celestial Observation',
          type: 'Star',
          constellation: 'Orion',
          description: 'General astronomical observation opportunity for this date. NASA data temporarily unavailable.',
          fact: 'NASA provides free access to astronomical data and imagery to inspire and educate people worldwide.',
          link: 'https://www.nasa.gov/audience/forstudents/k-4/stories/nasa-knows/what-is-astronomy-k4.html',
          magnitude: 2.0,
          coordinates: { ra: '06h 00m', dec: '+20°' }
        }]
      };
    }
  },

  async getEventsForMonth(month: number, year: number = 2025): Promise<DayEvents[]> {
    return await nasaApi.getEventsForMonth(month, year);
  },

  async getTodaysEvents(): Promise<DayEvents> {
    return await nasaApi.getTodaysEvents();
  },

  async getUpcomingEvents(): Promise<DayEvents[]> {
    return await nasaApi.getUpcomingEvents();
  }
};