This sample shows how to use the prompts classes included in `botbuilder-dialogs`. It demonstrates a 2-step dialog flow using a prompt, as well as using the state accessors to store and retrieve values. 

# Concepts introduced in this sample
## Prompts

A conversation between a bot and a user often involves asking (prompting) the user for information, parsing the user's response, and then acting on that information. This sample demonstrates how to prompt users for information using the different prompt types included in the [botbuilder-dialogs](https://github.com/Microsoft/botbuilder-js/tree/master/libraries/botbuilder-dialogs) library and supported by the SDK.

The `botbuilder-dialogs` library includes a variety of pre-built prompt classes, including text, number, and datetime types. This sample demonstrates using a single text prompt to collect the user's name. For an example that uses multiple prompts of different types, see [sample 5](../05.multi-turn-prompt/).
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
  cd sample\javascript_nodejs\04.simple-prompt
  ```

  **Optional:** Update the `.env` file under `sample\javascript_nodejs\04.simple-prompt` with your **botFileSecret**.
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
### Deploy from Visual Studio
### Deprovision your bot
<STEPS TO DEPROVISION>

# Further reading
- [Prompt types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Azure Bot Service Introduction](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)