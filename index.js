// Реалізувати калькулятор:
// class InterfaceCalculator - відповідає за зовнішній вигляд
// class LogicCalculator- відповідає за роботу самого калькулятора
const btnName = [
  "Pi",
  "e",
  "X!",
  "(",
  ")",
  "%",
  "AC",
  "x²",
  "x³",
  "xʸ",
  "7",
  "8",
  "9",
  "/",
  "√x",
  "³√x",
  "ʸ√x",
  "4",
  "5",
  "6",
  "*",
  "ln",
  "log",
  "10ˣ",
  "1",
  "2",
  "3",
  "-",
  "Ans",
  "EXP",
  "Rand",
  "0",
  ".",
  "=",
  "+",
];
class InterFaceCalc {
  static creatDiv() {
    const body = document.getElementsByTagName("body")[0];
    const parentDiv = document.createElement("div");
    body.prepend(parentDiv);
    parentDiv.setAttribute("id", "calcWrap");
    parentDiv.setAttribute("class", "calcWrap");
  }
  static creatWrapElem() {
    const parentDiv = document.getElementById("calcWrap");
    this.creatElem("p", parentDiv, "calcValue", "0");
    this.creatElem("div", parentDiv, "calcBtn");
  }
  static creatElem(tagName, parent, id, content = "") {
    const el = document.createElement(tagName);
    el.textContent = content;
    el.setAttribute("id", id);
    el.setAttribute("class", id);
    parent.append(el);
    return el;
  }
  static creatBtns() {
    for (let i = 0; i < btnName.length; i++) {
      const parent = document.getElementById("calcBtn");
      const el = this.creatElem("div", parent, `btn-${i}`, btnName[i]);
      if (
        i === 10 ||
        i === 11 ||
        i === 12 ||
        i === 17 ||
        i === 18 ||
        i === 19 ||
        i === 24 ||
        i === 25 ||
        i === 26 ||
        i === 31 ||
        i === 32
      ) {
        el.setAttribute("class", "number");
      }
      if (i === 33) {
        el.setAttribute("class", "equal");
      }
    }
  }
}
InterFaceCalc.creatDiv();
InterFaceCalc.creatWrapElem();
InterFaceCalc.creatBtns();
class LogicCalculator {
  //Змінні
  static middleRes = [];
  static isDotClick = false;
  static ans;
  //Останній елемент з масива
  static lastEl;
  static check = false;
  static value; //поточне значення кнопки
  static checkConstans = false;
  static isWaitingForExponent = false;
  static isWaitingForExponentRoot = false;
  //Методи
  static addClick() {
    const btns = document.querySelectorAll(".calcBtn>div");
    Array.from(btns).map((item) => {
      item.addEventListener("click", () => {
        //Останній елемент з масива
        this.lastEl =
          this.middleRes.length !== 0
            ? this.middleRes[this.middleRes.length - 1]
            : "";

        // Прибираємо заборону на додавання крапки якщо останній елемент масиву не є числом
        if (!Number(this.lastEl)) {
          this.isDotClick = false;
        }
        this.value = item.textContent; //Значення кнопки по якій клікнули
        // Робимо перевірку якщо клікнули на '-' і останнє значення в масиві не дорівнює '-' то ми додаємо '-' в масив
        if (this.value === "-" && this.lastEl !== "-") {
          this.middleRes.push(this.value);
          this.lastEl = this.middleRes[this.middleRes.length - 1];
        }

        this.checkMinus();
        this.checkNumber();
        this.checkDot();
        this.checkActions();
        this.checkBracket();
        this.checkPiOrE();
        this.calcPercentage();
        this.calcFactorial();
        this.calcPowerOrRootSquareAndCube();
        this.calcPow();
        this.calcRoot();
        this.calcLogarithm();
        this.calcExp10();
        this.calcRand();
        this.calcExp();
        this.addAns();
        this.useAns();

        if (this.value === "AC") {
          this.middleRes.splice(this.middleRes.length - 1, 1);
        }
        // ми виводимо значення з масиву в рядок калькулятора
        let str = "";
        this.middleRes.map((item) => {
          str += item;
        });
        document.getElementById("calcValue").textContent =
          str === "" ? "0" : str;
        // console.log(this.middleRes);//вивід проміжного результату
        if (
          this.value === "=" &&
          (!isNaN(this.middleRes[this.middleRes.length - 1]) ||
            this.lastEl === ")")
        ) {
          if (this.middleRes.length === 0) {
            return;
          }
          const res = RPNClass.creatreRpn(this.middleRes);

          // console.log(res);// перевірка польської нотації
          const finalRes = RPNClass.useRpn(res);
          this.middleRes = [];
          this.middleRes.push(finalRes);
          document.getElementById("calcValue").textContent = Number(finalRes);
          //  console.log(this.middleRes); // вивід обчислення після дорівнює
        }
      });
    });
  }
 
