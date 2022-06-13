export function setCategoryList(state, { list }) {
  state.list = list;
}

export function favoriteClick(state, { indexCategory, index, favorite }) {
  state.list[indexCategory].items[index].favorite = favorite;
}
