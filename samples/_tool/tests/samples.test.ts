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
  // {
  //   id: "5dfe4cba-1794-402e-a707-eb6a9dd02add",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "26a51ce2-c20d-4cbd-a5aa-e96d7a283077",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "7715fbe4-eef2-4e1e-865f-0aa5698507bd",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "c3886c63-e5cf-4dc5-8cce-9b618897939b",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "d9f6a7cf-5d2b-46fe-89eb-101aaf006604",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "c1c61589-7887-4943-8e74-72d2fd2578aa",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "7c2d9c8e-fba0-4f01-a50a-cb3f8781a900",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "f2905080-7611-44c1-8711-68338c3bc18f",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "da6172f8-2854-46c4-a02c-56ccc652a714",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
  // {
  //   id: "b5ee05e4-d95e-42a6-8f80-48808f6c7a20",
  //   secret: "jvpWoiJJzGt3Fj",
  // },
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

const samplesFolder = path.resolve(`C:/repos/BotBuilder-Samples/samples`);

const convert = categorize({
  templateFolders: ["/DeploymentTemplates"],
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

const apps = new AppRegistrationQueue(appregs);

const bottester = new BotTester();
const botParameterProvider = new BotParameterProvider();

botParameterProvider.register("app", ({ scope }) => scope.app);

botParameterProvider.register("bot", ({ scope }) => scope.bot);

const date = new Date().toLocaleDateString().replace(/[\/]/g, "-");
const logsPath = path.resolve(
  path.join(__dirname, `/logs/samples/${date}.log`)
);

const botsToTest = [
  "nrgmut-37",
  "nrgmut-56",
  "nrgmut-77",
  "nrgmut-78",
  "nrgmut-152",
  "prgmut-37",
  "prgmut-56",
  "prgmut-77",
  "prgmut-78",
  "prgmut-152",
];

const listOnly = false;

const bots = [...templatesConfig].flatMap(([k, e]) => e.bots);

const filteredBots = bots
  .filter((e) => (botsToTest.length ? botsToTest.includes(e.id) : true))
  .filter((e, i) => listOnly || (i < apps.apps.length && i >= 0));

parallel(`samples tests, tests: ${filteredBots.length}`, () => {
  // await fs.writeFile(logsPath, "\n");
  const fileLogger = pino(pino.destination(logsPath));

  for (const bot of filteredBots) {
    it(`bot: ${bot.name}, folder: ${bot.folder}, template: ${bot.template}`, async () => {
      if (listOnly) return true;
      const logger = fileLogger.child({
        tests: bots.length,
        bot,
      });

      const app = await apps.take();

      const parameters = await botParameterProvider.process({
        parameters: templatesConfig.get(bot.category).parameters,
        scope: {
          bot,
          app,
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
        await bottester.createResourceGroup(parameters.botId.value as string);
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
});

// // Delete RGs
// for (const [_, template] of [...templatesConfig]) {
//   parallel(
//     `template: ${template.name}, tests: ${template.bots.length}`,
//     () => {
//       for (const bot of template.bots) {
//         it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
//           await bottester.cleanup({
//             group: { name: bot.name },
//           });
//         });
//       }
//     }
//   );
// }
