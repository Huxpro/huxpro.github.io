export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;


export const analytics = {

	// https://analytics.google.com/
	google: {trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X'},

};
