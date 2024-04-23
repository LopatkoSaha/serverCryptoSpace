// // class Car {
// //   static type = "Car";
// //
// //   private gas = 0;
// //
// //   constructor(protected readonly consumption: number, private readonly gasCapacity: number, private readonly model: string) {}
// //
// //   go() {
// //     const msg = `I was drive ${this.gas/this.consumption} miles in ${this.model}!`;
// //     this.gas = 0;
// //     return msg;
// //   }
// //
// //   fuel(gas: number) {
// //     const maxFuel = this.gasCapacity - this.gas;
// //     if (maxFuel >= gas) {
// //       this.gas = this.gas + gas;
// //       return `Get fuel ${gas} litters`;
// //     }
// //     this.gas = this.gas + maxFuel;
// //     return `Get fuel ${maxFuel} litters`;
// //   }
// //
// //   whoYouAre() {
// //     return `I am object type ${Car.type} and model ${this.model}`;
// //   }
// //
// //   static calcShtraf() {
// //     return new Date().getHours();
// //   }
// // }
//
// class BMW extends Car {
//   constructor(consumption: number, gasCapacity: number) {
//     super(consumption, gasCapacity, "BMW");
//   }
//
//   whoYouAre() {
//     return `I am cool BMW with consumption = ${this.consumption}`;
//   }
// }
//
// class BMW_X5 extends BMW {
//
// }
//
// class User {
//   constructor(private name: string, private hesCar?: BMW) {
//
//   }
//
//   // goToSilpo () {
//   //   if (this.hesCar) {
//   //     this.hesCar.whoYouAre();
//   //     this.hesCar.BMW_lol();
//   //     if (this.hesCar instanceof BMW) {
//   //       this.hesCar.BMW_lol();
//   //     }
//   //     //......
//   //   }
//   // }
// }
//
// class Opel extends Car {
//   constructor(consumption: number, gasCapacity: number) {
//     super(consumption, gasCapacity, "Opel");
//   }
// }
//
// // const bmw = new BMW_X5(10, 50);
// // console.log(bmw.go());
// // console.log(bmw.fuel(60));
// // console.log(bmw.go());
// console.log(Car.calcShtraf());
//
// const opelVectra = new Opel(10, 52);
// const Vasya = new User("Vasya", new Opel(10, 20))
//
// type User_1 = {
//   age: number,
//   weight: number,
//   gender: [any, string, number];
// }
//
// type Car_1 = {
//   age: number[],
//   weight: number,
// }
//
// type BMW_1 = Car_1 & {
//   age: number[],
//   weight: number,
//   lol: string,
// }
//
// function lol (item: User_1) {
//   return item.gender[0]
// };
//
// const user = { age: [10], weight: 1 as const, gender: [, "", 41], lol: "kek"};
