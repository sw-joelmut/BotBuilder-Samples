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
import { categorize, CategorizeCategory } from "../src/Categorize";
import { AppRegistrationQueue } from "../src/AppRegistrationQueue";
import assert from "assert";
import parallel from "mocha.parallel";
import glob from "glob";
import _fs from "fs";

const fs = _fs.promises;

const appregs = [
  {
    id: "5dfe4cba-1794-402e-a707-eb6a9dd02add",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "26a51ce2-c20d-4cbd-a5aa-e96d7a283077",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "7715fbe4-eef2-4e1e-865f-0aa5698507bd",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "c3886c63-e5cf-4dc5-8cce-9b618897939b",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "d9f6a7cf-5d2b-46fe-89eb-101aaf006604",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "c1c61589-7887-4943-8e74-72d2fd2578aa",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "7c2d9c8e-fba0-4f01-a50a-cb3f8781a900",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "f2905080-7611-44c1-8711-68338c3bc18f",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "da6172f8-2854-46c4-a02c-56ccc652a714",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "b5ee05e4-d95e-42a6-8f80-48808f6c7a20",
    secret: "jvpWoiJJzGt3Fj",
  },
];

const samplesFolder = path.resolve(
  `C:/repos/BotBuilder-Samples/composer-samples`
);

const convert = categorize({
  templateFolders: ["/scripts/DeploymentTemplates"],
});

const searchTemplate = (options) =>
  glob
    .sync(`**/${options.template}`, {
      nocase: true,
      cwd: options.directory,
    })
    .filter((e) => !e.includes("/bin/"))
    .filter((e) => !e.includes("/obj/"));

const baseParameters = {
  botId: { value: "{{ bot.name }}" },
  botSku: { value: "F0" },
  newAppServicePlanName: { value: "{{ bot.name }}" },
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
};

const groupBy =
  <T>(arr: T[]) =>
  (key: string) => {
    return arr.reduce((acc, val) => {
      (acc[val[key]] = acc[val[key]] || []).push(val);
      return acc;
    }, {});
  };

const bots: { [x: string]: any[] } = groupBy([
  ...searchTemplate({
    template: "template-with-new-rg.json",
    directory: samplesFolder,
  })
    .map((path, id) =>
      convert({ category: CategorizeCategory.NEW_RG, id: `nrgmut-${id}`, path })
    )
    .filter(
      (e) =>
        ![
          // New RG
          "nrgmut-0",
          "nrgmut-1",
          "nrgmut-2",
          "nrgmut-3",
          "nrgmut-4",
          "nrgmut-5",
          "nrgmut-6",
          // "nrgmut-7",
          "nrgmut-8",
          // "nrgmut-9",
          "nrgmut-10",
          "nrgmut-11",
          "nrgmut-12",
          "nrgmut-13",
          "nrgmut-14",
          "nrgmut-15",
          "nrgmut-16",
          "nrgmut-17",
          "nrgmut-18",
          "nrgmut-19",
          // "nrgmut-20",
          // "nrgmut-21",
          // "nrgmut-22",
          // "nrgmut-23",
          "nrgmut-24",
        ].includes(e.id)
    ),
  ...searchTemplate({
    template: "template-with-preexisting-rg.json",
    directory: samplesFolder,
  })
    .map((path, id) =>
      convert({
        category: CategorizeCategory.PREEXISTING_RG,
        id: `prgmut-${id}`,
        path,
      })
    )
    .filter(
      (e) =>
        ![
          // Pre RG
          "prgmut-0",
          "prgmut-1",
          "prgmut-2",
          "prgmut-3",
          "prgmut-4",
          "prgmut-5",
          "prgmut-6",
          // "prgmut-7",
          "prgmut-8",
          // "prgmut-9",
          "prgmut-10",
          "prgmut-11",
          "prgmut-12",
          "prgmut-13",
          "prgmut-14",
          "prgmut-15",
          "prgmut-16",
          "prgmut-17",
          "prgmut-18",
          "prgmut-19",
          // "prgmut-20",
          "prgmut-21",
          // "prgmut-22",
          "prgmut-23",
          "prgmut-24",
        ].includes(e.id)
    ),
  // ...searchTemplate({
  //   template: "function-template-with-preexisting-rg.json",
  //   directory: samplesFolder,
  // })
  //   .map((path, id) =>
  //     convert({
  //       category: CategorizeCategory.PREEXISTING_RG,
  //       id: `fprgmut-${id}`,
  //       path,
  //     })
  //   )
  //   .filter(
  //     (e, i) =>
  //       ![
  //         "fprgmut-0",
  //         "fprgmut-1",
  //         "fprgmut-2",
  //         "fprgmut-3",
  //         "fprgmut-4",
  //       ].includes(e.id)
  //   ),
  // // .filter((e, i) => i === 0),
])("folder");

