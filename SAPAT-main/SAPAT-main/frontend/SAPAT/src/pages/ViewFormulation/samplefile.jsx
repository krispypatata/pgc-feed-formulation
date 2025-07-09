
const formulationRatioConstraintSamples = {
        id: 1,
        name: "Starter Feed",
        ingredients: [
            { name: "Corn", percentage: 50 },
            { name: "Soybean Meal", percentage: 30 },
            { name: "Fish Meal", percentage: 10 },
            { name: "Premix", percentage: 10 }
        ],
        nutrientConstraints: {
            protein: { min: 20, max: 24 },
            fat: { min: 3, max: 5 },
            fiber: { min: 2, max: 5 },
            calcium: { min: 0.8, max: 1.2 },
            phosphorus: { min: 0.4, max: 0.6 }
        },
        nutrientRatioConstraints: [
            {
                firstIngredient: "Protein",
                secondIngredient: "Fat",
                firstIngredientRatio: 2,
                secondIngredientRatio: 1
            },
            {
                firstIngredient: "Calcium",
                secondIngredient: "Phosphorus",
                firstIngredientRatio: 3,
                secondIngredientRatio: 2
            },// calcium:phosphorus = 3:2
        ]
};

export default formulationRatioConstraintSamples;