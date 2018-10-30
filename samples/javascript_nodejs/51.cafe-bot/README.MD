Contoso cafe bot is a complete and fairly sophisticated sample that demonstrates various parts of the [BotBuilder V4 SDK](https://github.com/microsoft/botbuilder-dotnet) and [BotBuilder CLI tools](https://github.com/microsoft/botbuilder-tools) in action. 

This sample relies on prior knowledge / familiarity with the following tools and services 
- [LUIS](https://www.luis.ai)
- [QnA Maker](https://qnamaker.ai)
- [Ludown CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Ludown)
- [LUIS CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUIS)
- [QnA Maker CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/QnAMaker)
- [MSBOT CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/MSBot)
- [Chatdown CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown)
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator) 

# Table of Contents
- [Concepts introduced in this sample](#concepts-introduced-in-this-sample)
  * [Scenarios demonstrated](#scenarios-demonstrated)
  * [Services and tools demonstrated](#services-and-tools-demonstrated)
  * [Scenarios covered via other samples](#scenarios-covered-via-other-samples)
- [To try this sample](#to-try-this-sample)
  * [Prerequisites](#prerequisites)
    + [Required Tools](#required-tools)
    + [Clone the repo](#clone-the-repo)
  * [Configure Services](#configure-services)
  * [Install CLI tools](#install-cli-tools)
  * [Configure required services using MSBOT](#configure-required-services-using-msbot)
  * [Relevant commands for CLI tools](#relevant-commands-for-cli-tools)
    + [Building and creating services](#building-and-creating-services)
    + [Making updates to the models](#making-updates-to-the-models)
    + [Updating and publishing QnA Maker KB](#updating-and-publishing-qna-maker-kb)
  * [Run the Sample](#run-the-sample)
    + [Visual Studio Code](#visual-studio-code)
  * [Testing the bot using Bot Framework Emulator](#testing-the-bot-using-bot-framework-emulator)
    + [Connect to bot using Bot Framework Emulator **V4**](#connect-to-bot-using-bot-framework-emulator---v4--)
- [Further reading](#further-reading)

# Concepts introduced in this sample

Contoso cafe bot is a fairly sophisticated bot sample that uses the following concepts in the [BotBuilder V4 SDK](https://github.com/microsoft/botbuilder-js) and [BotBuilder CLI tools](https://github.com/microsoft/botbuilder-tools) - 

## Scenarios demonstrated

- Welcoming users
- Using cards to interact with users
- Using suggested actions to solicit user input
- Single and multi-turn conversations with users
- Interruptable, multi-turn conversations
- Support for help and cancel
- FAQ
- Chit-chat conversations
- Routing user input to appropriate dialog
- Handling no-match 
- Prompting users for information
- Implementing a custom prompt
- Multi-turn conversations using dialogs
- Implementing custom dialog solution
- Managing user and conversation state

## Services and tools demonstrated

- Using [LUIS](https://www.luis.ai) for Natural Language Processing
- Using [QnA Maker](https://qnamaker.ai) for FAQ, chit-chat, getting help and other single-turn conversations
- Using [BotBuilder CLI tools](https://github.com/microsoft/botbuilder-tools) to create, configure and manage all required services.

## Scenarios covered via other samples

- [Proactive messages](../../../samples/javascript_nodejs/16.proactive-messages)
- [Multi-lingual conversations](../../../samples/javascript_nodejs/17.multi-lingual-conversations)
- [Bot authentication](../../../samples/javascript_nodejs/18.bot-authentication)

# To try this sample
## Prerequisites
###	Required Tools
- [Install required CLI tools](#Install-CLI-tools)
- Configure required services
  - [Using MSBOT CLI](#Configure-required-services-using-msbot)
  - [Manually import models using Ludown, LUIS and QnA Maker CLI](#building-and-creating-services)

### Clone the repo
To clone the repository:
```bash
git clone https://github.com/microsoft/botbuilder-samples.git
```

## Configure Services
## Install CLI tools

Ensure you have [Node.js](https://nodejs.org/) version 8.5 or higher

- In a terminal

  ```bash
  npm i -g msbot chatdown ludown luis-apis qnamaker 
  ```

## Configure required services using MSBOT

1. Follow instructions [here](https://portal.azure.com) to create an Azure account. If you already have an account, sign in. Click on *All services* then search for '*subscriptions*', copy the subscription ID you would like to use from the *Subscriptions page* in *Home*.

2. Follow instructions [here](https://www.luis.ai/home) to create a LUIS.ai account. If you already have an account, sign in. Click on your name on top right corner of the screen, then *settings*, and grab your authoring key.

3. To create and configure required LUIS and QnA Maker services, 

   - In a terminal:

     ```bash
     cd samples/javascript_nodejs/51.cafe-bot
     ```

   - Run MSbot Clone and pass in your LUIS authoring key and Azure subscription ID. This command will create required services for your bot and update the .bot file.

     ```bash
     msbot clone services -n <YOUR-BOT-NAME> -f deploymentScripts/msbotClone -l <Bot service location> --luisAuthoringKey <Key from step-2 above> --subscriptionId <Key from step-1 above>
     ```

		Optionally, you can use the LUIS, QnA Maker portals to manually import the models found under **cognitiveModels** folder of this sample. Use portals (Manual)

## Relevant commands for CLI tools

### Building and creating services

- Parse `.lu` files into LUIS models:

  ```bash
  ludown parse toluis --in dialogs/dispatcher/resources/cafeDispatchModel.lu -o cognitiveModels -n cafeDispatchModel.luis --verbose
  ```
  ```bash
  ludown parse toluis --in dialogs/bookTable/resources/turn-N.lu -o cognitiveModels -n cafeBotBookTableTurnN.luis --verbose
  ```
  ```bash
  ludown parse toluis --in dialogs/whoAreYou/resources/getUserProfile.lu -o cognitiveModels -n getUserProfile.luis --verbose
  ```

- Parse `.lu` files into QnA Maker KB and QnA Maker alterations file:

  ```bash
  ludown parse toqna --in dialogs/dispatcher/resources/cafeFAQ_ChitChat.lu -o cognitiveModels -n cafeFaqChitChat.qna -a --verbose
  ```

- Import LUIS applications and update the `.bot` file with LUIS service references:

  - Follow instructions [here](https://www.luis.ai/home) to create a LUIS.ai account. If you already have an account, sign in. Click on your name on top right corner of the screen, then *settings*, and grab your authoring key.
  - `LUIS-AUTHORING-REGION` can be one of [westus|westeurope|australiaeast]. See [here](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-reference-regions) for more information.

  ```bash
  luis import application --in cognitiveModels/cafeDispatchModel.luis --authoringKey <Your LUIS authoring key> --region <LUIS-AUTHORING-REGION> --msbot | msbot connect luis --stdin
  ```
  ```bash
  luis import application --in cognitiveModels/cafeBotBookTableTurnN.luis --authoringKey <Your LUIS authoring key> --region <LUIS-AUTHORING-REGION> --msbot | msbot connect luis --stdin
  ```
  ```bash
  luis import application --in cognitiveModels/getUserProfile.luis --authoringKey <Your LUIS authoring key> --region <LUIS-AUTHORING-REGION> --msbot | msbot connect luis --stdin
  ```

- Import QnA Maker KBs (Note: You don't need this if you have already run MSBOT clone):

  - Follow instructions [here](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/quickstarts/create-new-kb-nodejs#prerequisites) to create a QnA Maker subscription and copy your QnA Maker subscription key.

  ```bash
  qnamaker create kb --in cognitiveModels/cafeFaqChitChat.qna --subscriptionKey <Your QnA Maker subscription key> --msbot | msbot connect qna --stdin
  ```

- Train LUIS model:

  ```bash
  msbot get cafeDispatchModel | luis train version --wait --stdin
  msbot get cafeBotBookTableTurnN | luis train version --wait --stdin
  msbot get getUserProfile | luis train version --wait --stdin
  ```

- Publish LUIS models:

  ```bash
  msbot get cafeDispatchModel | luis publish version --stdin
  msbot get cafeBotBookTableTurnN | luis publish version --stdin
  msbot get getUserProfile | luis publish version --stdin
  ```

- Train and publish QnA Maker KB:

  ```bash
  msbot get cafeFaqChitChat | qnamaker publish kb --stdin
  ```

- Replace QnA Maker alterations:

  ```bash
  msbot get cafeFaqChitChat | qnamaker replace alterations --in cognitiveModels/cafeFaqChitChat.qna_Alterations.json --stdin
  ```

### Making updates to the models 

Any time you change `.lu` files, you can update and publish the LUIS and QnA Maker models using the following commands. You can also script and automate the CLI tools to match your development workflow. See [here](./deploymentScripts/updateModels.bat) for an example.

- Parse `.lu` files into LUIS models:

	```bash
	ludown parse toluis --in dialogs/dispatcher/resources/cafeDispatchModel.lu -o cognitiveModels -n cafeDispatchModel.luis --verbose
	```
	```bash
	ludown parse toluis --in dialogs/bookTable/resources/turn-N.lu -o cognitiveModels -n cafeBotBookTableTurnN.luis --verbose
	```
	```bash
	ludown parse toluis --in dialogs/whoAreYou/resources/getUserProfile.lu -o cognitiveModels -n getUserProfile.luis --verbose
	```

- Parse `.lu` files into QnA Maker KB and QnA Maker alterations file:

  ```bash
  > ludown parse toqna --in dialogs/dispatcher/resources/cafeFAQ_ChitChat.lu -o cognitiveModels -n cafeFaqChitChat.qna -a --verbose
  ```

- Rename current LUIS version:

  ```bash
  > msbot get cafeDispatchModel --secret <Key if your bot file is encrypted> | luis rename version --newVersionId 0.1_old --stdin
  ```

- Import a LUIS new application version:

  ```bash
  > msbot get cafeDispatchModel --secret <Key if your bot file is encrypted> | luis import version --stdin --in cognitiveModels/cafeDispatchModel.luis
  ```

- Deleting old LUIS application version:

  ```bash
  > msbot get cafeDispatchModel --secret <Key if your bot file is encrypted> | luis delete version --stdin --versionId 0.1_old
  ```

- Training a LUIS model

  ```bash
  > msbot get cafeDispatchModel --secret <Key if your bot file is encrypted> | luis train version --wait --stdin
  ```

- Publishing a LUIS model:

  ```bash
  > msbot get cafeDispatchModel --secret <Key if your bot file is encrypted> | luis publish version --stdin
  ```

### Updating and publishing QnA Maker KB

- Replace KB contents:

  ```bash
  > msbot get cafeFaqChitChat --secret <Key if your bot file is encrypted> | qnamaker replace kb --in cognitiveModels/cafeFaqChitChat.qna --stdin
  ```

- Train and publish KB:

  ```bash
  > msbot get cafeFaqChitChat --secret <Key if your bot file is encrypted> | qnamaker publish kb --stdin
  ```

- Replace QnA Maker alterations:
  ```bash
  msbot get cafeFaqChitChat --secret <Key if your bot file is encrypted> | qnamaker replace alterations --in cognitiveModels/cafeFaqChitChat.qna_Alterations.json --stdin
  ```

## Run the Sample

### Visual Studio Code
- In a terminal, navigate to the following directory:
  ```bash
  cd samples\javascript_nodejs\51.cafe-bot
  ```

  **Optional:** Update the `.env` file under `samples\javascript_nodejs\51.cafe-bot` with your **botFileSecret**.
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

# Further reading
- [LUIS](https://www.luis.ai)
- [QnA Maker](https://qnamaker.ai)
- [Ludown CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Ludown)
- [LUIS CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUIS)
- [QnA Maker CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/QnAMaker)
- [MSBOT CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/MSBot)
- [Chatdown CLI tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown)
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator)