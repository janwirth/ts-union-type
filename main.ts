import { Project } from "ts-morph";

const project = new Project(
    {tsConfigFilePath: "./tsconfig.json"}
);

// ...lots of code here that manipulates, copies, moves, and deletes files...

// when you're all done, call this and it will save everything to the file system

// 1. READ THE STRUCTURE
function main () {
    const sourceFile = project.getSourceFileOrThrow("src/union.ts");
    const templateFile = project.getSourceFileOrThrow("template.ts");
    const structure = sourceFile.getStructure()


    // parse the union type in the structure
    const constructors = getUnions(structure.statements[0].type)
    const def = structure.statements[0]


    // apply new structure
    const generatedStructure = makeStructure(constructors, def)

    // save stuff back
    const targetFile = project.createSourceFile("src/compiled-union.ts", {statements : generatedStructure}, {overwrite: true});

    project.save();
}
const buildParams = params => `<${params.map(p => p.name).join(", ")}>`

function makeStructure(variants: Variant[], def): any[] {
    console.log(def)
    def.isExported = true
    // create a type accessor for our union type
    const accessor = {
      name: `${def.name}Type`,
      isExported: false,
      isDefaultExport: false,
      hasDeclareKeyword: false,
      docs: [],
      type: `${def.name}["type"]`,
      typeParameters: [],
      kind: 35
    }
    const classes = variants.map(makeClass)
    const maps = makeMaps(def.name)

    return [def, accessor, ...classes, ...maps]
}

function makeMaps(def) {
    const typeName = def.name
    const map = {
          name: `${typeName}Map`,
          isExported: false,
          isDefaultExport: false,
          hasDeclareKeyword: false,
          docs: [],
          type: `{ [K in ${typeName}Type]: U extends { type: K } ? U : never }`,
          typeParameters: [
            {
              name: "U",
              kind: 36
            }
          ],
          kind: 35
        }

    const typeMap = {
          name: `${typeName}TypeMap`,
          isExported: false,
          isDefaultExport: false,
          hasDeclareKeyword: false,
          docs: [],
          type: `${typeName}Map<${typeName}>`,
          typeParameters: [],
          kind: 35
        }
    const pattern = {
          name: "Pattern",
          isExported: false,
          isDefaultExport: false,
          hasDeclareKeyword: false,
          docs: [],
          type: `{ [K in keyof ${typeName}TypeMap]: (union: ${typeName}TypeMap[K]) => T }`,
          typeParameters: [
            {
              name: "T",
              kind: 36
            }
          ],
          kind: 35
        }
    const match =
        {
          name: "match",
          statements: [
            `return ${typeName.toLowerCase()} => pattern[${typeName.toLowerCase()}.type](${typeName.toLowerCase()} as any)`
          ],
          parameters: [
            {
              name: "pattern",
              type: "Pattern<T>",
              isReadonly: false,
              decorators: [],
              hasQuestionToken: false,
              kind: 27,
              isRestParameter: false
            }
          ],
          returnType: `(${typeName.toLowerCase()}: ${typeName}${buildParams(def.typeParameters)}) => T`,
          typeParameters: [
            {
              name: "T",
              kind: 36
            }
          ],
          docs: [],
          isExported: true,
          isDefaultExport: false,
          hasDeclareKeyword: false,
          isGenerator: false,
          isAsync: false,
          kind: 11,
          overloads: []
        }


    return [map, typeMap, pattern, match]
}

function makeClass({name, parameters}: Variant): object {
    return {
      decorators: [],
      typeParameters: [],
      docs: [],
      isAbstract: false,
      implements: [],
      name: name,
      isExported: true,
      isDefaultExport: false,
      hasDeclareKeyword: false,
      kind: 1,
      ctors: [
        {
          statements: [],
          parameters: parameters.map(p => 
            ({
              name: p,
              type: p,
              isReadonly: false,
              scope: "public",
              decorators: [],
              hasQuestionToken: false,
              kind: 27,
              isRestParameter: false
            })
          ),
          typeParameters: [],
          docs: [],
          kind: 3,
          overloads: []
        }
      ],
      methods: [],
      properties: [
        {
          name: "type",
          initializer: `\"${name}\" as const`,
          hasQuestionToken: false,
          hasExclamationToken: false,
          isReadonly: false,
          docs: [],
          isStatic: false,
          isAbstract: false,
          decorators: [],
          kind: 28
        }
      ],
      getAccessors: [],
      setAccessors: []
    }
}


// A variant of a union type
interface Variant
    { name : string;
      parameters : string[]
    }

// given a variant, extract it's name and it's args
const extractVariant = (raw : string): Variant => {
    const [def, rawArgs] = raw.replace(">", "").split("<");
    const parameters = rawArgs.split(",").map(p => p.trim())
    const name = def.trim()
    return {name, parameters}
}

const getUnions = (type : string): Variant[] => 
    type.split("|").map(extractVariant)

main()
