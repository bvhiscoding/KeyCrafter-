import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from '@/store/cart.slice';

const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  return {
    ...cart,
    addItem: (product) => dispatch(addToCart(product)),
    removeItem: (id) => dispatch(removeFromCart(id)),
    changeQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    resetCart: () => dispatch(clearCart()),
  };
};

export default useCart;
