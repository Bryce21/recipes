import {Component} from 'react';
import PropTypes from 'prop-types';

export default class NumberRangeInput extends Component {
    constructor(props) {
        super(props);
    }


    render(){
        return (
            <div>
                <label htmlFor="from">From:</label>
                <input
                    type="number"
                    id="from"
                    name="from"
                    min="0"
                    value={this.props.from}
                    onChange={this.props.fromChange}
                />

                <label htmlFor="to">To:</label>
                <input
                    type="number"
                    id="to"
                    name="to"
                    min={this.props.from}
                    value={this.props.to}
                    onChange={this.props.toChange}
                />
            </div>
        )
    }
}


NumberRangeInput.PropTypes = {
    from: PropTypes.number,
    to: PropTypes.number,
    // functions that are called on input change
    fromChange: PropTypes.func.isRequired,
    toChange: PropTypes.func.isRequired,
}

NumberRangeInput.defaultProps = {
    from: undefined,
    to: undefined
}
