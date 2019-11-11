// class Square {
//   type = "Square" as const
//   constructor(public side: number) {}
// }
// class Circle {
//   type = "Circle" as const
//   constructor(public radius: number) {}
// }

type Result = TypeConstructor | TypeConstructor

class TypeConstructor {
  type = "TypeConstructor" as const
  constructor(public arg1: arg1, public arg2: arg2) {}
}


type ResultType = Result["type"]

type ResultMap<U> = { [K in ResultType]: U extends { type: K } ? U : never }
type ResultTypeMap = ResultMap<Result>

type Pattern<T> = { [K in keyof ResultTypeMap]: (union: ResultTypeMap[K]) => T }

function matcher<T>(pattern: Pattern<T>): (union: Result) => T {
  return union => pattern[union.type](union as any)
}

// example
const unions = [new Circle(4.0), new Square(5.0), new Rectangle(6.0, 7.0)]

const area = matcher<number>({
  Square: square => square.side * square.side,
  Circle: circle => circle.radius * circle.radius * Math.PI,
  Rectangle: rect => rect.height * rect.width
})
const totalArea = unions.reduce((acc, union) => acc + area(union), 0)

console.log(`Total area: ${totalArea}`)

const perimeter = matcher<number>({
  Square: square => 4 * square.side,
  Circle: circle => 2 * Math.PI * circle.radius,
  Rectangle: rect => 2 * rect.height + 2 * rect.width
})
const sumPerimeter = unions.reduce((acc, union) => acc + perimeter(union), 0)
console.log(`Total perimeter: ${sumPerimeter}`)

document.getElementById("result").innerHTML = `Total area: ${totalArea} <br/> Total perimeter: ${sumPerimeter}`