  static checkPiOrE() {
    if (this.value === "Pi" || this.value === "e") {
      
      let sign = "";
      const operatorOrNot = this.middleRes[this.middleRes.length - 2];
      if (
        operatorOrNot === "+" ||
        operatorOrNot === "*" ||
        operatorOrNot === "/" ||
        (this.middleRes.length <= 2 &&
          this.middleRes[this.middleRes.length - 1] === "-")
      ) {
        sign = this.middleRes[this.middleRes.length - 1] === "-" ? "-" : "";
      }
      const lastValue = this.middleRes[this.middleRes.length - 1];

      if (!isNaN(Number(lastValue))) {
        const multiplier = this.value === "Pi" ? Math.PI : Math.E;
        this.middleRes[this.middleRes.length - 1] = String(
          lastValue * multiplier
        );
      } else {
        const constant = this.value === "Pi" ? Math.PI : Math.E;
        if (
          this.middleRes[this.middleRes.length - 1] === "-" &&
          Number(operatorOrNot)
        ) {
          sign = "";
          this.middleRes.push("-");
        }
        this.middleRes.push(sign + String(constant));
        if (
          this.middleRes[this.middleRes.length - 2] === "-" &&
          this.middleRes[this.middleRes.length - 3] !== ")"
        ) {
          this.middleRes.splice(this.middleRes.length - 2, 1);
        }
      }
      this.isDotClick = true;
      this.checkConstans = true;
    }
  }

  static checkMinus() {
    //поєднуємо цифру з попереднім "-", якщо перед "-" стоїть якась дія
    this.check = true; //цю змінну вводимо, щоб у нас не дублювалася цифра - в нас перевірка на число є ще далі і іноді цифра дублююється
    if (this.middleRes.length >= 2) {
      if (
        (!isNaN(Number(this.value)) || this.value === "0") &&
        this.lastEl === "-" &&
        isNaN(this.middleRes[this.middleRes.length - 2])
      ) {
        if (this.middleRes[this.middleRes.length - 2] === ")") {
          this.middleRes.push(this.value);
        } else if (
          this.middleRes[this.middleRes.length - 2] === "(" &&
          this.lastEl === "-"
        ) {
          this.middleRes[this.middleRes.length - 1] = "-" + this.value;
        } else {
          this.lastEl = this.lastEl + this.value;
          this.middleRes[this.middleRes.length - 1] = this.lastEl;
        }
        this.check = false;
      }
    }
  }

  static checkNumber() {
    // Перевіряємо чи кнопка є числом або нулем
    if ((Number(this.value) || this.value === "0") && !this.checkConstans) {
      //В пустий масив просто пушимо значення
      if (this.middleRes.length === 0) {
        this.middleRes.push(this.value);
        this.lastEl = this.value;
      } else {
        this.joinNumbers();
      }
    }
  }

  static checkDot() {
    // Поєднуємо число і крапку і забороняємо додавати крапку більше одного разу до числа
    if (this.value === "." && !this.isDotClick) {
      if (Number(this.lastEl) || this.lastEl === "0" || this.lastEl === "-0") {
        this.isDotClick = true;
        this.middleRes[this.middleRes.length - 1] = this.lastEl + ".";
      }

      if (this.middleRes.length === 0) {
        this.middleRes.push("0.");
        this.lastEl = this.middleRes[this.middleRes.length - 1];
      }
    }
  }

