const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
cartSchema.index({ user: 1 }, { unique: true });
cartSchema.index({ 'items.product': 1 });
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL: 90 days (increased from 30)



// Total amount of items in cart
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Total price of all items in cart
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((sum, item) => {
    // Handle cases where product might be deleted or not populated
    if (!item.product || !item.product.price) {
      return sum;
    }
    const price = item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);