import React, { useState, useEffect } from 'react'

export default function UploadImg(props) {

    const [errors, setErrors] = useState({})
    const [fileImage, setFileImage] = useState()
    const [preview, setPreview] = useState()
    
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

    useEffect(() => {
        if (!fileImage) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(fileImage)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [fileImage])

    useEffect(() => {
        setPreview(props.value ? props.value : '')
    }, [props.value])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        
        setFileImage(e.target.files[0])
        props.callback(e.target.files[0])
    }

    return (
        <div className={props.containerClass}>
            <div className={`mb-1 ${props.labelClass && props.labelClass}`}>
                {props?.label} {props?.isRequired && <span className="text-red-500">*</span>}
            </div>
            <div className={`flex items-center space-x-4 ${props.classPreview && props.classPreview}`}>
                <div className='w-full' style={props.stylePreview && props.stylePreview} onClick={() => document.getElementById('input-file').click()}>
                    {
                        preview
                        &&
                            <div 
                                className='w-full border border-1 border-dark rounded-circle overflow-hidden display-square mx-auto'
                                style={props.style && props.style}
                            >
                                <img
                                    className='h-100 mx-auto'
                                    style={props.stylePreview && props.stylePreview} 
                                    src={preview}
                                    alt='bdns'
                                />
                            </div>
                    }  
                    <div className="flex justify-center mt-3">
                        <button 
                            style={{fontSize: '30px'}}
                            className='w-50 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium text-black border border-1 border-dark bg-gray-100'
                        >
                            <i className='bx bx-image-add'></i>
                        </button>
                    </div>
                </div>
                <input
                    type='file'
                    name={props.name}
                    id='input-file'
                    className='hidden'
                    onChange={onSelectFile}
                />
            </div>
            
            { errors.message && errors.message.map((item, index) => (
                <div key={index} className={`text-red-500 mt-1 ${props.errorClass && props.errorClass}`}>{ item }</div>
            )) }
        </div>
    )
}