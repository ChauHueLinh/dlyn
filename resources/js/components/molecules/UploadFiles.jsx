import React, { useState, useEffect } from 'react'

export default function UploadImg(props) {

    const [errors, setErrors] = useState({})
    
    useEffect(() => {
        if (props.validate[props.name] != undefined) {
            Object.entries(props.validate).forEach(([key, value]) => {
                if (props.name == key) {
                    setErrors({
                        name: key,
                        message: value
                    })
                }
            });
        } else {
            setErrors({})
        }
    }, [props.validate]);

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        props.callback(e.target.files)
    }

    return (
        <div className={props.containerClass}>
            <div className={`mb-1 ${props.labelClass && props.labelClass}`}>
                {props?.label} {props?.isRequired && <span className="text-red-500">*</span>}
            </div>
            <div className={`flex items-center space-x-4 ${props.classPreview && props.classPreview}`}>
                <div className='w-full' style={props.stylePreview && props.stylePreview} onClick={() => document.getElementById('input-files').click()}>
                    <div className={`${props.containerBtnClass ? props.containerBtnClass : 'flex justify-content-start mt-3'}`}>
                        <button 
                            style={{fontSize: '30px'}}
                            className={`${props.btnClass ? props.btnClass : 'inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium text-black border border-1 border-dark bg-gray-100'}`}
                        >
                            <i className='bx bx-image-add'></i>
                        </button>
                    </div>
                </div>
                <input
                    type='file'
                    name={props.name}
                    id='input-files'
                    className='hidden'
                    onChange={onSelectFile}
                    multiple='multiple'
                />
            </div>
            
            { errors.message && errors.message.map((item, index) => (
                <div key={index} className={`text-red-500 mt-1 ${props.errorClass && props.errorClass}`}>{ item }</div>
            )) }
        </div>
    )
}