  static checkActions() {
    // Реалізуємо поведінку "+","*","/" якщо в масиві немає елементів то ми спочатку туди пушимо нуль а потім знак дії
    if (document.getElementById("calcValue").textContent === "0") {
      this.pushFirstValue();
    } else {
      this.pushNextValues();
    }
    // перевірка конкатенації pi та e проблема що після натискання AC якщо був знак або і число і знак то конкатенація відбудеться
    if (
      !Number(this.value) &&
      this.value !== "0" &&
      this.value !== "." &&
      this.value !== "(" &&
      this.value !== ")" &&
      this.value !== "10ˣ" &&
      this.value !== "Ans" &&
      this.value !== "EXP" &&
      this.value !== "√x" &&
      this.value !== "³√x" &&
      this.value !== "ʸ√x" &&
      this.value !== "x²" &&
      this.value !== "x³" &&
      this.value !== "X!" &&
      this.value !== "ln" &&
      this.value !== "log" &&
      this.value !== "Rand" &&
      this.value !== "xʸ" &&
      this.value !== "%"
    ) {
      this.checkConstans = false;
    }
  }

  static pushFirstValue() {
    if (this.value === "*" || this.value === "/" || this.value === "+") {
      if (this.middleRes.length === 0) {
        this.middleRes.push("0");
      }
      this.middleRes.push(this.value);
      this.lastEl = this.middleRes[this.middleRes.length - 1];
    }
    // якщо в нас мінус то просто пушимо мінус без нуля
    if (this.value === "-" && this.middleRes.length === 0) {
      this.middleRes.push("-");
      this.lastEl = this.middleRes[this.middleRes.length - 1];
    }
  }

