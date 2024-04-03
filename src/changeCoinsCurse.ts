import {Coins} from "./dbModels/Coins";
import {observer} from './helpers/observer';
import {actualCoins} from './dbModels/Coins';




const exchangeGenerator = (prev: number | null | undefined, defaultNum = 2) => {
    if(!prev) {
        return defaultNum
    }
    const operation = Math.random()-0.5;
    const rate = prev + operation*10;
    return Math.floor(rate)<1 ? 1 : Math.floor(rate)
}


export const changeCoinsCurse = async () => {
    setInterval(async ()=>{
        const lastCointsCurse = await Coins.findOne().sort({createdDate: -1});
        
        if(!lastCointsCurse){
            const defaultCointCurse: Record<string, number | Date> = {createdDate: new Date()};
            actualCoins.forEach((item)=>{
                defaultCointCurse[item] = 2;
            })
            await new Coins(defaultCointCurse).save();
        }else{
                const currentCointCurse: Record<string, number | Date> = {createdDate: new Date()};
                    actualCoins.forEach((item)=>{
                        if(lastCointsCurse){
                            currentCointCurse[item] = exchangeGenerator(+lastCointsCurse[item])
                        }else{
                            currentCointCurse[item] = 2
                        }
                    })
            await Coins.create(currentCointCurse)
            }
        observer.emit(JSON.stringify(await Coins.findOne().sort({_id: -1})));
    }, 600000)
}

