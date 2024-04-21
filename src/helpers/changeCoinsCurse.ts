import { actualCoins } from "../actualCoins";
import { Coins } from "../dbModels/Coins";
import { observer } from "./observer";

const exchangeGenerator = (prev: number | null | undefined, defaultNum = 2) => {
  if (!prev) {
    return defaultNum;
  }
  const operation = Math.random() - 0.5;
  const rate = prev + operation * 10;
  return Math.floor(rate) < 1 ? 1 : Math.floor(rate);
};

export const changeCoinsCurse = () => {
  setInterval(async () => {
    const lastCoinsCurse = await Coins.findOne().sort({createdDate: -1});

    if (!lastCoinsCurse) {
      const defaultCointCurse: Record<string, number | Date> = {createdDate: new Date()};
      actualCoins.forEach((item) => {
        defaultCointCurse[item] = 2;
      });
      await new Coins(defaultCointCurse).save();
    } else {
      const currentCointCurse: Record<string, number | Date> = {createdDate: new Date()};
      actualCoins.forEach((item) => {
        if (lastCoinsCurse) {
          currentCointCurse[item] = exchangeGenerator(+lastCoinsCurse[item]);
        } else {
          currentCointCurse[item] = 2;
        }
      });
      await Coins.create(currentCointCurse);
    }
    await sendCurse();
  }, 60000);
};
export const sendCurse = async () => {
  observer.emit(JSON.stringify(await Coins.findOne().sort({_id: -1})));
};
