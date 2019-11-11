import { Project } from "ts-morph";

const project = new Project(
    {tsConfigFilePath: "./tsconfig.json"}
);

// ...lots of code here that manipulates, copies, moves, and deletes files...

// when you're all done, call this and it will save everything to the file system

const sourceFile = project.getSourceFileOrThrow("src/union.ts");
const structure = sourceFile.getStructure()
const transformedStructure = structure
console.log(transformedStructure.statements[0])

interface Variant
    { name : string;
      params : string[]
    }

const extractVariant = (raw : string): Variant = {
    const [def, rawArgs] = raw.split("<")
    const params = rawArgs.split(",").map(p => p.trim())
    const name = def.trim()
    return {name, params}
}

const getUnions = (type : string): Variant[] => 
    type.split("|").map(extractVariant)

const alternatives = getUnions(transformedStructure.statements[0].type)
console.log("alts")
console.log(alternatives)

try {
    const compiled  = project.getSourceFileOrThrow("src/compiled-union.ts");
    project.removeSourceFile(compiled);
} catch (e) {
    console.log("not compiled before")
}
// project.createSourceFile("src/compiled-union.ts", transformedStructure);
// console.log(.map(t => t.getStructure()))

/*const makeClass =
class Rectangle {
  type = "Rectangle" as const
  constructor(public width: number, public height: number) {}
}
*/

project.save();
