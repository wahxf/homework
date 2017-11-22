class Promise {
    constructor(success_fn, fail_fn) {
        this.success_fn = success_fn
        this.fail_fn = fail_fn
        this.callbacks = []
    }
    then(onFulfilled) {
        this.callbacks.push(onFulfilled)
    }

    static resole(value) {
        this.callbacks.forEach(fn => {
            fn(value)
        });
    }

}