  static pushNextValues() {
    // якщо в масиві є елементи і останній елемент це число то пушимо дію "+","*","/" , а якщо останній елемент дія "+","*","/" то ми замінюємо останній елемент на дану дію
    if (this.value === "*" || this.value === "/" || this.value === "+") {
      //якщо останній елемент число, пушимо в масив дію
      if (Number(this.lastEl)) {
        this.middleRes.push(this.value);
        this.lastEl = this.middleRes[this.middleRes.length - 1];
      }
      //якщо останній елемент дія, то замінюємо її
      if (this.lastEl === "*" || this.lastEl === "/" || this.lastEl === "+") {
        this.middleRes[this.middleRes.length - 1] = this.value;
      }
      if (this.lastEl === ")") {
        this.middleRes.push(this.value);
      }
      //Якщо останній елемент мінус, а передостанній число, то ми замінємо мінус на дію теж
      if (
        this.lastEl === "-" &&
        Number(this.middleRes[this.middleRes.length - 2])
      ) {
        this.middleRes[this.middleRes.length - 1] = this.value;
      }
    }
  }
  static joinNumbers() {
    //Якщо масив не пустий, робимо перевірку чи є останнє значення числом або "-", поєднуємо тоді з тим числом, що клікнули
    if (
      Number(this.lastEl) ||
      this.lastEl === "0" ||
      this.lastEl.includes(".") ||
      (this.lastEl === "-" && this.middleRes.length === 1)
    ) {
      this.lastEl = this.lastEl === "0" ? this.value : this.lastEl + this.value;
      if (this.check) {
        this.middleRes[this.middleRes.length - 1] = this.lastEl;
      }
    } else {
      if (this.check) {
        this.middleRes.push(this.value);
        this.lastEl = this.value;
      }
    }
  }
  static checkBracket() {
    // 1.Ми не можемо запушити закриваючу дужку якщо немає відкриваючися
    // 2.Ми не можемо запушити більше закриваючихся більше ніж є закриваючих
    // 3.()+, ((*)+)
    if (this.value === ")" && !this.middleRes.includes("(")) {
      return;
    }

    const res = this.middleRes.reduce(
      (acc, val) => {
        if (val === "(") {
          acc.open += 1;
        }
        if (val === ")") {
          acc.close += 1;
        }
        return acc;
      },
      { open: 0, close: 0 }
    );

    if (this.value === ")" && res.open === res.close) {
      return;
    }
    if (this.value === "(" || this.value === ")") {
      if (this.value === "(" && (this.lastEl === ")" || Number(this.lastEl))) {
        return;
      }
      if (this.lastEl === "(" && this.value === ")") {
        return;
      }
      if (this.value === ")" && !Number(this.lastEl) && this.lastEl !== ")") {
        return;
      }
      if (
        this.value === "(" &&
        this.lastEl === "-" &&
        acts.includes(this.middleRes[this.middleRes.length - 2])
      ) {
        return;
      }
      this.middleRes.push(this.value);
    }
  }
  static calcPercentage() {
    if (this.value === "%") {
      if (!this.lastEl || isNaN(this.lastEl) || this.middleRes.length === 0) {
        return;
      }
      if (
        this.middleRes.length === 1 ||
        (this.middleRes.length > 1 &&
          (this.middleRes[this.middleRes.length - 2] === "*" ||
            this.middleRes[this.middleRes.length - 2] === "/")) ||
        this.middleRes.length > 1
      ) {
        this.middleRes[this.middleRes.length - 1] = this.lastEl / 100;
      }
      if (
        this.middleRes.length > 1 &&
        (this.middleRes[this.middleRes.length - 2] === "+" ||
          this.middleRes[this.middleRes.length - 2] === "-")
      ) {
        this.middleRes[this.middleRes.length - 1] =
          this.middleRes[this.middleRes.length - 3] * (this.lastEl / 100);
      }
      if (
        this.middleRes[this.middleRes.length - 3] === ")" &&
        (this.middleRes[this.middleRes.length - 2] === "+" ||
          this.middleRes[this.middleRes.length - 2] === "-")
      ) {
        let openParenthesisCount = 0;
        let startIndex = -1;
        for (let i = this.middleRes.length - 4; i >= 0; i--) {
          if (this.middleRes[i] === "(") {
            if (openParenthesisCount === 0) {
              startIndex = i;
              break;
            } else {
              openParenthesisCount--;
            }
          } else if (this.middleRes[i] === ")") {
            openParenthesisCount++;
          }
        }
        if (startIndex !== -1 && startIndex >= 0) {
          let expressionInsideBracket = this.middleRes.slice(
            startIndex + 1,
            this.middleRes.length - 3
          );
          let calculatedInsideBracket = RPNClass.useRpn(
            RPNClass.creatreRpn(expressionInsideBracket)
          );
          let percentageValue = parseFloat(this.lastEl) / 100;
          let calculatedPercentage = calculatedInsideBracket * percentageValue;
          this.middleRes[this.middleRes.length - 1] = calculatedPercentage;
        }
      }
    }
  }
  static calcFactorial() {
    if (this.value === "X!") {
      let num = 0;

      if (this.lastEl === ")") {
        let openParenthesisCount = 0;

        for (let i = this.middleRes.length - 1; i >= 0; i--) {
          if (this.middleRes[i] === "(") {
            if (openParenthesisCount === 0) {
              num = i;
              break;
            } else {
              openParenthesisCount--;
            }
          } else if (this.middleRes[i] === ")") {
            openParenthesisCount++;
          }
        }
      } else {
        num = parseFloat(this.lastEl);
      }

      if (!isNaN(num) && Number.isInteger(num) && num >= 0) {
        let factorial = 1;
        for (let i = 2; i <= num; i++) {
          factorial *= i;
        }

        if (this.middleRes[this.middleRes.length - 1] === ")") {
          let openParenthesisCount = 0;
          let startIndex = -1;
          for (let i = this.middleRes.length - 2; i >= 0; i--) {
            if (this.middleRes[i] === "(") {
              if (openParenthesisCount === 0) {
                startIndex = i;
                break;
              } else {
                openParenthesisCount--;
              }
            } else if (this.middleRes[i] === ")") {
              openParenthesisCount++;
            }
          }
          if (startIndex !== -1 && startIndex >= 0) {
            let expressionInsideBracket = this.middleRes.slice(
              startIndex + 1,
              this.middleRes.length - 1
            );
            num = RPNClass.useRpn(RPNClass.creatreRpn(expressionInsideBracket));
            if (!isNaN(num) && Number.isInteger(num) && num >= 0) {
              let factorial = 1;
              for (let i = 2; i <= num; i++) {
                factorial *= i;
              }
              this.middleRes.splice(
                startIndex,
                expressionInsideBracket.length + 3,
                factorial.toString()
              );
            }
          }
        } else {
          this.middleRes[this.middleRes.length - 1] = factorial.toString();
        }
      }
    }
  }
  static calcPowerOrRootSquareAndCube() {
    const powerOperators = ["x²", "x³"];
    const rootOperators = ["√x", "³√x"];

    if (
      powerOperators.includes(this.value) ||
      rootOperators.includes(this.value)
    ) {
      if (!this.lastEl || this.middleRes.length === 0) {
        return;
      }

      if (!isNaN(this.lastEl)) {
        let num = parseFloat(this.lastEl);
        let result;

        if (powerOperators.includes(this.value)) {
          if (this.value === "x²") {
            result = Math.pow(num, 2);
          } else if (this.value === "x³") {
            result = Math.pow(num, 3);
          }
        }

        if (rootOperators.includes(this.value)) {
          if (this.value === "√x") {
            result = Math.sqrt(num);
          } else if (this.value === "³√x") {
            result = Math.cbrt(num);
          }
        }

        this.middleRes[this.middleRes.length - 1] = result.toString();
      }

      if (this.middleRes[this.middleRes.length - 1] === ")") {
        let num = this.calculateExpression();

        if (powerOperators.includes(this.value)) {
          if (this.value === "x²") {
            this.middleRes[this.middleRes.length - 1] = Math.pow(num, 2);
          } else if (this.value === "x³") {
            this.middleRes[this.middleRes.length - 1] = Math.pow(num, 3);
          }
        }

        if (rootOperators.includes(this.value)) {
          if (this.value === "√x") {
            this.middleRes[this.middleRes.length - 1] = Math.sqrt(num);
          } else if (this.value === "³√x") {
            this.middleRes[this.middleRes.length - 1] = Math.cbrt(num);
          }
        }
      }
    }
  }
  static calcPow() {
    if (this.value === "xʸ") {
      if (!this.lastEl || this.middleRes.length === 0) {
        return;
      }
      if (
        !isNaN(this.lastEl) ||
        this.middleRes[this.middleRes.length - 1] === ")"
      ) {
        this.middleRes.push("^");
        this.isWaitingForExponent = true;
      }
      if (
        this.isWaitingForExponent &&
        this.middleRes[this.middleRes.length - 3] === "^"
      ) {
        const result = Math.pow(
          this.middleRes[this.middleRes.length - 4],
          this.middleRes[this.middleRes.length - 2]
        );
        this.middleRes.splice(
          this.middleRes[this.middleRes.length - 1],
          3,
          result
        );
      }
    } else if (
      this.isWaitingForExponent &&
      this.middleRes[this.middleRes.length - 1] === "^" &&
      !Number(this.value)
    ) {
      return;
    } else if (
      this.isWaitingForExponent &&
      this.middleRes[this.middleRes.length - 3] === ")"
    ) {
      const power = [...this.middleRes];

      power.splice(0, power.length - 2);
      this.middleRes.splice(this.middleRes.length - 2, 2);
      const resEXpresion = this.calculateExpression();
      this.middleRes.splice(this.middleRes.length - 1, 2);
      this.middleRes.push(resEXpresion.toString(), power[0], power[1]);
    } else if (this.isWaitingForExponent && this.value === "=") {
      let result = Math.pow(
        this.middleRes[this.middleRes.length - 3],
        this.middleRes[this.middleRes.length - 1]
      );
      this.middleRes.splice(this.middleRes.length - 3, 3, result);
      this.isWaitingForExponent = false;
    } else if (
      (this.isWaitingForExponent &&
        (this.value === "Pi" || this.value === "e")) ||
      this.value === "AC" ||
      this.value === "X!" ||
      this.value === "x²" ||
      this.value === "x³" ||
      this.value === "%" ||
      this.value === "."
    ) {
    } else if (this.isWaitingForExponent && isNaN(this.value)) {
      const findIndexPow = this.middleRes.findIndex((el) => el === "^");
      if (
        this.middleRes[findIndexPow] === "^" &&
        this.middleRes[findIndexPow + 1] === "("
      ) {
        if (this.middleRes[this.middleRes.length - 1] === ")") {
          const result = this.calculateExpression();
          this.calculateExpression();
          this.middleRes.splice(this.middleRes.length - 1, 1, result);
        }
      } else {
        let result = Math.pow(
          this.middleRes[this.middleRes.length - 4],
          this.middleRes[this.middleRes.length - 2]
        );
        this.middleRes.splice(this.middleRes.length - 4, 3, result);
        this.isWaitingForExponent = false;
      }
    }
  }
  static calcRoot() {
    if (this.value === "ʸ√x") {
      if (!this.lastEl || this.middleRes.length === 0) {
        return;
      }
      if (
        !isNaN(this.lastEl) ||
        this.middleRes[this.middleRes.length - 1] === ")"
      ) {
        this.middleRes.push("ʸ√");
        this.isWaitingForExponentRoot = true;
      }
      if (
        this.isWaitingForExponentRoot &&
        this.middleRes[this.middleRes.length - 3] === "ʸ√"
      ) {
        const result = Math.pow(
          this.middleRes[this.middleRes.length - 4],
          1 / this.middleRes[this.middleRes.length - 2]
        );
        this.middleRes.splice(
          this.middleRes[this.middleRes.length - 1],
          3,
          result
        );
      }
    } else if (
      this.isWaitingForExponentRoot &&
      this.middleRes[this.middleRes.length - 1] === "ʸ√" &&
      !Number(this.value)
    ) {
      return;
    } else if (
      this.isWaitingForExponentRoot &&
      this.middleRes[this.middleRes.length - 3] === ")"
    ) {
      const power = [...this.middleRes];

      power.splice(0, power.length - 2);
      this.middleRes.splice(this.middleRes.length - 2, 2);
      const resEXpresion = this.calculateExpression();
      this.middleRes.splice(this.middleRes.length - 1, 2);
      this.middleRes.push(resEXpresion.toString(), power[0], power[1]);
    } else if (this.isWaitingForExponentRoot && this.value === "=") {
      let result = Math.pow(
        this.middleRes[this.middleRes.length - 3],
        1 / this.middleRes[this.middleRes.length - 1]
      );
      this.middleRes.splice(this.middleRes.length - 3, 3, result);

      this.isWaitingForExponent = false;
    } else if (
      (this.isWaitingForExponent &&
        (this.value === "Pi" || this.value === "e")) ||
      this.value === "AC" ||
      this.value === "X!" ||
      this.value === "x²" ||
      this.value === "x³" ||
      this.value === "%" ||
      this.value === "."
    ) {
    } else if (this.isWaitingForExponentRoot && isNaN(this.value)) {
      const findIndexPow = this.middleRes.findIndex((el) => el === "ʸ√");
      if (
        this.middleRes[findIndexPow] === "ʸ√" &&
        this.middleRes[findIndexPow + 1] === "("
      ) {
        if (this.middleRes[this.middleRes.length - 1] === ")") {
          const result = this.calculateExpression();
          this.calculateExpression();
          this.middleRes.splice(this.middleRes.length - 1, 1, result);
        }
      } else {
        let result = Math.pow(
          this.middleRes[this.middleRes.length - 4],
          1 / this.middleRes[this.middleRes.length - 2]
        );

        this.middleRes.splice(this.middleRes.length - 4, 3, result);
        this.isWaitingForExponentRoot = false;
      }
    }
  }
  static calcLogarithm() {
    if (this.value === "ln" || this.value === "log") {
      if (!this.lastEl || this.middleRes.length === 0) {
        return;
      }

      if (!isNaN(this.lastEl)) {
        let num = parseFloat(this.lastEl);
        let result;
        if (this.value === "ln") {
          result = Math.log(num);
        } else if (this.value === "log") {
          result = Math.log10(num);
        }
        this.middleRes[this.middleRes.length - 1] = result.toString();
      }

      if (this.middleRes[this.middleRes.length - 1] === ")") {
        let num = this.calculateExpression();
        if (this.value === "ln") {
          result = Math.log(num);
        }
        if (this.value === "log") {
          result = Math.log10(num);
        }
        this.middleRes[this.middleRes.length - 1] = result.toString();
      }
    }
  }
  static calcExp10() {
    if (this.value === "10ˣ") {
      if (!this.lastEl || this.middleRes.length === 0) {
        return;
      }

      if (!isNaN(this.lastEl)) {
        let num = parseFloat(this.lastEl);
        let result = Math.pow(10, num);
        this.middleRes[this.middleRes.length - 1] = result.toString();
      }

      if (this.middleRes[this.middleRes.length - 1] === ")") {
        let num = this.calculateExpression();
        let result = Math.pow(10, num);
        this.middleRes[this.middleRes.length - 1] = result.toString();
      }
    }
  }
  static calcRand() {
    let randomNum = Math.random();
    if (this.value === "Rand") {
      if (this.lastEl === ")") {
        return;
      }

      if (this.middleRes.length > 0 && !isNaN(this.lastEl)) {
        this.middleRes.splice(
          this.middleRes.length - 1,
          1,
          randomNum.toString()
        );
      }
      let sign = "";
      const operatorOrNot = this.middleRes[this.middleRes.length - 2];
      if (
        operatorOrNot === "+" ||
        operatorOrNot === "*" ||
        operatorOrNot === "/" ||
        (this.middleRes.length <= 2 &&
          this.middleRes[this.middleRes.length - 1] === "-")
      ) {
        sign = this.middleRes[this.middleRes.length - 1] === "-" ? "-" : "";
      } else if (
        this.middleRes.length < 1 ||
        this.lastEl === "+" ||
        this.lastEl === "/" ||
        this.lastEl === "*" ||
        this.lastEl === "-" ||
        this.lastEl === "("
      ) {
        this.middleRes.push(randomNum.toString());
      }
      this.isDotClick = true;
    }
  }

