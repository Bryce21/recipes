import {Component, Fragment} from 'react';
import PropTypes from 'prop-types';


export default class Table extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render(){
        console.log('table.props', {props: this.props});
        return (
            <table>
                {/*headers*/}
                <thead>
                    <tr>
                        {this.props.columns.map( (column, colIndex) => {
                            return (
                                <th key={`th-col-${colIndex}`}>
                                    {column}
                                </th>
                            )
                        })}
                    </tr>
                </thead>


                <tbody>
                {
                    <Fragment>
                        {
                            this.props.data.map((dataRow, rowIndex) => {
                                return (
                                    <tr key={`row-index-${rowIndex}`}>
                                        {
                                            this.props.columns.map((col, tdIndex) => {
                                                return (
                                                    <td key={`td-index-${tdIndex}-rowIndex-${rowIndex}`}>
                                                        {dataRow[col] || 'N/A'}
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </Fragment>

                }
                </tbody>


            </table>
        )
    }
}


Table.propTypes = {
    columns: PropTypes.array.isRequired,
    // array of objects. Objects are a row
    // Columns represents the key to get row value for
    data: PropTypes.array.isRequired
}
