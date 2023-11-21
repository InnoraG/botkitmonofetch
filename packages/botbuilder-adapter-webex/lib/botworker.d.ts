/**
 * @module botbuilder-adapter-webex
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { BotWorker, BotkitMessage } from 'botkit';
import * as Webex from 'webex';
/**
 * This is a specialized version of [Botkit's core BotWorker class](core.md#BotWorker) that includes additional methods for interacting with Webex Teams.
 * It includes all functionality from the base class, as well as the extension methods below.
 *
 * When using the WebexAdapter with Botkit, all `bot` objects passed to handler functions will include these extensions.
 */
export declare class WebexBotWorker extends BotWorker {
    /**
     * An instance of the [webex api client](https://www.npmjs.com/package/webex)
     */
    api: Webex;
    /**
     * Change the context of the _next_ message
     * Due to a quirk in the Webex API, we can't know the address of the DM until after sending the first message.
     * As a result, the internal tracking for this conversation can't be persisted properly.
     * USE WITH CAUTION while we try to sort this out.
     * @param userId user id of a webex teams user, like one from `message.user`
     */
    startPrivateConversation(userId: string): Promise<any>;
    /**
     * Switch a bot's context into a different room.
     * After calling this method, messages sent with `bot.say` and any dialogs started with `bot.beginDialog` will occur in this new context.
     *
     * ```javascript
     * controller.hears('take this offline', 'message', async(bot, message) => {
     *
     *      // switch to a different channel
     *      await bot.startConversationInRoom(WEBEX_ROOM_ID, message.user);
     *
     *      // say hello
     *      await bot.say('Shall we discuss this matter over here?');
     *      // ... continue...
     *      await bot.beginDialog(ANOTHER_DIALOG);
     *
     * });
     * ```
     *
     * Also useful when sending pro-active messages such as those sent on a schedule or in response to external events:
     * ```javascript
     * // Spawn a worker
     * let bot = await controller.spawn();
     *
     * // Set the context for the bot's next action...
     * await bot.startConversationInRoom(CACHED_ROOM_ID, CACHED_USER_ID);
     *
     * // Begin a dialog in the 1:1 context
     * await bot.beginDialog(ALERT_DIALOG);
     * ```
     *
     * @param roomId A Webex rooom id, like one found in `message.channel`
     * @param userId A Webex user id, like one found in `message.user`
     */
    startConversationInRoom(roomId: string, userId: string): Promise<any>;
    /**
     * Switch a bot's context into a specific thread within a room.
     * After calling this method, messages sent with `bot.say` and any dialogs started with `bot.beginDialog` will occur in this new context.
     *
     * ```javascript
     * controller.hears('take this offline', 'message', async(bot, message) => {
     *
     *      // switch to a different channel
     *      await bot.startConversationInThread(WEBEX_ROOM_ID, message.user, message.id);
     *
     *      // say hello
     *      await bot.say('Shall we discuss this matter over here?');
     *      // ... continue...
     *      await bot.beginDialog(ANOTHER_DIALOG);
     *
     * });
     * ```
     *
     * Also useful when sending pro-active messages such as those sent on a schedule or in response to external events:
     * ```javascript
     * // Spawn a worker
     * let bot = await controller.spawn();
     *
     * // Set the context for the bot's next action...
     * await bot.startConversationInRoom(CACHED_ROOM_ID, CACHED_USER_ID);
     *
     * // Begin a dialog in the 1:1 context
     * await bot.beginDialog(ALERT_DIALOG);
     * ```
     *
     * @param roomId A Webex rooom id, like one found in `message.channel`
     * @param userId A Webex user id, like one found in `message.user`
     * @param parentId A webex message id that should be the parent message, like the one found in `message.id`
     */
    startConversationInThread(roomId: string, userId: string, parentId: string): Promise<any>;
    /**
     * Like bot.reply, but as a threaded response to the incoming message rather than a new message in the main channel.
     * @param src an incoming message object
     * @param resp an outgoing message object (or part of one or just reply text)
     */
    replyInThread(src: any, resp: any): Promise<any>;
    /**
     * Delete an existing message.
     *
     * ```javascript
     * // send a reply, capture the results
     * let sent = await bot.reply(message,'this is my original reply...');
     *
     * // delete the sent message using the sent.id field
     * await bot.deleteMessage(sent);
     * ```
     *
     * @param update An object in the form of `{id: <id of message to delete>}`
     */
    deleteMessage(update: Partial<BotkitMessage>): Promise<any>;
}
