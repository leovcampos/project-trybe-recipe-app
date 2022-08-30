import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDetailsRecipe } from '../services/recipesAPI';
import './style/RecipeInProgress.css';
import IconCopy from '../components/IconCopy';
import Favorite from '../components/Favorite';

function RecipeInProgress({ type, history }) {
  const { id } = useParams();
  const recipeType = type === 'meal' ? 'Meal' : 'Drink';
  const testType = type === 'meal' ? 'meals' : 'cocktails';
  const [recipe, setRecipe] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [ingredientsChecked, setIngredientsChecked] = useState([]);

  const getRecipeAPI = async () => {
    const newRecipe = await getDetailsRecipe(type, id);
    setRecipe(newRecipe);
  };

  const ingredientes = recipe.length !== 0 ? Object.keys(recipe[0])
    .filter((key) => key.includes('strIngredient'))
    : [];

  const amount = recipe.length !== 0 ? Object.keys(recipe[0])
    .filter((key) => key.includes('strMeasure'))
    : [];

  const listIngredients = ingredientes
    .filter((e) => recipe[0][e] !== null)
    .filter((ele) => recipe[0][ele].length !== 0);

  const local = JSON.parse(localStorage.getItem('inProgressRecipes'));

  const toggleCheckbox = (e) => {
    console.log(e.target.parentNode.innerText);

    if (e.target.checked) {
      // localStorage.setItem(JSON.stringify({ [e.target.id]: e.target.checked }));
      console.log(local[testType]);
      local[testType][id].push(e.target.value);

      localStorage.setItem('inProgressRecipes', JSON.stringify(local));
      setIsDisabled(false);
      // const test = console.log(arrayList);
    } else {
      const index = (local[testType][id]).indexOf(e.target.value);
      local[testType][id].splice(index);
      // const newLocal = local[testType][id].filter((el) => el !== e.target.value);
      localStorage.setItem('inProgressRecipes', JSON.stringify(local));
    }
  };

  const getLocalStorage = () => {
    const progressRecipes = localStorage.getItem('inProgressRecipes')
      ? local : {
        meals: {},
        cocktails: {},
      };

    const newRecipe = { ...progressRecipes,
      [testType]: { ...progressRecipes[testType],
        [id]: [] } };
    localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipe));
    setIngredientsChecked(newRecipe[testType][id]);
    console.log(ingredientsChecked);
  };

  const handleButton = () => {
    history.push('/done-recipes');
  };
  useEffect(() => {
    getRecipeAPI();
    getLocalStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (

    <div>
      {
        recipe.length !== 0
        && (
          <>
            <img
              src={ recipe[0][`str${recipeType}Thumb`] }
              alt="Food"
              data-testid="recipe-photo"
            />
            <h3
              data-testid="recipe-title"
            >
              {recipe[0][`str${recipeType}`]}
            </h3>
            <IconCopy id={ id } type={ type } index={ 0 } />
            <Favorite id={ id } type={ type } />

            <p data-testid="recipe-category">{recipe[0].strCategory}</p>
            <ul>
              {
                listIngredients.map((ingrediente, index) => (
                  <li
                    key={ index }
                    data-testid={ `${index}-ingredient-step` }
                    id="li-ingredients"
                  >
                    <label
                      htmlFor={ ingrediente }
                      className="input"

                    >
                      <input
                        type="checkbox"
                        onChange={ toggleCheckbox }
                        id={ ingrediente }
                        value={
                          `${recipe[0][ingrediente]} - ${recipe[0][amount[index]]}`
                        }

                      />
                      {recipe[0][ingrediente]}

                      {
                        recipe[0][amount[index]] !== null
                         && ` - ${recipe[0][amount[index]]}`
                      }

                    </label>

                  </li>
                ))
              }
            </ul>

            <h3>Instructions</h3>
            <p
              data-testid="instructions"
            >
              {recipe[0].strInstructions}
            </p>

            <button
              type="button"
              data-testid="finish-recipe-btn"
              onClick={ handleButton }
              disabled={ isDisabled }
            >
              Finalizar Receita
            </button>
          </>
        )
      }

    </div>
  );
}

RecipeInProgress.propTypes = {
  type: PropTypes.string,
}.isRequired;

export default RecipeInProgress;