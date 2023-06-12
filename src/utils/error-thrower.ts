const errorThrower = (e: Error, errText: string, extraData?: any) => {
    console.error(e)
    if (typeof extraData !== "undefined") {
        throw Error(`${errText}: ${extraData}`)
    } else {
        throw Error(errText)
    }
}
export {errorThrower}