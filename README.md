# Stackoverflow-light-front-end

This is the front end for the stackoverflow project.

## Usage

To run the frontend simply clone it and make sure that the [back end](https://github.com/Lamasaurus/stackoverflow-light-back-end) is running, then run: 
```
npm install
npm start
```

## Testing

To run the tests run:
```
npm test
```

The tests make use of a `fetch-mock` module setup in `./src/setupTests.ts` so we are able to test the integration between the `API` and components themselves.

## Design decisions
The frontend is completely implemented in Typescript. This way it is easier to reason about the code and easier to test in general making development faster.

The application is created using the React library because it is a lightweight and easy to use library to create component based applications. All components are implemented functionally because this way they are easier to reason about and maintain. In the future they are also supposed to be easier to test, I found this not the case for now and the `act()` test function to update components has a known [issue](https://github.com/facebook/react/issues/14769) to throw an uninformative error.

Each component resides in its own folder in `./src/components` this way we can reuse them all as we see fit. In each folder we find an `index.tsx` file that exports the component. I chose to use this instead of a `Component.tsx` file because now we are able to import them like this `import "../Component/"` instead of `import "../Component/Component"` which has the name of the component in it twice and is thus redundant. 
Further we find a `Component.scss` file in some components which carries the styling for the particular component. Lastly each component will be accompanied with a `Component.test.tsx` file that defines the tests for that component. 

All tests came after the implementation of the component it tests except for the search function, where I tried TTD.

In `./src/lib/API` there is a class called `APIAccess` for API accesses. It is placed in the `lib` folder because it is not direct frontend code, but the frontend makes use of it. This is to make a separation between frontend code and business logic. `APIAccess` is exported as a singleton, this way all components that import it will use the same instance. This way we can store user login data and the access token here.
