var pick = require('lodash/pick')
var omit = require('lodash/omit')

// from https://facebook.github.io/react-native/docs/layout-props.html
var layoutStyles = [
  'alignItems',
  'alignSelf',
  'bottom',
  'flex',
  'flexDirection',
  'flexWrap',
  'height',
  'justifyContent',
  'left',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'position',
  'right',
  'top',
  'width',
  'zIndex'
]

var layoutProps = layoutStyles.concat([
  'marginHorizontal',
  'marginVertical',
  'paddingHorizontal',
  'paddingVertical',
])

function getDisplayStyles( props ) {
  var styleFromProps = pick( props, layoutStyles )

  // Handle Vertical and Horizontal cases (like React Native)
  if (!styleFromProps.marginTop && props.marginVertical) {
    styleFromProps.marginTop = props.marginVertical
  }
  if (!styleFromProps.marginBottom && props.marginVertical) {
    styleFromProps.marginBottom = props.marginVertical
  }
  if (!styleFromProps.marginLeft && props.marginHorizontal) {
    styleFromProps.marginLeft = props.marginHorizontal
  }
  if (!styleFromProps.marginRight && props.marginHorizontal) {
    styleFromProps.marginRight = props.marginHorizontal
  }


  if (!styleFromProps.paddingTop && props.paddingVertical) {
    styleFromProps.paddingTop = props.paddingVertical
  }
  if (!styleFromProps.paddingBottom && props.paddingVertical) {
    styleFromProps.paddingBottom = props.paddingVertical
  }
  if (!styleFromProps.paddingLeft && props.paddingHorizontal) {
    styleFromProps.paddingLeft = props.paddingHorizontal
  }
  if (!styleFromProps.paddingRight && props.paddingHorizontal) {
    styleFromProps.paddingRight = props.paddingHorizontal
  }

  return styleFromProps
}

function getNonDisplayProps( props ) {
  return omit( props, layoutProps )
}


module.exports = {
  getDisplayStyles: getDisplayStyles,
  getNonDisplayProps: getNonDisplayProps,
}