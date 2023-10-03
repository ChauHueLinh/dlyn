import { useEffect, useState } from 'react'

export default function Switch( props ) {

    const [ loading, setLoading ] = useState( false )
    const [ enabled, setEnabled ] = useState()

    useEffect(() => {
        setEnabled( props.enabled )
        setLoading( false )
    }, [ props.enabled, props.id ])
    
    const callback = () => {
        props.callback( enabled )
        setLoading( true )
    }
    return (
        <>
            { loading
                ?
                    <div
                        className={ `switch-button ${ props.class } ${ enabled && `enabled` }`}
                    >
                        <div className='round'></div>
                    </div>
                :
                    <div
                        className={ `switch-button ${ props.class } ${ enabled && `enabled` }`}
                        onClick={() => callback()}
                    >
                        <div className='round'></div>
                    </div>
            }
        </>
    )
}