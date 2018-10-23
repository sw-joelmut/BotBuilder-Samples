This sample shows how to create a bot that uses Rich Cards. This bot example uses [`restify`](https://www.npmjs.com/package/restify) and [`dotenv`](https://www.npmjs.com/package/dotenv). 

# Concepts introduced in this sample

## Rich Cards

A key to good bot design is to send interactive media, such as Rich Cards. There are several different types of Rich Cards, which are as follows:

- Animation Card
- Audio Card
- Hero Card
- Receipt Card
- Signin Card
- Thumbnail Card
- Video Card

When [designing the user experience](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-design-user-experience?view=azure-bot-service-4.0#cards) developers should consider adding visual elements such as Rich Cards.

# To try this sample

- Clone the repository

  ```bash
  git clone https://github.com/microsoft/botbuilder-samples.git
  ```

- In a terminal, 

  ```bash
  cd samples/javascript_nodejs/06.using-cards
  ```

- **Optional**: Update the .`env` file under `samples/javascript_nodejs/06.using-cards` with your `botFileSecret`. For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

- Install modules and start the bot

  ```bash
  npm i && npm start
  ```

  Alternatively you can also use nodemon via

  ```bash
  npm i && npm run watch
  ```

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot 
developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the [Bot Framework emulator](https://aka.ms/botframeworkemulator).

## Connect to bot using Bot Framework Emulator **V4**

- Launch the **Bot Framework Emulator**.
- **File** -> **Open Bot Configuration** and navigate to `botbuilder-samples/samples/javascript_nodejs/06.using-cards` folder.
- Select `using-cards.bot` file.

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run

```
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further reading

- [Azure Bot Service Introduction](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Rich cards](https://docs.microsoft.com/en-us/azure/bot-service/dotnet/bot-builder-dotnet-add-rich-card-attachments?view=azure-bot-service-4.0)

