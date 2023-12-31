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
exports.BotkitBotFrameworkAdapter = void 0;
/**
 * @module botkit
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botbuilder_1 = require("botbuilder");
const botframework_connector_1 = require("botframework-connector");
const teamsHelpers_1 = require("./teamsHelpers");
const os = require("os");
const pjson = require('../package.json'); // eslint-disable-line @typescript-eslint/no-var-requires
// Retrieve additional information, i.e., host operating system, host OS release, architecture, Node.js version
const ARCHITECTURE = os.arch();
const TYPE = os.type();
const RELEASE = os.release();
const NODE_VERSION = process.version;
const USER_AGENT = `Microsoft-BotFramework/3.1 Botkit/${pjson.version} ` +
    `(Node.js,Version=${NODE_VERSION}; ${TYPE} ${RELEASE}; ${ARCHITECTURE})`;
/**
 * This class extends the [BotFrameworkAdapter](https://docs.microsoft.com/en-us/javascript/api/botbuilder/botframeworkadapter?view=botbuilder-ts-latest) with a few additional features to support Microsoft Teams.
 * * Changes userAgent to reflect Botkit instead of BotBuilder
 * * Adds getChannels() (MS Teams)
 * * Adds middleware for adjusting location of tenant id field (MS Teams)
 */
class BotkitBotFrameworkAdapter extends botbuilder_1.BotFrameworkAdapter {
    constructor() {
        super(...arguments);
        this.botkit_worker = teamsHelpers_1.TeamsBotWorker;
    }
    /**
     * Allows for mocking of the connector client in unit tests.
     * Overridden by Botkit in order to change userAgent.
     * @ignore
     * @param serviceUrl Clients service url.
     */
    createConnectorClient(serviceUrl) {
        const client = new botframework_connector_1.ConnectorClient(this.credentials, { baseUri: serviceUrl, userAgent: USER_AGENT });
        return client;
    }
    /**
     * Allows for mocking of the OAuth API Client in unit tests.
     * Overridden by Botkit in order to change userAgent.
     * @ignore
     * @param serviceUrl Clients service url.
     */
    createTokenApiClient(serviceUrl) {
        const client = new botframework_connector_1.TokenApiClient(this.credentials, { baseUri: serviceUrl, userAgent: USER_AGENT });
        return client;
    }
    /**
     * Get the list of channels in a MS Teams team.
     * Can only be called with a TurnContext that originated in a team conversation - 1:1 conversations happen _outside a team_ and thus do not contain the required information to call this API.
     * @param context A TurnContext object representing a message or event from a user in Teams
     * @returns an array of channels in the format [{name: string, id: string}]
     */
    getChannels(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.channelData && context.activity.channelData.team) {
                const channels = yield botbuilder_1.TeamsInfo.getTeamChannels(context);
                return channels ? channels.map((c) => { if (!c.name) {
                    c.name = 'General';
                } return c; }) : [];
            }
            else {
                console.error('getChannels cannot be called from unknown team');
                return [];
            }
        });
    }
}
exports.BotkitBotFrameworkAdapter = BotkitBotFrameworkAdapter;
//# sourceMappingURL=adapter.js.map