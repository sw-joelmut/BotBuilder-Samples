This sample shows how to use the prompts classes included in `botbuilder-dialogs`. It demonstrates a 2-step dialog flow using a prompt, as well as using the state accessors to store and retrieve values.

# Concepts introduced in this sample

## Prompts

A conversation between a bot and a user often involves asking (prompting) the user for information, parsing the user's response, and then acting on that information. This sample demonstrates how to prompt users for information using the different prompt types included in the [botbuilder-dialogs](https://github.com/Microsoft/botbuilder-js/tree/master/libraries/botbuilder-dialogs) library and supported by the SDK.

The `botbuilder-dialogs` library includes a variety of pre-built prompt classes, including text, number, and datetime types. This sample demonstrates using a single text prompt to collect the user's name. For an example that uses multiple prompts of different types, see [sample 5](../05.multi-turn-prompt/).

# To try this sample

- Clone the samples repository

```bash
git clone https://github.com/Microsoft/botbuilder-samples.git
```

- **Optional**: Update the `appsettings.json` file under `botbuilder-samples/samples/csharp_dotnetcore/04.simple-prompt` with your `botFileSecret`.  For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

## Visual Studio

- Navigate to the samples folder (`botbuilder-samples/samples/csharp_dotnetcore/04.simple-prompt`) and open `SimplePromptBot.csproj` in Visual Studio.
- From the **Startup Projects** select `SimplePromptBot`
- Run the project (press `F5` key).

## Visual Studio Code

- Open `botbuilder-samples/samples/csharp_dotnetcore/04.simple-prompt` sample folder.
- Bring up a terminal, navigate to `botbuilder-samples/samples/csharp_dotnetcore/04.simple-prompt` folder.
- Type `dotnet run`.

## Update packages

- In Visual Studio right click on the solution and select "**Restore NuGet Packages**".
- In Visual Studio Code type `dotnet restore`

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot 
developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the [Bot Framework emulator](https://aka.ms/botframeworkemulator).

## Connect to bot using Bot Framework Emulator **V4**

- Launch the **Bot Framework Emulator**.
- **File** -> **Open Bot Configuration** and navigate to `botbuilder-samples/samples/csharp_dotnetcore/04.simple-prompt` folder.
- Select `BotConfiguration.bot` file.

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. Ensure you have [Node.js](https://nodejs.org/) version 8.5 or higher.

To install all Bot Builder tools

```bash
npm i -g msbot chatdown ludown qnamaker luis-apis botdispatch luisgen
```

To clone this bot, run

```
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further reading

- [Prompt types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Azure Bot Service Introduction](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)