const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const single_mealEl = document.getElementById('single-meal');

function searchMeal(e){
    e.preventDefault();

    //clear single meal
    single_mealEl.innerHTML = '';


    //get search term
    const term = search.value;
    //console.log(term);

    //check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data =>{
                //console.log(data);
                resultHeading.innerHTML = `<h3>Search result for '${term}': Please scroll down to see the details</h3>`;

                if(data.meals === null){
                    resultHeading.innerHTML = `<p>There is no search result for '${term}'</p>`;
                }else{
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                     <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                    .join('');
                }

            })
    }else{
        alert('put something')
    }
    //clear search history
    search.value = '';

}
//fetch meal by ID
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data =>{
            //console.log(data);
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}

//add meal to DOM
function addMealToDOM(meal){
    const ingredients = [];

    for(let i=1 ; i<=20 ; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`)
        }else{
            break;
        }
    }
    single_mealEl.innerHTML = `
        <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="main">
            <h2>ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        </div>
    `;
}


submit.addEventListener('submit',searchMeal)
mealsEl.addEventListener('click',e =>{
    const mealInfo = e.path.find(item=>{
        // console.log(item);
        if(item.classList){
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    });
   if(mealInfo){
       const mealID = mealInfo.getAttribute('data-mealid');
    // console.log(mealID);
       getMealById(mealID)
   } 
});