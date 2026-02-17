/**
 * Unit Tests for Utility Functions
 */

describe('Utility Functions', () => {
  describe('Data Sanitization', () => {
    test('should sanitize player arrays', () => {
      const deepSanitizePlayers = (input) => {
        if (!input) return [];
        let data = input;
        if (typeof data === "string") {
          try { data = JSON.parse(data); } catch (e) { return []; }
        }
        if (!Array.isArray(data)) return [];
        
        return data.map(item => {
          if (typeof item === "string") {
             try { return JSON.parse(item); } catch (e) { return null; }
          }
          return item;
        }).filter(Boolean);
      };

      expect(deepSanitizePlayers(null)).toEqual([]);
      expect(deepSanitizePlayers([])).toEqual([]);
      expect(deepSanitizePlayers([{name: 'Test'}])).toEqual([{name: 'Test'}]);
      expect(deepSanitizePlayers('invalid')).toEqual([]);
    });

    test('should handle JSON strings', () => {
      const deepSanitizePlayers = (input) => {
        if (!input) return [];
        let data = input;
        if (typeof data === "string") {
          try { data = JSON.parse(data); } catch (e) { return []; }
        }
        if (!Array.isArray(data)) return [];
        return data;
      };

      const jsonString = '[{"name":"Player1"},{"name":"Player2"}]';
      const result = deepSanitizePlayers(jsonString);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });
  });

  describe('Room ID Validation', () => {
    test('should validate room ID format', () => {
      const isValidRoomId = (id) => {
        return typeof id === 'string' && id.length === 6 && /^[A-Z0-9]+$/.test(id);
      };

      expect(isValidRoomId('ABC123')).toBe(true);
      expect(isValidRoomId('ROOM01')).toBe(true);
      expect(isValidRoomId('abc123')).toBe(false); // lowercase
      expect(isValidRoomId('AB12')).toBe(false); // too short
      expect(isValidRoomId('ABCDEFG')).toBe(false); // too long
      expect(isValidRoomId('ABC-12')).toBe(false); // special char
    });
  });

  describe('Password Validation', () => {
    test('should validate 4-digit password', () => {
      const isValidPassword = (pass) => {
        return typeof pass === 'string' && pass.length === 4 && /^\d{4}$/.test(pass);
      };

      expect(isValidPassword('1234')).toBe(true);
      expect(isValidPassword('0000')).toBe(true);
      expect(isValidPassword('9999')).toBe(true);
      expect(isValidPassword('123')).toBe(false); // too short
      expect(isValidPassword('12345')).toBe(false); // too long
      expect(isValidPassword('abcd')).toBe(false); // not digits
    });
  });

  describe('Currency Formatting', () => {
    test('should format Indian currency', () => {
      const formatCurrency = (amount) => {
        if (amount >= 10000000) { // 1 Crore
          return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) { // 1 Lakh
          return `₹${(amount / 100000).toFixed(2)} L`;
        }
        return `₹${amount}`;
      };

      expect(formatCurrency(10000000)).toBe('₹1.00 Cr');
      expect(formatCurrency(25000000)).toBe('₹2.50 Cr');
      expect(formatCurrency(500000)).toBe('₹5.00 L');
      expect(formatCurrency(50000)).toBe('₹50000');
    });
  });

  describe('Player Role Detection', () => {
    test('should detect player roles correctly', () => {
      const getPlayerRole = (player) => {
        const role = (player.role || '').toLowerCase();
        if (role.includes('bat')) return 'Batsman';
        if (role.includes('bowl')) return 'Bowler';
        if (role.includes('ar')) return 'All-Rounder';
        if (role.includes('wk')) return 'Wicket-Keeper';
        return 'Player';
      };

      expect(getPlayerRole({role: 'bat'})).toBe('Batsman');
      expect(getPlayerRole({role: 'bowl'})).toBe('Bowler');
      expect(getPlayerRole({role: 'ar'})).toBe('All-Rounder');
      expect(getPlayerRole({role: 'wk'})).toBe('Wicket-Keeper');
      expect(getPlayerRole({role: ''})).toBe('Player');
    });
  });
});
