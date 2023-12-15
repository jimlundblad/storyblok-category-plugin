import { useState, useEffect, FunctionComponent } from 'react'
import { useFieldPlugin } from '../useFieldPlugin'
import AsyncSelect, { StylesConfig } from 'react-select';
import CSS from 'csstype';
import { FieldPluginOption, FieldPluginSchema } from '@storyblok/field-plugin';

async function getCategories() {
    // TODO
}

const WAVECategories: FunctionComponent = () => {

    const { data, actions: { setContent }}:any = useFieldPlugin();
    const [selected, setSelected ] = useState();
    const [waveCategories, setWaveCategoriesState] = useState<any[]>();

    useEffect(() => {
        getCategories().then( // TODO: On Load, collect data from WA&VE once)
    }, []);

    useEffect(()=>{
        getSelected();
    },[data, waveCategories])

    const getSelected = () => {
        // TODO
    }

    const setCategories = ((event: any) => {
        // TODO
    })

    const colourStyles: StylesConfig = {
        control: (styles) => ({ ...styles, fontSize: '12px' }),
        placeholder: (styles) => ({ ...styles, fontSize: '12px' }),
        group: (styles) => ({
            ...styles,
            'fontSize': '9px',
            'paddingTop': '1px',
            'paddingBottom': '1px',
            'marginTop': '1px',
            'marginBottom': '1px',
        }),
        groupHeading: (styles) => ({
            ...styles,
            'fontSize': '9px',
            'borderTop': '1px solid #ccc',
            'marginTop': '1px',
            'paddingTop': '3px',
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                'fontSize': '14px',
            };
        },
    };

    const appCSS: CSS.Properties = {
        'minHeight': '450px',
        'height': '100%',
    };

    return (
        <div className="App" style={appCSS}>
            <AsyncSelect
                value={selected}
                isMulti
                isSearchable={true}
                isDisabled={waveCategories == undefined}
                isLoading={waveCategories == undefined}
                onChange={event => setCategories(event)}
                options={waveCategories}
                styles={colourStyles}
            />
            <p style={{textAlign:'center',fontSize:'12px', paddingTop:'5px'}}>All of the above categories are managed in <a href='https://wave.uea.ac.uk' target='_blank' title='WA&VE'>WA&VE</a>.<br/>Please contact the <a href='mailto:digital@uea.ac.uk'>Digital Inbox</a> for any queries.</p>
        </div>
    );
}

export default WAVECategories