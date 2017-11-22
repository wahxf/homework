class Promise {
    constructor(success_fn, fail_fn) {
        this.success_fn = success_fn
        this.fail_fn = fail_fn,
            this.callbacks = []
    }

    then(fn) {
        this.callbacks.push(fn)
    }


}