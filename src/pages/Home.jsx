import products from '../data/products'
import ProductCard from '../components/ProductCard';
function Home(){
return(
<div className="max-w-7x1 mx-auto px-4 py-8">
    <h1 className="text-2x1 font-bold mb-6">
        Latest Electronics
    </h1>
    <div className="grid grid-cols-1  sm:grid-cols-2 md:gird-cols-3 lg:grid-cols-4 gap-6" >
        {products.map((product)=><ProductCard key={product.id}
        product={product}/>)}

    </div>
</div>

);

}
export default Home;