'use strict';

import React, {
  StyleSheet
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  loading: {
    flex: 1,
    padding: 10,

  },
  overviewSlide: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  forecastSlide: {
    flex: 1,
    padding: 20
  },
  citySection: {
    flex: 1,
    flexDirection: 'row',
  },
  weatherSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent:'flex-end',
    padding: 10
  },
  city: {
    fontSize: 35,
    color: '#EFEFEF',
    textAlign:'center',
    flex: 1,
    flexDirection: 'column',
  },
  icon: {
    fontFamily: 'weathericons-regular-webfont',
    fontSize: 60,
    padding: 0,
    color: '#EFEFEF'
  }
});

module.exports = styles;
