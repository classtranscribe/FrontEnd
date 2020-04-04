export function parseError(error) {
    // console.log(JSON.stringify(error))
    const { response } = error
    if (!Boolean(response)) { // Server Error
        return { status: 500 }
    } 
    return { status: response.status }
}

export function isAuthError(error) {
    const { status } = parseError(error)
    return status === 401 || status === 403
}