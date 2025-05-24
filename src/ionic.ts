import coreJson from "./data/core.json" with { type: "json" };
import fs from "fs";

const cleanIonicDefinition = (ionic_core_definition: any) => {

    if (!ionic_core_definition) {
        return {error: "No definition found"};
    }
  
  
    //@ts-ignore
  delete ionic_core_definition["tag"];
  //@ts-ignore
  delete ionic_core_definition["docs"];
  //@ts-ignore
  delete ionic_core_definition["docsTags"];
  //@ts-ignore
  delete ionic_core_definition["usage"];
  //@ts-ignore
  delete ionic_core_definition["dependents"];
  //@ts-ignore
  delete ionic_core_definition["dependencies"];
  //@ts-ignore
  delete ionic_core_definition["dependencyGraph"];
  //@ts-ignore
  delete ionic_core_definition["filePath"];

  // for all elements in the props item, we delete things as well
  //@ts-ignore
  const propsArray = ionic_core_definition["props"];
  if (propsArray && Array.isArray(propsArray)) {
    for (let i = 0; i < propsArray.length; i++) {
      const prop = propsArray[i];
      if (prop) {
        //@ts-ignore
        delete prop["complexType"];
        //@ts-ignore
        delete prop["reflectToAttr"];
        //@ts-ignore
        delete prop["docsTags"];
        //@ts-ignore
        delete prop["optional"];
      }
    }
  }

  return ionic_core_definition;
};

export const giveIonicDefinition = (html_tag: string) => {
  let result = null;
  if (coreJson.components && Array.isArray(coreJson.components)) {
    result = coreJson.components.find((c: any) => c.tag === html_tag);
  }
  return cleanIonicDefinition(result);
};


// not really all components
// https://raw.githubusercontent.com/ionic-team/ionic-docs/refs/heads/main/docs/components.md
export const giveAllIonicComponents = ()=>{
  // read the file data/components.md and return the content
  const fileToRead= "./src/data/components.md";

  console.log('Current working directory:', process.cwd());

  const data = fs.readFileSync(fileToRead, "utf8");
 
  // each component is enclosed in a "<DocsCard header" and "</DocsCard>"  pair
  const components = data.split("<DocsCard header").slice(1).map((component: string) => {
    const endIndex = component.indexOf("</DocsCard>");
    if (endIndex !== -1) {
      // include the opening and closing tags
      return `<DocsCard header${component.substring(0, endIndex + "</DocsCard>\n".length)}`;
    }
    // fallback: include opening tag if closing not found
    return `<DocsCard header${component}`;
  });

  // return as a single string
  return components.join('');
};
