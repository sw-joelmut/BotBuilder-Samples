import glob from "glob";
import path from "path";

const samples = [
  {
    name: "",
    folder: "",
  },
];

const appregs = [
  {
    id: "5dfe4cba-1794-402e-a707-eb6a9dd02add",
    secret: "jvpWoiJJzGt3Fj",
  },
];

const samplesFolder = path.resolve(
  `C:/repos/BotBuilder-Samples/composer-samples`
);

interface Folder {
  id: string
  path: string
}

const categorize = (options) => (folder:Folder) => {
  const regex = new RegExp(options.templatesFolder,'gi')
  const f = folder.path.replace(regex, '');

  const [main, ...rest] = f.split("/");
  const mainFolder = main.replace(/[_]*/g, "-");
  // Get bot number or next folder name after the main folder.
  const sample = rest.join("/").split(".")?.[0].split("/").pop();
  // Limit to 42 characters, due to Azure naming limitation
  const name = `${mainFolder}-${sample}`.slice(0, 42);
}

categorize({
  templatesFolders: ["scripts/DeploymentTemplates"]
})

const preexistingRg = glob
  .sync(`**/template-with-preexisting-rg.json`, {
    nocase: true,
    cwd: samplesFolder,
  })
  .filter((e) => !e.includes("/bin/"))
  .filter((e) => !e.includes("/obj/"))
  .map((path, id) => ({ id, path }))
  .map((e) => {
    const folder = e.path.replace(
      /\/DeploymentTemplates\/template-with-preexisting-rg\.json/gi,
      ""
    );
    const [main, ...rest] = folder.split("/");
    const mainFolder = main.replace(/[_]/g, "-");
    const sample = rest.join("/").split(".")?.[0].split("/").pop();
    const name = `${mainFolder}-${sample}`.slice(0, 38);

    let lang = "rest";

    if (main.startsWith("java_")) {
      lang = "java";
    }

    return {
      name: `${e.id}-${name}`,
      baseFolder: samplesFolder,
      folder,
      lang,
    };
  }),

console.log(preexistingRg);
