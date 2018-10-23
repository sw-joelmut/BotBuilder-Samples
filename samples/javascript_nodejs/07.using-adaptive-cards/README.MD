This sample shows how to send an Adaptive Card. This bot example uses [`restify`](https://www.npmjs.com/package/restify) and [`dotenv`](https://www.npmjs.com/package/dotenv).

# Concepts introduced in this sample

## Adaptive Cards

Card authors describe their content as a simple JSON object. That content can then be rendered natively inside a host application, automatically adapting to the look and feel of the host.

For example, Contoso Bot can author an Adaptive Card through the Bot Framework, and when delivered to Skype, it will look and feel like a Skype card. When that same payload is sent to Microsoft Teams, it will look and feel like Microsoft Teams. As more host apps start to support Adaptive Cards, that same payload will automatically light up inside these applications, yet still feel entirely native to the app.

Users win because everything feels familiar. Host apps win because they control the user experience. Card authors win because their content gets broader reach without any additional work.

## Adding media to messages

A message exchange between user and bot can contain media attachments, such as cards, images, video, audio, and files.

Adaptive Cards are supported by Bot Framework:

- [Adaptive card](http://adaptivecards.io)
- [Send an Adaptive card](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-send-rich-cards?view=azure-bot-service-3.0&viewFallbackFrom=azure-bot-service-4.0#send-an-adaptive-card)

# To try this sample

- Clone the repository

  ```bash
  git clone https://github.com/Microsoft/botbuilder-samples.git
  ```

- In a terminal, navigate to `samples/javascript_nodejs/07.using-adaptive-cards`

  ```bash
  cd samples/javascript_nodejs/07.using-adaptive-cards
  ```

- **Optional**: Update the `.env` file under `samples/javascript_nodejs/07.using-adaptive-cards` with your `botFileSecret`. For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

- Install modules and start the bot

  ```bash
  npm i && npm start
  ```

  Alternatively you can also use nodemon via

  ```bash
  npm i && npm run watch
  ```

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator from [here](https://aka.ms/botframework-emulator)

## Connect to bot using Bot Framework Emulator V4

- Launch **Bot Framework Emulator**
- **File** -> **Open Bot Configuration** and navigate to `samples/javascript_nodejs/07.using-adaptive-cards` folder
- Select `using-adaptive-cards.bot` file

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run

```bash
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further reading

- [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Adaptive Cards](https://adaptivecards.io/)