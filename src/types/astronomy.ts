export interface AstronomicalEvent {
  id: string;
  name: string;
  type: 'Star' | 'Planet' | 'Comet' | 'Mission';
  constellation: string;
  description: string;
  fact: string; // Added fact field for interesting tidbits
  link: string;
  magnitude?: number;
  coordinates?: {
    ra: string;
    dec: string;
  };
}

export interface DayEvents {
  date: string;
  events: AstronomicalEvent[];
}

export interface Star {
  id: string;
  date: string;
  x: number;
  y: number;
  brightness: number;
  constellation: string;
  hasEvents: boolean;
}

export interface TelescopePosition {
  x: number;
  y: number;
  zoom: number;
}

export interface Coordinates {
  ra: string;
  dec: string;
}

export type FilterType = 'All' | 'Star' | 'Planet' | 'Comet' | 'Mission';