const templatesConfig = new Map();

templatesConfig.set(CategorizeCategory.NEW_RG, {
  name: "template-with-new-rg",
  parameters: {
    ...baseParameters,
    groupLocation: { value: "westus" },
    groupName: { value: "{{ bot.name }}" },
    newAppServicePlanLocation: { value: "westus" },
  },
  bots: searchTemplate({
    template: "template-with-new-rg.json",
    directory: samplesFolder,
  }).map((path, id) =>
    convert({ category: CategorizeCategory.NEW_RG, id: `nrgmut-${id}`, path })
  ),
});
templatesConfig.set(CategorizeCategory.PREEXISTING_RG, {
  name: "template-with-preexisting-rg",
  parameters: {
    ...baseParameters,
    useCosmosDb: { value: false },
    useAppInsights: { value: false },
    shouldCreateAuthoringResource: { value: false },
    shouldCreateLuisResource: { value: false },
    useStorage: { value: false },
    appServicePlanLocation: { value: "westus" },
  },
  bots: searchTemplate({
    template: "template-with-preexisting-rg.json",
    directory: samplesFolder,
  }).map((path, id) =>
    convert({
      category: CategorizeCategory.PREEXISTING_RG,
      id: `prgmut-${id}`,
      path,
    })
  ),
});
templatesConfig.set(CategorizeCategory.FUNCTION_PREEXISTING_RG, {
  name: "function-template-with-preexisting-rg",
  parameters: {
    ...baseParameters,
    useCosmosDb: { value: false },
    useAppInsights: { value: true },
    shouldCreateAuthoringResource: { value: false },
    shouldCreateLuisResource: { value: false },
    useStorage: { value: false },
    appServicePlanLocation: { value: "westus" },
  },
  bots: searchTemplate({
    template: "function-template-with-preexisting-rg.json",
    directory: samplesFolder,
  }).map((path, id) =>
    convert({
      category: CategorizeCategory.PREEXISTING_RG,
      id: `fprgmut-${id}`,
      path,
    })
  ),
});

const apps = new AppRegistrationQueue(appregs);

const filteredBots = Object.entries(bots).filter(
  (_, i) => i < apps.idle.length / 2 && i >= 0
);

const bottester = new BotTester();
const appreg = new AppRegistration();
const botParameterProvider = new BotParameterProvider();

botParameterProvider.register("app", ({ collection }) => {
  // return appreg.create({ name: collection.botId.value, secret: nanoid() });
  // return { name: "a", secret: "1" };
});

botParameterProvider.register("bot", ({ scope }) => ({
  name: scope.bot.name,
}));

const now = new Date().toISOString().replace(/[:\.]/g, "-");
const logsPath = path.resolve(
  path.join(__dirname, `/logs/composer-samples/${now}.log`)
);

