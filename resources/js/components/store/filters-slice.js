import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        param: {
            keywords: '',
            order_by: 'DESC',
            page: 1,
            per_page: 10
        },
        status: 0,
        forcePage: null
    },
    reducers: {
        handle(state, action) {
            const payload = action.payload
            const status = [
                '', 'DESC', 'ASC'
            ]

            for (const [key, value] of Object.entries(payload)) {
                const encodeValue = encodeURIComponent(value)
                if (state.param.hasOwnProperty(key)) {
                    if (key == 'sort_key') {
                        if (state.param.sort_key == encodeValue) {
                            switch (state.status) {
                                case 2:
                                    state.param.order_by = status[0]
                                    state.status = 0
                                    break;
                                case 1:
                                    state.param.order_by = status[2]
                                    state.status = 2
                                    break;
                            
                                case 0:
                                    state.param.order_by = status[1]
                                    state.status = 1
                                    break;
                            }
                        } else {
                            state.status = 1 // khi chuyển sang thead khác sẽ để order_by = DESC (1)
                            state.param.order_by = status[1]
                        }

                        state.param['sort_key'] = encodeValue
                    } else if(key != 'sort_key' && key != 'page'){ // khi ở mục filtes data sẽ không bị ảnh hưởng bởi page hiện tại
                        state.param['page'] = 1
                        state.param[key] = encodeValue
                    } else {
                        state.param[key] = encodeValue
                    }
                    state.forcePage = state.param.page - 1 //chuyển sang trang 1
                } else if(key == 'sort_key') {
                    state.status = 1
                    state.param[key] = encodeValue
                } else {
                    state.param[key] = encodeValue
                }
                
            }
        },
        forcePage(state, action) {
            const payload = action.payload
            state.forcePage = payload
        }
    }
})

export const filtersActions = filtersSlice.actions
export default filtersSlice