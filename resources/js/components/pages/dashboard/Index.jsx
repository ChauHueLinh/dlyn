import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider, useDispatch, useSelector} from 'react-redux'

import store from '~/components/store'

function DashboardIndex() {

    return (
        <div className="w-full py-5 h1 text-center">
            <div className="mx-auto w-25 bg-blue-100 py-5">Trang chủ</div>
        </div>
    )
}

export default DashboardIndex

if (document.getElementById("dashboard-index")) {
    ReactDOM.createRoot(document.getElementById("dashboard-index")).render (
        <Provider store={store}>
            <DashboardIndex/>
        </Provider>
    )
}