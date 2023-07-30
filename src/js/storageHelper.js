const fetchInLS = (item, isArray) => JSON.parse(localStorage.getItem(item) || (isArray ? '[]' : '{}'))

const saveInLS = (item, data, isArray) => {
  localStorage.setItem(item, JSON.stringify(data))
  return fetchInLS(item, isArray)
}

export {
  fetchInLS,
  saveInLS
}
