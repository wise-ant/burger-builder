import React from 'react';
//import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

import Ingredient from './BurgerIngredient/Ingredient'
import classes from './Burger.css';

const burger = (props) => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <Ingredient key = {igKey + i} type = {igKey} />
      })
    })
    .reduce((arr, el)=>{
      return arr.concat(el)
    }, [])

    if (transformedIngredients.length === 0) {
      transformedIngredients = <p>Please start adding ingredients!</p>
    }
  return (
    <div className={classes.Burger}>
      <Ingredient type="bread-top"/>
      {transformedIngredients}
      <Ingredient type="bread-bottom"/>

    </div>)
}


export default burger;
