
import axios from axios
import {showAlert} from './alert'
// export const updateData=async(name,email)=>{
// try {
//     const response=await axios({
//         method:'PATCH',
//         /* 10 cont...) During user authentication we have defined route to update user i.e 
//         http://localhost/user/updateMe inside userController.updateMe middleware */
//         url:'http://127.0.0.1:4000/api/user/updateMe',
//         data:{
//             name,
//             email
//         }
        
//     })
//     if(response.data.status==='success'){
//         showAlert('success','Data updated successfully!')
//     }
// } catch (error) {
//     showAlert('error',err.response.data.message)
// }
// }
/*10 cont...) Now let us use this function inside our index.js file
Go to index.js file 
*/



/*11 a) Let us modify above fucntion such that it can be used for both updating data and password
After doing so we have to import it inside the login.js file 

Go to login.js file
*/

export const updateSettings=async(userDataObject,type)=>{
    const url= type==='password'?'http://127.0.0.1:4000/api/user/updateMe':'http://127.0.0.1:4000/api/user/updatePassword';
    try {
        const response=await axios({
            method:'PATCH',
          
            url,
            data:userDataObject
            
        })
        if(response.data.status==='success'){
            showAlert('success',`${type.toUpperCase()} updated successfully`)
        }
    } catch (error) {
        showAlert('error',err.response.data.message)
    }
    }

