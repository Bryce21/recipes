# recipes



Kaggle data source link: https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions

Plan:
Make a site to be able to filter and search through recipe data that is loaded into elasticsearch.
Not having site hit es directly, built up site queries need to be translated
Auth? Need to have api/es authenticated so not anyone can talk to es

Workflow:

[x] Need to get the recipe data into elasticsearch
     Dockerized elk
[ ] Frontend
    Frontend first cuz have to decide how to build up query to send to backend to translate or translate directly and hit es directly.
    [ ] Draw up plan of what want ui to look at. Queries can build and how that would filter use cases
    [ ] Translation service here?
[ ] Backend
    [ ] Hapi/express server?
    [ ] Translation service here?
    [ ] Api to be able to add more documents to es cluster


UI planning:
name,id,minutes,contributor_id,submitted,tags,nutrition,n_steps,steps,description,ingredients,n_ingredients

recipe name search/selection filter
    recipe_name: name
    Do multiple names? 
submitted date range filter
    submitted: date range info
how long to cook range slider
tags select filter
n_steps number range filter
description search
ingredients search/filter
n_ingredients number range filter