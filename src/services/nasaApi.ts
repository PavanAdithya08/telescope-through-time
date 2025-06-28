import { AstronomicalEvent, DayEvents } from '../types/astronomy';

const NASA_API_KEY = '28aVSj7cPlw2E83qcx9pVzdBH1cIlSlEX546Kzdn';
const NASA_BASE_URL = 'https://api.nasa.gov';

// NASA API endpoints
const ENDPOINTS = {
  APOD: `${NASA_BASE_URL}/planetary/apod`,
  NEO: `${NASA_BASE_URL}/neo/rest/v1/feed`,
  MARS_WEATHER: `${NASA_BASE_URL}/insight_weather`,
  EARTH_IMAGERY: `${NASA_BASE_URL}/planetary/earth/imagery`,
  EPIC: `${NASA_BASE_URL}/EPIC/api/natural`,
  DONKI: `${NASA_BASE_URL}/DONKI/notifications`,
  TECHPORT: `${NASA_BASE_URL}/techport/api/projects`
};

interface NASAAPODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

interface NASANEOResponse {
  links: any;
  element_count: number;
  near_earth_objects: {
    [date: string]: Array<{
      id: string;
      name: string;
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
      };
      is_potentially_hazardous_asteroid: boolean;
      close_approach_data: Array<{
        close_approach_date: string;
        relative_velocity: {
          kilometers_per_hour: string;
        };
        miss_distance: {
          kilometers: string;
        };
      }>;
    }>;
  };
}

interface NASADONKIResponse {
  messageType: string;
  messageID: string;
  messageURL: string;
  messageIssueTime: string;
  messageBody: string;
}

class NASAApiService {
  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async getAPOD(date?: string): Promise<NASAAPODResponse> {
    const dateParam = date ? `&date=${date}` : '';
    const url = `${ENDPOINTS.APOD}?api_key=${NASA_API_KEY}${dateParam}`;
    return this.fetchWithRetry(url);
  }

  async getNearEarthObjects(startDate: string, endDate?: string): Promise<NASANEOResponse> {
    const endParam = endDate ? `&end_date=${endDate}` : '';
    const url = `${ENDPOINTS.NEO}?start_date=${startDate}${endParam}&api_key=${NASA_API_KEY}`;
    return this.fetchWithRetry(url);
  }

  async getSpaceWeatherNotifications(): Promise<NASADONKIResponse[]> {
    const url = `${ENDPOINTS.DONKI}?api_key=${NASA_API_KEY}&type=all`;
    return this.fetchWithRetry(url);
  }

  async getEPICImages(date?: string): Promise<any> {
    const dateParam = date ? `date/${date}` : 'date';
    const url = `${ENDPOINTS.EPIC}/${dateParam}?api_key=${NASA_API_KEY}`;
    return this.fetchWithRetry(url);
  }

  // Convert NASA data to our event format
  private convertAPODToEvent(apod: NASAAPODResponse, date: string): AstronomicalEvent {
    return {
      id: `apod-${date}`,
      name: apod.title,
      type: this.determineEventType(apod.title, apod.explanation),
      constellation: this.extractConstellation(apod.explanation),
      description: this.truncateDescription(apod.explanation, 200),
      fact: this.generateFactFromAPOD(apod),
      link: apod.url,
      magnitude: this.estimateMagnitude(apod.title),
      coordinates: this.generateCoordinates()
    };
  }

  private convertNEOToEvent(neo: any, date: string): AstronomicalEvent {
    const approach = neo.close_approach_data[0];
    const diameter = neo.estimated_diameter.kilometers;
    
    return {
      id: `neo-${neo.id}`,
      name: neo.name.replace(/[()]/g, ''),
      type: 'Comet',
      constellation: this.getRandomConstellation(),
      description: `Near-Earth asteroid ${neo.name} makes its closest approach to Earth. Estimated diameter: ${diameter.estimated_diameter_min.toFixed(1)}-${diameter.estimated_diameter_max.toFixed(1)} km.`,
      fact: neo.is_potentially_hazardous_asteroid 
        ? 'This asteroid is classified as potentially hazardous due to its size and proximity to Earth\'s orbit.'
        : `This asteroid will safely pass Earth at a distance of ${parseInt(approach.miss_distance.kilometers).toLocaleString()} kilometers.`,
      link: `https://cneos.jpl.nasa.gov/sentry/`,
      magnitude: this.calculateAsteroidMagnitude(diameter.estimated_diameter_max),
      coordinates: this.generateCoordinates()
    };
  }