  static calcExp() {
    if (this.value === "EXP") {
      if (!this.lastEl || this.middleRes.length === 0) {
        return;
      }
      // Перевірка наявності числа перед "EXP"
      if (!isNaN(this.lastEl)) {
        this.middleRes.push("E"); // Додавання "E" до виразу
        this.isWaitingForExp = true;
      }
    } else if (
      this.isWaitingForExp &&
      this.middleRes[this.middleRes.length - 2] === "E" &&
      this.value === "."
    ) {
      const deleteDot = this.middleRes[this.middleRes.length - 1]
        .split(".")
        .splice(0, 1);
      this.middleRes.splice(this.middleRes.length - 1, 1, deleteDot);
    } else if (this.lastEl === "E" && this.value === "(") {
      this.middleRes.splice(this.middleRes.length - 1, 1);
      return;
    } else if (
      this.isWaitingForExp &&
      (this.value === "+" ||
        this.value === "-" ||
        this.value === "*" ||
        this.value === "/")
    ) {
      const num1 = parseFloat(this.middleRes[this.middleRes.length - 4]);
      const num2 = parseInt(this.middleRes[this.middleRes.length - 2]);
      const result = num1 * Math.pow(10, num2);
      this.middleRes.splice(this.middleRes.length - 4, 3, result.toString());
      this.isWaitingForExp = false; // Знімаємо очікування "EXP"
    } else if (this.isWaitingForExp && this.value === "=") {
      const num1 = parseFloat(this.middleRes[this.middleRes.length - 3]);
      const num2 = parseInt(this.middleRes[this.middleRes.length - 1]);
      const result = num1 * Math.pow(10, num2);
      this.middleRes.splice(this.middleRes.length - 3, 3, result.toString());
      this.isWaitingForExp = false;
    }
  }
  static addAns() {
    if (this.value === "=") {
      this.ans = RPNClass.useRpn(
        RPNClass.creatreRpn(this.middleRes)
      ).toString();
    }
  }
  static useAns() {
    if (this.value === "Ans") {
      if (this.ans && (this.middleRes.length === 0 || isNaN(this.lastEl))) {
        this.middleRes.push(this.ans); // Додати збережений результат до поточного виразу
      }
      if (
        this.middleRes.length === 2 &&
        this.middleRes[this.middleRes.length - 2] === "-"
      ) {
        this.middleRes.splice(0, 2, -this.ans);
      }
      const operator = this.middleRes[this.middleRes.length - 3];
      if (
        this.middleRes[this.middleRes.length - 2] === "-" &&
        (operator === "+" || operator === "*" || operator === "/")
      ) {
        this.middleRes.splice(this.middleRes.length - 2, 2, -this.ans);
      } else if (
        this.middleRes[this.middleRes.length - 2] === "-" &&
        this.ans < 0
      ) {
        this.middleRes[this.middleRes.length - 2] = "+";
        this.middleRes[this.middleRes.length - 1] = this.ans
          .toString()
          .slice(1);
      }
    }
  }
  static calculateExpression() {
    let num = 0;

    if (this.middleRes[this.middleRes.length - 1] === ")") {
      let openParenthesisCount = 0;
      let startIndex = -1;
      for (let i = this.middleRes.length - 2; i >= 0; i--) {
        if (this.middleRes[i] === "(") {
          if (openParenthesisCount === 0) {
            startIndex = i;
            break;
          } else {
            openParenthesisCount--;
          }
        } else if (this.middleRes[i] === ")") {
          openParenthesisCount++;
        }
      }
      if (startIndex !== -1 && startIndex >= 0) {
        let expressionInsideBracket = this.middleRes.slice(
          startIndex + 1,
          this.middleRes.length - 1
        );
        num = RPNClass.useRpn(RPNClass.creatreRpn(expressionInsideBracket));
        this.middleRes.splice(
          startIndex,
          expressionInsideBracket.length + 3,
          this.lastEl.toString()
        );
        return num;
      }
    }
  }
}

