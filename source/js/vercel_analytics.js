import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject } from "@vercel/analytics"

inject({debug: false})
injectSpeedInsights();