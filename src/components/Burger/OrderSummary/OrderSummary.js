import React, {Component} from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button'

 class OrderSummary extends Component {
   //this can be functional component does not need to be a class
   componentWillUpdate(){
     //console.log("OrderSummary will update");
   }

  render(){
    const ingredientsSummary = Object.keys(this.props.ingredients)
      .map(igKey => (
        <li key={igKey}>
          <span style={{textTransform: 'capitalize'}}>
            {igKey}
          </span>
            : {this.props.ingredients[igKey]}
        </li>
      )
    )

    return(
      <Aux>
        <h3>Your order</h3>
        <p>A delicious burger with the following ingredients: </p>
        <ul>
        {ingredientsSummary}
        </ul>
        <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue Checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCanceled}>CANCEL</Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
      </Aux>
    )
  }

}

export default OrderSummary;
