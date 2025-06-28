import { Star } from '../types/astronomy';

// Generate positions for 365 stars in a spiral galaxy pattern
export const generateStarPositions = (): Star[] => {
  const stars: Star[] = [];
  const centerX = 400;
  const centerY = 300;
  const numArms = 5;
  const starsPerArm = 73; // 365 / 5 arms
  
  for (let arm = 0; arm < numArms; arm++) {
    for (let i = 0; i < starsPerArm; i++) {
      const starIndex = arm * starsPerArm + i;
      if (starIndex >= 365) break;
      
      // Calculate date for this star
      const date = new Date(2025, 0, starIndex + 1);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateKey = `${month}-${day}`;
      
      // Spiral galaxy parameters
      const armAngle = (arm * 2 * Math.PI) / numArms;
      const t = i / starsPerArm;
      const spiralTightness = 2;
      const radius = 50 + t * 200; // Spiral outward
      const angle = armAngle + t * spiralTightness * Math.PI;
      
      // Add some randomness for natural look
      const randomRadius = radius + (Math.random() - 0.5) * 30;
      const randomAngle = angle + (Math.random() - 0.5) * 0.3;
      
      const x = centerX + randomRadius * Math.cos(randomAngle);
      const y = centerY + randomRadius * Math.sin(randomAngle);
      
      // Vary brightness based on position and randomness
      const brightness = 0.3 + Math.random() * 0.7;
      
      const constellations = [
        'Andromeda', 'Aquarius', 'Aries', 'Cancer', 'Capricornus', 'Gemini',
        'Leo', 'Libra', 'Pisces', 'Sagittarius', 'Scorpius', 'Taurus', 'Virgo',
        'Orion', 'Cassiopeia', 'Ursa Major', 'Ursa Minor', 'Draco', 'Cygnus'
      ];
      
      stars.push({
        id: `star-${dateKey}`,
        date: dateKey,
        x,
        y,
        brightness,
        constellation: constellations[Math.floor(Math.random() * constellations.length)],
        hasEvents: true // All stars now have events since we have daily data
      });
    }
  }
  
  return stars;
};

// Convert screen coordinates to telescope coordinates
export const screenToTelescopeCoordinates = (x: number, y: number): { ra: string; dec: string } => {
  // Simulate coordinate conversion based on screen position
  const ra = ((x / 800) * 24).toFixed(1);
  const dec = (((y - 300) / 300) * 90).toFixed(1);
  
  return {
    ra: `${ra}h`,
    dec: `${dec > 0 ? '+' : ''}${dec}°`
  };
};