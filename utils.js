function promiseDoWhile(action, condition) {
    function loop() {
        if (!condition()) return;
        return action().then(loop);
    }
    return action().then(loop);
}


module.exports = { promiseDoWhile };