// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const { ComponentDialog, OAuthPrompt } = require('botbuilder-dialogs');

class LogoutDialog extends ComponentDialog {
    constructor(id, connectionName) {
        super(id);
        this.connectionName = connectionName;
    }

    async onBeginDialog(innerDc, options) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }

        return await super.onBeginDialog(innerDc, options);
    }

    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }

        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {
        if (innerDc.context.activity.type === ActivityTypes.Message) {
            const text = innerDc.context.activity.text.toLowerCase();
            if (text === 'logout') {
                const signOutMessage = 'You have been signed out.';
                const oauthPrompt = new OAuthPrompt(
                    'SignOut',
                    {
                        connectionName: this.connectionName,
                        text: signOutMessage,
                        title: 'Sign Out'
                    }
                );

                await oauthPrompt.signOutUser(innerDc.context);
                await innerDc.context.sendActivity(signOutMessage);
                return await innerDc.cancelAllDialogs();
            }
        }
    }
}

module.exports.LogoutDialog = LogoutDialog;
