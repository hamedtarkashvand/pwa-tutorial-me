const nameCollection = 'recipes';
db.enablePersistence().catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});

db.collection(nameCollection).onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      // add new the document to the database
      renderRecipes(change.doc.data(), change.doc.id);
    }
    if (change.type === 'removed') {
      // remove the document from database
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const data = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection(nameCollection)
    .add(data)
        .catch((err) => console.log(err));
    form.title.value = '';
    form.ingredients.value = '';
});
// remove a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', (evt) => {
  const recipeId = evt.target.getAttribute('data-id');
  if (evt.target.nodeName === 'I') {
    db.collection(nameCollection).doc(recipeId).delete();
  }
});
