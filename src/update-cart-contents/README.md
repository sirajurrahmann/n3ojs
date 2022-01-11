# update-cart-contents

```
npm install @n3o/update-cart-contents
```

Require the package in the `index.ts` file

Initialize cart functionality, passing in the query selector for the cart icon.

```javascript
import cart from "@n3o/update-cart-contents";

cart.setToUpdateOnClick({
  cartBag: "#your-cart-selector",
  cartCounter: "#your-counter-selector",
  onModalOpen: () => $("#cart").modal("show"),
  // TODO
});
```