  private determineEventType(title: string, description: string): AstronomicalEvent['type'] {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('planet') || text.includes('mars') || text.includes('venus') || 
        text.includes('jupiter') || text.includes('saturn') || text.includes('mercury')) {
      return 'Planet';
    } else if (text.includes('comet') || text.includes('asteroid') || text.includes('meteor')) {
      return 'Comet';
    } else if (text.includes('mission') || text.includes('spacecraft') || text.includes('rover') || 
               text.includes('satellite') || text.includes('launch')) {
      return 'Mission';
    } else {
      return 'Star';
    }
  }

  private extractConstellation(text: string): string {
    const constellations = [
      'Andromeda', 'Aquarius', 'Aries', 'Cancer', 'Capricornus', 'Gemini',
      'Leo', 'Libra', 'Pisces', 'Sagittarius', 'Scorpius', 'Taurus', 'Virgo',
      'Orion', 'Cassiopeia', 'Ursa Major', 'Ursa Minor', 'Draco', 'Cygnus',
      'Perseus', 'Boötes', 'Lyra', 'Hercules', 'Corona Borealis'
    ];
    
    for (const constellation of constellations) {
      if (text.toLowerCase().includes(constellation.toLowerCase())) {
        return constellation;
      }
    }
    
    return this.getRandomConstellation();
  }

  private getRandomConstellation(): string {
    const constellations = [
      'Andromeda', 'Aquarius', 'Aries', 'Cancer', 'Capricornus', 'Gemini',
      'Leo', 'Libra', 'Pisces', 'Sagittarius', 'Scorpius', 'Taurus', 'Virgo',
      'Orion', 'Cassiopeia', 'Ursa Major', 'Ursa Minor', 'Draco', 'Cygnus'
    ];
    return constellations[Math.floor(Math.random() * constellations.length)];
  }

  private truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }

  private generateFactFromAPOD(apod: NASAAPODResponse): string {
    const facts = [
      'NASA\'s Astronomy Picture of the Day has been inspiring people since 1995.',
      'Each APOD image is carefully selected by professional astronomers.',
      'The APOD archive contains over 9,000 astronomical images and explanations.',
      'Many APOD images are taken by amateur astronomers from around the world.',
      'APOD images often reveal phenomena invisible to the naked eye.',
      'The Hubble Space Telescope has contributed thousands of images to APOD.',
      'Some APOD images show objects billions of light-years away.',
      'APOD helps bridge the gap between professional astronomy and public education.'
    ];
    
    return facts[Math.floor(Math.random() * facts.length)];
  }

  private estimateMagnitude(title: string): number {
    const text = title.toLowerCase();
    if (text.includes('sun') || text.includes('solar')) return -26.7;
    if (text.includes('moon') || text.includes('lunar')) return -12.6;
    if (text.includes('venus')) return -4.6;
    if (text.includes('jupiter')) return -2.9;
    if (text.includes('mars')) return -2.9;
    if (text.includes('saturn')) return 0.7;
    if (text.includes('bright') || text.includes('brilliant')) return 1.0;
    return 2.0 + Math.random() * 4.0; // Random magnitude between 2-6
  }

  private calculateAsteroidMagnitude(diameter: number): number {
    // Rough calculation based on asteroid size
    return Math.max(10, 15 - 2.5 * Math.log10(diameter));
  }

  private generateCoordinates(): { ra: string; dec: string } {
    const ra = Math.floor(Math.random() * 24);
    const raMin = Math.floor(Math.random() * 60);
    const dec = Math.floor(Math.random() * 180) - 90;
    
    return {
      ra: `${ra.toString().padStart(2, '0')}h ${raMin.toString().padStart(2, '0')}m`,
      dec: `${dec >= 0 ? '+' : ''}${dec.toString().padStart(2, '0')}°`
    };
  }

  // Main method to get events for a specific date
  async getEventsForDate(date: string): Promise<DayEvents> {
    const events: AstronomicalEvent[] = [];
    const fullDate = `2025-${date}`;
    
    try {
      // Get APOD for the date
      try {
        const apod = await this.getAPOD(fullDate);
        events.push(this.convertAPODToEvent(apod, date));
      } catch (error) {
        console.log('APOD not available for this specific date, skipping APOD event');
      }

      // Get Near-Earth Objects for the date
      try {
        const neoData = await this.getNearEarthObjects(fullDate);
        const dateNEOs = neoData.near_earth_objects[fullDate] || [];
        
        dateNEOs.slice(0, 2).forEach(neo => {
          events.push(this.convertNEOToEvent(neo, date));
        });
      } catch (error) {
        console.log('NEO data not available for date');
      }

      // Add space weather events if available
      try {
        const notifications = await this.getSpaceWeatherNotifications();
        const recentNotifications = notifications.slice(0, 1);
        
        recentNotifications.forEach((notification, index) => {
          events.push({
            id: `space-weather-${date}-${index}`,
            name: 'Space Weather Event',
            type: 'Mission',
            constellation: 'Solar System',
            description: this.truncateDescription(notification.messageBody, 200),
            fact: 'Space weather can affect satellite communications, GPS systems, and even power grids on Earth.',
            link: notification.messageURL || 'https://www.spaceweather.gov/',
            coordinates: this.generateCoordinates()
          });
        });
      } catch (error) {
        console.log('Space weather data not available');
      }

      // If no events found, add a general astronomical observation
      if (events.length === 0) {
        events.push({
          id: `general-${date}`,
          name: 'Daily Sky Observation',
          type: 'Star',
          constellation: this.getRandomConstellation(),
          description: 'Every night offers opportunities for astronomical observation. Look up and explore the wonders of the night sky.',
          fact: 'On any clear night, you can see about 2,500 stars with the naked eye from a dark location.',
          link: 'https://www.nasa.gov/audience/forstudents/k-4/stories/nasa-knows/what-is-astronomy-k4.html',
          magnitude: 3.0,
          coordinates: this.generateCoordinates()
        });
      }

    } catch (error) {
      console.error('Error fetching NASA data:', error);
      
      // Fallback event
      events.push({
        id: `fallback-${date}`,
        name: 'Astronomical Observation',
        type: 'Star',
        constellation: this.getRandomConstellation(),
        description: 'Explore the night sky and discover the wonders of the universe.',
        fact: 'NASA has been exploring space and advancing our understanding of the universe since 1958.',
        link: 'https://www.nasa.gov/',
        magnitude: 3.0,
        coordinates: this.generateCoordinates()
      });
    }

    return {
      date: fullDate,
      events
    };
  }

  // Get events for current date
  async getTodaysEvents(): Promise<DayEvents> {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    return this.getEventsForDate(dateKey);
  }

  // Get upcoming events (next 7 days)
  async getUpcomingEvents(): Promise<DayEvents[]> {
    const events: DayEvents[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateKey = `${month}-${day}`;
      
      const dayEvents = await this.getEventsForDate(dateKey);
      events.push(dayEvents);
    }
    
    return events;
  }

  // Get events for a specific month
  async getEventsForMonth(month: number, year: number = 2025): Promise<DayEvents[]> {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthEvents: DayEvents[] = [];
    
    // Limit concurrent requests to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < daysInMonth; i += batchSize) {
      const batch = [];
      
      for (let j = i; j < Math.min(i + batchSize, daysInMonth); j++) {
        const day = j + 1;
        const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        batch.push(this.getEventsForDate(dateKey));
      }
      
      const batchResults = await Promise.all(batch);
      monthEvents.push(...batchResults);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < daysInMonth) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return monthEvents;
  }
}

export const nasaApi = new NASAApiService();