
export const hideAlert=()=>{
    const el=document.querySelector('.alert');
    if(el)el.parentElement.removeChild(el)
}



//type will be success or error
export const showAlert=(type,message)=>{
    hideAlert()
 const markup=`<div class="alert alert-${type}">${message}</div>`;
 document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
window.setTimeout(()=>{
    hideAlert
},3000)
}

/*6a) Once we have implemented alert fucntionality now we can apply it into login.js file */