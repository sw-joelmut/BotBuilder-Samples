// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, InputHints, MessageFactory } = require('botbuilder');
const { ChoicePrompt, ComponentDialog, SkillDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { SsoSignInDialog } = require('./ssoSignInDialog');

const MAIN_DIALOG = 'MainDialog';
const SSO_SIGNIN_DIALOG = 'SsoSignInDialog';
const SKILL_DIALOG = 'SkillDialog';
const WATERFALL_DIALOG = 'WaterfallDialog';

/**
 * The main dialog for this bot. It uses a SkillDialog to call skills.
 */
class MainDialog extends ComponentDialog {
    constructor(auth, conversationState, conversationIdFactory, skillsConfig) {
        super(MAIN_DIALOG);

        if (!auth) throw new Error('[MainDialog]: Missing parameter \'auth\' is required');
        this.auth = auth;

        const botId = process.env.MicrosoftAppId;
        if (!botId) throw new Error('[MainDialog]: MicrosoftAppId is not set in configuration');

        const connectionName = process.env.connectionName;
        if (!connectionName) throw new Error('[MainDialog]: ConnectionName is not set in configuration');

        // We use a single skill in this example.
        const targetSkillId = 'SkillBot';
        const ssoSkill = skillsConfig.skills;
        if (!ssoSkill) throw new Error(`[MainDialog]: Skill with ID ${ targetSkillId } not found in configuration`);

        this.activeSkillPropertyName = `${ MAIN_DIALOG }.activeSkillProperty`;

        // Define the main dialog and its related components.
        // Add ChoicePrompt to render available skills.
        this.addDialog(new ChoicePrompt('ActionStepPrompt'))
        // Add ChoicePrompt to render skill actions.
            .addDialog(new SsoSignInDialog(connectionName))
        // Add main waterfall dialog for this bot.
            .addDialog(new SkillDialog(this.createSkillDialogOptions(skillsConfig, botId, conversationIdFactory, conversationState), SKILL_DIALOG));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.promptActionStep.bind(this),
            this.handleActionStep.bind(this),
            this.promptFinalStep.bind(this)
        ]));

        this.activeSkillProperty = conversationState.createProperty(this.activeSkillPropertyName);

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * // Helper to create a SkillDialogOptions instance for the SSO skill.
     */
    createSkillDialogOptions(skillsConfig, botId, conversationIdFactory, conversationState) {
        return {
            botId: botId,
            conversationIdFactory: conversationIdFactory,
            skillClient: this.auth,
            skillHostEndpoint: skillsConfig.skillHostEndpoint,
            conversationState: conversationState,
            skill: this.ssoSkill
        };
    }

    /**
     * Render a prompt to select the skill to call.
     */
    async promptActionStep(stepContext) {
        const messageText = 'What SSO action do you want to perform?';
        const repromptMessageText = 'That was not a valid choice, please select a valid choice.';
        const options = {
            prompt: MessageFactory.text(messageText, messageText, InputHints.ExpectingInput),
            retryPrompt: MessageFactory.text(repromptMessageText, repromptMessageText, InputHints.ExpectingInput),
            choices: await this.getPromptOptions(stepContext)
        };

        // Prompt the user to select a skill.
        return await stepContext.prompt('ActionStepPrompt', options);
    }

    /**
     * Creates the prompt choices based on the current sign in status
     */
    async getPromptOptions(stepContext) {
        const promptChoices = [];
        const adapter = stepContext.context.adapter;
        const token = await adapter.getUserToken(stepContext.context, this.connectionName);
        if (!token) {
            // User is not signed in.
            promptChoices.push({ value: 'Login to the root bot' });
            // Token exchange will fail when the root is not logged on and the skill should
            // show a regular OAuthPrompt.
            promptChoices.push({ value: 'Call Skill (without SSO)' });
        } else {
            // User is signed in to the parent
            promptChoices.push({ value: 'Logout from the root bot' });
            promptChoices.push({ value: 'Show token' });
            promptChoices.push({ value: 'Call Skill (with SSO)' });
        }
        return promptChoices;
    }

    async handleActionStep(stepContext) {
        // Get the skill info based on the selected skill.
        const action = stepContext.result.value.toLowerCase;
        const userId = stepContext.context.activity.from.id;
        const userTokenClient = stepContext.context.turnState.userTokenClient;

        switch (action) {
            case 'login to the root bot': {
                return await stepContext.beginDialog(SSO_SIGNIN_DIALOG, null);
            }
            case 'logout from the root bot': {
                const adapter = stepContext.context.adapter;
                await adapter.signOutUser(stepContext.context, this.connectionName);
                await stepContext.context.sendActivity('You have been signed out.');
                return await stepContext.next();
            }
            case 'show token': {
                const token = await userTokenClient.getUserToken(userId, this.connectionName, stepContext.context.activity.channelId, null);
                if (!token) {
                    await stepContext.context.sendActivity('User has no cached token.');
                } else {
                    await stepContext.context.sendActivity(`Here is your current SSO token: ${ token.Token }`);
                }
                return await stepContext.next();
            }
            case 'call skill (with sso)':
            case 'call skill (without sso)': {
                const beginSkillActivity = {
                    type: ActivityTypes.Event,
                    name: 'SSO'
                };
                await this.activeSkillProperty.set(stepContext.context, this.ssoSkill);
                return await stepContext.beginDialog(SKILL_DIALOG, { activity: beginSkillActivity });
            }
            default: {
                throw new Error(`[MainDialog]: Unrecognized action: ${ action }`);
            }
        }
    }

    async promptFinalStep(stepContext) {
        // Clear active skill in state.
        await this.activeSkillProperty.delete(stepContext.context);

        // Restart the main dialog with a different message the second time around.
        return await stepContext.replaceDialog(this.initialDialogId, null);
    }
}
module.exports.MainDialog = MainDialog;