describe("composer-samples tests", () => {
  for (const [_, template] of [...templatesConfig]) {
    parallel(
      `template: ${template.name}, tests: ${template.bots.length}`,
      () => {
        const fileLogger = pino(pino.destination(logsPath));
        for (const bot of template.bots.filter((e) =>
          // e.id.startsWith('fprg')
          ["fprgmut-0"].includes(e.id)
        )) {
          it(`bot: ${bot.name}, folder: ${bot.folder}, template: ${bot.template}`, async () => {
            const logger = fileLogger.child({
              tests: template.bots.length,
              bot,
            });

            const app = await apps.take();

            const params = JSON.parse(JSON.stringify(template.parameters));
            params.appId.value = app.id;
            params.appSecret.value = app.secret;
            const parameters = await botParameterProvider.process({
              parameters: params,
              scope: {
                bot,
              },
            });
            const options = {
              botFolder: `${samplesFolder}/${bot.folder}`,
              template: bot.template,
              parameters,
              bot: {
                name: parameters.botId.value as string,
              },
              group: {
                name: parameters.botId.value as string,
                exists: bot.category === CategorizeCategory.PREEXISTING_RG,
              },
            };

            if (bot.category === CategorizeCategory.PREEXISTING_RG) {
              logger.info({
                step: "Create Resource Group",
                name: parameters.botId.value,
              });
              await bottester.createResourceGroup(
                parameters.botId.value as string
              );
            }

            try {
              logger.info({ step: "Deploy" });
              const { bot, ...deployment } = await bottester.deploy(options);
              logger.info({ step: "Bot Health-Check" });
              await bot.connect();
              const status = await bot.status();
              await bot.disconnect();

              assert.strictEqual(deployment.status, DeploymentStatus.Succeeded);
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

            apps.free(app);
          });
        }
      }
    );
  }
});

// const now = new Date().toISOString().replace(/[:\.]/g, "-");
// const logsPath = path.resolve(
//   path.join(__dirname, `/logs/composer-samples/${now}.log`)
// );
// const fileLogger = pino(pino.destination(logsPath));
// parallel(`composer-samples tests`, () => {
//   for (const [folder, templates] of filteredBots) {
//     describe(`bot: ${folder}, tests: ${templates.length}`, () => {
//       for (const template of templates) {
//         const logger = fileLogger.child({
//           tests: templates.length,
//           template,
//         });
//         it(`name: ${template.name}, bot: ${folder}, template: ${template.template}, category: ${template.category}`, async () => {
//           const app = await apps.take();

//           const params = JSON.parse(
//             JSON.stringify(templatesConfig.get(template.category).parameters)
//           );
//           params.appId.value = app.id;
//           params.appSecret.value = app.secret;
//           const parameters = await botParameterProvider.process({
//             parameters: params,
//             scope: {
//               template,
//             },
//           });
//           const options = {
//             botFolder: `${samplesFolder}/${template.folder}`,
//             template: template.template,
//             parameters,
//             bot: {
//               name: parameters.botId.value as string,
//             },
//             group: {
//               name: parameters.botId.value as string,
//               exists: template.category === CategorizeCategory.PREEXISTING_RG,
//             },
//           };

//           try {
//             if (template.category === CategorizeCategory.PREEXISTING_RG) {
//               logger.info({
//                 step: "Create Resource Group",
//                 name: parameters.botId.value,
//               });
//               await bottester.createResourceGroup(
//                 parameters.botId.value as string
//               );
//             }

//             logger.info({ step: "Deploy" });
//             const { bot, ...deployment } = await bottester.deploy(options);
//             logger.info({ step: "Bot Health-Check" });
//             await bot.connect();
//             const status = await bot.status();
//             await bot.disconnect();

//             assert.strictEqual(deployment.status, DeploymentStatus.Succeeded);
//             assert.ok(status);

//             logger.info({
//               step: "Assert",
//               key: "deployment",
//               actual: deployment.status,
//               expected: DeploymentStatus.Succeeded,
//             });
//             logger.info({
//               step: "Assert",
//               key: "conversation-status",
//               actual: status,
//               expected: true,
//             });
//           } catch (error) {
//             const { message, stack, ...rest } = error;
//             if (typeof error === "string") {
//               logger.error({ step: "Error", error });
//             } else {
//               logger.error({
//                 step: "Error",
//                 error: { message, stack, rest },
//               });
//             }
//             throw error;
//           } finally {
//             logger.info({ step: "CleanUp" });
//             try {
//               // await bottester.cleanup({
//               //   group: {
//               //     name: options.group.name,
//               //   },
//               //   bot: { name: options.bot.name },
//               // });
//               // await appreg.remove(parameters.appId.value as string);
//             } catch (error) {
//               const { message, stack, ...rest } = error;
//               if (typeof error === "string") {
//                 logger.error({ step: "CleanUp-Fail", error });
//               } else {
//                 logger.error({
//                   step: "CleanUp-Fail",
//                   error: { message, stack, rest },
//                 });
//               }
//               throw error;
//             }
//           }

//           apps.free(app);
//         });
//       }
//     });
//   }
// });

// // for (const template of templates) {
// //   const now = new Date().toISOString().replace(/[:\.]/g, "-");
// //   const logsPath = path.resolve(
// //     path.join(__dirname, `/logs/${template.name}/composer-${now}.log`)
// //   );
// //   const fileLogger = pino(pino.destination(logsPath));

// //   parallel(`template: ${template.name}, tests: ${template.bots.length}`, () => {
// //     const apps = [...appregs].reverse();
// //     for (const bot of template.bots) {
// //       const app = apps.pop();
// //       it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
// //         const logger = fileLogger.child({
// //           tests: template.bots.length,
// //           bot,
// //         });
// //         const params = JSON.parse(JSON.stringify(template.parameters));
// //         params.appId.value = app.id;
// //         params.appSecret.value = app.secret;
// //         const parameters = await botParameterProvider.process({
// //           parameters: params,
// //           scope: {
// //             bot,
// //             template,
// //           },
// //         });
// //         const options = {
// //           botFolder: `${bot.baseFolder}/${bot.folder}`,
// //           template: template.path,
// //           parameters,
// //           bot: {
// //             name: parameters.botId.value as string,
// //           },
// //           group: {
// //             name:
// //               (parameters.botId.value as string) ||
// //               (parameters.groupName.value as string),
// //             exists: !!template.group?.name,
// //           },
// //         };

// //         const java: any = {};

// //         if (bot.lang == "java") {
// //           java.path = path.join(
// //             bot.baseFolder,
// //             bot.folder,
// //             "/src/main/resources/application.properties"
// //           );
// //           java.content = await fs.readFile(java.path, "utf8");

// //           const content = java.content
// //             .replace(/MicrosoftAppId=.*/gm, `MicrosoftAppId=${app.id}`)
// //             .replace(
// //               /MicrosoftAppPassword=.*/gm,
// //               `MicrosoftAppPassword=${app.secret}`
// //             );

// //           await fs.writeFile(java.path, content);
// //         }

// //         try {
// //           if (!!template.group?.name) {
// //             logger.info({
// //               step: "Create Resource Group",
// //               name: parameters.botId.value,
// //             });
// //             await bottester.createResourceGroup(
// //               parameters.botId.value as string
// //             );
// //           }

// //           // await new Promise((res) => setTimeout(() => res(1), 1000));
// //           logger.info({ step: "Deploy" });
// //           const { bot, ...deployment } = await bottester.deploy(options);
// //           // const bot = new Bot({ name: options.bot.name, group: options.group.name });
// //           logger.info({ step: "Bot Health-Check" });
// //           await bot.connect();
// //           const status = await bot.status();
// //           await bot.disconnect();

// //           assert.strictEqual(deployment.status, DeploymentStatus.Succeeded);
// //           assert.ok(status);

// //           logger.info({
// //             step: "Assert",
// //             key: "deployment",
// //             actual: deployment.status,
// //             expected: DeploymentStatus.Succeeded,
// //           });
// //           logger.info({
// //             step: "Assert",
// //             key: "conversation-status",
// //             actual: status,
// //             expected: true,
// //           });
// //         } catch (error) {
// //           const { message, stack, ...rest } = error;
// //           if (typeof error === "string") {
// //             logger.error({ step: "Error", error });
// //           } else {
// //             logger.error({
// //               step: "Error",
// //               error: { message, stack, rest },
// //             });
// //           }
// //           throw error;
// //         } finally {
// //           logger.info({ step: "CleanUp" });
// //           if (bot.lang == "java") {
// //             await fs.writeFile(java.path, java.content);
// //           }
// //           try {
// //             // await bottester.cleanup({
// //             //   group: {
// //             //     name: options.group.name,
// //             //   },
// //             //   bot: { name: options.bot.name },
// //             // });
// //             // await appreg.remove(parameters.appId.value as string);
// //           } catch (error) {
// //             const { message, stack, ...rest } = error;
// //             if (typeof error === "string") {
// //               logger.error({ step: "CleanUp-Fail", error });
// //             } else {
// //               logger.error({
// //                 step: "CleanUp-Fail",
// //                 error: { message, stack, rest },
// //               });
// //             }
// //             throw error;
// //           }
// //         }
// //       });
// //     }
// //   });
// // }

// ,
//   {
//     "name": "SCM_DO_BUILD_DURING_DEPLOYMENT",
//     "value": "true",
//     "slotSetting": false
//   }
