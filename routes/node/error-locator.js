function errorLocator() {
    const error = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec(error.stack.split("\n")[2]);
    return "Error in "+match[1] + " in line "+ match[2];
}