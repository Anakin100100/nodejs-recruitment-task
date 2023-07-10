#### Running the script

```
node index.js
```

#### Running tests

```
npm test
```

I haven't added a unit test for the fetchTop10MoviesData function because there is something wrong in my module setup and I wasted way too much time trying to fix it. This package must be a module to use top level await. I cannot mock the fetch function normally in jest or using jest-fetch-mock. In such a test I would mock the fetch function to return a prepared html with only the relevant data and css classes and later check if it is processed correctly by the function.
