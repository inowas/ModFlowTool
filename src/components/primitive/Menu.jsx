/*

items = [{
    name,
    icon,
    items: [{
        name,
        onClick
    }]
}]

*/

import React, { Component, PropTypes } from 'react';

import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import ConfiguredRadium from 'ConfiguredRadium';
import styleGlobals from 'styleGlobals';

const styles = {

    wrapper: {
        backgroundColor: styleGlobals.colors.background,
        padding: 16,
        boxShadow: styleGlobals.boxShadow
    },

    title: {
        textAlign: 'center',
        fontSize: 16
    },

    list: {
        listStyle: 'none',
        marginLeft: 36,
        padding: 0
    },

    listItem: {
        paddingTop: 6,
        paddingBottom: 6
    }

};

@ConfiguredRadium
export default class Menu extends Component {

    static propTypes = {
        style: PropTypes.object,
        title: PropTypes.string,
        items: PropTypes.array,
        firstActive: PropTypes.number
    }

    render( ) {
        const { title, items, style, firstActive } = this.props;

        return (
            <nav style={[ styles.wrapper, style ]}>
                <Accordion>
                    <AccordionItem style={styles.title} heading={title}>
                        <Accordion firstActive={firstActive}>
                            {items.map(( i, index ) => (
                                <AccordionItem icon={i.icon} heading={i.name} key={index}>
                                    <ul style={styles.list}>
                                        {i.items.map(( i2, index2 ) => (
                                            <li style={styles.listItem} key={index2}>
                                                {(( ) => {
                                                    if ( i2.onClick ) {
                                                        return (
                                                            <button onClick={i2.onClick} className="link">
                                                                {i2.name}
                                                            </button>
                                                        );
                                                    }
                                                    return i2.name;
                                                })( )}
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AccordionItem>
                </Accordion>
            </nav>
        );
    }
}
