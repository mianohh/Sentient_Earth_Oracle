import { OracleService } from '../services/oracleService';

// Mock the agents
jest.mock('../agents/emotionAnalysisAgent');
jest.mock('../agents/earthDataAgent');
jest.mock('../agents/synthesizerAgent');
jest.mock('../agents/actionGenerationAgent');

describe('OracleService', () => {
  let oracleService: OracleService;

  beforeEach(() => {
    oracleService = new OracleService();
  });

  describe('generateOracleResponse', () => {
    it('should generate a complete oracle response', async () => {
      const emotionalText = "I'm feeling anxious about the future";
      const latitude = 37.7749;
      const longitude = -122.4194;

      const response = await oracleService.generateOracleResponse(
        emotionalText,
        latitude,
        longitude
      );

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.emotionAnalysis).toBeDefined();
      expect(response.earthData).toBeDefined();
      expect(response.narrative).toBeDefined();
      expect(response.vibeScore).toBeGreaterThanOrEqual(0);
      expect(response.vibeScore).toBeLessThanOrEqual(100);
      expect(response.insights).toBeInstanceOf(Array);
      expect(response.actions).toBeInstanceOf(Array);
    });

    it('should handle invalid coordinates', async () => {
      const emotionalText = "I'm feeling great today";
      const latitude = 999; // Invalid
      const longitude = 999; // Invalid

      await expect(
        oracleService.generateOracleResponse(emotionalText, latitude, longitude)
      ).rejects.toThrow();
    });

    it('should handle empty emotional text', async () => {
      const emotionalText = "";
      const latitude = 37.7749;
      const longitude = -122.4194;

      await expect(
        oracleService.generateOracleResponse(emotionalText, latitude, longitude)
      ).rejects.toThrow();
    });
  });
});