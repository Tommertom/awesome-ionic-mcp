import coreJson from "./core.json" with { type: "json" };

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
