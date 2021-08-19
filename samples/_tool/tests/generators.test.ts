import glob from "glob";
import path from "path";
import { nanoid, customAlphabet } from "nanoid";
import pino from "pino";
import {
  BotTester,
  AppRegistration,
  BotParameterProvider,
  ConnectionStatus,
  Bot,
  DeploymentStatus,
} from "../src/BotTester";
import assert from "assert";
import parallel from "mocha.parallel";
import _fs from "fs";

const fs = _fs.promises;

// const describe = (k, c) => c();
// const it = (k, c) => c();
const bottester = new BotTester();
const appreg = new AppRegistration();
const botParameterProvider = new BotParameterProvider();

botParameterProvider.register("app", ({ collection }) => {
  // return appreg.create({ name: collection.botId.value, secret: nanoid() });
  // return { name: "a", secret: "1" };
});

botParameterProvider.register("bot", ({ scope }) => ({
  name: `${scope.template.name}-${scope.bot.name}`,
}));

const samplesFolder = path.resolve(`C:/Users/MartinLuccanera/Coding/Manx/BotBuilder-Samples/generators`);

const bots = [
  {
    name: "0-dotnet-templates",
    folder: "dotnet-templates/Microsoft.BotFramework.CSharp.CoreBot/content/CoreBot",
  },
  // {
  //   name: "1-adaptive-dialog",
  //   folder:
  //     "adaptive-dialog/javascript_nodejs/09.integrating-composer-dialogs/",
  // },
  // {
  //   name: "2-composer-samples",
  //   folder:
  //     "composer-samples/csharp_dotnetcore/projects/51.teams-messaging-extensions-action",
  // },
  // {
  //   name: "3-composer-samples",
  //   folder:
  //     "composer-samples/csharp_dotnetcore/projects/57.teams-conversation-bot",
  // },
  // {
  //   name: "4-composer-samples",
  //   folder: "composer-samples/csharp_dotnetcore/projects/ActionSample",
  // },
  // {
  //   name: "5-composer-samples",
  //   folder: "composer-samples/javascript_nodejs/projects/actions-sample",
  // },
  // {
  //   name: "6-immediate-accept-adapter",
  //   folder: "immediate-accept-adapter/csharp_dotnetcore",
  // },
  // { name: "7-sso-with-skills", folder: "sso-with-skills/RootBot" },
  // { name: "8-sso-with-skills", folder: "sso-with-skills/SkillBot" },
  // { name: "9-teams-sso", folder: "teams-sso/csharp_dotnetcore" },
];

// [
//   'dotnet-templates/Microsoft.BotFramework.CSharp.CoreBot/content/CoreBot/DeploymentTemplates/template-with-preexisting-rg.json',
//   'dotnet-templates/Microsoft.BotFramework.CSharp.EchoBot/content/DeploymentTemplates/template-with-preexisting-rg.json',        
//   'dotnet-templates/Microsoft.BotFramework.CSharp.EmptyBot/content/DeploymentTemplates/template-with-preexisting-rg.json',       
//   'generator-botbuilder/generators/app/templates/core/deploymentTemplates/template-with-preexisting-rg.json',
//   'generator-botbuilder/generators/app/templates/echo/deploymentTemplates/template-with-preexisting-rg.json',
//   'generator-botbuilder/generators/app/templates/empty/deploymentTemplates/template-with-preexisting-rg.json',
//   'java/generators/app/templates/core/project/deploymentTemplates/template-with-preexisting-rg.json',
//   'java/generators/app/templates/echo/project/deploymentTemplates/template-with-preexisting-rg.json',
//   'java/generators/app/templates/empty/project/deploymentTemplates/template-with-preexisting-rg.json',
//   'python/app/templates/core/{{cookiecutter.bot_name}}/deploymentTemplates/template-with-preexisting-rg.json',
//   'python/app/templates/echo/{{cookiecutter.bot_name}}/deploymentTemplates/template-with-preexisting-rg.json',
//   'python/app/templates/empty/{{cookiecutter.bot_name}}/deploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBot-Core21/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBot/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBotWithTests-Core21/CoreBot/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBotWithTests/CoreBot/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EchoBot-Core21/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EchoBot/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EmptyBot-Core21/DeploymentTemplates/template-with-preexisting-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EmptyBot/DeploymentTemplates/template-with-preexisting-rg.json'
// ]

