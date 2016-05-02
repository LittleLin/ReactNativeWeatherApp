import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions
} from 'react-native';


import Swiper from 'react-native-swiper2'
import Common from './common/common';
import WeekView from './components/iOS/WeekView';
import Chart from './components/iOS/Chart';

class WeatherApp extends Component {
  constructor(props) {
    super(props);
    
    this.flex = [2,1,6,6];
    let windowSize = Dimensions.get('window');
    let flexItemHeight = windowSize.height / this.flex.reduce(function(a, b){return a+b;});
    
    this.state = {
      initialPosition: null,
      lastPosition: null,
      loaded: false,
      cityName: 'unknown',      
      currentWeather: {
        temp: null,
        tempMin: null,
        tempMax: null,
        icon: Common.icon(null),
      },
      
      weekViewData: [],
      chartWidth: windowSize.width,
      chartHeight: flexItemHeight * 2,
      chartTop: flexItemHeight * 7,
      chartData: null,
      chartLineColors : ["#d35400","#a0dcdc"],
      chartPointFillColors : ["#e67e22","#a0dcdc"],
      chartPointStrokeColors : ["#d35400","#ffffff"],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({
          initialPosition: initialPosition}
        );
        this.fetchWeatherData();
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  // 取得天氣資訊
  fetchWeatherData() {
    var position = this.state.initialPosition;
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude + "&units=metric&lang=zh_tw&appid=bc639fd1425f7df939fafd3a4f64d096";
    var currentWeather = null;
    
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        var currentWeather = {
          temp: data.main.temp.toFixed(1),
          tempMin: data.main.temp_min.toFixed(1),
          tempMax: data.main.temp_max.toFixed(1),
          icon: Common.icon(data.weather[0].icon),
          description: data.weather[0].description
        };
        this.setState({
          currentWeather: currentWeather
        });
      })
      .then(this.fetchCityData())
      .then(this.fetchForecastData())
      .then(() => {
        this.setState({
          loaded: true,
        });
      })
      .done();
  }
  
  // 取得行政區名稱
  fetchCityData() {
    var position = this.state.initialPosition;
    var apiUrl = "http://maps.google.com/maps/api/geocode/json?latlng=" + position.coords.latitude+ "," + position.coords.longitude + "&language=zh-TW&sensor=true";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        var result = data.results[0].address_components;

        let cityName = result.filter(component => component.types[0] === "administrative_area_level_1" || component.types[1] === "administrative_area_level_2")[0];
        this.setState({
          cityName: cityName.short_name
        });
      })
      .done();
  }

  // 取得天氣預測資訊
  fetchForecastData() {
    var position = this.state.initialPosition;
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&lon=" + position.coords.longitude + "&lat=" + position.coords.latitude + "&units=metric&lang=zh_tw&appid=bc639fd1425f7df939fafd3a4f64d096";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        var chartData = [];
        var temp_max_arr = [];
        var temp_min_arr = [];
        
        Common.week(data.list).map((item, index) => {
          temp_max_arr.push(item.max);
          temp_min_arr.push(item.min);
        });
        chartData.push(temp_max_arr);
        chartData.push(temp_min_arr);

        chartData.map((item, index) => {
          item.push(item[0]);
          item.unshift(item[0]);
        });

        this.setState({
          chartData: chartData,
          weekViewData: data.list
        });
      })
      .done();
  }

  renderLoadingView() {
    return (
      <Image source={require('./images/background.jpg')} style={styles.container}>
        <View style={styles.loading}>
          <Text style={{fontSize: 30, color: '#EFEFEF'}}>
            Loading...
          </Text>
        </View>
      </Image>
    );
  }
  
  renderOverviewSlide() {
    return (
      <View style={styles.overviewSlide}>
        <View style={styles.citySection}>
          <Text style={styles.city}>
            {this.state.cityName}
          </Text>
        </View>
        <View style={styles.weatherSection}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.icon}>
              {this.state.currentWeather.icon}
            </Text>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#EFEFEF'}}>
              {this.state.currentWeather.description}
            </Text>
          </View>
          <Text style={{fontSize: 50, fontWeight: 'bold', color: '#EFEFEF'}}>
            {this.state.currentWeather.temp}°
          </Text>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#EFEFEF'}}>
            {this.state.currentWeather.tempMax}° / {this.state.currentWeather.tempMin}°
          </Text>
        </View>
      </View>
    );
  }

  renderForecastSlide() {
    return (
      <View style={styles.forecastSlide}>   
        <View style={{flex: 1}}>
        </View>
        
        <View style={{flex: 39}}>     
          <WeekView data={this.state.weekViewData} flex={this.flex.slice(3)}/>     
          
          <Chart 
            data={this.state.chartData} 
            width={this.state.chartWidth} 
            height={this.state.chartHeight}
            top={this.state.chartTop}
            pointFillColors={this.state.chartPointFillColors}
            pointStrokeColors={this.state.chartPointStrokeColors}
            lineColors={this.state.chartLineColors}
            />
        </View>
      </View>
    );    
  }
  
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <Image source={require('./images/background.jpg')} style={styles.container}>      
        <Swiper style={styles.wrapper} horizontal={false} showsButtons={false} showsPagination={false} loop={false}>
          
          {this.renderOverviewSlide()}
          
          {this.renderForecastSlide()}
          
        </Swiper>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    width: null,
    height: null,
    backgroundColor: 'rgba(0,0,0,0)',
    resizeMode: 'stretch' // iOS only
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
    padding: 0
  },
  city: {
    fontSize: 35,
    color: '#EFEFEF',
    textAlign:'center',
    flex: 1,
    flexDirection: 'column',
  },
  icon: {
    fontFamily: 'WeatherIcons-Regular',
    fontSize: 60,
    padding: 0,
    color: '#EFEFEF'
  }
});

AppRegistry.registerComponent('WeatherApp', () => WeatherApp);
