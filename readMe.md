# Replot-treemap: TreeMaps for react
Intelligent and customizable treemap components for your wicked cool projects.

![Tree!](docs/img/tree-photo.jpg)

## Installation
Only works with React projects. React must be installed separately.
```bash
npm install react-ent
```

Then with a module bundler like webpack/browserify that supports CommonJS/ES2015 modules, use as you would anything else.

```javascript
import TreeMap from 'react-ent'
```

## API
Ent is designed to create beautiful treemaps right out of the box. The only *required* input is properly formatted data.

### Basic Usage
In the simplest case, just supply data and specify the keys for the titles and weights -:

```javascript
render() {
  let populations = {
    {country: "China", population: 1388232693},
    {country: "India", population: 1342512706},
    {country: "USA", population: 326474013},
  }

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" />
  )
}
```

- `data` is the only required prop
- `titleKey` defaults to `"title"`
- `weightKey` defaults to `"weight"`

### Dimensions
Dimensions may be specified by passing in `width` and `height` props. The
unit is pixels, and the treemap defaults to 800 by 400 pixels.

### Colors
Colors may be specified through 3 different mechanisms.
If none of the three props are specified, TreeMap defaults to a built in
`colorPalette`.

#### colorPalette
A `colorPalette` array prop may be specified. This array will be applied in
the same order starting with the largest rectangle. If the array is not large
enough, TreeMap will automatically recycle the colors.

#### colorFunction
A `colorFunction` prop may be specified. This will override all other color
methods. The colorFunction will receive two arguments, the object
corresponding to that rectangle and the integer index of the rectangle.
This enables more complex coloring rules to group data based on some
feature of the data. In the example below, we change the color based
on the political party of the candidate.

```javascript
render() {
  let primary_results = {
    {candidate: "Barrack Obama", votes: 1236812, party: "Democrat"},
    {candidate: "Hilary Clinton", votes: 693021, party: "Democrat"},
    {candidate: "John Kerry", votes: 991315, party: "Republican"},
  }

  let colorFunction = (data, index) => {
    if (data.party == 'Republican') {
      return "#ee3333"
    } else {
      return "#3333ee"
    }
  }

  return(
    <TreeMap data={primary_results} titleKey="candidate"
      weightKey="votes" colorFunction={colorFunction} />
  )
}
```

#### colorKey
A `colorKey` prop may be specified. This will override the colorPalette method.
TreeMap will look for this key in each row of data and use this to color the
area. This gives complete flexibility in specifying colors.

```javascript
render() {
  let populations = {
    {country: "China", population: 1388232693, color="#336699"},
    {country: "India", population: 1342512706, color="#336666"},
    {country: "USA", population: 326474013, color="#666699"},
  }

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" colorKey="color" />
  )
}
```

### Displaying Percentages
Rectangle percentage values are displayed by default. This behaviour can be
switched off using the `displayPercentages` boolean prop.

```javascript
render() {
  ...

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" colorKey="color" displayPercentages={false} />
  )
}
```

### Initial Animation
Initial animation is enabled by default, resulting in the treemap growing and translating from the top left corner. This can be disabled using the `initialAnimation` prop.

```javascript
render() {
  ...

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" colorKey="color" initialAnimation={false} />
  )
}
```
