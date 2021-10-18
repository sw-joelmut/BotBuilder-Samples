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
  }).map((path, id) =>
    convert({ category: CategorizeCategory.NEW_RG, id: `new-rg-${id}`, path })
  ),
  ...searchTemplate({
    template: "template-with-preexisting-rg.json",
    directory: samplesFolder,
  }).map((path, id) =>
    convert({
      category: CategorizeCategory.PREEXISTING_RG,
      id: `pre-rg-${id}`,
      path,
    })
  ),
])("folder");

const templatesConfig = new Map();

templatesConfig.set(CategorizeCategory.NEW_RG, {
  parameters: {
    ...baseParameters,
    groupLocation: { value: "westus" },
    groupName: { value: "{{ bot.name }}" },
    newAppServicePlanLocation: { value: "westus" },
  },
});
templatesConfig.set(CategorizeCategory.PREEXISTING_RG, {
  parameters: {
    ...baseParameters,
    appServicePlanLocation: { value: "westus" },
  },
});


const apps = new AppRegistrationQueue(appregs);

const filteredBots = Object.entries(bots)
  .filter(([key, val]) => val.some((e) => ![].includes(e.id)))
  .filter((_, i) => i < apps.idle.length / 2 && i >= 0);

const bottester = new BotTester();
const appreg = new AppRegistration();
const botParameterProvider = new BotParameterProvider();

botParameterProvider.register("app", ({ collection }) => {
  // return appreg.create({ name: collection.botId.value, secret: nanoid() });
  // return { name: "a", secret: "1" };
});

botParameterProvider.register("bot", ({ scope }) => ({
  name: scope.template.name,
}));

for (const [folder, templates] of filteredBots) {
  parallel(`bot: ${folder}, tests: ${templates.length}`, () => {
    for (const template of templates) {
      it(`name: ${template.name}, template: ${template.template}, category: ${template.category}`, async () => {
        const app = await apps.take();
        console.log(app);

        const params = JSON.parse(
          JSON.stringify(templatesConfig.get(template.category).parameters)
        );
        params.appId.value = app.id;
        params.appSecret.value = app.secret;
        const parameters = await botParameterProvider.process({
          parameters: params,
          scope: {
            template,
          },
        });
        const options = {
          botFolder: `${samplesFolder}/${template.folder}`,
          template: template.folder,
          parameters,
          bot: {
            name: parameters.botId.value as string,
          },
          group: {
            name: parameters.botId.value as string,
            exists: template.category === CategorizeCategory.PREEXISTING_RG,
          },
        };

        apps.free(app);
      });
    }
  });
}

// for (const template of templates) {
//   const now = new Date().toISOString().replace(/[:\.]/g, "-");
//   const logsPath = path.resolve(
//     path.join(__dirname, `/logs/${template.name}/composer-${now}.log`)
//   );
//   const fileLogger = pino(pino.destination(logsPath));

//   parallel(`template: ${template.name}, tests: ${template.bots.length}`, () => {
//     const apps = [...appregs].reverse();
//     for (const bot of template.bots) {
//       const app = apps.pop();
//       it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
//         const logger = fileLogger.child({
//           tests: template.bots.length,
//           bot,
//         });
//         const params = JSON.parse(JSON.stringify(template.parameters));
//         params.appId.value = app.id;
//         params.appSecret.value = app.secret;
//         const parameters = await botParameterProvider.process({
//           parameters: params,
//           scope: {
//             bot,
//             template,
//           },
//         });
//         const options = {
//           botFolder: `${bot.baseFolder}/${bot.folder}`,
//           template: template.path,
//           parameters,
//           bot: {
//             name: parameters.botId.value as string,
//           },
//           group: {
//             name:
//               (parameters.botId.value as string) ||
//               (parameters.groupName.value as string),
//             exists: !!template.group?.name,
//           },
//         };

//         const java: any = {};

//         if (bot.lang == "java") {
//           java.path = path.join(
//             bot.baseFolder,
//             bot.folder,
//             "/src/main/resources/application.properties"
//           );
//           java.content = await fs.readFile(java.path, "utf8");

//           const content = java.content
//             .replace(/MicrosoftAppId=.*/gm, `MicrosoftAppId=${app.id}`)
//             .replace(
//               /MicrosoftAppPassword=.*/gm,
//               `MicrosoftAppPassword=${app.secret}`
//             );

//           await fs.writeFile(java.path, content);
//         }

//         try {
//           if (!!template.group?.name) {
//             logger.info({
//               step: "Create Resource Group",
//               name: parameters.botId.value,
//             });
//             await bottester.createResourceGroup(
//               parameters.botId.value as string
//             );
//           }

//           // await new Promise((res) => setTimeout(() => res(1), 1000));
//           logger.info({ step: "Deploy" });
//           const { bot, ...deployment } = await bottester.deploy(options);
//           // const bot = new Bot({ name: options.bot.name, group: options.group.name });
//           logger.info({ step: "Bot Health-Check" });
//           await bot.connect();
//           const status = await bot.status();
//           await bot.disconnect();

//           assert.strictEqual(deployment.status, DeploymentStatus.Succeeded);
//           assert.ok(status);

//           logger.info({
//             step: "Assert",
//             key: "deployment",
//             actual: deployment.status,
//             expected: DeploymentStatus.Succeeded,
//           });
//           logger.info({
//             step: "Assert",
//             key: "conversation-status",
//             actual: status,
//             expected: true,
//           });
//         } catch (error) {
//           const { message, stack, ...rest } = error;
//           if (typeof error === "string") {
//             logger.error({ step: "Error", error });
//           } else {
//             logger.error({
//               step: "Error",
//               error: { message, stack, rest },
//             });
//           }
//           throw error;
//         } finally {
//           logger.info({ step: "CleanUp" });
//           if (bot.lang == "java") {
//             await fs.writeFile(java.path, java.content);
//           }
//           try {
//             // await bottester.cleanup({
//             //   group: {
//             //     name: options.group.name,
//             //   },
//             //   bot: { name: options.bot.name },
//             // });
//             // await appreg.remove(parameters.appId.value as string);
//           } catch (error) {
//             const { message, stack, ...rest } = error;
//             if (typeof error === "string") {
//               logger.error({ step: "CleanUp-Fail", error });
//             } else {
//               logger.error({
//                 step: "CleanUp-Fail",
//                 error: { message, stack, rest },
//               });
//             }
//             throw error;
//           }
//         }
//       });
//     }
//   });
// }
