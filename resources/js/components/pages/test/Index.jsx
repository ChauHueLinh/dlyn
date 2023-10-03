import React from 'react'
import toast from 'react-hot-toast'
import ReactDOM from 'react-dom/client'

import { useState, useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import store from '~/components/store'
import Add from '~/components/pages/role/Add'
import Edit from '~/components/pages/role/Edit'
import Delete from '~/components/pages/role/Delete'
import Table from '~/components/molecules/Table'
import Filters from '~/components/molecules/Filters'
import PageFrame from '~/components/molecules/PageFrame'
import SelectBox from '~/components/molecules/SelectBox'

import { url } from '~/components/pages/role/Url'
import { modalActions } from '~/components/store/modal-slice'
import { filtersActions } from '~/components/store/filters-slice'

function TestIndex(){

    return (
        <SelectBox>

        </SelectBox>
    )
}

export default TestIndex

if(document.getElementById("test-index")) {
    ReactDOM.createRoot(document.getElementById("test-index")).render(
        <Provider store={store}>
            <TestIndex/>
        </Provider>
    )
}