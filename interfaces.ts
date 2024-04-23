//
// class Golf {
//   private candels: number;
//
//   private fuel: number;
//
//   constructor() {
//     this.candels = 4;
//     this.fuel = 0;
//   }
//
//   drive () {
//     if(this.start() === "Not go") {
//       return false;
//     }
//     this.goForward();
//     this.turnLeft();
//     this.stop();
//   }
//
//   start() {
//     if (this.checkFuel() && this.checkOil() && this.checkCendels()) {
//       return "Go!";
//     }
//     return "Not go";
//   }
//
//   checkCendels() {
//     return this.candels === 4;
//   }
//
//   checkOil() {
//     return true;
//   }
//
//   checkFuel () {
//     return this.fuel !== 0;
//   }
//
//   addFuel(gas: number) {
//     this.fuel = this.fuel + gas;
//   }
//
//   goForward() {
//     this.fuel = this.fuel - 5;
//   }
//   goBack() {}
//   turnRight() {}
//   turnLeft() {}
//   stop() {}
// }
//
// class Caddy {
//   private forsynkies: number;
//
//   private disel: number;
//
//   constructor() {
//     this.forsynkies = 4;
//     this.disel = 0;
//   }
//
//   drive () {
//     if(this.start() === "Not go") {
//       return false;
//     }
//     this.goForward();
//     this.turnLeft();
//     this.stop();
//   }
//
//   start() {
//     if (this.checkFuel() && this.checkOil() && this.checkCendels()) {
//       return "Go!";
//     }
//     return "Not go";
//   }
//
//   checkCendels() {
//     return this.forsynkies === 4;
//   }
//
//   checkOil() {
//     return true;
//   }
//
//   checkFuel () {
//     return this.disel !== 0;
//   }
//
//   addFuel(disel: number) {
//     this.disel = this.disel + disel;
//   }
//
//   goForward() {
//     this.disel = this.disel - 5;
//   }
//   goBack() {}
//   turnRight() {}
//   turnLeft() {}
//   stop() {}
// }

interface IEngin {
  start(): "Go!" | "Not go";
};

interface ITank {
  addFuel(gas: number): number;
  checkFuel(): boolean;
  rashodFuel(gas: number): void;
  getTypeGas(): string;
};

interface IControl {
  goForward(tank: ITank): void;
  turnLeft(tank: ITank): void;
  turnRight(tank: ITank): void;
  stop(tank: ITank): void;
};


class Car {
  constructor(private engin: IEngin, public tank: ITank, private control: IControl,  private gasStation: GasStation) {}

  drive () {
    if(this.engin.start() === "Not go" && this.tank.checkFuel()) {
      return false;
    }
    this.tank.addFuel(50);
    this.control.goForward(this.tank);
    this.control.turnLeft(this.tank);
    this.control.stop(this.tank);
  }

  addFuel(quantity: number) {
    this.gasStation.fuel(this.tank, quantity);
  }
}

class gasEngine implements IEngin {
  private candels: number;

  constructor() {
    this.candels = 4;
  }

  start() {
    if (this.checkOil() && this.checkCendels()) {
      return "Go!";
    }
    return "Not go";
  }

  private checkCendels() {
    return this.candels === 4;
  }

  private checkOil() {
    return true;
  }
}

class dieselEngine implements IEngin {
  private forsynkies: number;



  constructor() {
    this.forsynkies = 4;
  }

  start() {
    if (this.checkOil() && this.checkCendels()) {
      return "Go!";
    }
    return "Not go";
  }

  checkCendels() {
    return this.forsynkies === 4;
  }

  checkOil() {
    return true;
  }
}

class gasTank implements ITank {
  private gas: number;

  constructor() {
    this.gas = 0;
  }

  checkFuel () {
    return this.gas !== 0;
  }

  addFuel(gas: number) {
    this.gas = this.gas + gas;
    return 0;
  }

  rashodFuel(gas: number) {
    this.gas = this.gas - gas;
  }

  getTypeGas() {
    return "gas";
  }
}

class dieselTank implements ITank {
  private diesel: number;

  constructor() {
    this.diesel = 0;
  }

  checkFuel () {
    return this.diesel !== 0;
  }

  addFuel(gas: number) {
    this.diesel = this.diesel + gas;
    return 0;
  }

  rashodFuel(gas: number) {
    this.diesel = this.diesel - gas;
  }

  getTypeGas() {
    return "diesel";
  }
}

class DefaultControl implements IControl {
  goForward(tank: ITank) {
    tank.rashodFuel(-5);
  }
  goBack(tank: ITank) {
    tank.rashodFuel(-3);
  }
  turnRight(tank: ITank) {
    tank.rashodFuel(-1);
  }
  turnLeft(tank: ITank) {}
  stop(tank: ITank) {}
}

class Golf extends Car {
  constructor() {
    super(new gasEngine(), new gasTank(), new DefaultControl(), new GasStation());
  }
}

class Caddy extends Car {
  constructor() {
    super(new dieselEngine(), new dieselTank(), new DefaultControl(), new GasStation());
  }
}

class GasStation {
  constructor() {}

  fuel(tank: ITank, quantity: number) {
    switch(tank.getTypeGas()) {
      case "gas": return tank.addFuel(quantity);
      case "diesel": return tank.addFuel(quantity);
      default: return "Unknown gas type";
    }
  }
}

const golf = new Golf();
const caddy = new Caddy();

golf.addFuel( 50)
caddy.addFuel( 30)
// golf.addFuel(50);
golf.drive();


