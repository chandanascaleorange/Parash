const {getProducts,addProduct,failed,request, addOrder, getOrder,delete_product, addProductTocart, Order_Placed, UPDATE_STATUS, uploadFile}= require('../Type/type')
const { 
    ADD_CUSTOMER_FAILURE, 
    ADD_CUSTOMER_REQUEST, 
    ADD_CUSTOMER_SUCCESS, 
    GET_CUSTOMER_FAILURE, 
    GET_CUSTOMER_REQUEST, 
    GET_CUSTOMER_SUCCESS, 
    GET_CART_PAGE,
    GET_QUANTITY,
    DELETE_CUSTOMER_FAILURE,
    DELETE_CUSTOMER_REQUEST,
    DELETE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER
  } =require( "../Type/type");

export const initialState = {
    isLoading: false,
    isError: false,
    products: [],
    customers: [],
    customersLoading: false,
    customersError: false,
    cart:[]
  };
  
export default function appReducer(state = initialState, action){
     switch(action.type){
        case addProduct:
          return {
            ...state,
            products: [...state.products, action.payload], // Fixed key products
          };
        case getProducts:
          return {
            ...state,
            products: action.payload,  // Directly replace the array
          };
        
          case delete_product:
            return {
              ...state,
              products: state.products.filter((product) => product.id !== action.payload),
            };  
        case failed:
            return{
                ...state,
                isLoading:true,
                Error:action.payload,
                };
        case request : 
        return {
            ...state,
          isLoading: true,
          Error: false,
        };
        case addOrder : 
        return {
            ...state,
            products:action.payload
        };
        case getOrder : 
        return {
            ...state,
            products:action.payload
        };
        case GET_CUSTOMER_REQUEST:
        return {
          ...state,
          customersLoading: true,
          customersError: false,
        };
      case GET_CUSTOMER_SUCCESS:
        return {
          ...state,
          customers: action.payload,
          customersLoading: false,
          customersError: false,
        };
      case GET_CUSTOMER_FAILURE:
        return {
          ...state,
          customersLoading: false,
          customersError: true,
        };
        
      case ADD_CUSTOMER_REQUEST:
        return {
          ...state,
          customersLoading: true,
          customersError: false,
        };
      case ADD_CUSTOMER_SUCCESS:
        return {
          ...state,
          customers: [...state.customers, action.payload],
          customersLoading: false,
          customersError: false,
        };
      case ADD_CUSTOMER_FAILURE:
        return {
          ...state,
          customersLoading: false,
          customersError: true,
        };
        case addProductTocart:return{
              ...state,
              isLoading:false,
              isError:false,

        };
        case GET_CART_PAGE:
          return {
            ...state,
            cart: action.payload, 
          };
        case GET_QUANTITY : 
          return {
            ...state,
            cart:action.payload
        };
        case Order_Placed:
         return{
          ...state,
          data:action.payload
         }
         case UPDATE_STATUS:
          return {
            ...state,
            cart:action.payload
          };
          case DELETE_CUSTOMER_REQUEST:
          return {
            ...state,
            customersLoading: true,
            customersError: false,
          };
    
        case DELETE_CUSTOMER_SUCCESS:
          return {
            ...state,
            customers: state.customers.filter(customer => customer.customer_id !== action.payload),
            customersLoading: false,
            customersError: false,
          };
    
        case DELETE_CUSTOMER_FAILURE:
          return {
            ...state,
            customersLoading: false,
            customersError: true,
          };
        case UPDATE_CUSTOMER:
          return {
            ...state,
            customers: state.customers.map(customer =>
              customer.customer_id === action.payload.customer_id
                ? action.payload
                : customer
            ),
          };
          case uploadFile:
            return {
              ...state,
              products: action.payload,  // Directly replace the array
            };
        
        default:return state;
     }

}


