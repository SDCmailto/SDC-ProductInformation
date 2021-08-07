import React from 'react';
import ReactDOM from 'react-dom';
import ProductInfo from './components/ProductInfo.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    let productId = new URL(window.location).pathname.split('/');
    let id = productId[productId.length - 1];
    this.state = {
      id,
      product: {},
      cast: [],
      avgReviews: 0,
      totalReviews: 0
    };
    this.informationip = /* env.INFORMATION_IP || */ 'localhost';
    // this.reviewsip = env.REVIEW_IP || localhost;
  }


  componentDidMount() {
    let that = this;
    axios.get(`http://localhost:3001/Information/` + this.state.id)
      .then((responseData) => {
        that.setState({
          product: responseData.data,
          cast: responseData.data.cast_list.data
        })
      })
      .catch(function(error) {
        console.log('ERROR IN AXIOS GET REQUEST', error);
      });

    // axios.get(`http://${this.reviewsip}:3004/averagereview/` + this.state.id)
    //   .then((response) =>
    //     that.setState({
    //       avgReviews: response.data.averageReviews,
    //       totalReviews: response.data.totalReviews
    //     })
    //   )
    //   .catch((error) =>
    //     console.log('ERROR GETTING REVIEW', error)
    //   );
  }


  render() {
    console.log('this.state: ', this.state)
    return (
      <ProductInfo product = {this.state.product} cast = {this.state.cast} avgReviews = {this.state.avgReviews} totalReviews = {this.state.totalReviews}/>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('information'));

export default App;