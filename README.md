To see the demo click [here](http://loopiezlol.me/matchMyRegex)

This is a little side projects started as a React exercise, but finished due to too much free time.

If you want to replicate the behaviour of the matching component feel free to use the `RegexGame.js` file in the project.

After importing, you can use the componenet in the following way:
```jsx
...
render() {

  const string = {'firstString', 'abcdef', 's0m3thing'};
  return (
    <RegexGame options={strings} />
  );

}
...
```

--

Other props that can be used:
 - **matchColor**: color to highlight the matching sequences by the regex inputed. Defaults to **green**
 - **onInput**: function called everytime input is made. Can be used to pass down some trigger in a parent componenet on every user input
 - **foundSrc** and **notFoundSrc**: **URI**s to resources to be displayed near every option in the game if the user matched or did not matched it.
 - **returnScore**: if provided, the **onInput** function will be called with a **score** argument, which is the percentage (from `0` to`1`) of the matches. If user matches all options it will be `1`. If it doesn't match anything it will be `0`.
 - **regexType**: defines the flag of the regular expression created. It default to `g` : *multiline; treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)*
 
 
 The plan is to provide in the near future the option of capturing only ceratin parts of the options in a easy to use manner.
 
--

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


If you want to get started with **React** I recommend following the tutorial series [here](https://medium.com/@diamondgfx/learning-react-with-create-react-app-part-1-a12e1833fdc)


--

If you want to make this side project better please feel free to contribute.
