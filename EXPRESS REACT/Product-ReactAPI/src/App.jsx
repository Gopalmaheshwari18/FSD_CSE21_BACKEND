import react from 'react'
  import {usestate, useEffect}from 'react' 
const App = () =>{
  const[products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  // get products
  const getProducts =  async () => {
    const response = await fetch('http://localhost:4000/api/products');
    const data = await response.json();
    setProducts(data);
  }
  // add product
  const addProduct = async (e) => {
      e.preventDefault();
      const product ={
        name:name,
        price:price,
        category:category
      };
  await fetch('http://localhost:4000/api/products'),
      {
       method:'POST',
        headers:{
          'Content-Type':'application/json'
        }, 
      body:JSON.stringify(product) 
  }
  return (

    <div>
      <h1>Product Management App </h1>
      <form onSubmit={addProduct}>
        <input type='text' placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
        <input type='text' placeholder='Price' value={price} onChange={(e)=>setPrice(e.target.value)}/>
        <input type='text' placeholder='Category' value={category} onChange={(e)=>setCategory(e.target.value)}/>
        <button type='submit'>Add Product</button>
      </form> 
      <table border='1'cellpadding='10'cellspacing='0'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
}
export default App 