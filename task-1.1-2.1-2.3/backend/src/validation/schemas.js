import Joi from 'joi';

export const campaignSchema = Joi.object({
  client_id: Joi.string().uuid().required(),
  name: Joi.string().min(1).max(255).required(),
  status: Joi.string().valid('active', 'paused', 'completed', 'draft').default('draft'),
  budget: Joi.number().positive().required(),
  spend: Joi.number().min(0).default(0),
  impressions: Joi.number().integer().min(0).default(0),
  clicks: Joi.number().integer().min(0).default(0),
  conversions: Joi.number().integer().min(0).default(0),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')),
});

export const campaignUpdateSchema = Joi.object({
  client_id: Joi.string().uuid(),
  name: Joi.string().min(1).max(255),
  status: Joi.string().valid('active', 'paused', 'completed', 'draft'),
  budget: Joi.number().positive(),
  spend: Joi.number().min(0),
  impressions: Joi.number().integer().min(0),
  clicks: Joi.number().integer().min(0),
  conversions: Joi.number().integer().min(0),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso(),
}).min(1);

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(1).max(255).required(),
});

export const alertThresholdSchema = Joi.object({
  campaign_id: Joi.string().uuid().required(),
  metric_type: Joi.string().valid('ctr', 'spend', 'roas', 'conversions').required(),
  threshold_value: Joi.number().required(),
  comparison: Joi.string().valid('above', 'below').required(),
});
