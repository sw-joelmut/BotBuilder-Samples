 This sample demonstrates how to implement a Cortana Skill that properly handles EndOfConversation

# Table of Contents
- [Concepts introduced in this sample](#concepts-introduced-in-this-sample)
- [Cortana Skills](#cortana-skills)
- [To try this sample](#to-try-this-sample)
  * [Prerequisites](#prerequisites)
    + [Clone the repo](#clone-the-repo)
  * [Run the Sample](#run-the-sample)
    + [Visual Studio Code](#visual-studio-code)
  * [Testing the bot using Bot Framework Emulator](#testing-the-bot-using-bot-framework-emulator)
    + [Connect to bot using Bot Framework Emulator **V4**](#connect-to-bot-using-bot-framework-emulator---v4--)
  * [Deploy to Azure](#deploy-to-azure)
    + [Using CLI Tools](#using-cli-tools)
- [Further reading](#further-reading)

# Concepts introduced in this sample

# Cortana Skills

 Cortana skills are standard BotBuilder bots that require a few additional considerations specific to Cortana. 

The first thing to understand about a Cortana skill is that Cortana follows a very rigid turn based model of speaking where the user sends a single message to the bot, then the bot sends a single reply to the user, then the user sends a message back to the bot, the bot then sends a reply, and so on. The important thing to note from the bots perspective is that once you've sent a message to the user you are not allowed to send another message to the user until they've replied. You can work around this to some extent using the [inputHint](https://docs.microsoft.com/en-us/javascript/api/botframework-schema/activity?view=botbuilder-ts-latest#inputhint) property off the outgoing activity but in general your skill needs to conform to this back and forth conversation flow.

Another thing unique to Cortana skills is the use of the [EndOfConversation](https://docs.microsoft.com/en-us/javascript/api/botframework-schema/activitytypes?view=botbuilder-ts-latest) activity to indicate that the current skill invocation is finished. This activity can be sent from Cortana to the bot to indicate that the user closed the Cortana window in the UI, and it can be sent from the bot to Cortana to indicate that the Cortana window should be closed. It's worth noting that Cortana in some cases will re-use the same conversation ID on multiple invocations. This can potentially lead to skills starting off in the wrong state so as a best practice your skill should include logic to clear its conversation state anytime an `EndOfConversation` activity is detected. The sample includes a `CortanaSkill` base class that you can derive your bots main dialog from and automatically pickup the logic to clear your bots conversation state anytime an `EndOfConversation` activity is detected.

Cortana skills tend to be more multi-modal in their use of both speech and text. You can use the activities `speak` field to send Cortana standard [Speech Synthesis Markup Language(SSML)](https://docs.microsoft.com/en-us/cortana/skills/speech-synthesis-markup-language) that should be spoken to the user. The sample includes a simple `ssml` module that helps make composing valid SSML easier.

When creating skills targeted at Cortana for the desktop you'll want to fill in both the `text` and `speak` fields of the outgoing activity and you'll find the thing you want to show to the user and speak to the user are often quite different. The sample includes a simple `Language Generation (LG)` module that simplifies composing activities containing both `text` and `speak` fields. 

# To try this sample
## Prerequisites
### Clone the repo
To clone the repository:
```bash
git clone https://github.com/microsoft/botbuilder-samples.git
```

## Run the Sample
### Visual Studio Code
- In a terminal, navigate to the following directory:
  ```bash
  cd samples\javascript_nodejs\50.diceroller-skill
  ```

  **Optional:** Update the `.env` file under `samples\javascript_nodejs\50.diceroller-skill` with your **botFileSecret**.
  For Azure Bot Service bots, you can find the botFileSecret under application settings.

- Point to the MyGet feed 

    ```bash
    npm config set registry https://botbuilder.myget.org/F/botbuilder-v4-js-daily/npm/
    ```

- Install modules and start the bot:

    ```bash
    npm i && npm start
    ```
    Alternatively you can also use nodemon via:
    ```bash
    npm i && npm run watch
    ```

- To reset registry, you can do
    ```bash
    npm config set registry
    ```

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

Install the Bot Framework emulator from [here](https://github.com/Microsoft/BotFramework-Emulator/releases).

### Connect to bot using Bot Framework Emulator **V4**
- Launch Bot Framework Emulator
- From the *File* menu select *Open Bot Configuration*
- Navigate to your `.bot` file

## Deploy to Azure
### Using CLI Tools
You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run:

```bash
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```
- Write down the secret generated by `MSBot`. 
- The secret key is used later for the emulator and configuration:
  ```bash
  The secret used to decrypt <NAME>.bot is:
    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=
    NOTE: This secret is not recoverable and you should store this secret in a secure place according to best security practices.
    Your project may be configured to rely on this secret and you should update it as appropriate.
  ```
- Inspect Bot configuration file.
- The `msbot clone` command above generates a bot configuration file.
- The name of the bot configuration file is `<NAME>.bot`, where `<NAME>` is the name of your bot used in the `msbot clone` step.
- The configuration file can be loaded by the [Microsoft Bot Framework Emulator](https://aka.ms/botframeworkemulator).
# Further reading

- [Dialog class reference](https://docs.microsoft.com/en-us/javascript/api/botbuilder-dialogs/dialog)
- [Define conversation steps with waterfalls](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-dialog-waterfall?view=azure-bot-service-3.0)
- [Manage complex conversation flows with dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-dialog-manage-complex-conversation-flow?view=azure-bot-service-4.0&tabs=javascript)