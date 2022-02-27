import {Component} from 'react';
import StringInputAndSuggester from './StringInputAndSuggester';
import axios from 'axios'
import TableComponent from './table'
import NumberRangeInput from './NumberRangeInput'

export default class wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => {
        return {
            rows: [],

            submitted: {
                from: null,
                to: null
            },
            name: '',
            cooking_time: {
                from: null,
                to: null
            },
            tags: [],
            steps: [],
            n_steps: {
                from: null,
                to: null
            },
            description: '',

            ingredients: [],
            n_ingredients: {
                from: undefined,
                to: undefined
            }
        }
    }

    renderNameInput = () => {
        return (
            <div className={'nameInputWrapper'}>
                <span>Name: </span>
                <StringInputAndSuggester
                    value={this.state.name}
                    onValueChange={name => this.setState({name})}
                    getSuggestions={this.getSuggestions}
                    field={'name'}
                />
            </div>
        )
    }

    renderDescriptionInput = () => {
        return (
            <div className={'descriptionInputWrapper'}>
                <span>Description: </span>
                <StringInputAndSuggester
                    value={this.state.description}
                    onValueChange={description => this.setState({description})}
                    getSuggestions={this.getSuggestions}
                    field={'description'}
                />
            </div>
        )
    }




    renderSubmittedDate = () => {
        return (
            <div>
                <label htmlFor="submitted_from">From date:</label>

                <input
                    type="date"
                    id="submitted_from"
                    name="submitted_from"
                    value={this.state.submitted.from}
                    // todo min/max?
                    // min="2018-01-01"
                    // max="2018-12-31"
                />

                <label htmlFor="submitted_to">To date:</label>

                <input
                    type="date"
                    id="submitted_to"
                    name="submitted_to"
                    value={this.state.submitted.to}
                    onChange={(e) => this.setState({submitted: {from: this.state.submitted.from, to: e.value}})}
                    // todo min/max?
                    // min="2018-01-01"
                    // max="2018-12-31"
                />
            </div>

        )
    }

    /*
        Consumes the component state to build payload for api
        Return json payload
     */
    buildPayload = (size = 10) => {

        console.log('buildPayload.state', this.state);
        const fields = [];

        const state = this.state;
        if(state.name){
            fields.push({
                field: 'name',
                value: [state.name]
            })
        }

        if(state.description){
            fields.push({
                field: 'description',
                value: [state.description]
            })
        }

        // todo handle zero
        if(state.n_steps.from && state.n_steps.to) {
            fields.push({
                field: 'n_steps',
                num_from: parseInt(state.n_steps.from),
                num_to: parseInt(state.n_steps.to)
            })
        } else if(state.n_steps.from) {
            fields.push({
                field: 'n_steps',
                num_from: parseInt(state.n_steps.from),
                // num_to: state.n_steps.to
            })
        } else if(state.n_steps.to){
            fields.push({
                field: 'n_steps',
                // num_from: state.n_steps.from,
                num_to: parseInt(state.n_steps.to)
            })
        }


        console.log('fields', fields);
        return {
            limit: size,
            fields
        }
    }


    buildNumberRangeQuery(stateField) {

    }



    search = async (size = 10) => {
        try {
            const payload = this.buildPayload(size);
            const searchResponse = await axios.post('http://localhost:3001/search', payload)
            return searchResponse.data
        } catch (err) {
            console.error(err);
            return []
        }
    }


    getSuggestions = async(field, size = 10) => {
        const search = await this.search(size);
        console.log('search', search);

        return search.map(hit => {
            return hit._source[field];
        })
    }


    searchButtonOnClick = async (size = 20) => {
        try {
            const s = await this.search(size);
            console.log('searchButtonOnClick.search', s);

            if(s.hits){
                this.setState({rows: s.hits.map(row => row._source)})
                return;
            }

            // todo this can fail depending on the search
            // if only one result found elasticsearch will return the one document not wrapped in hits
            // so will fail with cannot use map on undefined
            // there is a way to configure this on es side so it will always return result wrapped in hits
            // so don't want to fix here
            // todo not only that response shape is weird
            this.setState({rows: s.map(row => row._source)})

        } catch (err) {
            console.error('Failed search: ', err);
        }

    }

    renderPostSearchButton = () => {
        return (
            <button
                onClick={() => this.searchButtonOnClick()}
            >
                Search
            </button>
        )
    }


    getColumns = () => {
        return ['name', 'description', 'ingredients', 'minutes', 'n_ingredients', 'n_steps', 'steps']
    }


    render(){
        console.log('render called', this.state);
        return (
            <div>
                {this.renderNameInput()}
                {this.renderDescriptionInput()}
                {/*Number steps number input*/}
                <span>Number of steps: </span>
                <NumberRangeInput
                    from={this.state.n_steps.from}
                    to={this.state.n_steps.to}
                    toChange={(e) => {console.log(e);this.setState({n_steps: {from: this.state.n_steps.from, to: e.target.value}})}}
                    fromChange={(e) => this.setState({n_steps: {from: e.target.value, to: this.state.n_steps.to}})}

                />


                {this.renderPostSearchButton()}




                <hr/>
                <TableComponent
                    data={this.state.rows || []}
                    columns={this.getColumns()}
                />

            </div>
        )
    }
}