LogicCalculator.addClick();
const acts = ["+", "/", "*"];
class RPNClass {
  static creatreRpn(arr) {
    // 1. Створити порожній стек для збереження операторів. const stack= []
    // 2. Розглянути вхідний вираз зліва направо. Проходимо по масиву this.middleRes
    // 3. Якщо поточний символ є операндом (числом), додати його до вихідного рядка. const res = [];
    // 4. Якщо поточний символ є відкриваючою дужкою, додати її до стеку.
    // 5. Якщо поточний символ є оператором, порівняти його пріоритет з оператором на вершині стеку.
    //Якщо поточний оператор має нижчий пріоритет або має такий самий пріоритет,
    //видалити оператори з вершини стеку та додати їх до вихідного рядка, res.push(stack.pop())
    //поки не буде досягнуто оператора з меншим пріоритетом або стек не стане порожнім.
    //Додати поточний оператор до стеку.
    // 6. Якщо поточний символ є закриваючою дужкою, видалити оператори з вершини стеку та додати їх
    // до вихідного рядка, поки не буде досягнута відповідна відкриваюча дужка.
    //Видалити відповідну відкриваючу дужку зі стеку.
    // 7. Повторювати кроки 3-6 для кожного символу вхідного виразу.
    // 8. Якщо вхідний вираз закінчився, видалити будь-які залишки операторів зі стеку та додати їх до вихідного рядка.
    const precedence = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
    };
    const res = [];
    const stack = [];
    arr.map((item) => {
      if (!isNaN(Number(item))) {
        res.push(item);
      }
      if (isNaN(Number(item))) {
        if (item === "(") {
          stack.push(item);
        }
        if (item === ")") {
          while (stack.length > 0 && stack[stack.length - 1] !== "(") {
            res.push(stack.pop());
          }
          stack.pop();
        }
        if (item !== "(" && item !== ")") {
          const priorityItem = precedence[item];
          while (
            stack.length > 0 &&
            priorityItem <= precedence[stack[stack.length - 1]]
          ) {
            res.push(stack.pop());
          }
          stack.push(item);
        }
      }
    });
    while (stack.length > 0) {
      res.push(stack.pop());
    }
    return res;
  }

  static useRpn(arr) {
    //1.створюємо пустий масив stack
    // 2.Ми йдемо по масиву який отримали в createRPN
    // 3. Якщо елемент масиву число ми його пушимо в стек, якщо не число то ми через switch виконуємо дію і пушимо результат у stack
    const stack = [];
    let res;
    arr.map((item) => {
      if (!isNaN(item)) {
        stack.push(item);
      } else {
        switch (item) {
          case "+":
            res = Number(stack.pop()) + Number(stack.pop());
            stack.push(res);
            break;
          case "*":
            res = Number(stack.pop()) * Number(stack.pop());
            stack.push(res);
            break;
          case "-":
            if (stack.length === 1) {
              stack.push("-" + stack.pop());
            } else {
              const val2 = stack.pop();
              const val1 = stack.pop();
              res = val1 - val2;
              stack.push(res);
            }
            break;
          case "/":
            const val22 = stack.pop();
            const val11 = stack.pop();
            res = val11 / val22;
            stack.push(res);
            break;
        }
      }
    });
    return stack.pop();
  }
}
