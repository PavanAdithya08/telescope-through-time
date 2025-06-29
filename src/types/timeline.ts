export interface TimelineEvent {
  id: string;
  name: string;
  type: 'Star' | 'Planet' | 'Comet' | 'Mission';
  date: string;
  time?: string;
  description: string;
  fact?: string;
  link?: string;
  location?: string;
  visibility?: string;
  equipment?: string;
  duration?: string;
  isMajor?: boolean;
  isRare?: boolean;
  coordinates?: {
    ra: string;
    dec: string;
  };
}