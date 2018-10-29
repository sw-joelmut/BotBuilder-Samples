This sample demonstrates the use of suggested actions. 

# Table of Contents
- [Concepts introduced in this sample](#concepts-introduced-in-this-sample)
  * [Suggested actions](#suggested-actions)
- [To try this sample](#to-try-this-sample)
  * [Prerequisites](#prerequisites)
    + [Clone the repo](#clone-the-repo)
  * [Run the Sample](#run-the-sample)
    + [Visual Studio](#visual-studio)
    + [Visual Studio Code](#visual-studio-code)
  * [Testing the bot using Bot Framework Emulator](#testing-the-bot-using-bot-framework-emulator)
    + [Connect to bot using Bot Framework Emulator **V4**](#connect-to-bot-using-bot-framework-emulator---v4--)
  * [Deploy to Azure](#deploy-to-azure)
    + [Using CLI Tools](#using-cli-tools)
- [Further reading](#further-reading)

# Concepts introduced in this sample
## Suggested actions
Suggested actions enable your bot to present buttons that the user can tap to provide input. Suggested actions appear close to the composer and enhance user experience by enabling the user to answer a question or make a selection with a simple tap of a button, rather than having to type a response with a keyboard.

Unlike buttons that appear within rich cards (which remain visible and accessible to the user even after being tapped), buttons that appear within the suggested actions pane will disappear after the user makes a selection. This prevents the user from tapping stale buttons within a conversation and simplifies bot development (since you will not need to account for that scenario).

# To try this sample
## Prerequisites
### Clone the repo
To clone the repository:
```bash
git clone https://github.com/microsoft/botbuilder-samples.git
```

**NOTE**: this sample requires `Microsoft.Bot.Builder`.
- In Visual Studio right click on the solution and select "Restore NuGet Packages".
- In Visual Studio Code type `dotnet restore`

## Run the Sample
### Visual Studio
- Navigate to the samples folder `sample\csharp_dotnetcore\08.suggested-actions` and open **SuggestedActionsBot.csproj** in Visual Studio 
- From the **Startup Projects** select `SuggestedActionsBot`
- Run the project (press `F5` key)

### Visual Studio Code
- In Visual Studio Code open the `sample\csharp_dotnetcore\08.suggested-actions` folder
- In the console type `dotnet run`

## Testing the bot using Bot Framework Emulator
[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework emulator from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

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
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Suggested actions](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-send-suggested-actions?view=azure-bot-service-4.0)
- [Bot State](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-storage-concept?view=azure-bot-service-4.0)