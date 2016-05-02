'use strict';

import React, {
  View,
  StyleSheet,
  PropTypes,
  Text,
  Component
} from 'react-native';

import Common from '../../common/common'; 

class WeekView extends Component {
  componentDidMount() {
  }
  
  days() {
    if(!this.props.data) {
      return <View style={ styles.dayCol }/>
    }
    
    return Common.week(this.props.data).map((item, index) => {
      var day = 
        <Text style={ styles.day }>
          { item.week }
        </Text>
      var iconUp = 
        <Text style = {[styles.day_icon, styles.weather_icon]}>
          { item.iconUp }
        </Text>
      var iconDown = 
        <Text style = {[styles.day_icon, styles.weather_icon]}>
          { item.iconDown }
        </Text>
      var date = 
        <Text style={ styles.date }>
          { item.date }
        </Text>
      return (
        <View style={ styles.dayCol } key={item.week}>
          {day}
          {date}
          {iconUp}
          <View style={{flex: 2}} />           
        </View>
      );
    });
  }
  
  render() {
    if (this.props.data) {
      return (
        <View style = { styles.week }>
          <View style = { styles.week_panel } >              
            <View style={ styles.dayColSpacing } />
            {this.days()}              
          </View>
        </View>
      );
    } else {
      return (
        <View style = { styles.week } />
      );
    }
  }
}

WeekView.propTypes = {
  data : React.PropTypes.array,
};

var styles = StyleSheet.create({
  dayColSpacing: {
    borderRightColor: '#336699',
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0
  },
  dayCol: {
    borderRightColor: '#336699',
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  weather_icon: {
    fontFamily: 'WeatherIcons-Regular',
  },
  week_panel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  week: {
    alignItems: 'stretch',
    flex: 6,
  },
  day_icon: {
    fontSize: 20,
    color: '#ffffff',
    flex: 1,
  },
  day: {
    fontSize: 16,
    color: '#ffffff',    
    fontWeight: 'bold',
    lineHeight: 18
  },
  date: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
    fontWeight: 'bold'
  }
});

module.exports = WeekView;