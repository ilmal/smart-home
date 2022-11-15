const initailState = {
    data: "Hello world"
}

const Reducer = (state = initailState, action) => {
    switch (action.type) {
        default:
            return {
                ...state
            }
    }
}

export default Reducer