export const handleStore = store => {
    if (localStorage.store) store.replaceState(JSON.parse(localStorage.store))  // 初始化store
    store.subscribe((mutation, state) => {
        localStorage.setItem("store", JSON.stringify(state))
    });
}
