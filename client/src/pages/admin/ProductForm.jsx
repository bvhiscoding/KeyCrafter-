const ProductForm = () => {
  return (
    <section className="card stack-sm">
      <h1>Admin - Product Form</h1>
      <input type="text" placeholder="Product name" />
      <input type="number" placeholder="Price" />
      <input type="number" placeholder="Stock" />
      <button type="button" className="button">
        Save product
      </button>
    </section>
  );
};

export default ProductForm;
