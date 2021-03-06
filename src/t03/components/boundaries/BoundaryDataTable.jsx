/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

import * as edit from 'react-edit';
import {DataTable, Formatter} from '../../../core/index';
import Icon from '../../../components/primitive/Icon';

class BoundaryDataTable extends DataTable.Component.DataTable {
    constructor(props) {
        super(props);

        this.state = {
            searchColumn: 'all',
            query: {}, // Search query
            page: 1,
            perPage: this.props.perPage || 20,
            selectedRows: [],
            // Sort the first column in a descending way by default.
            // "asc" would work too and you can set multiple if you want.
            sortingColumns: {
                'date_time': {
                    direction: 'asc',
                    position: 0
                },
            },
            columns: [{
                props: {style: {width: 30}},
                header: {
                    label: '', formatters: [() => (!this.props.readOnly &&
                        <Icon name={'unchecked'} onClick={this.onSelectAll}/>
                    )
                    ],
                },
                cell: {
                    formatters: [
                        (value, {rowData}) => !this.props.readOnly &&
                            <Icon
                                name={rowData.selected ? 'checked' : 'unchecked'}
                                onClick={() => this.onSelect(rowData)}
                            />
                    ]
                }
            }, {
                property: 'date_time',
                header: {
                    label: 'Start Time',
                    transforms: [this.resetable],
                    formatters: [this.header]
                },
                cell: {
                    transforms: this.props.readOnly ?
                        [] : [this.editableDate(edit.input({props: {type: 'date'}}))],
                    formatters: [(value) => (<span>{Formatter.toDate(value)}</span>)]
                }
            }],
            rows: this.props.rows
        };

        props.config.forEach(item => {
            this.state.columns.push({
                property: item.property,
                header: {label: item.label},
                cell: {
                    transforms: this.props.readOnly ?
                        [] : [this.editable(edit.input({props: {type: 'number'}}))],
                    formatters: [(value) => (<span>{Formatter.toNumber(value)}</span>)]
                }
            });
        });
    }

    onRowsChange = rows => {
        rows.map(r => {
            r.date_time = Formatter.dateToAtomFormat(r.date_time);
            return r;
        });
        this.props.onChange(rows);
    };
}

BoundaryDataTable.propTypes = {
    config: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    rows: PropTypes.array.isRequired,
};

export default BoundaryDataTable;
