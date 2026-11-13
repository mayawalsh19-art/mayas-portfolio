// Tells the app whether Plaid keys are set up on this server.
import { route } from './_plaid.js';
export default route(async () => ({ plaid: !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET && process.env.TOKEN_KEY) }));
