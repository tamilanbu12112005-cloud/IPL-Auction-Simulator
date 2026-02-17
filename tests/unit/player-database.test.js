/**
 * Unit Tests for Player Database
 */

const { PLAYER_DATABASE, PLAYER_IMAGE_MAP } = require('../../player-database');

describe('Player Database', () => {
  describe('PLAYER_DATABASE', () => {
    test('should be defined', () => {
      expect(PLAYER_DATABASE).toBeDefined();
      expect(typeof PLAYER_DATABASE).toBe('object');
    });

    test('should have player entries', () => {
      const players = Object.keys(PLAYER_DATABASE);
      expect(players.length).toBeGreaterThan(0);
    });

    test('each player should have required fields', () => {
      Object.entries(PLAYER_DATABASE).forEach(([name, stats]) => {
        expect(stats).toHaveProperty('bat');
        expect(stats).toHaveProperty('bowl');
        expect(stats).toHaveProperty('role');
        expect(stats).toHaveProperty('type');
        
        expect(typeof stats.bat).toBe('number');
        expect(typeof stats.bowl).toBe('number');
        expect(typeof stats.role).toBe('string');
        expect(typeof stats.type).toBe('string');
      });
    });

    test('player stats should be in valid range', () => {
      Object.entries(PLAYER_DATABASE).forEach(([name, stats]) => {
        expect(stats.bat).toBeGreaterThanOrEqual(0);
        expect(stats.bat).toBeLessThanOrEqual(100);
        expect(stats.bowl).toBeGreaterThanOrEqual(0);
        expect(stats.bowl).toBeLessThanOrEqual(100);
      });
    });

    test('should have marquee players', () => {
      const marquees = ['Virat Kohli', 'Rohit Sharma', 'MS Dhoni', 'Jasprit Bumrah'];
      
      marquees.forEach(player => {
        expect(PLAYER_DATABASE).toHaveProperty(player);
      });
    });

    test('player types should be valid', () => {
      const validTypes = ['bat', 'bowl', 'ar', 'wk'];
      
      Object.entries(PLAYER_DATABASE).forEach(([name, stats]) => {
        expect(validTypes).toContain(stats.type);
      });
    });
  });

  describe('PLAYER_IMAGE_MAP', () => {
    test('should be defined', () => {
      expect(PLAYER_IMAGE_MAP).toBeDefined();
      expect(typeof PLAYER_IMAGE_MAP).toBe('object');
    });

    test('should have image URLs', () => {
      const images = Object.keys(PLAYER_IMAGE_MAP);
      expect(images.length).toBeGreaterThan(0);
    });

    test('each image should be a string', () => {
      Object.entries(PLAYER_IMAGE_MAP).forEach(([name, url]) => {
        expect(typeof url).toBe('string');
        expect(url.length).toBeGreaterThan(0);
      });
    });
  });
});
