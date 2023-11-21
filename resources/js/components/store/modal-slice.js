import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: 'modalHeadless',
    initialState: {
        isOpen: false,
        validateField: [],
        collection: [],
        isLoading: false,
        isLoadingTable: false,
    },
    reducers: {
        open(state, action) {
            const payload = action.payload

            state.isOpen = true
            state.collection = {
                id: payload.id,
                name: payload.name,
                data: payload.data,
                accessToken: payload.accessToken,
            }
        },
        close(state, action) {
            const payload = action.payload
            
            state.isOpen = false
            state.collection = {
                id: 0,
                name: null
            }
        },
        loading(state, action) {
            const payload = action.payload

            state.isLoading = payload
        },
        loadingTable(state, action) {
            const payload = action.payload

            state.isLoadingTable = payload
        }
    }
})

export const modalActions = modalSlice.actions;
export default modalSlice;