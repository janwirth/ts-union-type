
type Result<err, res> = Res<err> | Ok<res>

type Res<a> = any
type Ok<a> = any

console.log("hi")

// https://codepen.io/pufface/pen/VOwMgd
/*

class Square {
  type = "Square" as const
  constructor(public side: number) {}
}
class Circle {
  type = "Circle" as const
  constructor(public radius: number) {}
}
class Rectangle {
  type = "Rectangle" as const
  constructor(public width: number, public height: number) {}
}

type Shape = Square | Circle | Rectangle
type ShapeType = Shape["type"]

type ShapeMap<U> = { [K in ShapeType]: U extends { type: K } ? U : never }
type ShapeTypeMap = ShapeMap<Shape>

type Pattern<T> = { [K in keyof ShapeTypeMap]: (shape: ShapeTypeMap[K]) => T }

function matcher<T>(pattern: Pattern<T>): (shape: Shape) => T {
  return shape => pattern[shape.type](shape as any)
}

const shapes = [new Circle(4.0), new Square(5.0), new Rectangle(6.0, 7.0)]

const area = matcher<number>({
  Square: square => square.side * square.side,
  Circle: circle => circle.radius * circle.radius * Math.PI,
  Rectangle: rect => rect.height * rect.width
})
const totalArea = shapes.reduce((acc, shape) => acc + area(shape), 0)

console.log(`Total area: ${totalArea}`)

const perimeter = matcher<number>({
  Square: square => 4 * square.side,
  Circle: circle => 2 * Math.PI * circle.radius,
  Rectangle: rect => 2 * rect.height + 2 * rect.width
})
const sumPerimeter = shapes.reduce((acc, shape) => acc + perimeter(shape), 0)
console.log(`Total perimeter: ${sumPerimeter}`)

document.getElementById("result").innerHTML = `Total area: ${totalArea} <br/> Total perimeter: ${sumPerimeter}`
*/
