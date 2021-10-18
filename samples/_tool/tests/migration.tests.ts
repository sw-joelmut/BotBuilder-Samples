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

const samplesFolder = path.resolve(`C:/Repositories/BotBuilder-Samples/Migration`);

const bots = [
  {
    name: "0-nlp-with-dispatch-14",
    folder: "/Dispatch/csharp/14.nlp-with-dispatch"
  },
//   {
//     name: "1-adaptive-dialog",
//     folder:
//       "adaptive-dialog/javascript_nodejs/09.integrating-composer-dialogs/",
//   },
//   {
//     name: "2-composer-samples",
//     folder:
//       "composer-samples/csharp_dotnetcore/projects/51.teams-messaging-extensions-action",
//   },
//   {
//     name: "3-composer-samples",
//     folder:
//       "composer-samples/csharp_dotnetcore/projects/57.teams-conversation-bot",
//   },
//   {
//     name: "4-composer-samples",
//     folder: "composer-samples/csharp_dotnetcore/projects/ActionSample",
//   },
//   {
//     name: "5-composer-samples",
//     folder: "composer-samples/javascript_nodejs/projects/actions-sample",
//   },
//   {
//     name: "6-immediate-accept-adapter",
//     folder: "immediate-accept-adapter/csharp_dotnetcore",
//   },
//   { name: "7-sso-with-skills", folder: "sso-with-skills/RootBot" },
//   { name: "8-sso-with-skills", folder: "sso-with-skills/SkillBot" },
//   { name: "9-teams-sso", folder: "teams-sso/csharp_dotnetcore" },
];

// const preexistingRg = glob
//   .sync(`**/template-with-preexisting-rg.json`, {
//     nocase: true,
//     cwd: samplesFolder,
//   })
//   .filter((e) => !e.includes("/bin/"))
//   .filter((e) => !e.includes("/obj/"))
//   // .map((path, id) => ({ id, path }))

const appregs = [
  {
    id: "09b67a16-f470-4acd-81c9-f0c1b8272a65",
    secret: "jvpWoiJJzGt3Fj",
  },
//   {
//     id: "5627fc20-5051-4af8-af70-ec30513a3413",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "7a95b259-0dde-4431-b4a4-0ed80c5ee06e",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "fe3ac4d0-4d35-44a7-8c39-ba34eb393165",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "d2fdd23b-27f1-4135-8efe-1f77f8f20a52",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "a1935622-bcca-4742-967d-9c048a5b8d5c",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "97eea80e-6710-4282-8d5f-f2dc4e070d12",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "b5b6eead-28f9-466b-8c88-7053e4b7929d",
//     secret: "jvpWoiJJzGt3Fj",
//   },
//   {
//     id: "07690179-7da8-4666-b8c5-691af608795d",
//     secret: "umHVC9B_2aG_M9tNml-93xpud-U8Dp.Djy",
//   },
//   {
//     id: "a37c4f15-2fc2-4e16-aafd-e6521238bfcc",
//     secret: "maiIoTWy~nO-_A4588gM7A9DR7Bo4Q~Agr",
//   },
];

const templates = [
  {
    name: "new-rg",
    path: "/DeploymentTemplates/template-with-new-rg.json",
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
//   {
//     name: "pre-rg",
//     path: "/DeploymentTemplates/template-with-preexisting-rg.json",
//     group: { name: "pre-rg-jmut" },
//     parameters: {
//       botId: { value: "{{ bot.name }}" },
//       botSku: { value: "F0" },
//       newAppServicePlanName: { value: "{{ bot.name }}" },
//       appServicePlanLocation: { value: "westus" },
//       newAppServicePlanSku: {
//         value: {
//           name: "S1",
//           tier: "Standard",
//           size: "S1",
//           family: "S",
//           capacity: 1,
//         },
//       },
//       appId: { value: "{{ app.id }}" },
//       appSecret: { value: "{{ app.secret }}" },
//     },
//     bots: bots
//       .filter(({ name }) => ![].includes(name))
//       .filter((e, i) => i < appregs.length && i >= 0),
//   },
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
    path.join(__dirname, `/logs/${template.name}/migration-${now}.log`)
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
                  exists: false,
                },
              };

              try {
                if (!!template.parameters.groupName) {
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



// Delete RGs
// for (const template of templates) {
//   parallel(
//     `template: ${template.name}, path: ${template.path}, tests: ${template.bots.length}`,
//     () => {
//       for (const bot of template.bots) {
//         it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
//           await bottester.cleanup({
//             group: { name: template.name + "-" + bot.name },
//           });
//         });
//       }
//     }
//   );
// }
