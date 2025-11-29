import { Router } from 'express';
import Joi from 'joi';
import { OracleService } from '../services/oracleService';
import { validateRequest } from '../middleware/validation';

const router = Router();
const oracleService = new OracleService();

const generateOracleSchema = Joi.object({
  emotionalText: Joi.string().min(10).max(1000).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

router.post('/generate', validateRequest(generateOracleSchema), async (req, res) => {
  try {
    const { emotionalText, latitude, longitude } = req.body;
    const userId = req.user?.id;

    console.log('Generating oracle response for:', { emotionalText, latitude, longitude });

    const oracleResponse = await oracleService.generateOracleResponse(
      emotionalText,
      latitude,
      longitude,
      userId
    );

    console.log('Oracle response generated:', oracleResponse);

    res.json({
      success: true,
      data: oracleResponse
    });
  } catch (error) {
    console.error('Oracle generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate oracle response'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const oracleResponse = await oracleService.getOracleResponse(id, userId);

    if (!oracleResponse) {
      return res.status(404).json({
        success: false,
        error: 'Oracle response not found'
      });
    }

    res.json({
      success: true,
      data: oracleResponse
    });
  } catch (error) {
    console.error('Oracle retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve oracle response'
    });
  }
});

router.get('/user/history', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const responses = await oracleService.getUserOracleResponses(userId, limit);

    res.json({
      success: true,
      data: responses
    });
  } catch (error) {
    console.error('Oracle history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve oracle history'
    });
  }
});

router.get('/user/emotions-timeline', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const timeline = await oracleService.getEmotionsTimeline(userId, 10);

    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Emotions timeline error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve emotions timeline'
    });
  }
});

export default router;