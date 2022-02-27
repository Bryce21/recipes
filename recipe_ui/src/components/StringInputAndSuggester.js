import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';

export default class StringInputAndSuggester extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            suggestions: []
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.value !== this.props.value){
            // todo does this need to pass in any input?
            // todo debounce this somehow
            const suggestions = await this.props.getSuggestions(this.props.field);
            this.setState({suggestions})
        }
    }

    onChange = (event, { newValue }) => {
        this.props.onValueChange(newValue);
    };

    renderSuggestion = suggestion => (
        <div>
          {suggestion}
        </div>
    );

    getSuggestionValue = suggestion => suggestion

    /*
        Represents styling for the AutoSuggest
     */
    getDefaultTheme = () => {
        return {
            container: {
            },
            input: {
                width: '15%'
            },
            suggestion: {
                textColor: 'white',
                textAlign: 'left'
            },
            suggestionsContainer: {
                position: 'absolute',
                backgroundColor: 'grey'
            }
        }
    }


    render(){
        const {theme, placeholder, value} = this.props;

        return (
            <div>
                <Autosuggest
                    theme={theme || this.getDefaultTheme()}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={() => {}}
                    onSuggestionsClearRequested={() => {}}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={{
                        placeholder: placeholder,
                        value,
                        onChange: this.onChange
                    }}
                />
            </div>
        )
    }
};

StringInputAndSuggester.propTypes = {
    // when there is nothing in the input
    placeholder: PropTypes.string,
    // controls styling for auto suggest component
    theme: PropTypes.object,

    // the input value
    value: PropTypes.string,
    // function that is called with the updated value
    onValueChange: PropTypes.func.isRequired,

    // this is the function that is called when props.value has changed
    // should return suggestions (of a certain expected format) to set the suggestions state to
    // todo brycePr add expected format here
    getSuggestions: PropTypes.func,
    // the field to parse results to get suggestions for
    field: PropTypes.string.isRequired
}

StringInputAndSuggester.defaultProps = {
    placeholder: 'Enter value',
    value: '',
    suggestions: []
}
