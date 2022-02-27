const Joi = require('joi');
const {Client} = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });


const searchField = Joi.object({
    field: Joi.string().required(),
    // what if there is a number? value is a number
    value: Joi.array().items(Joi.string()),
    date_from: Joi.date(),
    date_to: Joi.date(),
    num_from: Joi.number(),
    num_to: Joi.number()
})
// todo validation can't set date and num range at once
// todo field has to be set with something?

// this gets suggestions for a single field with match_phrase_prefix
module.exports = {
    path: '/search',
    method: 'POST',
    options: {
        validate: {
            payload: Joi.object({
                fields: Joi.array().items(searchField).default([]),
                limit: Joi.number().integer().greater(0).optional()
            }),
            failAction(request, h, err) {
                request.log('error', err);
                throw err;
            },
        },

    },
    handler: async (request, h) => {
        try {
            console.log('hitting handler2', request.payload);
            const fields = request.payload.fields || [];
            const limit = request.payload.limit || 10;

            // if nothing return everything
            if(!fields.length){
                const allSearch = await client.search({
                    index: 'recipes',
                    body: {
                        size: limit,
                        query: {
                            match_all: {}
                        }
                    }
                })
                console.log(allSearch)
                return allSearch.body.hits;
            }

            const mustQuery = fields.map((fieldQuery) => {
                const mustClause = {};
                if(fieldQuery.value && fieldQuery.value.length){
                    mustClause.bool = {
                        must: fieldQuery.value.map(v => ({
                                match_phrase_prefix: {
                                    [fieldQuery.field]: v
                                }
                            })
                        )
                    }
                }

                if(fieldQuery.num_from !== undefined && fieldQuery.num_to !== undefined){
                    mustClause.range = {
                        [fieldQuery.field]: {
                            gte: fieldQuery.num_from,
                            lte: fieldQuery.num_to
                        }

                    }
                } else if(fieldQuery.num_from !== undefined){
                    mustClause.range = {
                        [fieldQuery.field]: {
                            gte: fieldQuery.num_from,
                        }

                    }
                } else if(fieldQuery.num_to !== undefined){
                    mustClause.range = {
                        [fieldQuery.field]: {
                            lte: fieldQuery.num_to
                        }

                    }
                }

                // todo date range
                return mustClause
            })
            console.log('mustQuery');
            console.log(JSON.stringify(mustQuery, null, 2))

            const searchResults = await client.search({
                index: 'recipes',
                body: {
                    size: limit,
                    query: {
                        bool: {
                            must: mustQuery
                        }

                    }
                }
            })
            console.log(searchResults)

            // todo add a way to return raw search result

            return searchResults.body.hits.hits || [];
        } catch (err) {
            console.log('hitting error');
            console.log(err)
            return err
        }
    }
}
