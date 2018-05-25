import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENTS_PRICES = {
  salad: 0.5,
  bacon: 0.9,
  meat: 1.1,
  cheese: 0.6,
}

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount(){
    axios.get('https://react-my-burger-cda16.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data})
      })
      .catch(error => {
        this.setState({error:true})
      })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    let updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const additionalPrice = INGREDIENTS_PRICES[type]
    const newPrice = this.state.totalPrice + additionalPrice

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    })

    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) return;
    const updatedCount = oldCount - 1;
    let updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const deductionalPrice = INGREDIENTS_PRICES[type]
    const newPrice = this.state.totalPrice - deductionalPrice

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    })

    this.updatePurchaseState(updatedIngredients)

  }

  updatePurchaseState = (ingredients) => {

    const sum = Object.values(ingredients).reduce((sum, el) => sum += el, 0);
    this.setState({purchasable: sum})
  }

  purchaseHandler = () => {
    this.setState({purchasing: true})
  }

  purchaseClosedHandler = () => {
    this.setState({purchasing: false})
  }

  purchaseContinueHandler = () => {
    //orders.json - only for firebase, in real server it will be normal endpoint
    this.setState({loading: true})

    const data = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Tonya Mashtakova",
        address: {
          city: 'San Francisco',
          streen: "Ocean Ave",
          building: "123",
          app: "",
          zipCode: "12345"
        },
        phone: '1234567890',
        email: "test@test.com",
      },
      deliveryMethod: "fastest"
    }

    axios.post('/orders.json', data)
      .then(response => {
        this.setState({loading: false, purchasing: false})
      })
      .catch(error => {
        this.setState({loading: false, purchasing: false})
      })
  }


  render(){
    const disabledInfo ={
      ...this.state.ingredients
    }
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;

    if(this.state.loading){
      orderSummary = <Spinner />
    }

    let burger = this.state.error ? <p>Ingredients cannot be loaded</p> : <Spinner />

    if(this.state.ingredients) {
      burger = <Aux>
        <Burger ingredients = {this.state.ingredients}/>
        <BuildControls
          ingredientAdded = {this.addIngredientHandler}
          ingredientRemoved = {this.removeIngredientHandler}
          disabled = {disabledInfo}
          totalPrice={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </Aux>

      orderSummary = <OrderSummary
        ingredients = {this.state.ingredients}
        purchaseCanceled = {this.purchaseClosedHandler}
        purchaseContinued = {this.purchaseContinueHandler}
        price={this.state.totalPrice}
      />
    }

    return(
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseClosedHandler} >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);
