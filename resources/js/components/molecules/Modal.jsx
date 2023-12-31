import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

export default function Modal(props) {
    const [isOpen, setIsOpen] = useState(false)

    if (props.display != isOpen) {
        setIsOpen(props.display)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-20' onClose={() => props.callbackClose()}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>
                <div className={`${props.containerClass ?? 'rounded-lg fixed inset-0 overflow-auto'}`} style={props?.containerStyle}>
                    <div className={`card-center max-h-100 rounded-lg overflow-auto scrollbar-hidden bg-light ${props.wrapperClass && props.wrapperClass}`}>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className={props.panelClass ? props.panelClass : 'w-full transform p-6 text-left align-middle transition-all'}>
                                {props.btnClose &&
                                    <i 
                                        className='bx bx-x text-black lead absolute max-w-max' 
                                        style={{ fontSize: '30px', top: '10px', right: '16px' }}
                                        onClick={() => props.callbackClose()}
                                    >
                                    </i>
                                }
                                {props.children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}