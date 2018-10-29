This sample creates an echo bot that also welcomes user when they join the conversation. The welcoming pattern shown in this bot is applicable for personal (1:1) conversation with bots. 

# Concepts introduced in this sample
## ConversationUpdate Activity Type
The [ConversationUpdate](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-activity-spec?view=azure-bot-service-3.0#conversation-update-activity) Activity type describes a change in conversation members, for example when a new user (and/or) a bot joins the conversation. The channel sends this activity when a user (and/or) bot joins the conversation. It is recommended that you test your bot behavior on the target channel. 

Bots that are added directly by a user, are mostly personal (1:1) conversation bots. It is a best practice to send a welcome message to introduce the bot tell a bit about its functionality. To do this, ensure that your bot responds to the `ConversationUpdate` message. Use the `membersAdded` field to identify the list of channel participants (bots or users) that were added to the conversation.

Your bot may proactively send a welcome message to a personal chat the first time a user initiates a personal chat with your bot. Use `UserState` to persist a flag indicating first user interaction with a bot. 

## A note about Bot Framework Emulator and Web Test in Azure Bot Service
The Bot Framework Emulator is following standard [Activity protocol](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-activity-spec) for Activity messages sent to your bot. With that said, the emulator has unique behavior that is useful for testing and debugging your bot. For example, pressing the `Start Over` button sends a `ConversationUpdate` Activity with a fresh set of identifiers (conversation, from, recipient) to which your bot may reply. 

The Web Test in Azure Bot Service is where you may test your bot using the Web Chat control. When testing your bot in Azure Bot Service Web Test, your bot receives a `ConversationUpdate` Activity only after the first time the user sends a message. Your bot will receive two activities for `ConversationUpdate` (one for the new user and one for the bot) and also a `Message` Activity containing the utterance (text) the user sent. 

In other channels such as Teams, Skype, or Slack, you can expect to receive the `ConversationUpdate` just once in the lifetime of the bot for a given user, and it may arrive as soon as the user joins the channel or sent when the user first interacts with the bot.
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
  cd sample\javascript_nodejs\03.welcome-users
  ```

  **Optional:** Update the `.env` file under `sample\javascript_nodejs\03.welcome-users` with your **botFileSecret**.
  For Azure Bot Service bots, you can find the botFileSecret under application settings.

- Install modules and start the bot:
    ```bash
    npm i && npm start
    ```
    Alternatively you can also use nodemon via:
    ```bash
    npm i && npm run watch
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
# Further reading
- [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Bot Basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity Processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)