# replot-treemap: TreeMaps for react
Intelligent and customizable treemap components for your wicked cool projects.

![Tree!](docs/img/tree-photo.jpg)

## Installation
Only works with React projects. React must be installed separately.
```bash
npm install replot-treemap
```

Then with a module bundler like webpack/browserify that supports CommonJS/ES2015
modules, use as you would anything else.

```javascript
import TreeMap from 'replot-treemap'
```

## API
replot-treemap is designed to create beautiful treemaps right out of the box.
The only *required* input is properly formatted data.

### Basic Usage
In the simplest case, just supply data (as a Javascript array) and specify the
keys for the titles and weights -:

```javascript
render() {
  let populations = [
    {country: "China", population: 1388232693},
    {country: "India", population: 1342512706},
    {country: "USA", population: 326474013}
  ]

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" />
  )
}
```

- `data` is the only required prop
- `titleKey` defaults to `"title"`
- `weightKey` defaults to `"weight"`

### Advanced Usage - Nesting
Replot treemaps are able to display nested data, as long as the structure of the
data is an proper flat format. If flat nested data is supplied, a `keyOrder`
prop, which details titleKeys at various levels in the form of a Javascript
array, starting with the most general first, is also required. In this
case, the `titleKey` prop is no longer required.

Nested data input would look as follows:

```javascript
render() {
  let populations = [
    {population: 650, country: "China", state: "Beijing", city: "Miyun"},
    {population: 902, country: "China", state: "Beijing", city: "Tongzhou"},
    {population: 120, country: "China", state: "Beijing", city: "Yizhuang"},
    {population: 800, country: "United States", state: "California", city: "San Francisco"},
    {population: 1002, country: "United States", state: "California", city: "Los Angeles"},
    {population: 150, country: "United States", state: "Vermont", city: "Newport"},
    {population: 202, country: "United States", state: "Vermont", city: "Montpelier"},
    {population: 112, country: "Canada", state: "Ontario", city: "Kingston"},
    {population: 80, country: "Canada", state: "Ontario", city: "Barrie"},
  ]
  let keys = ["country", "state", "city"]

  return(
    <TreeMap data={populations} weightKey="population"
      keyOrder={keys}/>
  )
}
```

### Dimensions
Dimensions may be specified by passing in `width` and `height` props. The
unit is pixels, and the treemap defaults to 800 by 400 pixels.

### Colors
Colors may be specified through 2 different mechanisms, both through a `color` prop.
If none of the mechanisms are specified, TreeMap defaults to a built in
color palette.

#### User-provided Color Palette
The user can specify their own desired colored palette for the boxplots to use.
This is done by passing in an array of color strings to the component with the
`color` prop. The displayed boxplots will cycle through the provided colors.

#### User-provided Color function
The user can specify the color for rectangles by provided a function
as well. One can expect to receive the index of the rectangle (from 0 to n, where
0 is the top left rectangle, and indexes increase from left to right and then
top to bottom.), as well as any data associated with that specific rectangle.

### Clustering Small Rectangles
Replot treemaps intelligently aggregate smaller rectangles into a rectangle
classified by "Other". By default, any rectangle that would have an area smaller
than 2.5% of the total area is clustered. This value can be increased by passing
in an `otherThreshold` prop, as a decimal.

```javascript
render() {
  ...

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" otherThreshold={.05} />
  )
}
```

### Tooltip
Treemaps are capable of utilizing a tooltip to display more specific information
about any data element. By default, the tooltip is off, but can be activated by
passing in a `tooltip` prop (no value needed). The tooltip features two different
color schemes, dark and light, which can be specified by a
`tooltipColor` prop, with a value of "dark" or "light".

```javascript
render() {
  ...

  return(
    <TreeMap data={populations} titleKey="country"
      tooltip tooltipColor="light" />
  )
}
```

####Customizing Tooltip contents
By default, the tooltip will simply display the title of a rectangle.
The user can customize exactly what is displayed inside the tooltip by
passing in a `tooltipContents` prop in the form of a Javascript function.
The user can expect to receive the key and value of the rectangle you are hovering over
(e.g. key="country" and value="USA"), an array of data related to that specific
rectangle, and all data for the treemap. The function should return JSX,
which can utilize the provided values.

```javascript
fillTooltip(key, value, rectData, allData){
  return (
    <div>You are hovering on the {key}: {value}</div>
  )
}

render() {
  ...

  return(
    <TreeMap data={populations}
      titleKey="country" weightKey="population"
      tooltip tooltipContents={this.fillTooltip} />
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
Initial animation is enabled by default, resulting in the treemap growing and
translating from the top left corner. This can be disabled using the `initialAnimation` prop.

```javascript
render() {
  ...

  return(
    <TreeMap data={populations} titleKey="country"
      weightKey="population" colorKey="color" initialAnimation={false} />
  )
}
```