// [
//   'dotnet-templates/Microsoft.BotFramework.CSharp.CoreBot/content/CoreBot/DeploymentTemplates/template-with-new-rg.json',
//   'dotnet-templates/Microsoft.BotFramework.CSharp.EchoBot/content/DeploymentTemplates/template-with-new-rg.json',        
//   'dotnet-templates/Microsoft.BotFramework.CSharp.EmptyBot/content/DeploymentTemplates/template-with-new-rg.json',       
//   'generator-botbuilder/generators/app/templates/core/deploymentTemplates/template-with-new-rg.json',
//   'generator-botbuilder/generators/app/templates/echo/deploymentTemplates/template-with-new-rg.json',
//   'generator-botbuilder/generators/app/templates/empty/deploymentTemplates/template-with-new-rg.json',
//   'java/generators/app/templates/core/project/deploymentTemplates/template-with-new-rg.json',
//   'java/generators/app/templates/echo/project/deploymentTemplates/template-with-new-rg.json',
//   'java/generators/app/templates/empty/project/deploymentTemplates/template-with-new-rg.json',
//   'python/app/templates/core/{{cookiecutter.bot_name}}/deploymentTemplates/template-with-new-rg.json',
//   'python/app/templates/echo/{{cookiecutter.bot_name}}/deploymentTemplates/template-with-new-rg.json',
//   'python/app/templates/empty/{{cookiecutter.bot_name}}/deploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBot-Core21/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBot/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBotWithTests-Core21/CoreBot/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/CoreBotWithTests/CoreBot/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EchoBot-Core21/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EchoBot/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EmptyBot-Core21/DeploymentTemplates/template-with-new-rg.json',
//   'vsix-vs-win/BotBuilderVSIX-V4/UncompressedProjectTemplates/EmptyBot/DeploymentTemplates/template-with-new-rg.json'
// ]

// const preexistingRg = glob
//   .sync(`**/template-with-new-rg.json`, {
//     nocase: true,
//     cwd: samplesFolder,
//   })
//   .filter((e) => !e.includes("/bin/"))
//   .filter((e) => !e.includes("/obj/"))
//   // .map((path, id) => ({ id, path }))

// console.log(preexistingRg)

const appregs = [
  {
    id: "8d14de78-5fc6-4db1-9428-b4fdc079a055",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "974a67f3-8d37-42b2-8304-dc012a576d12",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "7cb2f30c-362b-453a-a497-ca2e83e6ea1a",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "628ca2a3-74d9-4606-be2c-37372f8c6d1a",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "ac2f0c66-c181-42a8-8426-7626d47a504f",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "ecb829a7-59d8-476d-9f63-cd98919800ae",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "8172c184-a2d8-4565-8222-c4897ef61475",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "475ccea9-e464-479f-b4fd-3cf1b2f4307d",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "1bc162db-db79-418d-ae45-5abb78508789",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "4aec072e-5dc0-4764-95da-71cd38c0fdce",
    secret: "jvpWoiJJzGt3Fj",
  },
];

const templates = [
  {
    name: "new-rg",
    path: "/DeploymentTemplates/template-with-new-rg.json",
    group:null,
    parameters: {
      groupLocation: { value: "westus" },
      groupName: { value: "{{ bot.name }}" },
      botId: { value: "{{ bot.name }}" },
      botSku: { value: "F0" },
      newAppServicePlanName: { value: "{{ bot.name }}" },
      newAppServicePlanLocation: { value: "westus" },
      newAppServicePlanSku: {
        value: {
          name: "S1",
          tier: "Standard",
          size: "S1",
          family: "S",
          capacity: 1,
        },
      },
      appId: { value: "{{ app.id }}" },
      appSecret: { value: "{{ app.secret }}" },
    },
    bots: bots
      .filter(({ name }) => ![].includes(name))
      .filter((e, i) => i < appregs.length && i >= 0),
  },
  // {
  //   name: "pre-rg",
  //   path: "/DeploymentTemplates/template-with-preexisting-rg.json",
  //   group: { name: "pre-rg-jmut" },
  //   parameters: {
  //     botId: { value: "{{ bot.name }}" },
  //     botSku: { value: "F0" },
  //     newAppServicePlanName: { value: "{{ bot.name }}" },
  //     appServicePlanLocation: { value: "westus" },
  //     newAppServicePlanSku: {
  //       value: {
  //         name: "S1",
  //         tier: "Standard",
  //         size: "S1",
  //         family: "S",
  //         capacity: 1,
  //       },
  //     },
  //     appId: { value: "{{ app.id }}" },
  //     appSecret: { value: "{{ app.secret }}" },
  //   },
  //   bots: bots
  //     .filter(({ name }) => ![].includes(name))
  //     .filter((e, i) => i < appregs.length && i >= 0),
  // },
];

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

