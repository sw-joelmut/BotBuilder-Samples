
export enum CategorizeCategory {
  NEW_RG = "new-rg",
  PREEXISTING_RG = "preexisting-rg",
}

interface CategorizeOptions {
  templateFolders: string[];
}
interface CategorizeFolderOptions {
  id: any;
  path: string;
  category: CategorizeCategory;
}

export const categorize =
  (options: CategorizeOptions) => (folderOptions: CategorizeFolderOptions) => {
    const { folder, template } = options.templateFolders.reduce(
      (acc, val) => {
        const regex = new RegExp(`${val}.*`, "gi");
        acc.folder = acc.folder.replace(regex, "");
        acc.template = folderOptions.path.replace(`${acc.folder}/`, "");
        return acc;
      },
      { folder: folderOptions.path, template: "" }
    );

    const [main, ...rest] = folder.split("/");
    const mainFolder = main.replace(/[_]/g, "-");
    // Get bot number or next folder name after the main folder.
    const sample = rest.join("/").split(".")?.[0].split("/").pop();
    // Limit to 42 characters, due to Azure naming limitation
    const name = `${folderOptions.id}-${mainFolder}-${sample}`.slice(0, 42);

    return {
      id: folderOptions.id,
      name,
      template,
      folder,
      category: folderOptions.category,
    };
  };
