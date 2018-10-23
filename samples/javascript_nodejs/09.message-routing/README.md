This sample shows how to route messages to dialogs.

# Concepts introduced in this sample

## message-routing bot

In this sample, we create a bot that collects user information after the user greets the bot. This samples shows how to:

- Handle user interruptions for such things as Help or Cancel
- Prompt for and validate requests for information from the user

# To try this sample

- Clone the repository

  ```bash
  git clone https://github.com/microsoft/botbuilder-samples.git
  ```

- In a terminal, navigate to `javascript_nodejs/09.message-routing`

  ```bash
  cd javascript_nodejs/09.message-routing
  ```

  **Optional**: Update the `.env` file under `samples/javascript_nodejs/09.message-routing` with your `botFileSecret`. For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

- Install modules

  ```bash
  npm install
  ```

- Create [required services](https://github.com/Microsoft/BotBuilder-Samples/blob/b44fa247060a153f6a82a84103da205ffc7124e1/samples/javascript_nodejs/09.message-routing/deploymentScripts/DEPLOYMENT.MD)

- Run the sample

  ```bash
  npm start
  ```

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator from [here](https://aka.ms/botframeworkemulator).

### Connect to bot using Bot Framework Emulator V4

- Launch **Bot Framework Emulator**
- **File** -> **Open Bot Configuration** and navigate to `botbuilder-samples/samples/javascript_nodejs/09.message-routing` folder
- Select `message-routing.bot` file

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run

```bash
msbot clone services -f DeploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further reading

- [Azure Bot Service Introduction](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)

- [Bot Framework Documentation](https://docs.botframework.com/)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [LUIS](https://www.luis.ai/)
- [Prompt Types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [QnA Maker](https://qnamaker.ai/)