for (const template of templates) {
  const now = new Date().toISOString().replace(/[:\.]/g, "-");
  const logsPath = path.resolve(
    path.join(__dirname, `/logs/${template.name}/generators-${now}.log`)
  );
  const fileLogger = pino(pino.destination(logsPath));
  describe(`template: ${template.name}, path: ${template.path}, tests: ${template.bots.length}`, () => {
    const chunks = chunkArray(template.bots, appregs.length);

    for (let i = 0; i < chunks.length; i++) {
      const bots = chunks[i];

      parallel(
        `batch: ${i + 1}/${chunks.length}, tests: ${bots?.length}`,
        () => {
          const apps = [...appregs].reverse();
          for (const bot of bots) {
            const app = apps.pop();
            it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
              const logger = fileLogger.child({
                tests: template.bots.length,
                batch: {
                  number: i + 1,
                  total: chunks.length,
                  tests: bots.length,
                },
                bot: { name: bot.name, folder: bot.folder },
              });
              const params = JSON.parse(JSON.stringify(template.parameters));
              params.appId.value = app.id;
              params.appSecret.value = app.secret;
              const parameters = await botParameterProvider.process({
                parameters: params,
                scope: {
                  bot,
                  template,
                },
              });
              const options = {
                botFolder: `${samplesFolder}/${bot.folder}`,
                template: template.path,
                parameters,
                bot: {
                  name: parameters.botId.value as string,
                },
                group: {
                  name:
                    (parameters.botId.value as string) ||
                    (parameters.groupName.value as string),
                  exists: !!template.group?.name,
                },
              };

              try {
                if (!!template.group?.name) {
                  logger.info({
                    step: "Create Resource Group",
                    name: parameters.botId.value,
                  });
                  await bottester.createResourceGroup(
                    parameters.botId.value as string
                  );
                }

                logger.info({ step: "Deploy" });
                const { bot, ...deployment } = await bottester.deploy(options);
                logger.info({ step: "Bot Health-Check" });
                await bot.connect();
                const status = await bot.status();
                await bot.disconnect();

                assert.strictEqual(
                  deployment.status,
                  DeploymentStatus.Succeeded
                );
                assert.ok(status);

                logger.info({
                  step: "Assert",
                  key: "deployment",
                  actual: deployment.status,
                  expected: DeploymentStatus.Succeeded,
                });
                logger.info({
                  step: "Assert",
                  key: "conversation-status",
                  actual: status,
                  expected: true,
                });
              } catch (error) {
                const { message, stack, ...rest } = error;
                if (typeof error === "string") {
                  logger.error({ step: "Error", error });
                } else {
                  logger.error({
                    step: "Error",
                    error: { message, stack, rest },
                  });
                }
                throw error;
              } finally {
                logger.info({ step: "CleanUp" });
                try {
                  // await bottester.cleanup({
                  //   group: {
                  //     name: options.group.name,
                  //   },
                  //   bot: { name: options.bot.name },
                  // });
                  // await appreg.remove(parameters.appId.value as string);
                } catch (error) {
                  const { message, stack, ...rest } = error;
                  if (typeof error === "string") {
                    logger.error({ step: "CleanUp-Fail", error });
                  } else {
                    logger.error({
                      step: "CleanUp-Fail",
                      error: { message, stack, rest },
                    });
                  }
                  throw error;
                }
              }
            });
          }
        }
      );
    }
  });
}



// // Delete RGs
// // for (const template of templates) {
// //   parallel(
// //     `template: ${template.name}, path: ${template.path}, tests: ${template.bots.length}`,
// //     () => {
// //       for (const bot of template.bots) {
// //         it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
// //           await bottester.cleanup({
// //             group: { name: template.name + "-" + bot.name },
// //           });
// //         });
// //       }
// //     }
// //   );
// // }
