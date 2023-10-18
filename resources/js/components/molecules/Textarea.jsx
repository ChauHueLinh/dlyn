import React, { useState, useEffect } from 'react'

export default function Textarea(props) {

    const [errors, setErrors] = useState({})
    const [value, setValue] = useState('')

    const isDisabled = props.disabled == true ? true : false
    const inputClass = props.inputClass ?
        props.inputClass :
        "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    const labelClass = props.labelClass ? props.labelClass : "mb-2 text-sm font-medium text-gray-900 flex items-center space-x-2"

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
        setValue(props.value ? props.value : '')
    }, [props.value])

    const handleChange = (e) => {
        setValue(e.target.value)
        props.onChange ? props.onChange(e.target.value) : "";
    }

    return (
        <div className={props.containerClass}>
            <label
                htmlFor={props.name}
                className={`${labelClass}`}
            >
                <div> {props.labelName} </div>
                {props.isRequired && <p className="text-red-500">*</p>}
            </label>

            <textarea
                name={props.name}
                id={props.name}
                value={value}
                rows="4"
                className={`${inputClass} ${errors.message ? 'border-red-500' : ''} shadow-md `}
                placeholder={props.placeholder}
                disabled={isDisabled}
                onChange={(e) => handleChange(e)}
            ></textarea>

            {errors.message && errors.message.map((item, index) => (
                <div key={index} className="text-red-500 mt-1">{item}</div>
            ))}
        </div>
    )
}