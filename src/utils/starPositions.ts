import { Star } from '../types/astronomy';

// Generate positions for 365 stars in a spiral galaxy pattern
export const generateStarPositions = (containerWidth: number = 800, containerHeight: number = 600): Star[] => {
  const stars: Star[] = [];
  
  // Create a much larger starfield area for telescope exploration
  const starfieldWidth = containerWidth * 3;
  const starfieldHeight = containerHeight * 3;
  const centerX = starfieldWidth / 2;
  const centerY = starfieldHeight / 2;
  
  const numArms = 5;
  const starsPerArm = 73; // 365 / 5 arms
  
  // Scale spiral size based on container dimensions
  const maxRadius = Math.min(starfieldWidth, starfieldHeight) * 0.4;
  
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
      const radius = maxRadius * 0.1 + t * maxRadius * 0.9; // Spiral outward across larger area
      const angle = armAngle + t * spiralTightness * Math.PI;
      
      // Add some randomness for natural look
      const randomRadius = radius + (Math.random() - 0.5) * (maxRadius * 0.15);
      const randomAngle = angle + (Math.random() - 0.5) * 0.3;
      
      const x = centerX + randomRadius * Math.cos(randomAngle);
      const y = centerY + randomRadius * Math.sin(randomAngle);
      
      // Vary brightness based on position and randomness
      const brightness = 0.4 + Math.random() * 0.6;
      
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
  
  // Add some random scattered stars throughout the field for more natural distribution
  for (let i = 0; i < 50; i++) {
    const randomX = centerX + (Math.random() - 0.5) * starfieldWidth * 0.8;
    const randomY = centerY + (Math.random() - 0.5) * starfieldHeight * 0.8;
    const brightness = 0.2 + Math.random() * 0.5;
    
    // Generate a random date for scattered stars
    const randomDay = Math.floor(Math.random() * 365) + 1;
    const date = new Date(2025, 0, randomDay);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    const constellations = [
      'Andromeda', 'Aquarius', 'Aries', 'Cancer', 'Capricornus', 'Gemini',
      'Leo', 'Libra', 'Pisces', 'Sagittarius', 'Scorpius', 'Taurus', 'Virgo',
      'Orion', 'Cassiopeia', 'Ursa Major', 'Ursa Minor', 'Draco', 'Cygnus'
    ];
    
    stars.push({
      id: `scattered-${i}-${dateKey}`,
      date: dateKey,
      x: randomX,
      y: randomY,
      brightness,
      constellation: constellations[Math.floor(Math.random() * constellations.length)],
      hasEvents: Math.random() > 0.3 // 70% chance of having events
    });
  }
  
  return stars;
};

// Convert screen coordinates to telescope coordinates
export const screenToTelescopeCoordinates = (x: number, y: number, containerWidth: number = 800, containerHeight: number = 600): { ra: string; dec: string } => {
  // Simulate coordinate conversion based on screen position
  const ra = ((x / containerWidth) * 24).toFixed(1);
  const dec = (((y - containerHeight / 2) / (containerHeight / 2)) * 90).toFixed(1);
  
  return {
    ra: `${ra}h`,
    dec: `${dec > 0 ? '+' : ''}${dec}°`
  };
};