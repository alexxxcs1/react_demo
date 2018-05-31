import qs from 'qs';
const demoPost = (ajaxinstance) => {
    const customer = {}
    customer.explamefunc = (a,b) => {
        return ajaxinstance.post('your_api_url',qs.stringify({
            uprop:a,
            uprop2:b,
        }));
      }
    return customer
  }
  
  export default demoPost