import React from 'react';

const renderIngredientsTableRowsSpecial = (ingredients) => {
    if (ingredients) {
      return ingredients.map((ingredient, index) => (
        <tr key={index} className="hover:bg-base-300">
          <td>{ingredient.name}</td>
          <td>
            <input
              id={`ingredient-${index}-minimum`}
              type="text"
              className="input input-bordered input-xs w-15"
              disabled={isDisabled}
              value={ingredient.minimum !== 0 ? ingredient.minimum : 'N/A'}
              onChange={(e) => {
                const inputValue = e.target.value
                // in consideration for 'N/A' values which means 0
                if (
                  /^N\/A(\d+|\.)/.test(inputValue) ||
                  /^\d*\.?\d{0,2}$/.test(inputValue)
                ) {
                  // to allow rewriting of input if user types a number after clicking on input with 'N/A'
                  const processedValue = /^N\/A\d*/.test(inputValue)
                    ? inputValue.replace('N/A', '')
                    : inputValue
                  handleIngredientMinimumChange(index, processedValue)
                  setIsDirty(false)
                }
              }}
              onFocus={() => {
                updateMyPresence({ focusedId: `ingredient-${index}-minimum` })
              }}
              onBlur={() => updateMyPresence({ focusedId: null })}
            />
            <Selections id={`ingredient-${index}-minimum`} others={others} />
          </td>
          <td>
            <input
              id={`ingredient-${index}-maximum`}
              type="text"
              className="input input-bordered input-xs w-15"
              disabled={isDisabled}
              value={ingredient.maximum !== 0 ? ingredient.maximum : 'N/A'}
              onChange={(e) => {
                const inputValue = e.target.value
                // in consideration for 'N/A' values which means 0
                if (
                  /^N\/A(\d+|\.)/.test(inputValue) ||
                  /^\d*\.?\d{0,2}$/.test(inputValue)
                ) {
                  // to allow rewriting of input if user types a number after clicking on input with 'N/A'
                  let processedValue = /^N\/A\d*/.test(inputValue)
                    ? inputValue.replace('N/A', '')
                    : inputValue
                  // limit max constraint of ingredient to weight
                  const numericValue = parseFloat(processedValue)
                  if (!isNaN(numericValue) && numericValue > weight) {
                    processedValue = weight
                  }
                  handleIngredientMaximumChange(index, processedValue)
                  setIsDirty(false)
                }
              }}
              onFocus={() =>
                updateMyPresence({ focusedId: `ingredient-${index}-maximum` })
              }
              onBlur={() => updateMyPresence({ focusedId: null })}
            />
            <Selections id={`ingredient-${index}-maximum`} others={others} />
          </td>
          <td>{ingredient && weight && (ingredient.value * weight).toFixed(3)}</td>
          <td>
            <button
              disabled={isDisabled}
              className={`${isDisabled ? 'hidden' : ''} btn btn-ghost btn-xs text-red-500 hover:bg-red-200`}
              onClick={() => handleRemoveIngredient(ingredient)}
            >
              <RiDeleteBinLine />
            </button>
          </td>
        </tr>
      ))
    }
  }

export default renderIngredientsTableRowsSpecial;
// Note: This function is used to render the rows of ingredients in a table format for its respective ingredients.