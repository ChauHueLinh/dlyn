import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "~/components/store/modal-slice";
import filtersSlice from "~/components/store/filters-slice";

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        filters: filtersSlice.reducer,
    }
})

export default store;