"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotkitTestClient = void 0;
/**
 * @module botkit
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botbuilder_core_1 = require("botbuilder-core");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
/**
 * A client for testing dialogs in isolation.
 */
class BotkitTestClient {
    constructor(channelOrAdapter, bot, dialogToTest, initialDialogOptions, middlewares, conversationState) {
        this.conversationState = conversationState || new botbuilder_core_1.ConversationState(new botbuilder_core_1.MemoryStorage());
        const dialogState = this.conversationState.createProperty('DialogState');
        let targetDialogs = [];
        if (Array.isArray(dialogToTest)) {
            dialogToTest.forEach((dialogName) => {
                targetDialogs.push(bot.dialogSet.find(dialogName));
                targetDialogs.push(bot.dialogSet.find(dialogName + '_default_prompt'));
                targetDialogs.push(bot.dialogSet.find(dialogName + ':botkit-wrapper'));
            });
            dialogToTest = dialogToTest[0];
        }
        else {
            targetDialogs = [
                bot.dialogSet.find(dialogToTest),
                bot.dialogSet.find(dialogToTest + '_default_prompt'),
                bot.dialogSet.find(dialogToTest + ':botkit-wrapper')
            ];
        }
        this._callback = this.getDefaultCallback(targetDialogs, initialDialogOptions || null, dialogState);
        if (typeof channelOrAdapter === 'string') {
            this._testAdapter = new botbuilder_core_1.TestAdapter(this._callback, { channelId: channelOrAdapter }).use(new botbuilder_core_1.AutoSaveStateMiddleware(this.conversationState));
        }
        else {
            this._testAdapter = channelOrAdapter;
        }
        this.addUserMiddlewares(middlewares);
    }
    /**
     * Send an activity into the dialog.
     * @returns a TestFlow that can be used to assert replies etc
     * @param activity an activity potentially with text
     *
     * ```javascript
     * DialogTest.send('hello').assertReply('hello yourself').then(done);
     * ```
     */
    sendActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!activity) {
                activity = { type: 'event' };
            }
            yield this._testAdapter.receiveActivity(activity);
            return this._testAdapter.activityBuffer.shift();
        });
    }
    /**
     * Get the next reply waiting to be delivered (if one exists)
     */
    getNextReply() {
        return this._testAdapter.activityBuffer.shift();
    }
    getDefaultCallback(targetDialogs, initialDialogOptions, dialogState) {
        return (turnContext) => __awaiter(this, void 0, void 0, function* () {
            const dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);
            targetDialogs.forEach(targetDialog => dialogSet.add(targetDialog));
            const dialogContext = yield dialogSet.createContext(turnContext);
            this.dialogTurnResult = yield dialogContext.continueDialog();
            if (this.dialogTurnResult.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
                this.dialogTurnResult = yield dialogContext.beginDialog(targetDialogs[0].id, initialDialogOptions);
            }
        });
    }
    addUserMiddlewares(middlewares) {
        if (middlewares != null) {
            middlewares.forEach((middleware) => {
                this._testAdapter.use(middleware);
            });
        }
    }
}
exports.BotkitTestClient = BotkitTestClient;
//# sourceMappingURL=testClient.js.map