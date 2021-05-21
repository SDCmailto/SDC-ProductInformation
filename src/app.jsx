import React from 'react';
import ReactDOM from 'react-dom';
import ProductInfo from './components/productInfo.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    let productId = new URL(window.location).pathname.slice(1);
    this.state = {
      productId,
      product: {},
      cast: [],
      avgReviews: 0,
      totalReviews: 0
    };
  }


  componentDidMount() {
    let that = this;
    axios.get('http://localhost:3001/Information/' + this.state.productId)
      .then((responseData) =>
        that.setState({
          product: responseData.data,
          cast: responseData.data.cast
        })
      )
      .catch(function(error) {
        console.log('ERROR IN AXIOS GET REQUEST', error);
      });

    axios.get('http://localhost:9001/averagereview/' + this.state.productId)
      .then((response) =>
        that.setState({
          avgReviews: response.data.averageReviews,
          totalReviews: response.data.totalReviews
        })
      )
      .catch((error) =>
        console.log('ERROR GETTING REVIEW', error)
      );
  }


  render() {
    return (
      <ProductInfo product = {this.state.product} cast = {this.state.cast} avgReviews = {this.state.avgReviews} totalReviews = {this.state.totalReviews}/>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('information'));