import InventoryView from './Wholesaler/components/InventoryPage';
import InventoryManagement from './Wholesaler/components/PendingOrder';
import SidebarMenu from './Wholesaler/components/ProfilePage';
import ProductSelectionPage from './Retailers/UserOrderView';
import { HashRouter as Router,Routes,Route } from 'react-router-dom';
import CustomerDetails from './Wholesaler/components/CustomerDetails';
import CustomerForm from './Wholesaler/components/CustomerEntryForm';
import Cart from './Retailers/CartPage';
import SuccessOrder from './Retailers/SuccessOrderPage';
import YourOrders from './Retailers/MyOrdersPage';
import ItemsList from './Retailers/ItemsListPage';
import Pagination from './Wholesaler/components/pagination';
import Login from './Auth/login';
import CreateNewPassword from './Auth/CreateNewPasswordPage';
import ContactUs from './Wholesaler/components/ContactUs';

function App() {
  return (  
    <Router> 
    <Routes> 
          <Route path="/" element={<InventoryManagement/>}/>
          <Route path="/InventoryView" element={<InventoryView />}/> 
          <Route path="/userOrdersPage" element={<ProductSelectionPage />}/>
          <Route path='/ProfilePage' element={<SidebarMenu/>}/>
          <Route path="/customerdetails" element={<CustomerDetails/>}/>
          <Route path="/customerentry" element={<CustomerForm/>}/>
          <Route path='/mycart' element={<Cart/>}/>
          <Route path='/SuccessOrder' element={<SuccessOrder/>}/> 
          <Route path='/YourOrders' element={<YourOrders />}/> 
          <Route path='/itemslist/:id' element ={<ItemsList/>}/>
          <Route path='/pagination' element={<Pagination/>} />
          <Route path='/login' element={< Login/>} />
          <Route path='/createnewPassword' element={< CreateNewPassword/>} />
          <Route path='/ContactUs' element={< ContactUs/>} />
          

    </Routes>
    </Router>
  );
}


export default App;

