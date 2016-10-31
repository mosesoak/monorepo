'use strict';

var React = require('react')
var shallowCompare = require('react-addons-shallow-compare')
// var radium = require('radium')
// var aphrodite = require('aphrodite')
var glamor = require('glamor')
var merge = glamor.merge
var style = glamor.style
var glamorReact = require('glamor/react')
var glamorJsx = require('glamor/jsxstyle')

var _isEmpty = require('lodash/isEmpty')
var _forEach = require('lodash/forEach')
var _map = require('lodash/map')
var _findLast = require('lodash/findLast')
var _filter = require('lodash/filter')
var _keys = require('lodash/keys')
var _pick = require('lodash/pick')
var _omit = require('lodash/omit')
var _assign = require('lodash/assign')

// from https://github.com/facebook/css-layout#default-values
var layoutDefaultStyle = {
  position: 'relative',
  flexShrink: 0,
}

var layoutDefaultCSS = style(layoutDefaultStyle)

// from https://facebook.github.io/react-native/docs/layout-props.html
var layoutStyles = [
  'alignItems',
  'alignSelf',

  // --soon to be removed--
  'alignContent',
  'justifyContent',
  // ----

  'bottom',
  'flex',
  'flexDirection',      // consider replacing with 'direction'
  'flexWrap',           // consider replacing with 'wrap'
  'flexGrow',           // consider replacing with 'grow'
  'flexShrink',         // consider replacing with 'shrink'
  'flexBasis',          // consider replacing with 'basis'
  'height',
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
  'order',
  'overflow',
  'overflowX',
  'overflowY',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'position',
  'right',
  'top',
  // 'transform',
  // 'transition',
  'width',
  'zIndex',

  //TODO: Deprecate these
  'background',
  'backgroundColor',
  'boxShadow',
  'border',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderColor',
  'borderStyle',
  'borderRadius',
  'borderWidth',
  'outline',
]

var layoutProps = layoutStyles.concat([
  'marginHorizontal',
  'marginVertical',
  'paddingHorizontal',
  'paddingVertical',

  // soon to be moved to aliases
  'overflowScrolling',
  'align',
  'justify',
])

function getStyleFromProps( props, styleAliases ) {
  var styleFromProps = _pick( props, layoutStyles )

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

  // webkit-overflow-scrolling
  if (props.overflowScrolling) {
    styleFromProps.WebkitOverflowScrolling = props.overflowScrolling
  }

  // align and justify
  if (props.align) {
    styleFromProps.alignItems = props.align
  }
  if (props.justify) {
    styleFromProps.justifyContent = props.justify
  }

  // map styleAliases if there are any
  if (styleAliases) {
    var styleAliasesFromProps = _pick( props, _keys( styleAliases ))

    // if aliased props are found, use the styleAlias maps to convert their value
    if (!_isEmpty( styleAliasesFromProps )) {
      _forEach( _keys( styleAliasesFromProps ), function( aliasKey ) {
        var alias = styleAliases[ aliasKey ]

        styleFromProps[ alias.property ] = alias.map[ props[ aliasKey ] ]
      })
    }
  }

  return styleFromProps
}

function getNonStyleProps( props, styleAliases ) {
  if (styleAliases) {
    return _omit( props, layoutProps.concat( _keys( styleAliases ) ) )
  }

  return _omit( props, layoutProps )
}

module.exports = function( displayName, requiredStyle, defaultStyle, styleAliases ) {
  var defaultCSS = style(defaultStyle)
  var requiredCSS = style(requiredStyle)
  // return radium(React.createClass({

  return React.createClass({

    displayName: displayName,

    propTypes: {
      refNode: React.PropTypes.func,
    },

    getDefaultProps: function() {
      return {tag: 'div'}
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    },

    render: function() {
      var styleFromProps = getStyleFromProps( this.props, styleAliases )
      // var propsWithoutStyle = getNonStyleProps( this.props, styleAliases )
      var propsToPass = getNonStyleProps( this.props, styleAliases )

      // RADIUM
      // var style = [].concat.call( layoutDefaultStyle, defaultStyle, styleFromProps, this.props.style, requiredStyle )
      // APHRODITE
      // var style = _assign( {}, layoutDefaultStyle, defaultStyle, styleFromProps, this.props.style, requiredStyle )
      // var styles = aphrodite.StyleSheet.create({node: style})
      // GLAMOR
      // var style = _assign( {}, layoutDefaultStyle, defaultStyle, styleFromProps, this.props.style, requiredStyle )
      // var styles = glamor.style(style)

      // var css = merge( layoutDefaultCSS, defaultCSS, style(styleFromProps), style(this.props.css), requiredCSS )
      var css = _assign( {}, layoutDefaultStyle, defaultStyle, styleFromProps, this.props.css, requiredStyle )

      // RADIUM
      // var passedProps = _assign( {}, propsWithoutStyle, {style: style} )
      // APHRODITE
      // var passedProps = _assign( {}, propsWithoutStyle, {className: aphrodite.css(styles.node)} )
      // delete passedProps.style
      // GLAMOR
      // var passedProps = _assign( {}, propsWithoutStyle, {className: styles} )
      // GLAMOR-react
      propsToPass.css = css
      // var passedProps = _assign( {}, propsWithoutStyle, {css: styles} )
      // delete passedProps.style


      // No need to pass the tag prop down
      delete propsToPass.tag

      // Use refNode pattern to pass back the DOM's node
      if (propsToPass.refNode) {
        propsToPass.ref = propsToPass.refNode
        delete propsToPass.refNode
      }

      // return React.createElement( this.props.tag, passedProps )
      // GLAMOR-react
      return glamorReact.createElement( this.props.tag, propsToPass )
    }
// }))
  })
}
