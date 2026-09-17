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
      <h1>Welcome to React API</h1>
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
          </tbody>
                  </table>
    </div>
  )
}
}
export default App 