import { TextEncoder, TextDecoder } from "util";
// https://github.com/inrupt/solid-client-authn-js/issues/1676#issuecomment-917016646
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// In the real app, these are set via .env
process.env.LOCAL_FILE_CACHE = "";
process.env.CLOUDFLARE_PURGE_AUTH_KEY = "";
process.env.CAPTBARITONE_USER_ID = "";
process.env.TEST_CHANNEL_ID = "";
process.env.TWEET_BOT_CHANNEL_ID = "";
process.env.SKIN_UPLOADS_CHANNEL_ID = "";
process.env.SKIN_REVIEW_CHANNEL_ID = "";
process.env.NSFW_SKIN_CHANNEL_ID = "";
process.env.FEEDBACK_SKIN_CHANNEL_ID = "";
process.env.POPULAR_TWEETS_CHANNEL_ID = "";
process.env.DISCORD_TOKEN = "";
process.env.DISCORD_WEBAMP_SERVER_ID = "<DUMMY_DISCORD_WEBAMP_SERVER_ID>";
process.env.DISCORD_CLIENT_ID = "<DUMMY_DISCORD_CLIENT_ID>";
process.env.DISCORD_CLIENT_SECRET = "<DUMMY_DISCORD_CLIENT_SECRET>";
process.env.DISCORD_REDIRECT_URL = "https://api.webampskins.org/auth/discord";
process.env.LOGIN_REDIRECT_URL = "https://skins.webamp.org/review/";
process.env.ALGOLIA_ACCOUNT = "";
process.env.ALGOLIA_INDEX = "";
process.env.ALGOLIA_KEY = "";
process.env.TWITTER_API_KEY = "";
process.env.TWITTER_API_SECRET = "";
process.env.TWITTER_ACCESS_TOKEN = "";
process.env.TWITTER_ACCESS_TOKEN_SECRET = "";
process.env.INSTAGRAM_ACCESS_TOKEN = "";
process.env.INSTAGRAM_ACCOUNT_ID = "";
process.env.MASTODON_ACCESS_TOKEN = "";
process.env.SECRET = "";
