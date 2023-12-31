/**
 * @module botbuilder-adapter-webex
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, BotAdapter, ResourceResponse, ConversationReference, TurnContext } from 'botbuilder';
import { WebexBotWorker } from './botworker';
export interface WebexAdapterOptions {
    /**
     * An access token for the bot. Get one from [https://developer.webex.com/](https://developer.webex.com/)
     */
    access_token: string;
    /**
     * Secret used to validate incoming webhooks - you can define this yourself
     */
    secret?: string;
    /**
     * The root URL of your bot application.  Something like `https://mybot.com/`
     */
    public_address: string;
    /**
     * a name for the webhook subscription that will be created to tell Webex to send your bot webhooks.
     */
    webhook_name?: string;
    /**
     * Allow the adapter to startup without a complete configuration.
     * This is risky as it may result in a non-functioning or insecure adapter.
     * This should only be used when getting started.
     */
    enable_incomplete?: boolean;
}
/**
 * Connect [Botkit](https://www.npmjs.com/package/botkit) or [BotBuilder](https://www.npmjs.com/package/botbuilder) to Webex Teams.
 */
export declare class WebexAdapter extends BotAdapter {
    private options;
    private _api;
    private _identity;
    /**
     * Name used by Botkit plugin loader
     * @ignore
     */
    name: string;
    /**
     * Object containing one or more Botkit middlewares to bind automatically.
     * @ignore
     */
    middlewares: any;
    /**
     * A customized BotWorker object that exposes additional utility methods.
     * @ignore
     */
    botkit_worker: typeof WebexBotWorker;
    /**
     * Create a Webex adapter. See [WebexAdapterOptions](#webexadapteroptions) for a full definition of the allowed parameters.
     *
     * Use with Botkit:
     *```javascript
     * const adapter = new WebexAdapter({
     *      access_token: process.env.ACCESS_TOKEN, // access token from https://developer.webex.com
     *      public_address: process.env.PUBLIC_ADDRESS,  // public url of this app https://myapp.com/
     *      secret: process.env.SECRET // webhook validation secret - you can define this yourself
     * });
     * const controller = new Botkit({
     *      adapter: adapter,
     *      // ... other configuration options
     * });
     * ```
     *
     * Use with BotBuilder:
     *```javascript
     * const adapter = new WebexAdapter({
     *      access_token: process.env.ACCESS_TOKEN, // access token from https://developer.webex.com
     *      public_address: process.env.PUBLIC_ADDRESS,  // public url of this app https://myapp.com/
     *      secret: process.env.SECRET // webhook validation secret - you can define this yourself
     * });
     *
     * // set up restify...
     * const server = restify.createServer();
     * server.use(restify.plugins.bodyParser());
     * // register the webhook subscription to start receiving messages - Botkit does this automatically!
     * adapter.registerWebhookSubscription('/api/messages');
     * // Load up the bot's identity, otherwise it won't know how to filter messages from itself
     * adapter.getIdentity();
     * // create an endpoint for receiving messages
     * server.post('/api/messages', (req, res) => {
     *      adapter.processActivity(req, res, async(context) => {
     *          // do your bot logic here!
     *      });
     * });
     * ```
     *
     * @param options An object containing API credentials, a webhook verification token and other options
     */
    constructor(config: WebexAdapterOptions);
    /**
     * Load the bot's identity via the Webex API.
     * MUST be called by BotBuilder bots in order to filter messages sent by the bot.
     */
    getIdentity(): Promise<any>;
    /**
     * Returns the identity of the bot, including {id, emails, displayName, created} and anything else from [this spec](https://webex.github.io/spark-js-sdk/api/#personobject)
     */
    get identity(): any;
    /**
     * Botkit-only: Initialization function called automatically when used with Botkit.
     *      * Calls registerWebhookSubscription() during bootup.
     *      * Calls getIdentit() to load the bot's identity.
     */
    init(botkit: any): void;
    /**
     * Clear out and reset all the webhook subscriptions currently associated with this application.
     */
    resetWebhookSubscriptions(): Promise<any>;
    /**
     * Register a webhook subscription with Webex Teams to start receiving message events.
     * @param webhook_path the path of the webhook endpoint like `/api/messages`
     */
    registerWebhookSubscription(webhook_path: any): void;
    /**
     * Register a webhook subscription with Webex Teams to start receiving message events.
     * @param webhook_path the path of the webhook endpoint like `/api/messages`
     */
    registerAdaptiveCardWebhookSubscription(webhook_path: any): void;
    /**
     * Standard BotBuilder adapter method to send a message from the bot to the messaging API.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#sendactivities).
     * @param context A TurnContext representing the current incoming message and environment.
     * @param activities An array of outgoing activities to be sent back to the messaging API.
     */
    sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]>;
    /**
     * Webex adapter does not support updateActivity.
     * @ignore
     */
    updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void>;
    /**
     * Standard BotBuilder adapter method to delete a previous message.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#deleteactivity).
     * @param context A TurnContext representing the current incoming message and environment. (not used)
     * @param reference An object in the form `{activityId: <id of message to delete>, conversation: { id: <id of slack channel>}}`
     */
    deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void>;
    /**
     * Standard BotBuilder adapter method for continuing an existing conversation based on a conversation reference.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#continueconversation)
     * @param reference A conversation reference to be applied to future messages.
     * @param logic A bot logic function that will perform continuing action in the form `async(context) => { ... }`
     */
    continueConversation(reference: Partial<ConversationReference>, logic: (context: TurnContext) => Promise<void>): Promise<void>;
    /**
     * Accept an incoming webhook request and convert it into a TurnContext which can be processed by the bot's logic.
     * @param req A request object from Restify or Express
     * @param res A response object from Restify or Express
     * @param logic A bot logic function in the form `async(context) => { ... }`
     */
    processActivity(req: any, res: any, logic: (context: TurnContext) => Promise<void>): Promise<any>;
}
