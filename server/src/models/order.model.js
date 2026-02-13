const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      required: [true, 'Order code is required'],
      // Format: KC-YYYYMMDD-XXX (e.g., KC-20240115-001)
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product is required'],
        },
        name: {
          type: String,
          required: [true, 'Product name is required'],
        },
        image: {
          type: String,
          required: [true, 'Product image is required'],
        },
        price: {
          type: Number,
          required: [true, 'Product price is required'],
          min: [0, 'Price must be a positive number'],
        },
        quantity: {
          type: Number,
          required: [true, 'Product quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
    },
    shippingFee: {
      type: Number,
      required: [true, 'Shipping fee is required'],
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'stripe', 'banking'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    shippingAddress: {
      name: {
        type: String,
        required: [true, 'Recipient name is required'],
        trim: true,
        minlength: [2, 'Recipient name must be at least 2 characters long'],
      },
      phone: {
        type: String,
        trim: true,
        required: [true, 'Phone number is required'],
        match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'],
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address must be at most 200 characters long'],
      },
      ward: {
        type: String,
        required: [true, 'Ward is required'],
        trim: true,
        maxlength: [100, 'Ward must be at most 100 characters long'],
      },
      district: {
        type: String,
        required: [true, 'District is required'],
        trim: true,
        maxlength: [100, 'District must be at most 100 characters long'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [100, 'City must be at most 100 characters long'],
      },
    },
    note: {
      type: String,
      maxlength: [500, 'Note must be at most 500 characters long'],
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
          required: [true, 'Status is required'],
        },
        time: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    stripeSessionId: {
      type: String,
      select: false,
    },

    stripePaymentIntentId: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderSchema.index({ orderCode: 1 }, { unique: true });
orderSchema.index({ user: 1 }, { createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

// Compound index for admin queries
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

// middleware
// Auto generate orderCode
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Fix: Create separate date objects to avoid mutation
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Count orders today
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    this.orderCode = `KC-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    // Add initial status to history
    this.statusHistory.push({
      status: 'pending',
      time: new Date(),
    });
  }
  next();
});

// Update statusHistory when status changes
orderSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      time: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
