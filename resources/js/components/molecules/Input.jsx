import React, { useState, useEffect } from 'react'

export default function Input(props) {

    const [errors, setErrors] = useState({})
    const [value, setValue]   = useState('')
    const [isChecked, setIsChecked] = useState(false)

    const isDisabled = props.disabled == true ? true : false
    const inputClass = props.inputClass ?
                       props.inputClass :
                       "bg-gray-50 border border-solid border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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

    useEffect(() => {
        setIsChecked(props.checked ?? false)
    }, [props.checked])

    const handleChange = (e) => {
        if (props.type == 'text' || props.type == 'email' || props.type == 'number' || props.type == 'password' || !props.type) {
            changeText(e)
        }
        if (props.type == 'checkbox') {
            changeCheckbox()
        }
    }

    const changeText = (e) => {
        setValue(e.target.value)
        props.onChange ? props.onChange(e.target.value) : "";
    }
    const changeCheckbox = () => {
        setIsChecked(!isChecked)
        props.onChange(!isChecked)
    }

    return (
        <div className={props.containerClass}>
            {props.labelName && (
                <label
                    htmlFor={props.name}
                    className={`${labelClass}`}
                >
                    <div> {props.labelName} </div>
                    {props.isRequired && <p className="text-red-500">*</p>}
                </label>
            )}

            { props.children
                ?
                    props.children
                :
                    <input
                        type={props.type ?? "text"}
                        name={props.name} value={value}
                        id={props.name}
                        className={`${inputClass} ${errors.message && 'border-red-500'} ${isDisabled == true && 'bg-gray'} shadow-md`}
                        placeholder={props.placeholder}
                        onChange={e => handleChange(e)}
                        disabled={isDisabled}
                        min={props?.min}
                        step={props?.step}
                        checked={isChecked}
                        onBlur={props?.callbackOnBlur}
                    />
            }
            
            { errors.message && errors.message.map((item, index) => (
                <div key={index} className="text-red-500 mt-1">{ item }</div>
            )) }
        </div>
    )
}