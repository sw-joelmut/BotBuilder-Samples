This sample shows how to use the prompt classes included in `botbuilder-dialogs`. It demonstrates a multi-turn dialog flow using a text prompt, a number prompt, and state accessors to store and retrieve values. 

# Table of Contents
- [Concepts introduced in this sample](#concepts-introduced-in-this-sample)
  * [Prompts](#prompts)
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

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


# Concepts introduced in this sample
## Prompts
A conversation between a bot and a user often involves asking (prompting) the user for information, parsing the user's response, and then acting on that information. This sample demonstrates how to prompt users for information using the different prompt types included in the [botbuilder-dialogs](https://github.com/microsoft/botbuilder-js/tree/master/libraries/botbuilder-dialogs) library
and supported by the SDK.

The `botbuilder-dialogs` library includes a variety of pre-built prompt classes, including text, number, and datetime types. This sample demonstrates using a text prompt to collect the user's name, then using a number prompt to collect an age.

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
- Navigate to the samples folder `sample\csharp_dotnetcore\05.multi-turn-prompt` and open **MultiTurnPromptsBot.csproj** in Visual Studio 
- From the **Startup Projects** select `MultiTurnPromptsBot`
- Run the project (press `F5` key)

### Visual Studio Code
- In Visual Studio Code open the `sample\csharp_dotnetcore\05.multi-turn-prompt` folder
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
- [Prompt types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Waterfall dialogs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-dialogs/waterfall)
- [Ask the user questions](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-tutorial-waterfall?view=azure-bot-service-4.0&tabs=jstab)