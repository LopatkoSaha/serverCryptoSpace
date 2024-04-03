class Observer {
    private listeners: Function[];

    constructor() {
        this.listeners = [];
    }
    subscribe (cb: (message: string) => void) {
        this.listeners.push(cb)
    } 

    unsubscribe (cb: Function) {
        this.listeners = this.listeners.filter((item)=> item !== cb);
    } 

    emit (msg: string) {
        this.listeners.forEach((cb)=>{
            cb(msg);
        })
    }
}
export const observer = new Observer();