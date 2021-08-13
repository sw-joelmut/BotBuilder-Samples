// Create/Use app registrations (batch size)

// Deploy bot
//   - Gather created resources
//   - Connect to the bot
//   - Delete resources gathered previously

import {
  Activity,
  DirectLine,
  ConnectionStatus,
} from "botframework-directlinejs";

export enum DeploymentStatus {
  Succeeded = 0,
  Failed = 1,
  Canceled = 2,
  InProgress = 3,
  Deleting = 4,
}

(async () => {
  const bottester = new BotTester({
    bot: {
      name: "",
      folder: "",
      lang: ''
    },
    group: {
      name: "",
      new: true,
    },
    template: {
      name: "",
      folder: "",
    },
    parameters: {},
  });

  const deployStatus = await bottester.deploy();
  const botStatus = await bottester.status();
  const cleanupStatus = await bottester.cleanup();
})();

interface TemplateOptions {
  name: string;
  folder: string;
}

interface BotOptions {
  name: string;
  folder: string;
  lang: string;
}

interface GroupOptions {
  name: string;
  new: boolean;
}

interface ParametersOptions {
  [x: string]: any;
}

interface BotDeploymentOptions {
  group: GroupOptions;
  bot: BotOptions;
  template: TemplateOptions;
  parameters: ParametersOptions;
}

interface BotTesterOptions extends BotDeploymentOptions {}

class BotTester {
  private bot: Bot;
  private deployment: BotDeployment;

  constructor(private options: BotTesterOptions) {
    this.bot = new Bot(options.bot);
    this.deployment = new BotDeployment(options);
  }

  public async deploy(): Promise<DeploymentStatus> {
    return this.deployment.deploy();
  }

  public async cleanup(): Promise<any> {
    return this.deployment.cleanup();
  }

  public async status(): Promise<ConnectionStatus> {
    return this.bot.status();
  }
}

class ResourceDeployment {
  
}

class BotDeployment {
  private zip: string;

  constructor(private options: BotDeploymentOptions) {}

  public async deploy(): Promise<DeploymentStatus> {
    // try catch, asi no continua ejecutando
    try {
      let result: any = {};
      if (this.options.group.new) {
        result = await this.deployWithoutGroup();
        await this.waitDeployWithoutGroup();
      } else {
        result = await this.deployWithGroup();
        await this.waitDeployWithGroup();
      }
      this.zip = await this.zipBot();
      // await this.configureBotDeploy(options);
      // await this.checkConfigureBotDeployStatus(options);
      await this.deployBot();
      await this.tagResourceGroup();

      const state = DeploymentStatus[
        result?.properties?.provisioningState
      ] as any as DeploymentStatus;
      return state || DeploymentStatus.Failed;
    } catch (error) {
      throw error;
    }
  }

  public async cleanup(): Promise<any> {
    return {
      resourceGroup: await this.cleanupResourceGroup(),
      deployment: await this.cleanupDeployment(),
      zip: await this.cleanupZip(),
    };
  }

  private async cleanupResourceGroup(): Promise<any> {
    const flags = objectToFlag({
      "resource-group": this.group.name,
      yes: null,
      "only-show-errors": null,
    });

    return JSON.parse(await cmd(`az group delete ${flags}`));
  }

  private async cleanupDeployment(): Promise<any> {
    const flags = objectToFlag({
      name: this.bot.name,
      "only-show-errors": null,
    });

    return JSON.parse(await cmd(`az deployment delete ${flags}`));
  }

  private async cleanupZip(): Promise<void> {
    return fs.rm(this.zip, { force: true });
  }

  private async deployBot(): Promise<any> {
    // Add retry
    const flags = objectToFlag({
      name: this.bot.name,
      "resource-group": this.group.name,
      src: this.zip,
      "only-show-errors": null,
    });

    return cmd(`az webapp deployment source config-zip ${flags}`);
  }

  private async waitDeployWithGroup(): Promise<string> {
    const flags = objectToFlag({
      name: this.bot.name,
      created: null,
      timeout: 300,
      interval: 10,
    });

    return cmd(`az deployment group wait ${flags}`);
  }

  private async waitDeployWithoutGroup(): Promise<string> {
    const flags = objectToFlag({
      name: this.bot.name,
      created: null,
      timeout: 300,
      interval: 10,
    });

    return cmd(`az deployment sub wait ${flags}`);
  }

  private async deployWithGroup(): Promise<string> {
    const flags = objectToFlag({
      name: this.bot.name,
      "resource-group": this.group.name,
      "template-file": path.join(this.template.folder, this.template.name),
      parameters: JSON.stringify(JSON.stringify(this.parameters)),
      "only-show-errors": null,
    });

    const result = await cmd(`az deployment group create ${flags}`);

    if (result) {
      return JSON.parse(result);
    }
  }

  private async deployWithoutGroup(): Promise<string> {
    const flags = objectToFlag({
      name: this.bot.name,
      location: "westus",
      "template-file": path.join(this.template.folder, this.template.name),
      parameters: JSON.stringify(JSON.stringify(this.parameters)),
      "only-show-errors": null,
    });

    const result = await cmd(`az deployment sub create ${flags}`);

    if (result) {
      return JSON.parse(result);
    }
  }

  private async tagResourceGroup(): Promise<string> {
    const flags = objectToFlag({
      "resource-group": this.group.name,
      set: "tags.project='manx'",
      "only-show-errors": null,
    });

    return cmd(`az group update ${flags}`);
  }

  private async zipBot(): Promise<string> {
    const dir = await fs.readdir(this.bot.folder);
    const zip = new AdmZip();

    for (var i = 0; i < dir.length; i++) {
      const file = path.join(this.bot.folder, dir[i]);
      const stat = await fs.stat(file);
      if (stat.isDirectory()) {
        zip.addLocalFolder(file, dir[i]);
      } else if (stat.isFile()) {
        zip.addLocalFile(file);
      }
    }

    const zipName = `${this.bot.name}.zip`;
    const zipPath = path.join(__dirname, "zips", zipName);
    zip.writeZip(zipPath);

    return zipPath;
  }
}

class Bot {
  constructor(private options: BotOptions) {}

  public async status(): Promise<ConnectionStatus> {
    const directline = new DirectLine({
      secret: await this.secret(),
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        directline.end();
        reject(
          new Error(
            `The bot '${this.options.name}' at '${this.options.folder}' took too long to respond!`
          )
        );
      }, 60000);

      const sub = directline
        .postActivity({
          from: { id: "bottester" },
          type: "message",
        })
        .flatMap(() => directline.connectionStatus$.asObservable())
        .subscribe(
          (status) => {
            sub.unsubscribe();
            clearTimeout(timeout);
            directline.end();
            resolve(status);
          },
          (error) => {
            sub.unsubscribe();
            clearTimeout(timeout);
            directline.end();
            reject(error);
          }
        );
    });
  }

  private async secret(): Promise<string> {
    const flags = objectToFlag({
      name: this.options.name,
      "resource-group": this.options.group,
      "with-secrets": true,
      "only-show-errors": null,
    });

    const result = await cmd(`az bot directline show ${flags}`);
    const json = JSON.parse(result);

    return json?.properties?.properties?.sites?.[0]?.key;
  }
}
